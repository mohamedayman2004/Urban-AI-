import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Building2, Mail, MessageSquare, Globe, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

export default function SignupPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: 'شركة URBAN العقارية',
    contact_email: 'mohamedaymanessawy2004@gmail.com',
    whatsapp_enabled: true,
    gmail_enabled: true,
    followup_mode: 'automatic', // 'automatic' or 'manual'
  })

  useEffect(() => {
    // Load current company if exists
    axios.get(`${API_BASE}/companies/current`)
      .then(res => {
        if (res.data) {
          setFormData({
            name: res.data.name || 'شركة URBAN العقارية',
            contact_email: res.data.contact_email || 'mohamedaymanessawy2004@gmail.com',
            whatsapp_enabled: res.data.whatsapp_enabled === 'true',
            gmail_enabled: res.data.gmail_enabled === 'true',
            followup_mode: res.data.followup_mode || 'automatic',
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API_BASE}/companies`, formData)
      navigate('/')
    } catch (err) {
      console.error("Error saving company:", err)
      // Even on local error, redirect to dashboard for demo continuity
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center items-center p-6 font-sans select-none" dir="rtl">
      {/* Top Brand */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-md">
          U
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading tracking-tight">URBAN AI</h1>
          <p className="text-xs text-text-body">منصة إدارة المبيعات وخدمة العملاء بالذكاء الاصطناعي</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-xl bg-surface rounded-2xl border border-border shadow-xl p-8 transition-all">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-xl font-bold text-text-heading font-heading mb-1 flex items-center gap-2">
            <Building2 className="text-primary" size={22} /> تسجيل بيانات الشركة
          </h2>
          <p className="text-sm text-text-body">
            ابدأ بتسجيل إعدادات شركتك لتفعيل وكلاء الذكاء الاصطناعي وبدء استقبال العملاء.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-text-heading mb-2">
              اسم الشركة <span className="text-accent-red">*</span>
            </label>
            <div className="flex items-center gap-2.5 bg-bg border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary transition">
              <Building2 size={18} className="text-text-body shrink-0" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: شركة URBAN العقارية"
                className="bg-transparent border-none outline-none text-sm text-text-heading w-full font-medium"
              />
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-xs font-bold text-text-heading mb-2">
              البريد الإلكتروني للتواصل والإشعارات <span className="text-accent-red">*</span>
            </label>
            <div className="flex items-center gap-2.5 bg-bg border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary transition">
              <Mail size={18} className="text-text-body shrink-0" />
              <input
                type="email"
                required
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="name@company.com"
                className="bg-transparent border-none outline-none text-sm text-text-heading w-full font-medium text-left"
                dir="ltr"
              />
            </div>
            <p className="text-[11px] text-text-body mt-1">تصل إليه إشعارات التصعيد الفورية وروابط القرار المباشر.</p>
          </div>

          {/* Channels Toggles */}
          <div className="border-t border-border pt-4">
            <label className="block text-xs font-bold text-text-heading mb-3 flex items-center gap-1.5">
              <Globe size={15} className="text-primary" /> القنوات المفعلة (Connected Channels)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp Toggle */}
              <div
                onClick={() => setFormData({ ...formData, whatsapp_enabled: !formData.whatsapp_enabled })}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  formData.whatsapp_enabled
                    ? 'bg-accent-teal/5 border-accent-teal text-text-heading'
                    : 'bg-bg border-border text-text-body opacity-75'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-accent-teal flex items-center justify-center font-bold">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">واتساب بزنس</div>
                    <div className="text-[10px] text-text-body">WhatsApp API</div>
                  </div>
                </div>
                <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.whatsapp_enabled ? 'bg-accent-teal' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow ${formData.whatsapp_enabled ? 'left-0.5' : 'right-0.5'}`}></div>
                </div>
              </div>

              {/* Gmail Toggle */}
              <div
                onClick={() => setFormData({ ...formData, gmail_enabled: !formData.gmail_enabled })}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  formData.gmail_enabled
                    ? 'bg-blue-50/60 border-blue-400 text-text-heading'
                    : 'bg-bg border-border text-text-body opacity-75'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">بريد Gmail</div>
                    <div className="text-[10px] text-text-body">SMTP Alerts</div>
                  </div>
                </div>
                <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.gmail_enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow ${formData.gmail_enabled ? 'left-0.5' : 'right-0.5'}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up Approval Mode */}
          <div className="border-t border-border pt-4">
            <label className="block text-xs font-bold text-text-heading mb-2 flex items-center gap-1.5">
              <Sparkles size={15} className="text-accent-amber" /> نمط اعتماد المتابعات الذكية (AI Follow-up Mode)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setFormData({ ...formData, followup_mode: 'automatic' })}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1 ${
                  formData.followup_mode === 'automatic'
                    ? 'bg-primary/5 border-primary text-primary font-bold shadow-xs'
                    : 'bg-bg border-border text-text-body'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>⚡ إرسال تلقائي فوري</span>
                  {formData.followup_mode === 'automatic' && <CheckCircle2 size={14} className="text-primary" />}
                </div>
                <div className="text-[10px] text-text-body font-normal">يقوم الذكاء الاصطناعي بمتابعة العملاء تلقائياً دون انتظار موافقة يدوية.</div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, followup_mode: 'manual' })}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1 ${
                  formData.followup_mode === 'manual'
                    ? 'bg-primary/5 border-primary text-primary font-bold shadow-xs'
                    : 'bg-bg border-border text-text-body'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>✋ موافقة يدوية قبل الإرسال</span>
                  {formData.followup_mode === 'manual' && <CheckCircle2 size={14} className="text-primary" />}
                </div>
                <div className="text-[10px] text-text-body font-normal">تظهر الرسائل المقترحة في صفحة المهام وتنتظر ضغطتك للموافقة.</div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm disabled:opacity-50"
          >
            {loading ? (
              <span>جاري الحفظ والدخول...</span>
            ) : (
              <>
                <span>🚀 بدء الاستخدام والدخول للوحة التحكم</span>
                <ArrowLeft size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-text-body flex items-center gap-2">
        <ShieldCheck size={14} className="text-accent-teal" />
        <span>جميع بيانات العملاء والمحادثات السابقة محفوظة بالكامل وجاهزة في لوحة التحكم.</span>
      </div>
    </div>
  )
}
