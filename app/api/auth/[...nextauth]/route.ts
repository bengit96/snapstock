import { handlers } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { signOut } from '@/lib/auth'

export const { GET, POST } = handlers

// Custom logout endpoint
export async function DELETE(request: NextRequest) {
  try {
    await signOut()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}