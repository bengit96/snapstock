import NextAuth, { type NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db'
import { users, accounts, sessions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { sendOTP, verifyOTP } from './otp'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      subscriptionStatus?: string | null
      subscriptionTier?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    subscriptionStatus?: string | null
    subscriptionTier?: string | null
  }
}

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),

  providers: [
    CredentialsProvider({
      name: 'otp',
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          return null
        }

        const email = credentials.email as string
        const code = credentials.code as string

        // Verify OTP
        const isValid = await verifyOTP(email, code)
        if (!isValid) {
          throw new Error('Invalid or expired OTP')
        }

        // Find or create user
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        let user = existingUsers[0]

        if (!user) {
          // Create new user
          const newUsers = await db
            .insert(users)
            .values({
              email,
              emailVerified: new Date(),
            })
            .returning()

          user = newUsers[0]
        } else {
          // Update email verified if not already
          if (!user.emailVerified) {
            await db
              .update(users)
              .set({ emailVerified: new Date() })
              .where(eq(users.id, user.id))
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionTier: user.subscriptionTier,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
          session.user.subscriptionStatus = userData[0].subscriptionStatus
          session.user.subscriptionTier = userData[0].subscriptionTier
        }
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
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