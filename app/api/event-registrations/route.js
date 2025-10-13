import { createClient } from '@/lib/supabase'
import { createResponse, createErrorResponse } from '@/lib/api-helpers'

function validatePayload(body) {
  const errors = []
  if (!body) errors.push('Missing request body')
  if (!body?.event_id) errors.push('event_id is required')
  if (!body?.teamName?.trim()) errors.push('teamName is required')
  if (!body?.captainName?.trim()) errors.push('captainName is required')
  if (!body?.captainEmail?.trim()) errors.push('captainEmail is required')
  if (!body?.captainPhone?.trim()) errors.push('captainPhone is required')
  if (!Array.isArray(body?.players) || body.players.length === 0) errors.push('players array is required')
  return errors
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return Response.json(
        createErrorResponse('Expected application/json body', 'INVALID_CONTENT_TYPE'),
        { status: 415 }
      )
    }

    const body = await request.json()
    const errors = validatePayload(body)
    if (errors.length) {
      return Response.json(
        createErrorResponse('Validation error: ' + errors.join(', '), 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }

    // Try to persist to database if available
    let persisted = false
    let createdRow = null
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([
          {
            event_id: body.event_id,
            team_name: body.teamName,
            captain_name: body.captainName,
            captain_email: body.captainEmail,
            captain_phone: body.captainPhone,
            players: body.players,
            emergency_contact: body.emergencyContact || null,
            emergency_phone: body.emergencyPhone || null,
            special_requirements: body.specialRequirements || null,
          },
        ])
        .select()

      if (error) throw error
      persisted = true
      createdRow = data?.[0] || null
    } catch (dbErr) {
      // Graceful fallback: do not fail user submission; log and continue
      console.error('[event-registrations] DB insert failed, returning fallback success:', dbErr)
    }

    const responsePayload = {
      received: body,
      persisted,
      record: createdRow,
    }

    return Response.json(createResponse(responsePayload, 'Event registration received'), {
      status: 201,
    })
  } catch (error) {
    console.error('Error creating event registration:', error)
    return Response.json(
      createErrorResponse(error, 'EVENT_REGISTRATION_ERROR'),
      { status: 500 }
    )
  }
}


