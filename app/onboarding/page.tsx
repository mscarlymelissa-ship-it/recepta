'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const [contractor, setContractor] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [device, setDevice] = useState<'iphone' | 'android' | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('contractors').select('*').eq('id', user.id).single()
      setContractor(data)
    }
    load()
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', justifyContent: 'center' }}>
          <div style={{ width: '32px', height: '32px', background: '#1D9E75', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15 4L9 2L3 4V9C3 12.5 5.5 15.7 9 17C12.5 15.7 15 12.5 15 9V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '500', color: '#111' }}>Recepta</div>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: s <= step ? '#1D9E75' : '#e5e5e5' }} />
          ))}
        </div>

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ fontSize: '24px', marginBottom: '1rem' }}>👋</div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              Welcome to Recepta{contractor?.business_name ? `, ${contractor.business_name}` : ''}!
            </h1>
            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              You're 2 minutes away from never losing a job to a missed call again. Let's get you set up.
            </p>

            {contractor?.twilio_number && (
              <div style={{ background: '#E1F5EE', border: '0.5px solid #9FE1CB', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '12px', color: '#0F6E56', marginBottom: '4px' }}>Your Recepta number</div>
                <div style={{ fontSize: '24px', fontWeight: '500', color: '#085041', letterSpacing: '-0.5px' }}>{contractor.twilio_number}</div>
                <div style={{ fontSize: '13px', color: '#0F6E56', marginTop: '4px' }}>This is the number that will text back your missed calls</div>
              </div>
            )}

            <button onClick={() => setStep(2)} style={{ width: '100%', padding: '13px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
              Get started →
            </button>
          </div>
        )}

        {/* Step 2 — Forward your calls */}
        {step === 2 && (
          <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ fontSize: '24px', marginBottom: '1rem' }}>📱</div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Forward your calls</h1>
            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              When you miss a call, it needs to reach Recepta. Set up call forwarding on your phone — it takes 2 minutes.
            </p>

            <p style={{ fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '0.75rem' }}>What phone do you have?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.5rem' }}>
              {[
                { id: 'iphone', label: '🍎 iPhone' },
                { id: 'android', label: '🤖 Android' },
              ].map(d => (
                <button key={d.id} onClick={() => setDevice(d.id as 'iphone' | 'android')} style={{ padding: '12px', border: '0.5px solid', borderColor: device === d.id ? '#1D9E75' : '#e5e5e5', borderRadius: '10px', background: device === d.id ? '#E1F5EE' : '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: device === d.id ? '#085041' : '#111' }}>
                  {d.label}
                </button>
              ))}
            </div>

            {device === 'iphone' && (
              <div style={{ background: '#f5f5f3', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '0.75rem' }}>iPhone instructions:</div>
                {[
                  'Open Settings on your iPhone',
                  'Tap Phone',
                  'Tap Call Forwarding',
                  'Turn on Call Forwarding',
                  `Enter your Recepta number: ${contractor?.twilio_number || 'your Recepta number'}`,
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1D9E75', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                    <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>{step}</div>
                  </div>
                ))}
              </div>
            )}

            {device === 'android' && (
              <div style={{ background: '#f5f5f3', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '0.75rem' }}>Android instructions:</div>
                {[
                  'Open your Phone app',
                  'Tap the three dots menu (top right)',
                  'Tap Settings, then Calls',
                  'Tap Call Forwarding',
                  'Tap "Forward when unanswered"',
                  `Enter your Recepta number: ${contractor?.twilio_number || 'your Recepta number'}`,
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1D9E75', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                    <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>{step}</div>
                  </div>
                ))}
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>Note: Steps may vary slightly by Android manufacturer.</div>
              </div>
            )}

            <button onClick={() => setStep(3)} disabled={!device} style={{ width: '100%', padding: '13px', background: device ? '#1D9E75' : '#e5e5e5', color: device ? '#fff' : '#aaa', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: device ? 'pointer' : 'not-allowed' }}>
              Done, forwarding is set up →
            </button>
          </div>
        )}

        {/* Step 3 — Test it */}
        {step === 3 && (
          <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ fontSize: '24px', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>You are all set!</h1>
            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Recepta is now watching for your missed calls. Want to see it in action?
            </p>

            <div style={{ background: '#f5f5f3', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '0.75rem' }}>Test it right now:</div>
              {[
                'Call your own number from another phone',
                'Let it ring without answering',
                'Watch for an automatic text back',
                'Check your dashboard to see the lead',
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E1F5EE', color: '#0F6E56', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                  <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>{s}</div>
                </div>
              ))}
            </div>

            <button onClick={() => router.push('/dashboard')} style={{ width: '100%', padding: '13px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
              Go to my dashboard →
            </button>
          </div>
        )}

      </div>
    </main>
  )
}