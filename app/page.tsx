'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [leads, setLeads] = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function getLeads() {
      const { data } = await supabase.from('Leads').select('*').order('created_at', { ascending: false })
      if (data) setLeads(data)
    }
    getLeads()
    const interval = setInterval(getLeads, 10000)
    return () => clearInterval(interval)
  }, [])

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)
  const replied = leads.filter(l => l.status === 'replied').length
  const waiting = leads.filter(l => l.status === 'waiting').length

  function timeAgo(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

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
              <div style={{ fontSize: '12px', color: '#888', marginTop: '1px' }}>Missed call lead recovery</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#0F6E56', background: '#E1F5EE', padding: '4px 10px', borderRadius: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
            Live
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Missed calls', value: leads.length, sub: 'Total' },
            { label: 'SMS sent', value: leads.length, sub: '100% reply rate' },
            { label: 'Leads captured', value: leads.length - waiting, sub: `${leads.length > 0 ? Math.round(((leads.length - waiting) / leads.length) * 100) : 0}% response rate`, green: true },
          ].map((m, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{m.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '500', color: m.green ? '#0F6E56' : '#111', letterSpacing: '-1px' }}>{m.value}</div>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Leads table */}
        <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>Recent leads</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['all', 'waiting', 'replied'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', border: '0.5px solid', borderColor: filter === f ? '#9FE1CB' : '#e5e5e5', background: filter === f ? '#E1F5EE' : 'transparent', color: filter === f ? '#0F6E56' : '#888', cursor: 'pointer' }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
              No leads yet — waiting for missed calls.
            </div>
          )}

          {filtered.map((lead, i) => (
            <div key={lead.id} style={{ padding: '1rem 1.25rem', borderBottom: i < filtered.length - 1 ? '0.5px solid #f0f0f0' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>📞</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>{lead.phone}</div>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.message || 'No message yet'}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>{timeAgo(lead.created_at)}</div>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: '500', background: lead.status === 'replied' ? '#E1F5EE' : lead.status === 'waiting' ? '#FAEEDA' : '#E6F1FB', color: lead.status === 'replied' ? '#085041' : lead.status === 'waiting' ? '#633806' : '#0C447C' }}>
                  {lead.status || 'new'}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}