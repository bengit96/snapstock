import { config } from 'dotenv'
import { resolve } from 'path'
import { db } from '../lib/db'
import { users } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

// Load environment variables
config({ path: resolve(__dirname, '../.env') })

async function addAdmin(email: string) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`)

    // Check if user exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUsers.length === 0) {
      console.log('❌ User not found. Creating new admin user...')

      // Create new admin user
      const newUser = await db
        .insert(users)
        .values({
          email,
          role: 'admin',
          emailVerified: new Date(),
        })
        .returning()

      console.log('✅ Admin user created successfully!')
      console.log(`   Email: ${newUser[0].email}`)
      console.log(`   Role: ${newUser[0].role}`)
      console.log(`   ID: ${newUser[0].id}`)
    } else {
      const user = existingUsers[0]

      if (user.role === 'admin') {
        console.log('ℹ️  User is already an admin!')
        console.log(`   Email: ${user.email}`)
        console.log(`   ID: ${user.id}`)
      } else {
        console.log('📝 User found. Updating to admin role...')

        // Update user to admin
        const updatedUser = await db
          .update(users)
          .set({ role: 'admin' })
          .where(eq(users.id, user.id))
          .returning()

        console.log('✅ User upgraded to admin successfully!')
        console.log(`   Email: ${updatedUser[0].email}`)
        console.log(`   Role: ${updatedUser[0].role}`)
        console.log(`   ID: ${updatedUser[0].id}`)
      }
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding admin:', error)
    process.exit(1)
  }
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.error('❌ Please provide an email address')
  console.log('Usage: npm run add-admin <email>')
  process.exit(1)
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  console.error('❌ Invalid email format')
  process.exit(1)
}

addAdmin(email)
