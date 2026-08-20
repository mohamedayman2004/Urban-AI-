import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Phone, Hash, Clock, Activity, Search, Sparkles, MessageSquare, X, Check, XCircle, ExternalLink, Send, ArrowRight, UserCheck, PhoneCall } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

const statusColors = {
  'Hot Lead': 'bg-accent-teal text-white',
  'Qualified': 'bg-accent-amber text-white',
  'Escalated': 'bg-accent-red text-white',
  'Closed Won': 'bg-green-600 text-white',
  'Closed Lost': 'bg-gray-500 text-white',
  'New': 'bg-primary text-white',
}

const statusFilters = [
  { id: 'ALL', label: 'جميع العملاء' },
  { id: 'Hot Lead', label: '🔥 صفقات ساخنة', color: 'text-accent-teal' },
  { id: 'Escalated', label: '⚠️ بحاجة لتدخل', color: 'text-accent-red' },
  { id: 'Qualified', label: '📋 مؤهلون', color: 'text-accent-amber' },
  { id: 'Closed Won', label: '✅ تم الإغلاق', color: 'text-green-600' },
]

export default function ClientsPage() {
  const [searchParams] = useSearchParams()
  const initialStatus = searchParams.get('status')
  const initialPhone = searchParams.get('phone')

  const [leads, setLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [activeFilter, setActiveFilter] = useState(initialStatus || 'ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [loadingLeadId, setLoadingLeadId] = useState(null)

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_BASE}/leads`)
      setLeads(res.data)

      // If initialPhone was passed, select that lead
      if (initialPhone && !selectedLead) {
        const found = res.data.find(l => l.phone_number === initialPhone)
        if (found) setSelectedLead(found)
      } else if (selectedLead) {
        const updated = res.data.find(l => l.id === selectedLead.id)
        if (updated) setSelectedLead(updated)
      }
    } catch (err) {
      console.error("Error fetching leads:", err)
    }
  }

  useEffect(() => {
    if (initialStatus) {
      setActiveFilter(initialStatus)
    }
  }, [initialStatus])

  useEffect(() => {
    fetchLeads()
    const interval = setInterval(fetchLeads, 3000)
    return () => clearInterval(interval)
  }, [selectedLead?.id, initialPhone])

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await axios.put(`${API_BASE}/leads/${leadId}/status`, { status: newStatus })
      setToast(`✓ تم تحديث حالة العميل إلى "${newStatus === 'Closed Won' ? 'تم الإغلاق' : 'خسارة'}" بنجاح!`)
      setTimeout(() => setToast(null), 4000)
      fetchLeads()
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const handleGenerateFollowup = async (lead) => {
    setLoadingLeadId(lead.id)
    try {
      await axios.post(`${API_BASE}/leads/${lead.id}/followup`)
      setToast(`✓ تم توليد مهمة متابعة ذكية للعميل ${lead.phone_number} في صفحة المهام!`)
      setTimeout(() => setToast(null), 4000)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingLeadId(null)
    }
  }

  // Filter and search logic
  const filteredLeads = leads.filter(lead => {
    const matchesFilter = activeFilter === 'ALL' || lead.status === activeFilter
    const matchesSearch = lead.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.next_action && lead.next_action.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const allActivity = leads.flatMap(l => (l.activity_logs || []).map(log => ({ ...log, phone: l.phone_number })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const cleanPhone = (phone) => phone ? phone.replace(/[^0-9+]/g, '') : ''

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="bg-green-50 border border-accent-teal text-accent-teal px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-accent-teal font-bold px-2 py-0.5 hover:bg-accent-teal/10 rounded cursor-pointer">✕</button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border">
          <div className="text-text-body text-sm font-semibold mb-1">إجمالي العملاء</div>
          <div className="text-3xl font-bold text-text-heading">{leads.length}</div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border">
          <div className="text-text-body text-sm font-semibold mb-1">🔥 صفقات ساخنة (Hot)</div>
          <div className="text-3xl font-bold text-accent-teal">{leads.filter(l => l.status === 'Hot Lead').length}</div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border">
          <div className="text-text-body text-sm font-semibold mb-1">⚠️ بحاجة لتدخل بشري</div>
          <div className="text-3xl font-bold text-accent-red">{leads.filter(l => l.status === 'Escalated').length}</div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border">
          <div className="text-text-body text-sm font-semibold mb-1">✅ صفقات مغلقة (Won)</div>
          <div className="text-3xl font-bold text-green-600">{leads.filter(l => l.status === 'Closed Won').length}</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex justify-between items-center bg-surface p-3 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {statusFilters.map(tab => {
            const count = tab.id === 'ALL' ? leads.length : leads.filter(l => l.status === tab.id).length
            const isActive = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-bg text-text-body hover:bg-border/60 hover:text-text-heading'
                  }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-border text-text-body font-bold'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Box */}
        <div className="flex items-center gap-2 bg-bg border border-border rounded-lg px-3 py-1.5 w-64">
          <Search size={15} className="text-text-body" />
          <input
            type="text"
            placeholder="بحث برقم الهاتف أو الإجراء..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-text-heading placeholder:text-text-body w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-text-body hover:text-text-heading text-xs font-bold">✕</button>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Leads Table */}
        <section className="flex-[2] bg-surface rounded-xl border border-border flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-bg/50 flex justify-between items-center">
            <h2 className="text-base font-bold text-text-heading flex items-center gap-2">
              <Phone className="text-primary" size={18} /> سجل العملاء والمحادثات
            </h2>
            <span className="text-xs text-text-body font-medium">اضغط على أي عميل لعرض المحادثة الكاملة</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-right border-collapse">
              <thead className="bg-bg text-text-body text-xs uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="p-3.5 font-medium">الهاتف</th>
                  <th className="p-3.5 font-medium">الحالة</th>
                  <th className="p-3.5 font-medium"><Sparkles size={13} className="inline ml-1 text-accent-teal" />الخطوة التالية (AI)</th>
                  <th className="p-3.5 font-medium"><Clock size={13} className="inline ml-1" />آخر نشاط</th>
                  <th className="p-3.5 font-medium text-left">إجراء فوري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeads.map(lead => {
                  const isSelected = selectedLead?.id === lead.id
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`hover:bg-primary/5 transition cursor-pointer ${isSelected ? 'bg-primary/10 border-r-4 border-primary' : ''}`}
                    >
                      <td className="p-3.5 text-text-heading font-bold whitespace-nowrap text-sm">{lead.phone_number}</td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center min-w-[85px] shadow-2xs ${statusColors[lead.status] || statusColors['New']}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs">
                        <span className="bg-primary/5 text-primary border border-primary/15 px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1 whitespace-nowrap">
                          {lead.next_action || 'استكمال التواصل وتأهيل العميل'}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs text-text-body whitespace-nowrap">
                        {new Date(lead.last_active).toLocaleString('ar-SA', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric' })}
                      </td>
                      <td className="p-3.5 text-left whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {lead.status === 'Escalated' ? (
                          <div className="flex gap-1.5 justify-start">
                            <button
                              onClick={() => updateLeadStatus(lead.id, 'Closed Won')}
                              className="bg-accent-teal text-white px-2.5 py-1 rounded text-xs font-semibold hover:opacity-90 transition cursor-pointer"
                              title="تم إغلاق الصفقة بنجاح"
                            >
                              تم الإغلاق
                            </button>
                            <button
                              onClick={() => updateLeadStatus(lead.id, 'Closed Lost')}
                              className="bg-accent-red text-white px-2.5 py-1 rounded text-xs font-semibold hover:opacity-90 transition cursor-pointer"
                              title="خسارة الصفقة"
                            >
                              خسارة
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGenerateFollowup(lead)}
                            disabled={loadingLeadId === lead.id}
                            className="bg-bg hover:bg-border text-primary border border-border px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                          >
                            {loadingLeadId === lead.id ? "جاري..." : "⚡ متابعة ذكية"}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-text-body">
                      {searchQuery ? "لا توجد نتائج مطابقة لبحثك." : "لا يوجد عملاء في هذه الفئة حالياً."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Live Activity Feed OR Client Specific Chat Drawer */}
        <section className="flex-1 bg-surface rounded-xl border border-border flex flex-col overflow-hidden shadow-sm">
          {selectedLead ? (
            // ==================== SINGLE CLIENT CONVERSATION DRAWER ====================
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="p-4 border-b border-border bg-bg/80 flex flex-col gap-3 shrink-0">
                {/* Top Row: Phone + Status + Action Buttons + Close */}
                <div className="flex items-center justify-between gap-3">
                  {/* Client Info */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-sm font-bold text-text-heading font-mono select-all tracking-tight" dir="ltr">
                      {selectedLead.phone_number}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap inline-flex items-center justify-center min-w-[80px] shadow-2xs ${statusColors[selectedLead.status] || statusColors['New']}`}>
                      {selectedLead.status}
                    </span>
                  </div>

                  {/* Actions & Close Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/${cleanPhone(selectedLead.phone_number)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white transition text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="فتح محادثة WhatsApp مباشرة"
                    >
                      <MessageSquare size={14} />
                      <span>واتساب</span>
                    </a>
                    <a
                      href={`tel:${cleanPhone(selectedLead.phone_number)}`}
                      className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white transition text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="اتصال هاتفي بالعميل"
                    >
                      <PhoneCall size={14} />
                      <span>اتصال</span>
                    </a>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-1.5 rounded-lg bg-surface hover:bg-border text-text-body hover:text-text-heading border border-border transition cursor-pointer"
                      title="إغلاق والعودة للشريط العام"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* AI Next Action Pill */}
                <div className="bg-primary/5 border border-primary/15 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                  <span className="text-sm">🎯</span>
                  <div className="leading-snug">
                    <span className="font-bold text-primary ml-1">الخطوة المقترحة (AI):</span>
                    <span className="text-text-heading font-medium">{selectedLead.next_action || 'استكمال التواصل وتأهيل العميل'}</span>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-auto p-4 flex flex-col gap-3 bg-bg/30">
                {(selectedLead.activity_logs && selectedLead.activity_logs.length > 0) ? (
                  selectedLead.activity_logs.map(log => {
                    const isUser = log.action_type === 'User Message'
                    const isResolution = log.action_type.includes('Resolution')
                    const isFollowup = log.action_type.includes('Follow-up')

                    if (isResolution) {
                      return (
                        <div key={log.id} className="text-center my-1">
                          <span className="bg-accent-amber/10 border border-accent-amber/30 text-accent-amber text-[11px] font-bold px-3 py-1 rounded-full inline-block">
                            🛡️ {log.message_body}
                          </span>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={log.id}
                        className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${isUser
                              ? 'bg-border/60 text-text-heading rounded-bl-sm border border-border'
                              : isFollowup
                                ? 'bg-accent-teal/10 text-accent-teal border border-accent-teal/30 rounded-br-sm font-medium'
                                : 'bg-primary text-white rounded-br-sm'
                            }`}
                        >
                          <div className="text-[10px] font-bold opacity-75 mb-1">
                            {isUser ? '👤 العميل' : isFollowup ? '⚡ متابعة ذكية (Agent 2)' : '🤖 Urban AI (Agent 1)'}
                          </div>
                          <div className="whitespace-pre-wrap">{log.message_body}</div>
                        </div>
                        <span className="text-[10px] text-text-body mt-0.5 px-1">
                          {new Date(log.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center text-text-body my-auto text-xs">لا توجد رسائل مسجلة لهذا العميل بعد.</div>
                )}
              </div>

              {/* Drawer Action Bar */}
              <div className="p-3.5 border-t border-border bg-surface flex items-center justify-between gap-2 shrink-0">
                {selectedLead.status === 'Escalated' ? (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id, 'Closed Won')}
                      className="flex-1 bg-accent-teal hover:bg-accent-teal/90 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check size={14} /> تأكيد إغلاق الصفقة (Won)
                    </button>
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id, 'Closed Lost')}
                      className="flex-1 bg-accent-red hover:bg-accent-red/90 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <XCircle size={14} /> رفض العرض (Lost)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGenerateFollowup(selectedLead)}
                    disabled={loadingLeadId === selectedLead.id}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <Sparkles size={14} />
                    {loadingLeadId === selectedLead.id ? "جاري توليد المتابعة..." : "⚡ إرسال متابعة ذكية بالذكاء الاصطناعي"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            // ==================== LIVE GLOBAL ACTIVITY FEED ====================
            <>
              <div className="p-4 border-b border-border bg-bg/50 flex justify-between items-center">
                <h2 className="text-base font-bold text-text-heading flex items-center gap-2">
                  <Activity className="text-accent-amber" size={18} /> شريط النشاط العام
                </h2>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-teal"></span>
                </span>
              </div>
              <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
                {allActivity.map(log => (
                  <div
                    key={log.id}
                    onClick={() => {
                      const lead = leads.find(l => l.phone_number === log.phone)
                      if (lead) setSelectedLead(lead)
                    }}
                    className="p-3 rounded-lg bg-bg border border-border text-xs flex flex-col gap-1.5 hover:border-primary/40 transition cursor-pointer shadow-2xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">{log.phone}</span>
                      <span className="text-[10px] text-text-body">{new Date(log.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.2 rounded font-semibold ${log.action_type === 'AI Reply' ? 'bg-primary/10 text-primary' :
                          log.action_type.includes('Resolution') ? 'bg-accent-amber/10 text-accent-amber' :
                            log.action_type.includes('Follow-up') ? 'bg-accent-teal/10 text-accent-teal' :
                              'bg-border text-text-body'
                        }`}>
                        {log.action_type === 'User Message' ? 'رسالة مستخدم' :
                          log.action_type === 'AI Reply' ? 'رد الذكاء' :
                            log.action_type.includes('Resolution') ? 'تدخل بشري' :
                              log.action_type.includes('Follow-up') ? 'متابعة ذكية' : log.action_type}
                      </span>
                    </div>
                    <p className="text-text-heading mt-0.5 line-clamp-2 leading-relaxed">{log.message_body}</p>
                  </div>
                ))}
                {allActivity.length === 0 && (
                  <div className="text-center text-text-body mt-10 text-xs">لا يوجد نشاط حديث.</div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  )
}
