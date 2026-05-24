'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Settings() {
  const [businessName, setBusinessName] = useState('')
  const [notificationPhone, setNotificationPhone] = useState('')
  const [smsMessage, setSmsMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [twilioNumber, setTwilioNumber] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('contractors')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setBusinessName(data.business_name || '')
        setNotificationPhone(data.notification_phone || '')
        setSmsMessage(data.sms_message || '')
        setTwilioNumber(data.twilio_number || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('contractors').upsert({
      id: user.id,
      business_name: businessName,
      notification_phone: notificationPhone,
      sms_message: smsMessage,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ color: '#888', fontSize: '14px' }}>Loading...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#1D9E75', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 4L9 2L3 4V9C3 12.5 5.5 15.7 9 17C12.5 15.7 15 12.5 15 9V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500', color: '#111' }}>Recepta</div>
          </div>
          <button onClick={() => router.push('/dashboard')} style={{ fontSize: '13px', color: '#888', background: 'transparent', border: '0.5px solid #e5e5e5', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>
            ← Back to dashboard
          </button>
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#111', marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '2rem' }}>Manage your Recepta account</p>

        {/* Recepta number */}
        {twilioNumber && (
          <div style={{ background: '#E1F5EE', border: '0.5px solid #9FE1CB', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '12px', color: '#0F6E56', marginBottom: '4px' }}>Your Recepta number</div>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#085041', marginBottom: '4px' }}>{twilioNumber}</div>
            <div style={{ fontSize: '13px', color: '#0F6E56' }}>Forward your existing number to this to start capturing missed calls</div>
          </div>
        )}

        {/* Settings form */}
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111', marginBottom: '1.25rem' }}>Business details</h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Business name</label>
            <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Mike's Plumbing" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '0' }}>
            <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Notification number</label>
            <input type="tel" value={notificationPhone} onChange={e => setNotificationPhone(e.target.value)} placeholder="+1 (604) 555-0100" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            <p style={{ fontSize: '12px', color: '#aaa', marginTop: '6px' }}>We'll text you at this number the moment a lead comes in</p>
          </div>
        </div>

        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111', marginBottom: '4px' }}>Auto-reply message</h2>
          <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '1.25rem' }}>This is sent automatically when someone calls and you don't answer</p>

          <textarea
            value={smsMessage}
            onChange={e => setSmsMessage(e.target.value)}
            rows={4}
            placeholder={`Hi! Sorry we missed your call. We're currently on a job. Reply with what you need and we'll get back to you shortly.`}
            style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'system-ui, sans-serif' }}
          />
          <p style={{ fontSize: '12px', color: '#aaa', marginTop: '6px' }}>{smsMessage.length}/160 characters</p>
        </div>

        <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '11px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save settings'}
        </button>

      </div>
    </main>
  )
}