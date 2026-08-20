import { useState } from 'react'
import axios from 'axios'
import { Bell, Shield, Palette, Globe, Database, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

export default function SettingsPage() {
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  
  const [settings, setSettings] = useState({
    new_leads_notif: true,
    escalation_notif: true,
    daily_email_report: true,
    auto_escalate: true,
    data_encryption: true,
    dark_mode: false,
    whatsapp_active: true,
    gmail_smtp_active: true,
    openrouter_active: true,
  })

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleResetDemo = async () => {
    if (!window.confirm("⚠️ هل أنت متأكد من رغبتك في تصفير جميع بيانات العملاء والمهام والمحادثات للبدء من الصفر؟")) {
      return
    }

    setResetLoading(true)
    setResetSuccess(false)
    try {
      await axios.post(`${API_BASE}/demo/reset`)
      setResetSuccess(true)
      setTimeout(() => setResetSuccess(false), 4000)
    } catch (err) {
      console.error("Failed to reset demo data:", err)
      alert("حدث خطأ أثناء تصفير البيانات.")
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        {/* Notifications */}
        <section className="bg-surface rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bell size={20} />
            </div>
            <h2 className="text-lg font-bold text-text-heading">إعدادات الإشعارات والتنبيهات</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-text-heading">إشعارات العملاء الجدد الفورية</span>
              <button
                onClick={() => toggleSetting('new_leads_notif')}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${settings.new_leads_notif ? 'bg-accent-teal' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${settings.new_leads_notif ? 'left-0.5' : 'right-0.5'}`}></div>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-text-heading">إرسال إيميل تصعيد فوري للمدير (Gmail)</span>
              <button
                onClick={() => toggleSetting('escalation_notif')}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${settings.escalation_notif ? 'bg-accent-teal' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${settings.escalation_notif ? 'left-0.5' : 'right-0.5'}`}></div>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-text-heading">تفعيل روابط القرار المباشر (1-Click Action)</span>
              <button
                onClick={() => toggleSetting('daily_email_report')}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${settings.daily_email_report ? 'bg-accent-teal' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${settings.daily_email_report ? 'left-0.5' : 'right-0.5'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="bg-surface rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Globe size={20} />
            </div>
            <h2 className="text-lg font-bold text-text-heading">حالة القنوات والتكاملات</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-text-heading">WhatsApp Business Webhook</div>
                <div className="text-xs text-text-body">مربوط ومتصل عبر Twilio / Webhook</div>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold">متصل ✓</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-text-heading">Gmail SMTP Server</div>
                <div className="text-xs text-text-body">مربوط بـ mohamedaymanessawy2004@gmail.com</div>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold">نشط ✓</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-text-heading">OpenRouter Multi-LLM Engine</div>
                <div className="text-xs text-text-body">سلسلة 5 نماذج ذكاء اصطناعي مع Fallback</div>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold">جاهز ✓</span>
            </div>
          </div>
        </section>
      </div>

      {/* Demo Reset Management */}
      <section className="bg-surface rounded-xl shadow-sm border border-accent-red/20 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-accent-red flex items-center justify-center shrink-0">
              <Trash2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-heading flex items-center gap-2">
                تصفير البيانات
              </h2>
              <p className="text-sm text-text-body mt-0.5">
                تصفير قاعدة البيانات وسجلات العملاء والمهام للبدء من جديد.
              </p>
              {resetSuccess && (
                <div className="mt-2 bg-green-50 text-accent-teal border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={15} /> تم تصفير البيانات بنجاح!
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleResetDemo}
            disabled={resetLoading}
            className="bg-accent-red hover:bg-accent-red/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
          >
            <Trash2 size={16} />
            {resetLoading ? "جاري التصفير..." : "تصفير البيانات"}
          </button>
        </div>
      </section>

      {/* System Information */}
      <section className="bg-surface rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            <Database size={20} />
          </div>
          <h2 className="text-lg font-bold text-text-heading">معلومات وبنية النظام (Architecture)</h2>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-bg rounded-lg p-4 border border-border">
            <div className="text-xs text-text-body mb-1 font-medium">إصدار المنصة</div>
            <div className="font-bold text-text-heading">Urban AI Enterprise v1.0</div>
          </div>
          <div className="bg-bg rounded-lg p-4 border border-border">
            <div className="text-xs text-text-body mb-1 font-medium">قاعدة البيانات</div>
            <div className="font-bold text-text-heading">SQLite (Fast SQLAlchemy)</div>
          </div>
          <div className="bg-bg rounded-lg p-4 border border-border">
            <div className="text-xs text-text-body mb-1 font-medium">الخادم والـ API</div>
            <div className="font-bold text-text-heading">FastAPI Python 3.11</div>
          </div>
          <div className="bg-bg rounded-lg p-4 border border-border">
            <div className="text-xs text-text-body mb-1 font-medium">واجهة المستخدم</div>
            <div className="font-bold text-text-heading">React 18 + Tailwind CSS</div>
          </div>
        </div>
      </section>
    </>
  )
}
