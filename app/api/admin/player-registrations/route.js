import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// Get all registrations (admin only)
export async function GET(request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit')) || 50
    const offset = parseInt(searchParams.get('offset')) || 0

    let query = supabase
      .from('player_registrations')
      .select(`
        *,
        player_reference_numbers!inner(
          reference_number,
          full_name,
          email,
          created_at,
          expires_at,
          is_used,
          used_at
        )
      `)
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching registrations:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch registrations' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('player_registrations')
      .select('id', { count: 'exact', head: true })

    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Error fetching count:', countError)
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    })

  } catch (error) {
    console.error('Error in registrations API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update registration status (admin only)
export async function PATCH(request) {
  try {
    const { id, status, review_notes, reviewed_by } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Registration ID and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'under_review']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updateData = {
      status,
      reviewed_at: new Date().toISOString()
    }

    if (review_notes) {
      updateData.review_notes = review_notes
    }

    if (reviewed_by) {
      updateData.reviewed_by = reviewed_by
    }

    const { data, error } = await supabase
      .from('player_registrations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating registration:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update registration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Error in registration update:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get registration statistics
export async function POST(request) {
  try {
    const { action } = await request.json()

    if (action === 'statistics') {
      // Get registration statistics
      const { data: stats, error } = await supabase
        .from('player_registrations')
        .select('status')

      if (error) {
        console.error('Error fetching statistics:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to fetch statistics' },
          { status: 500 }
        )
      }

      const statistics = {
        total: stats.length,
        pending: stats.filter(s => s.status === 'pending').length,
        approved: stats.filter(s => s.status === 'approved').length,
        rejected: stats.filter(s => s.status === 'rejected').length,
        under_review: stats.filter(s => s.status === 'under_review').length
      }

      return NextResponse.json({
        success: true,
        data: statistics
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in statistics API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
