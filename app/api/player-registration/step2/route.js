import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Step 2: Complete Registration
export async function POST(request) {
  try {
    const registrationData = await request.json()
    const { reference_number, ...formData } = registrationData

    // Validate reference number
    if (!reference_number) {
      return NextResponse.json(
        { success: false, error: 'Reference number is required' },
        { status: 400 }
      )
    }

    // Check if reference number exists and is valid
    const { data: refData, error: refError } = await supabase
      .from('player_reference_numbers')
      .select('*')
      .eq('reference_number', reference_number)
      .single()

    if (refError || !refData) {
      return NextResponse.json(
        { success: false, error: 'Invalid reference number' },
        { status: 400 }
      )
    }

    // Check if already used
    if (refData.is_used) {
      return NextResponse.json(
        { success: false, error: 'Reference number has already been used' },
        { status: 400 }
      )
    }

    // Check if expired
    if (new Date(refData.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Reference number has expired' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields = ['full_name', 'email', 'phone', 'date_of_birth', 'gender']
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { success: false, error: `${field.replace('_', ' ')} is required` },
          { status: 400 }
        )
      }
    }

    // Validate terms acceptance
    if (!formData.terms_accepted || !formData.privacy_policy_accepted) {
      return NextResponse.json(
        { success: false, error: 'You must accept the terms and privacy policy' },
        { status: 400 }
      )
    }

    // Start transaction
    const { data: registration, error: regError } = await supabase
      .from('player_registrations')
      .insert({
        reference_number,
        ...formData,
        status: 'pending'
      })
      .select()
      .single()

    if (regError) {
      console.error('Error creating registration:', regError)
      return NextResponse.json(
        { success: false, error: 'Failed to submit registration' },
        { status: 500 }
      )
    }

    // Mark reference number as used
    const { error: updateError } = await supabase
      .from('player_reference_numbers')
      .update({
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('reference_number', reference_number)

    if (updateError) {
      console.error('Error updating reference number:', updateError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      data: {
        registration_id: registration.id,
        reference_number,
        status: 'pending',
        message: 'Registration submitted successfully'
      }
    })

  } catch (error) {
    console.error('Error in registration submission:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get registration status
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
      .from('player_registrations')
      .select('*')
      .eq('reference_number', reference_number)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      )
    }

    // Return limited data for security
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        reference_number: data.reference_number,
        status: data.status,
        submitted_at: data.submitted_at,
        reviewed_at: data.reviewed_at,
        review_notes: data.review_notes
      }
    })

  } catch (error) {
    console.error('Error fetching registration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
