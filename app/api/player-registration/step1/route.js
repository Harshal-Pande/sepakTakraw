import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Step 1: Generate Reference Number
export async function POST(request) {
  try {
    const { full_name, email } = await request.json()

    // Validate input
    if (!full_name || !email) {
      return NextResponse.json(
        { success: false, error: 'Full name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingRef } = await supabase
      .from('player_reference_numbers')
      .select('id, reference_number, is_used')
      .eq('email', email)
      .single()

    if (existingRef) {
      if (existingRef.is_used) {
        return NextResponse.json(
          { success: false, error: 'Email already used for registration' },
          { status: 400 }
        )
      } else {
        // Return existing reference number
        return NextResponse.json({
          success: true,
          data: {
            reference_number: existingRef.reference_number,
            full_name,
            email
          }
        })
      }
    }

    // Create new reference number
    const { data, error } = await supabase
      .from('player_reference_numbers')
      .insert({
        full_name,
        email
      })
      .select('reference_number, full_name, email, created_at, expires_at')
      .single()

    if (error) {
      console.error('Error creating reference number:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to generate reference number' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Error in reference number generation:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get reference number details
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference_number = searchParams.get('reference_number')

    if (!reference_number) {
      return NextResponse.json(
        { success: false, error: 'Reference number is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('player_reference_numbers')
      .select('*')
      .eq('reference_number', reference_number)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Reference number not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Reference number has expired' },
        { status: 400 }
      )
    }

    // Check if already used
    if (data.is_used) {
      return NextResponse.json(
        { success: false, error: 'Reference number has already been used' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Error fetching reference number:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
