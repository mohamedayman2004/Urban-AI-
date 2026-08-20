import { useState, useEffect, useRef } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, CheckSquare, Settings, BarChart2, Bell, ChevronDown, Bot, Trash2, Mail, ExternalLink, ShieldCheck, Building2, Globe, Cable } from 'lucide-react'
import axios from 'axios'

import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import TasksPage from './pages/TasksPage'
import AgentsPage from './pages/AgentsPage'
import ReportsPage from './pages/ReportsPage'
import IntegrationsPage from './pages/IntegrationsPage'
import SettingsPage from './pages/SettingsPage'
import SignupPage from './pages/SignupPage'
import LandingPage from './pages/LandingPage'
import WhatsAppSimulator from './components/WhatsAppSimulator'

const API_BASE = 'http://localhost:8000/api'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'الرئيسية' },
  { to: '/clients', icon: Users, label: 'العملاء' },
  { to: '/tasks', icon: CheckSquare, label: 'المهام' },
  { to: '/agents', icon: Bot, label: 'AI Agents' },
  { to: '/integrations', icon: Cable, label: 'الأدوات المتصلة' },
  { to: '/reports', icon: BarChart2, label: 'التقارير' },
  { to: '/settings', icon: Settings, label: 'الإعدادات' },
]

const pageTitles = {
  '/': { title: 'مرحباً بك، مدير الشركة', subtitle: 'إليك نظرة عامة على أداء شركتك اليوم' },
  '/clients': { title: 'إدارة العملاء', subtitle: 'عرض وإدارة جميع العملاء والتفاعلات' },
  '/tasks': { title: 'إدارة المهام', subtitle: 'متابعة جميع المهام والإجراءات المطلوبة' },
  '/agents': { title: 'وكلاء الذكاء الاصطناعي', subtitle: 'مراقبة أداء وكلاء AI والتحكم بهم' },
  '/integrations': { title: 'التكاملات والأدوات المتصلة', subtitle: 'إدارة وتفعيل قنوات التواصل وخوادم الذكاء الاصطناعي والبريد' },
  '/reports': { title: 'التقارير والتحليلات', subtitle: 'تحليل شامل لأداء الشركة والمبيعات' },
  '/settings': { title: 'الإعدادات', subtitle: 'إدارة إعدادات النظام وتفضيلات المنصة' },
}

