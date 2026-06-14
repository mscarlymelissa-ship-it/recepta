'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([])
  const [contractor, setContractor] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: contractorData } = await supabase
        .from('contractors')
        .select('*')
        .eq('id', user.id)
        .single()
      setContractor(contractorData)

      const { data: leadsData } = await supabase
        .from('Leads')
        .select('*')
        .eq('contractor_id', user.id)
        .order('created_at', { ascending: false })
      if (leadsData) setLeads(leadsData)
      setLoading(false)
    }
    init()
    const interval = setInterval(() => init(), 10000)
    return () => clearInterval(interval)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function updateStatus(leadId: number, newStatus: string) {
    await supabase.from('Leads').update({ status: newStatus }).eq('id', leadId)
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ color: '#888', fontSize: '14px' }}>Loading...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#1D9E75', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 4L9 2L3 4V9C3 12.5 5.5 15.7 9 17C12.5 15.7 15 12.5 15 9V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M6 9L8 11L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '500', color: '#111', letterSpacing: '-0.3px' }}>Recepta</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{contractor?.business_name || 'Your dashboard'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#0F6E56', background: '#E1F5EE', padding: '4px 10px', borderRadius: '20px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
              Live
            </div>
            <button onClick={() => router.push('/settings')} style={{ fontSize: '13px', color: '#888', background: 'transparent', border: '0.5px solid #e5e5e5', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>Settings</button>
            <button onClick={handleLogout} style={{ fontSize: '13px', color: '#888', background: 'transparent', border: '0.5px solid #e5e5e5', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>Sign out</button>
          </div>
        </div>

        {/* Twilio number */}
        {contractor?.twilio_number && (
          <div style={{ background: '#E1F5EE', border: '0.5px solid #9FE1CB', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#0F6E56', marginBottom: '2px' }}>Your Recepta number</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: '#085041' }}>{contractor.twilio_number}</div>
            </div>
            <div style={{ fontSize: '12px', color: '#0F6E56' }}>Forward your calls to this number</div>
          </div>
        )}

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Missed calls', value: leads.length, sub: 'Total' },
            { label: 'SMS sent', value: leads.length, sub: '100% reply rate' },
            { label: 'Leads captured', value: leads.filter(l => l.status !== 'waiting').length, sub: `${leads.length > 0 ? Math.round((leads.filter(l => l.status !== 'waiting').length / leads.length) * 100) : 0}% response rate`, green: true },
          ].map((m, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{m.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '500', color: m.green ? '#0F6E56' : '#111', letterSpacing: '-1px' }}>{m.value}</div>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Leads */}
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>Recent leads</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['all', 'waiting', 'replied', 'booked'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', border: '0.5px solid', borderColor: filter === f ? '#9FE1CB' : '#e5e5e5', background: filter === f ? '#E1F5EE' : 'transparent', color: filter === f ? '#0F6E56' : '#888', cursor: 'pointer' }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
              No leads yet — forward your calls to {contractor?.twilio_number || 'your Recepta number'} to get started.
            </div>
          )}

          {filtered.map((lead, i) => (
            <div key={lead.id} style={{ padding: '1rem 1.25rem', borderBottom: i < filtered.length - 1 ? '0.5px solid #f0f0f0' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>📞</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>
                  {lead.name ? `${lead.name} — ${lead.phone}` : lead.phone}
                </div>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.message || 'No message yet'}
                </div>
                {lead.urgency && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: lead.urgency === 'emergency' ? '#fef2f2' : lead.urgency === 'soon' ? '#FAEEDA' : '#E6F1FB', color: lead.urgency === 'emergency' ? '#dc2626' : lead.urgency === 'soon' ? '#633806' : '#0C447C' }}>
                      {lead.urgency === 'emergency' ? '🚨 Emergency' : lead.urgency === 'soon' ? '📅 This week' : '💬 Quote only'}
                    </span>
                    {lead.address && <span style={{ fontSize: '11px', color: '#aaa' }}>📍 {lead.address}</span>}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>{timeAgo(lead.created_at)}</div>
                <select
                  value={lead.status || 'waiting'}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: '500', border: '0.5px solid #e5e5e5', cursor: 'pointer', outline: 'none', background: lead.status === 'replied' ? '#E1F5EE' : lead.status === 'booked' ? '#E6F1FB' : lead.status === 'closed' ? '#f5f5f3' : '#FAEEDA', color: lead.status === 'replied' ? '#085041' : lead.status === 'booked' ? '#0C447C' : lead.status === 'closed' ? '#888' : '#633806' }}
                >
                  <option value="waiting">Waiting</option>
                  <option value="replied">Replied</option>
                  <option value="booked">Booked</option>
                  <option value="called back">Called back</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}