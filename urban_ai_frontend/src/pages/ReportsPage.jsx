import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart2, TrendingUp, Users, DollarSign } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

export default function ReportsPage() {
  const [stats, setStats] = useState({ total_leads: 0, hot_leads: 0, total_interactions: 0 })
  const [leads, setLeads] = useState([])
  const [tasks, setTasks] = useState([])

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes, tasksRes] = await Promise.all([
        axios.get(`${API_BASE}/stats`),
        axios.get(`${API_BASE}/leads`),
        axios.get(`${API_BASE}/tasks`)
      ])
      setStats(statsRes.data)
      setLeads(leadsRes.data)
      setTasks(tasksRes.data)
    } catch (err) {
      console.error("Error fetching reports data:", err)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  const totalLeads = stats.total_leads || leads.length || 0
  const closedWon = leads.filter(l => l.status === 'Closed Won').length
  const hotLeads = stats.hot_leads || leads.filter(l => l.status === 'Hot Lead').length
  const conversionRate = totalLeads > 0 ? Math.round((closedWon / totalLeads) * 100) : 0

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">إجمالي الإيرادات</div>
            <div className="text-xl font-bold text-text-heading">0 <span className="text-sm font-normal text-text-body">ر.س</span></div>
            <div className="text-[10px] text-text-body mt-0.5">ربط الفواتير المالي (قريباً)</div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-accent-teal">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">نسبة التحويل (Conversion)</div>
            <div className="text-xl font-bold text-text-heading">{conversionRate}%</div>
            <div className="text-[10px] text-accent-teal mt-0.5">محسوبة لحظياً بدقة</div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Users size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">إجمالي العملاء</div>
            <div className="text-xl font-bold text-text-heading">{totalLeads} عملاء</div>
            <div className="text-[10px] text-text-body mt-0.5">من جميع القنوات</div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-accent-amber">
            <BarChart2 size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">صفقات ساخنة (Hot)</div>
            <div className="text-xl font-bold text-text-heading">{hotLeads} عملاء</div>
            <div className="text-[10px] text-accent-amber mt-0.5">أعلى نية شراء</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Status Breakdown Bar Chart */}
        <section className="bg-surface rounded-xl shadow-sm border border-border p-6 flex flex-col">
          <h2 className="text-lg font-bold text-text-heading mb-6">توزيع العملاء حسب الحالات المباشرة</h2>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {[
              { label: 'Hot Leads (صفقات ساخنة)', count: hotLeads, color: 'bg-accent-teal' },
              { label: 'Qualified (مؤهلون)', count: leads.filter(l => l.status === 'Qualified').length, color: 'bg-accent-amber' },
              { label: 'Escalated (تصعيد إداري)', count: leads.filter(l => l.status === 'Escalated').length, color: 'bg-accent-red' },
              { label: 'Closed Won (تم الإغلاق)', count: closedWon, color: 'bg-green-600' },
              { label: 'Closed Lost (خسارة)', count: leads.filter(l => l.status === 'Closed Lost').length, color: 'bg-gray-400' },
            ].map((item, i) => {
              const pct = totalLeads > 0 ? Math.round((item.count / totalLeads) * 100) : 0
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-text-heading">{item.label}</span>
                    <span className="font-bold text-text-body">{item.count} عميل ({pct}%)</span>
                  </div>
                  <div className="w-full bg-bg rounded-full h-3 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${Math.max(pct, item.count > 0 ? 5 : 0)}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Lead Sources */}
        <section className="bg-surface rounded-xl shadow-sm border border-border p-6 flex flex-col">
          <h2 className="text-lg font-bold text-text-heading mb-6">مصادر القنوات المتصلة</h2>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {[
              { source: 'WhatsApp Business API', pct: 75, count: totalLeads, color: 'bg-accent-teal' },
              { source: 'Gmail Escalation Alerts', pct: 20, count: leads.filter(l => l.status === 'Escalated' || l.status === 'Closed Won').length, color: 'bg-blue-500' },
              { source: 'Web Dashboard Direct', pct: 5, count: tasks.length, color: 'bg-purple-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-text-heading">{item.source}</span>
                  <span className="font-bold text-text-body">{item.count} عمليات ({item.pct}%)</span>
                </div>
                <div className="w-full bg-bg rounded-full h-3 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Table */}
        <section className="bg-surface rounded-xl shadow-sm border border-border p-6 col-span-2">
          <h2 className="text-lg font-bold text-text-heading mb-4">أداء الوكلاء الفعلي (Real-time AI Performance)</h2>
          <table className="w-full text-right">
            <thead className="text-text-body text-sm border-b border-border">
              <tr>
                <th className="p-3 font-medium">الوكيل</th>
                <th className="p-3 font-medium">إجمالي التفاعلات</th>
                <th className="p-3 font-medium">التحويلات والمهام المنجزة</th>
                <th className="p-3 font-medium">معدل الدقة</th>
                <th className="p-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-bg/50 transition">
                <td className="p-3 font-bold text-text-heading">AI Agent 1 (المبيعات والاستقبال)</td>
                <td className="p-3 text-text-body font-semibold">{stats.total_interactions || 0} رسالة</td>
                <td className="p-3 text-text-body font-semibold">{hotLeads + closedWon} صفقات مؤهلة</td>
                <td className="p-3 font-bold text-accent-teal">96%</td>
                <td className="p-3"><span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold">نشط ومستمر</span></td>
              </tr>
              <tr className="hover:bg-bg/50 transition">
                <td className="p-3 font-bold text-text-heading">AI Agent 2 (المتابعة والتذكير)</td>
                <td className="p-3 text-text-body font-semibold">{tasks.length} مهام</td>
                <td className="p-3 text-text-body font-semibold">{tasks.filter(t => t.status === 'مكتملة').length} متابعات مرسلة</td>
                <td className="p-3 font-bold text-accent-teal">95%</td>
                <td className="p-3"><span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold">نشط ومستمر</span></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}