function App() {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  const notifRef = useRef(null)
  const profileRef = useRef(null)

  // Fetch recent notifications
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/leads`)
        const logs = res.data.flatMap(l => (l.activity_logs || []).map(log => ({ ...log, phone: l.phone_number })))
                             .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                             .slice(0, 5)
        setNotifications(logs)
      } catch (e) {
        console.error(e)
      }
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 4000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentInfo = pageTitles[location.pathname] || pageTitles['/']

  if (location.pathname === '/landing') {
    return <LandingPage />
  }

  if (location.pathname === '/signup') {
    return <SignupPage />
  }

  return (
    <div className="flex h-screen bg-bg font-sans overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col z-10 shrink-0 shadow-lg">
        <div className="p-6 text-2xl font-bold flex items-center gap-3">
          URBAN شركة <span className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-xl ml-auto">U</span>
        </div>
        <nav className="flex-1 mt-4 flex flex-col gap-1 px-4">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-lg transition font-medium ${
                    isActive
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={22} className="opacity-90" /> {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">

        {/* Top Header */}
        <header className="px-8 py-6 flex justify-between items-center bg-bg shrink-0 z-20">
          <div>
            <h1 className="text-3xl font-bold text-text-heading mb-1">{currentInfo.title}</h1>
            <p className="text-text-body text-sm">{currentInfo.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-6">
            
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen)
                  setIsProfileOpen(false)
                }}
                className="relative p-2 rounded-lg hover:bg-border/60 transition cursor-pointer text-text-body hover:text-text-heading"
              >
                <Bell size={22} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 bg-accent-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute left-0 mt-3 w-80 bg-surface border border-border rounded-xl shadow-xl p-4 z-50 animate-fade-in text-right">
                  <div className="flex justify-between items-center pb-2.5 border-b border-border mb-2">
                    <span className="font-bold text-sm text-text-heading">أحدث التنبيهات المباشرة</span>
                    <span className="text-[10px] text-accent-teal font-bold bg-accent-teal/10 px-2 py-0.5 rounded-full">لايف</span>
                  </div>
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className="p-2.5 bg-bg rounded-lg border border-border text-xs flex flex-col gap-1">
                        <div className="flex justify-between items-center font-semibold text-primary">
                          <span>{notif.phone}</span>
                          <span className="text-[10px] text-text-body font-normal">{new Date(notif.timestamp).toLocaleTimeString('ar-SA')}</span>
                        </div>
                        <p className="text-text-heading text-[11px] line-clamp-2">{notif.message_body}</p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="text-center text-text-body py-4 text-xs">لا توجد إشعارات جديدة.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen)
                  setIsNotifOpen(false)
                }}
                className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-border/40 transition select-none"
              >
                <div className="text-left">
                  <div className="font-bold text-sm text-text-heading">مدير الشركة</div>
                  <div className="text-xs text-text-body">المدير العام</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                  <Users size={18} />
                </div>
                <ChevronDown size={15} className={`text-text-body transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              {isProfileOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-surface border border-border rounded-xl shadow-xl p-3 z-50 animate-fade-in text-right">
                  <div className="p-2.5 bg-bg rounded-lg border border-border mb-2 text-right">
                    <div className="font-bold text-xs text-text-heading">محمد أيمن (المدير العام)</div>
                    <div className="text-[11px] text-text-body truncate mt-0.5">mohamedaymanessawy2004@gmail.com</div>
                  </div>
                  <div className="flex flex-col gap-1 text-xs font-semibold text-text-heading">
                    <button
                      onClick={() => {
                        navigate('/landing')
                        setIsProfileOpen(false)
                      }}
                      className="p-2 rounded-lg hover:bg-bg flex items-center gap-2.5 transition text-right cursor-pointer w-full"
                    >
                      <Globe size={15} className="text-accent-teal" /> الصفحة التعريفية (Landing Page)
                    </button>
                    <button
                      onClick={() => {
                        navigate('/signup')
                        setIsProfileOpen(false)
                      }}
                      className="p-2 rounded-lg hover:bg-primary/5 text-primary flex items-center gap-2.5 transition text-right cursor-pointer w-full font-bold"
                    >
                      <Building2 size={15} /> تجربة تسجيل شركة (Sign Up Demo)
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings')
                        setIsProfileOpen(false)
                      }}
                      className="p-2 rounded-lg hover:bg-bg flex items-center gap-2.5 transition text-right cursor-pointer w-full"
                    >
                      <Settings size={15} className="text-primary" /> إعدادات الحساب والتكاملات
                    </button>
                    <button
                      onClick={() => {
                        navigate('/reports')
                        setIsProfileOpen(false)
                      }}
                      className="p-2 rounded-lg hover:bg-bg flex items-center gap-2.5 transition text-right cursor-pointer w-full"
                    >
                      <BarChart2 size={15} className="text-accent-teal" /> التقارير والإحصائيات
                    </button>
                    <div className="h-px bg-border my-1"></div>
                    <button
                      onClick={async () => {
                        if (window.confirm("هل ترغب في تصفير جميع بيانات العملاء للبدء من الصفر؟")) {
                          await axios.post(`${API_BASE}/demo/reset`)
                          setIsProfileOpen(false)
                          window.location.reload()
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-accent-red/10 text-accent-red flex items-center gap-2.5 transition text-right cursor-pointer w-full"
                    >
                      <Trash2 size={15} /> تصفير بيانات الـ Demo
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page Content */}
        <div className="px-8 pb-8 flex flex-col gap-6 flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>

        {/* Global Live In-App WhatsApp Simulator */}
        <WhatsAppSimulator />

      </main>
    </div>
  )
}

export default App
