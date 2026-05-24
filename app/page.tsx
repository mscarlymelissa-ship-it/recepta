'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [leads, setLeads] = useState([])

useEffect(() => {
  async function getLeads() {
    const { data, error } = await supabase.from('Leads').select('*').order('created_at', { ascending: false })
    console.log('data:', data)
    console.log('error:', error)
    if (data) setLeads(data)
  }
  getLeads()
}, [])

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recepta</h1>
          <p className="text-gray-500 mt-1">Missed call lead recovery</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Leads</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{leads.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Replied</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{leads.filter(l => l.status === 'replied').length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Waiting</p>
            <p className="text-4xl font-bold text-green-600 mt-1">{leads.filter(l => l.status === 'waiting').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {leads.length === 0 && (
              <div className="p-6 text-gray-400 text-sm">No leads yet — waiting for missed calls.</div>
            )}
            {leads.map(lead => (
              <div key={lead.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{lead.phone}</p>
                    <p className="text-sm text-gray-500 mt-1">{lead.message || 'No message yet'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${lead.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{new Date(lead.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}