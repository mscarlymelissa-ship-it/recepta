import twilio from 'twilio'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(request) {
  const { userId, areaCode } = await request.json()

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  try {
    // Search for available local numbers
    const available = await client.availablePhoneNumbers('CA')
      .local.list({ areaCode: areaCode || '604', limit: 1 })

    if (available.length === 0) {
      return Response.json({ error: 'No numbers available in that area code' }, { status: 400 })
    }

    // Purchase the number
    const purchased = await client.incomingPhoneNumbers.create({
      phoneNumber: available[0].phoneNumber,
      voiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/missed-call`,
      voiceMethod: 'POST'
    })

    // Save to contractor record
    await supabase.from('contractors').update({
      twilio_number: purchased.phoneNumber
    }).eq('id', userId)

    return Response.json({ number: purchased.phoneNumber })

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}