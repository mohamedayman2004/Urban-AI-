import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Users, CheckSquare, Clock, Bot, Bell, ArrowUpRight } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total_leads: 0, hot_leads: 0, total_interactions: 0 })
  const [leads, setLeads] = useState([])

  const fetchData = async () => {
    try {
      const statsRes = await axios.get(`${API_BASE}/stats`)
      setStats(statsRes.data)
      const leadsRes = await axios.get(`${API_BASE}/leads`)
      setLeads(leadsRes.data)
    } catch (err) {
      console.error("Error fetching data:", err)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  // Pure live metrics
  const revenue = 0
  const newCustomers = stats.total_leads || 0
  const openTasks = stats.open_tasks !== undefined ? stats.open_tasks : leads.filter(l => l.status === 'New' || l.status === 'Qualified').length
  const approvalsRequired = stats.pending_approvals !== undefined ? stats.pending_approvals : leads.filter(l => l.status === 'Escalated').length
  const hotLeads = stats.hot_leads || 0
  const totalInteractions = stats.total_interactions || 0

  // Derive latest alerts from real activity logs
  const recentLogs = leads
    .flatMap(l => l.activity_logs.map(log => ({ ...log, phone: l.phone_number })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 3)

  // Task distribution derived from actual leads
  const completedCount = leads.filter(l => l.status === 'Closed Won').length
  const inProgressCount = leads.filter(l => l.status === 'Qualified' || l.status === 'Hot Lead' || l.status === 'New').length
  const overdueCount = leads.filter(l => l.status === 'Escalated').length
  const totalDistribution = completedCount + inProgressCount + overdueCount

  return (
    <>
      {/* Top Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* Revenue */}
        <div
          onClick={() => navigate('/reports')}
          className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center justify-between hover:border-primary/50 transition cursor-pointer group"
        >
          <div>
            <div className="text-text-body text-sm font-semibold mb-2 flex items-center gap-1">
              إجمالي الإيرادات <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-primary" />
            </div>
            <div className="text-2xl font-bold text-text-heading flex items-center gap-2">
              0 <span className="text-sm font-normal text-text-body">ر.س</span>
            </div>
            <div className="text-xs text-text-body font-medium mt-1">ربط الفواتير (قريباً)</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
            <span className="text-xl font-bold">$</span>
          </div>
        </div>

        {/* New Customers */}
        <div
          onClick={() => navigate('/clients')}
          className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center justify-between hover:border-accent-teal/50 transition cursor-pointer group"
        >
          <div>
            <div className="text-text-body text-sm font-semibold mb-2 flex items-center gap-1">
              العملاء الجدد <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-accent-teal" />
            </div>
            <div className="text-2xl font-bold text-text-heading">{newCustomers}</div>
            <div className="text-xs text-accent-teal font-medium mt-1">
              {newCustomers > 0 ? `+${newCustomers} عميل مسجل (عرض الكل)` : 'لا يوجد عملاء جدد'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition">
            <Users size={24} />
          </div>
        </div>

        {/* Open Tasks */}
        <div
          onClick={() => navigate('/tasks')}
          className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center justify-between hover:border-purple-400 transition cursor-pointer group"
        >
          <div>
            <div className="text-text-body text-sm font-semibold mb-2 flex items-center gap-1">
              المهام المفتوحة <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-text-heading">{openTasks}</div>
            <div className="text-xs text-text-body font-medium mt-1">
              {openTasks > 0 ? `${openTasks} بحاجة لمتابعة (انتقال)` : 'جميع المهام منجزة'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition">
            <CheckSquare size={24} />
          </div>
        </div>

        {/* Approvals Required */}
        <div
          onClick={() => navigate('/clients?status=Escalated')}
          className={`bg-surface rounded-xl p-5 shadow-sm border flex items-center justify-between transition cursor-pointer group ${approvalsRequired > 0 ? 'border-accent-red/40 hover:border-accent-red bg-red-50/20' : 'border-border hover:border-orange-400'
            }`}
        >
          <div>
            <div className="text-text-body text-sm font-semibold mb-2 flex items-center gap-1">
              الموافقات المطلوبة <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-accent-red" />
            </div>
            <div className={`text-2xl font-bold ${approvalsRequired > 0 ? 'text-accent-red' : 'text-text-heading'}`}>
              {approvalsRequired}
            </div>
            <div className="text-xs text-accent-red font-bold mt-1">
              {approvalsRequired > 0 ? '⚡ حسم الحالات المعلقة الآن' : 'لا توجد طلبات معلقة'}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition ${approvalsRequired > 0 ? 'bg-red-100 text-accent-red' : 'bg-orange-100 text-orange-500'
            }`}>
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* AI Agents Section */}
      <section className="bg-surface rounded-xl shadow-sm border border-border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-heading">الذكاء الاصطناعي (AI Agents)</h2>
          <span className="text-xs font-medium text-text-body">2 وكلاء متصلين</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {/* AI Agent 1 */}
          <div className="border border-border rounded-lg p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-text-heading">AI Agent 1</h3>
                <div className="text-sm text-text-body">المبيعات والتواصل والرد الآلي</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Bot size={24} />
              </div>
            </div>
            <p className="text-sm text-text-body mb-6 flex-1">
              يتواصل مع العملاء عبر WhatsApp ويؤهلهم فورياً ويسجل البيانات في قاعدة البيانات.
            </p>
            <div className="flex justify-between items-end">
              <div className="text-center">
                <div className="text-xs text-text-body mb-1">الرسائل المعالجة</div>
                <div className="font-bold text-lg text-text-heading">{totalInteractions}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text-body mb-1">عملاء ساخنون</div>
                <div className="font-bold text-lg text-accent-teal">{hotLeads}</div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
                </span>
                <span className="text-xs font-semibold text-accent-teal">متصل ومفعل</span>
              </div>
            </div>
          </div>

          {/* AI Agent 2 */}
          <div className="border border-border rounded-lg p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-text-heading">AI Agent 2</h3>
                <div className="text-sm text-text-body">التصعيد والمتابعة الذكية</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Bot size={24} />
              </div>
            </div>
            <p className="text-sm text-text-body mb-6 flex-1">
              يراقب المحادثات ويحول الحالات المعقدة إلى تدخل بشري فوري للإدارة.
            </p>
            <div className="flex justify-between items-end">
              <div className="text-center">
                <div className="text-xs text-text-body mb-1">الحالات المصعدة</div>
                <div className="font-bold text-lg text-accent-red">{approvalsRequired}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text-body mb-1">حالات مكتملة</div>
                <div className="font-bold text-lg text-text-heading">{completedCount}</div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-accent-teal"></span>
                <span className="text-xs font-semibold text-accent-teal">متصل ومفعل</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Connected Channels */}
        <section className="bg-surface rounded-xl shadow-sm border border-border p-6 flex flex-col">
          <h2 className="text-lg font-bold text-text-heading mb-6">قنوات التواصل المتصلة</h2>
          <div className="flex flex-col gap-6 flex-1 justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              </div>
              <div>
                <div className="font-bold text-text-heading text-lg">WhatsApp API</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-accent-teal"></span>
                  <span className="text-xs text-text-body">متصل ونشط</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <div>
                <div className="font-bold text-text-heading text-lg">Web Dashboard</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-accent-teal"></span>
                  <span className="text-xs text-text-body">محدث مباشرة (3ث)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Alerts */}
        <section className="bg-surface rounded-xl shadow-sm border border-border p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-text-heading">أحدث التنبيهات</h2>
            <span className="text-xs text-text-body">مباشر</span>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {recentLogs.map((log, index) => (
              <div
                key={index}
                onClick={() => navigate(`/clients?phone=${encodeURIComponent(log.phone)}`)}
                className="flex justify-between items-start p-2 rounded-lg hover:bg-bg transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.action_type === 'AI Reply' ? 'bg-primary' : log.action_type === 'Human Resolution' ? 'bg-accent-amber' : 'bg-accent-teal'}`}></span>
                  <div>
                    <span className="text-xs font-bold text-text-heading group-hover:text-primary transition block">{log.action_type === 'AI Reply' ? 'رد من الذكاء الاصطناعي' : log.action_type === 'User Message' ? `رسالة من ${log.phone}` : 'تدخل بشري'}</span>
                    <span className="text-[11px] text-text-body truncate block max-w-[180px]">{log.message_body}</span>
                  </div>
                </div>
                <span className="text-[10px] text-text-body shrink-0">{new Date(log.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <div className="text-center text-text-body text-sm my-auto py-4">
                <Bell size={24} className="mx-auto text-text-body/40 mb-2" />
                لا توجد تنبيهات حتى الآن
              </div>
            )}
          </div>
        </section>

        {/* Task Distribution (Donut Chart) */}
        <section className="bg-surface rounded-xl shadow-sm border border-border p-6 flex flex-col items-center">
          <h2 className="text-lg font-bold text-text-heading mb-6 self-start">توزيع الحالات</h2>
          <div className="flex gap-8 items-center w-full justify-center">
            <div className="relative w-32 h-32 rounded-full" style={{
              background: totalDistribution > 0
                ? `conic-gradient(#1F9D6D 0% ${(completedCount / totalDistribution) * 100}%, #3B82F6 ${(completedCount / totalDistribution) * 100}% ${((completedCount + inProgressCount) / totalDistribution) * 100}%, #D64545 ${((completedCount + inProgressCount) / totalDistribution) * 100}% 100%)`
                : `#E3E8F0`
            }}>
              <div className="absolute inset-0 m-auto w-24 h-24 bg-surface rounded-full flex flex-col items-center justify-center">
                <div className="text-xs text-text-body font-semibold">إجمالي</div>
                <div className="font-bold text-2xl text-text-heading">{totalDistribution}</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between gap-6 items-center">
                <div className="flex items-center gap-2 text-sm font-bold text-text-heading">
                  <span className="w-2 h-2 rounded-full bg-accent-teal"></span> مكتملة
                </div>
                <span className="font-bold">{completedCount}</span>
              </div>
              <div className="flex justify-between gap-6 items-center">
                <div className="flex items-center gap-2 text-sm font-bold text-text-heading">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> جارية
                </div>
                <span className="font-bold">{inProgressCount}</span>
              </div>
              <div className="flex justify-between gap-6 items-center">
                <div className="flex items-center gap-2 text-sm font-bold text-text-heading">
                  <span className="w-2 h-2 rounded-full bg-accent-red"></span> تصعيد
                </div>
                <span className="font-bold">{overdueCount}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
