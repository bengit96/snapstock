import NextAuth, { type NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db'
import { users, accounts, sessions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verifyOTP } from './otp'
import { discordService } from '@/lib/services/discord.service'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: 'user' | 'admin'
      subscriptionStatus?: string | null
      subscriptionTier?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role?: 'user' | 'admin'
    subscriptionStatus?: string | null
    subscriptionTier?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: 'user' | 'admin'
  }
}

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true, // Allow linking existing email accounts
    }),
    CredentialsProvider({
      name: 'otp',
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          console.error('Missing credentials:', { email: !!credentials?.email, code: !!credentials?.code })
          return null
        }

        const email = credentials.email as string
        const code = credentials.code as string

        console.log('Attempting to verify OTP for:', email)

        // Verify OTP
        const isValid = await verifyOTP(email, code)
        if (!isValid) {
          console.error('OTP verification failed for:', email)
          // Generic error message for security - don't reveal if email exists or if OTP is wrong/expired
          throw new Error('Invalid or expired verification code')
        }

        console.log('OTP verified successfully for:', email)

        // Find or create user
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        let user = existingUsers[0]

        if (!user) {
          console.log('Creating new user for:', email)
          // Create new user
          const newUsers = await db
            .insert(users)
            .values({
              email,
              emailVerified: new Date(),
            })
            .returning()

          user = newUsers[0]
          console.log('Created user:', user.id)

          // Notify Discord about new user signup
          await discordService.notifySignup({
            email: user.email,
            userId: user.id,
          })
        } else {
          console.log('Found existing user:', user.id)
          // Update email verified if not already
          if (!user.emailVerified) {
            console.log('Updating email verified for user:', user.id)
            await db
              .update(users)
              .set({ emailVerified: new Date() })
              .where(eq(users.id, user.id))
          }
        }

        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionTier: user.subscriptionTier,
        }

        console.log('Returning user data:', userData)
        return userData
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  events: {
    async createUser({ user }) {
      // Notify Discord about new user signup (for Google OAuth)
      if (user.email) {
        await discordService.notifySignup({
          email: user.email,
          userId: user.id,
        })
      }
    },
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        // Fetch fresh user data
        const userData = await db
          .select()
          .from(users)
          .where(eq(users.id, token.sub))
          .limit(1)

        if (userData[0]) {
          session.user.id = userData[0].id
          session.user.role = userData[0].role
          session.user.subscriptionStatus = userData[0].subscriptionStatus
          session.user.subscriptionTier = userData[0].subscriptionTier
        }
      }
      return session
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.sub = user.id
        token.role = user.role
      }

      // Refresh role on update
      if (trigger === 'update' && token.sub) {
        const userData = await db
          .select()
          .from(users)
          .where(eq(users.id, token.sub as string))
          .limit(1)

        if (userData[0]) {
          token.role = userData[0].role
        }
      }

      return token
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)