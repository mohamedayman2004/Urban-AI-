import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bot, Zap, MessageSquare, Clock, CheckSquare } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

export default function AgentsPage() {
  const [stats, setStats] = useState({ total_leads: 0, hot_leads: 0, total_interactions: 0, open_tasks: 0, pending_approvals: 0 })
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
      console.error("Error fetching agents data:", err)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  const agent1Interactions = stats.total_interactions || 0
  const agent2TasksCompleted = tasks.filter(t => t.status === 'مكتملة').length
  const totalTasksToday = agent1Interactions + tasks.length

  const agents = [
    {
      name: 'AI Agent 1',
      role: 'وكيل المبيعات والاستقبال الذكي',
      description: 'يتولى استقبال العملاء عبر WhatsApp وGmail، والرد الفوري بلغة عربية احترافية، وتصنيف نية الشراء فورياً والتصعيد للإدارة.',
      icon: MessageSquare,
      color: 'bg-indigo-100 text-indigo-600',
      tasks: agent1Interactions,
      accuracy: 96,
      status: 'نشط ويعمل',
      todayActions: [
        `رد وتفاعل مع ${agent1Interactions} رسالة واستفسار`,
        `تصنيف ${stats.total_leads || 0} عملاء جدد في الـ CRM`,
        `تحويل ${stats.pending_approvals || 0} حالات للإدارة عبر البريد الفوري`,
        `تحديد ${stats.hot_leads || 0} صفقات شراء ساخنة (Hot Leads)`
      ],
    },
    {
      name: 'AI Agent 2',
      role: 'وكيل المتابعة وإعادة التنشيط',
      description: 'يراقب العملاء الخاملين، ويولد رسائل تذكير ذكية مخصصة لسياق كل عميل لضمان عدم ضياع أي فرصة بيعية.',
      icon: Clock,
      color: 'bg-green-100 text-green-600',
      tasks: tasks.length,
      accuracy: 95,
      status: 'نشط ويعمل',
      todayActions: [
        `إنشاء وإدارة ${tasks.length} مهمة متابعة ذكية`,
        `إرسال ${agent2TasksCompleted} رسائل إعادة تنشيط ناجحة`,
        `متابعة دورية للعملاء الخاملين في النظام`
      ],
    },
  ]

  return (
    <>
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Bot size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">وكلاء نشطون</div>
            <div className="text-2xl font-bold text-text-heading">2</div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-accent-teal">
            <CheckSquare size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">إجمالي العمليات والتفاعلات</div>
            <div className="text-2xl font-bold text-text-heading">{totalTasksToday}</div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-accent-amber">
            <Zap size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">متوسط الدقة</div>
            <div className="text-2xl font-bold text-text-heading">95.5%</div>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      {agents.map((agent, i) => {
        const Icon = agent.icon
        return (
          <section key={i} className="bg-surface rounded-xl shadow-sm border border-border p-6">
            <div className="flex gap-6">
              <div className={`w-16 h-16 rounded-xl ${agent.color} flex items-center justify-center shrink-0`}>
                <Icon size={32} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-text-heading">{agent.name}</h2>
                    <p className="text-sm text-text-body font-medium">{agent.role}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
                    </span>
                    <span className="text-xs font-semibold text-accent-teal">{agent.status}</span>
                  </div>
                </div>
                <p className="text-sm text-text-body mb-4 leading-relaxed">{agent.description}</p>
                <div className="flex gap-8 mb-4">
                  <div>
                    <div className="text-xs text-text-body font-medium">العمليات المنفذة</div>
                    <div className="font-bold text-lg text-text-heading">{agent.tasks}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-body font-medium">نسبة الدقة</div>
                    <div className="font-bold text-lg text-accent-teal">{agent.accuracy}%</div>
                  </div>
                </div>
                <div className="bg-bg rounded-lg p-4 border border-border">
                  <div className="text-sm font-bold text-text-heading mb-2">إجراءات النظام المباشرة:</div>
                  <ul className="flex flex-col gap-1.5">
                    {agent.todayActions.map((action, j) => (
                      <li key={j} className="text-sm text-text-body flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-teal shrink-0"></span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
