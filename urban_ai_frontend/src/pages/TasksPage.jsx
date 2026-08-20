import { useState, useEffect } from 'react'
import axios from 'axios'
import { CheckSquare, Clock, AlertTriangle, Send, Sparkles, RefreshCw } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

const statusStyle = {
  'مكتملة': 'bg-accent-teal/10 text-accent-teal',
  'جارية': 'bg-blue-100 text-blue-600',
  'متأخرة': 'bg-accent-red/10 text-accent-red',
}

const priorityStyle = {
  'عالية': 'text-accent-red',
  'متوسطة': 'text-accent-amber',
  'منخفضة': 'text-text-body',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`)
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    }
  }

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleScanDormant = async () => {
    setLoading(true)
    try {
      await axios.post(`${API_BASE}/tasks/scan-dormant`)
      await fetchTasks()
    } catch (err) {
      console.error('Scan failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendFollowup = async (taskId) => {
    setActionLoading(taskId)
    try {
      await axios.post(`${API_BASE}/tasks/${taskId}/send`)
      await fetchTasks()
    } catch (err) {
      console.error('Failed to send followup:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const completed = tasks.filter(t => t.status === 'مكتملة').length
  const inProgress = tasks.filter(t => t.status === 'جارية').length
  const overdue = tasks.filter(t => t.status === 'متأخرة').length

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-accent-teal">
            <CheckSquare size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">مكتملة</div>
            <div className="text-2xl font-bold text-text-heading">{completed}</div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">جارية</div>
            <div className="text-2xl font-bold text-text-heading">{inProgress}</div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-accent-red">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">متأخرة</div>
            <div className="text-2xl font-bold text-text-heading">{overdue}</div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <section className="bg-surface rounded-xl border border-border flex flex-col overflow-hidden shadow-sm flex-1">
        <div className="p-6 border-b border-border bg-bg/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-heading flex items-center gap-2">
            <CheckSquare className="text-primary" size={22} /> مهام المتابعة وإعادة التنشيط (AI Agent 2)
          </h2>
          <button
            onClick={handleScanDormant}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "جاري الفحص..." : "فحص وتوليد متابعات ذكية"}
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-bg text-text-body text-sm uppercase tracking-wider sticky top-0">
              <tr>
                <th className="p-4 font-medium">المهمة والرسالة المقترحة</th>
                <th className="p-4 font-medium">المسؤول</th>
                <th className="p-4 font-medium">الأولوية</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium">تاريخ الإنشاء</th>
                <th className="p-4 font-medium text-left">إجراء الإرسال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-bg/50 transition">
                  <td className="p-4">
                    <div className="text-text-heading font-semibold">{task.title}</div>
                    {task.suggested_message && (
                      <div className="text-xs text-text-body bg-bg/80 p-2 rounded mt-1 border-r-2 border-accent-teal max-w-xl">
                        💬 <span className="font-medium text-primary">المقترح من الـ AI:</span> {task.suggested_message}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-text-body">{task.assignee}</td>
                  <td className={`p-4 text-sm font-semibold ${priorityStyle[task.priority] || ''}`}>{task.priority}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center min-w-[70px] ${statusStyle[task.status] || statusStyle['جارية']}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-body">
                    {new Date(task.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4 text-left">
                    {task.status === 'جارية' ? (
                      <button
                        onClick={() => handleSendFollowup(task.id)}
                        disabled={actionLoading === task.id}
                        className="bg-accent-teal hover:bg-accent-teal/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                      >
                        <Send size={13} />
                        {actionLoading === task.id ? "جاري الإرسال..." : "إرسال المتابعة"}
                      </button>
                    ) : (
                      <span className="text-xs text-accent-teal font-semibold">✓ تم الإرسال</span>
                    )}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-text-body">
                    <div className="flex flex-col items-center gap-3">
                      <Sparkles size={32} className="text-primary/40" />
                      <p className="text-base font-semibold">لا توجد مهام متابعة معلقة حالياً.</p>
                      <p className="text-xs text-text-body/70">اضغط على زر "فحص وتوليد متابعات ذكية" لفحص العملاء الخاملين تلقائياً.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
