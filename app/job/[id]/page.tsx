'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JobForm() {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState('')
  const [address, setAddress] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!name || !description || !urgency) return
    setLoading(true)

    await supabase.from('Leads').update({
      name: name,
      message: description,
      address: address,
      urgency: urgency,
      status: 'replied'
    }).eq('id', id)

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ width: '56px', height: '56px', background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '24px' }}>✓</div>
        <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#111', marginBottom: '0.5rem' }}>Got it, thanks!</h1>
        <p style={{ fontSize: '14px', color: '#888' }}>We've received your request and will be in touch shortly.</p>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '440px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <div style={{ width: '32px', height: '32px', background: '#1D9E75', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15 4L9 2L3 4V9C3 12.5 5.5 15.7 9 17C12.5 15.7 15 12.5 15 9V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#111' }}>Tell us what you need</div>
            <div style={{ fontSize: '12px', color: '#888' }}>We'll get back to you as soon as possible</div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Your name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>What do you need help with?</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Burst pipe under kitchen sink, leaking badly" rows={3} style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'system-ui, sans-serif' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>How urgent is this?</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { value: 'emergency', label: '🚨 Emergency', sub: 'Right now' },
              { value: 'soon', label: '📅 This week', sub: 'Within days' },
              { value: 'quote', label: '💬 Quote only', sub: 'No rush' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setUrgency(opt.value)} style={{ padding: '10px 8px', border: '0.5px solid', borderColor: urgency === opt.value ? '#1D9E75' : '#e5e5e5', borderRadius: '8px', background: urgency === opt.value ? '#E1F5EE' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: urgency === opt.value ? '#085041' : '#111' }}>{opt.label}</div>
                <div style={{ fontSize: '11px', color: urgency === opt.value ? '#0F6E56' : '#aaa', marginTop: '2px' }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Address <span style={{ color: '#aaa' }}>(optional)</span></label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Vancouver" style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <button onClick={handleSubmit} disabled={loading || !name || !description || !urgency} style={{ width: '100%', padding: '11px', background: name && description && urgency ? '#1D9E75' : '#e5e5e5', color: name && description && urgency ? '#fff' : '#aaa', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: name && description && urgency ? 'pointer' : 'not-allowed' }}>
          {loading ? 'Sending...' : 'Send request'}
        </button>
      </div>
    </main>
  )
}