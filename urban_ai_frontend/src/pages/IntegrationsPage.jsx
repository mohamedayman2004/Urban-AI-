import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  MessageSquare, 
  Mail, 
  CreditCard, 
  CheckCircle2, 
  Copy, 
  Zap, 
  Check, 
  Building, 
  Layers,
  ShieldCheck,
  Receipt,
  Wallet
} from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'channels' | 'crms' | 'payments'
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({ total_interactions: 0, total_leads: 0 })
  const [tools, setTools] = useState({
    whatsapp: true,
    gmail: true,
    hubspot: true,
    salesforce: false,
    zoho: false,
    stripe: false,
    zatca_erp: false,
  })

  useEffect(() => {
    axios.get(`${API_BASE}/stats`).then(res => setStats(res.data)).catch(() => {})
  }, [])

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText('http://localhost:8000/webhook/whatsapp')
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const toggleTool = (key) => {
    setTools(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Filter Tabs definition
  const tabs = [
    { id: 'all', label: 'جميع الأدوات', count: 7 },
    { id: 'channels', label: '💬 قنوات التواصل', count: 2 },
    { id: 'crms', label: '🏢 أنظمة الـ CRM', count: 3 },
    { id: 'payments', label: '💳 بوابات الدفع والفواتير', count: 2 },
  ]

  return (
    <div className="flex flex-col gap-6 pb-8">
      
      {/* Top Health & Summary Bar */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-accent-teal">
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">قنوات التواصل</div>
            <div className="text-2xl font-bold text-text-heading">2 نشطة</div>
            <div className="text-[10px] text-accent-teal mt-0.5 font-bold">WhatsApp + Gmail</div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Zap size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">استدعاءات الـ Webhook</div>
            <div className="text-2xl font-bold text-text-heading">{stats.total_interactions || 0}</div>
            <div className="text-[10px] text-text-body mt-0.5">رسائل مستلمة ومعالجة</div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Building size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">أنظمة الـ CRM المربوطة</div>
            <div className="text-2xl font-bold text-text-heading">HubSpot</div>
            <div className="text-[10px] text-accent-teal mt-0.5 font-bold">مزامنة تلقائية 2-Way</div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="text-text-body text-sm font-semibold">الدفع والتحصيل</div>
            <div className="text-2xl font-bold text-text-heading">قريباً</div>
            <div className="text-[10px] text-purple-600 mt-0.5 font-bold">Stripe & ZATCA ERP</div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-border shadow-2xs w-fit flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'text-text-body hover:text-text-heading hover:bg-bg'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-border text-text-body'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* ==================== 1. WhatsApp Business API (Channel) ==================== */}
        {(activeTab === 'all' || activeTab === 'channels') && (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between hover:border-primary/30 transition animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 text-accent-teal flex items-center justify-center font-bold">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-heading flex items-center gap-2">
                      WhatsApp Business API
                      <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {tools.whatsapp ? 'نشط ومتصل' : 'معطل'}
                      </span>
                    </h3>
                    <p className="text-xs text-text-body">قناة الاستقبال والتأهيل والرد الفوري 24/7</p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleTool('whatsapp')}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${tools.whatsapp ? 'bg-accent-teal' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${tools.whatsapp ? 'left-1' : 'right-1'}`}></div>
                </button>
              </div>

              <p className="text-xs text-text-body leading-relaxed mb-4">
                يستقبل رسائل العملاء القادمة من Twilio أو Meta WhatsApp ويوجهها مباشرة للـ CRM لتسجيل البيانات والرد الفوري.
              </p>

              {/* Webhook URL Field with Copy */}
              <div className="bg-bg border border-border rounded-xl p-3 flex items-center justify-between gap-2 mb-4">
                <div className="text-xs font-mono text-text-heading truncate select-all" dir="ltr">
                  http://localhost:8000/webhook/whatsapp
                </div>
                <button
                  onClick={handleCopyWebhook}
                  className="bg-surface hover:bg-border text-primary border border-border px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copied ? <Check size={14} className="text-accent-teal" /> : <Copy size={14} />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
                </button>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center text-xs text-text-body">
              <span>البروتوكول: HTTP POST (TwiML Compliant)</span>
              <span className="text-accent-teal font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> استجابة في أقل من 1 ثانية
              </span>
            </div>
          </div>
        )}

        {/* ==================== 2. Gmail SMTP Escalation Server (Channel) ==================== */}
        {(activeTab === 'all' || activeTab === 'channels') && (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between hover:border-primary/30 transition animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-heading flex items-center gap-2">
                      خادم بريد التصعيد (Gmail SMTP)
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {tools.gmail ? 'Port 587 SSL' : 'معطل'}
                      </span>
                    </h3>
                    <p className="text-xs text-text-body">إرسال إشعارات التفاوض المالي العاجلة للمدير</p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleTool('gmail')}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${tools.gmail ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${tools.gmail ? 'left-1' : 'right-1'}`}></div>
                </button>
              </div>

              <p className="text-xs text-text-body leading-relaxed mb-4">
                مربوط ببريد المدير لإرسال تفاصيل العميل ونصه الفعلي مع روابط القرار المباشر لحسم الصفقات المعلقة.
              </p>

              <div className="bg-bg border border-border rounded-xl p-3 flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-body">البريد المستلم:</span>
                  <span className="font-bold text-primary font-mono select-all">mohamedaymanessawy2004@gmail.com</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-border/60 pt-2">
                  <span className="text-text-body">روابط القرار المباشر (1-Click Action):</span>
                  <span className="text-accent-teal font-bold">مفعلة (Won / Lost) ✓</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center text-xs text-text-body">
              <span>الخادم: smtp.gmail.com</span>
              <span className="text-accent-teal font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> إرسال فوري متزامن
              </span>
            </div>
          </div>
        )}

        {/* ==================== 3. HubSpot CRM (CRM) ==================== */}
        {(activeTab === 'all' || activeTab === 'crms') && (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between hover:border-primary/30 transition animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-heading flex items-center gap-2">
                      HubSpot CRM
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        tools.hubspot ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tools.hubspot ? 'مزامنة نشطة 2-Way' : 'غير متصل'}
                      </span>
                    </h3>
                    <p className="text-xs text-text-body">مزامنة جهات الاتصال ومراحل الصفقات تلقائياً</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleTool('hubspot')}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${tools.hubspot ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${tools.hubspot ? 'left-1' : 'right-1'}`}></div>
                </button>
              </div>

              <p className="text-xs text-text-body leading-relaxed mb-4">
                تصدير واستيراد بيانات العملاء المحتملين وتحديث مراحل الصفقات (Deal Pipeline) تلقائياً عند إغلاق الصفقة في Urban AI.
              </p>

              <div className="bg-bg border border-border rounded-xl p-3 flex flex-col gap-2 mb-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-body">حالة الربط:</span>
                  <span className="font-bold text-accent-teal">متصل عبر OAuth 2.0 ✓</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/60 pt-2">
                  <span className="text-text-body">نوع المزامنة:</span>
                  <span className="font-semibold text-text-heading">Leads & Deals Sync</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center text-xs text-text-body">
              <span>بروتوكول: REST API v3</span>
              <span className="text-accent-teal font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> مزامنة مستمرة
              </span>
            </div>
          </div>
        )}

        {/* ==================== 4. Salesforce CRM (CRM) ==================== */}
        {(activeTab === 'all' || activeTab === 'crms') && (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between hover:border-primary/30 transition animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-heading flex items-center gap-2">
                      Salesforce Enterprise
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        tools.salesforce ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tools.salesforce ? 'متصل' : 'جاهز للربط'}
                      </span>
                    </h3>
                    <p className="text-xs text-text-body">تغذية قنوات المبيعات وحسابات الشركات الكبرى</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleTool('salesforce')}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${tools.salesforce ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${tools.salesforce ? 'left-1' : 'right-1'}`}></div>
                </button>
              </div>

              <p className="text-xs text-text-body leading-relaxed mb-4">
                ربط حسابات العملاء المصنفين كـ `Hot Leads` وتحويلهم فورياً إلى فرص بيعية (Opportunities) في منصة Salesforce.
              </p>

              <div className="bg-bg border border-border rounded-xl p-3 flex flex-col gap-2 mb-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-body">طريقة التوثيق:</span>
                  <span className="font-bold text-primary">Connected App / API Key</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/60 pt-2">
                  <span className="text-text-body">التحديثات:</span>
                  <span className="text-text-body font-semibold">Webhooks & Events</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center text-xs text-text-body">
              <span>النظام: Salesforce Sales Cloud</span>
              <span className="text-text-body font-bold">جاهز للتفعيل</span>
            </div>
          </div>
        )}

        {/* ==================== 5. Zoho CRM (CRM) ==================== */}
        {(activeTab === 'all' || activeTab === 'crms') && (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between hover:border-primary/30 transition animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-heading flex items-center gap-2">
                      Zoho CRM
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        tools.zoho ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tools.zoho ? 'متصل' : 'جاهز للربط'}
                      </span>
                    </h3>
                    <p className="text-xs text-text-body">مزامنة جهات الاتصال وإسناد المهام للموظفين</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleTool('zoho')}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${tools.zoho ? 'bg-red-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${tools.zoho ? 'left-1' : 'right-1'}`}></div>
                </button>
              </div>

              <p className="text-xs text-text-body leading-relaxed mb-4">
                مزامنة تلقائية للمحادثات والمهام المكتملة في Urban AI وإرسالها لموظفي المبيعات داخل نظام Zoho.
              </p>

              <div className="bg-bg border border-border rounded-xl p-3 flex flex-col gap-2 mb-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-body">النطاق:</span>
                  <span className="font-bold text-text-heading">Zoho CRM Middle East</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/60 pt-2">
                  <span className="text-text-body">المزامنة:</span>
                  <span className="text-text-body font-semibold">Contacts & Activities</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center text-xs text-text-body">
              <span>بروتوكول: Zoho API v2</span>
              <span className="text-text-body font-bold">جاهز للتفعيل</span>
            </div>
          </div>
        )}

        {/* ==================== 6. Stripe Payment Links (Payment) ==================== */}
        {(activeTab === 'all' || activeTab === 'payments') && (
          <div className="bg-surface rounded-2xl border border-dashed border-border p-6 shadow-xs flex flex-col justify-between hover:border-primary/40 transition animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-heading flex items-center gap-2">
                      بوابة الدفع (Stripe & Apple Pay)
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        قريباً (Roadmap)
                      </span>
                    </h3>
                    <p className="text-xs text-text-body">تحصيل العربون وروابط الدفع الفورية من شات WhatsApp</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-text-body leading-relaxed mb-4">
                توليد رابط دفع بنكي ذكي ومباشر للعميل داخل محادثة الواتساب لحجز الوحدة وسداد العربون وتأكيد الحجز فورياً.
              </p>

              <div className="bg-bg border border-border rounded-xl p-3 flex flex-col gap-2 mb-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-body">وسائل الدفع المدعومة:</span>
                  <span className="font-bold text-text-heading">Apple Pay, Visa, Mastercard, Mada</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center text-xs text-text-body">
              <span>التكامل المالي: مرحلة التطوير</span>
              <button
                disabled
                className="bg-bg text-text-body border border-border px-3 py-1 rounded-lg text-xs font-bold opacity-60 cursor-not-allowed"
              >
                طلب تفعيل مسبق
              </button>
            </div>
          </div>
        )}

        {/* ==================== 7. ZATCA & ERP Invoicing (Payment) ==================== */}
        {(activeTab === 'all' || activeTab === 'payments') && (
          <div className="bg-surface rounded-2xl border border-dashed border-border p-6 shadow-xs flex flex-col justify-between hover:border-primary/40 transition animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center font-bold">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-heading flex items-center gap-2">
                      الفواتير الإلكترونية و ERP (ZATCA / Odoo / SAP)
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        قريباً (Roadmap)
                      </span>
                    </h3>
                    <p className="text-xs text-text-body">إصدار الفواتير الضريبية المعتمدة ومزامنة الحسابات</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-text-body leading-relaxed mb-4">
                إصدار الفواتير الإلكترونية المتوافقة مع هيئة الزكاة والضريبة والجمارك وترحيل قيود الإيرادات لنظام المحاسبة تلقائياً.
              </p>

              <div className="bg-bg border border-border rounded-xl p-3 flex flex-col gap-2 mb-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-body">أنظمة الـ ERP المدعومة:</span>
                  <span className="font-bold text-text-heading">Odoo, SAP, Oracle NetSuite, QuickBooks</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center text-xs text-text-body">
              <span>الربط المحاسبي: مرحلة التطوير</span>
              <button
                disabled
                className="bg-bg text-text-body border border-border px-3 py-1 rounded-lg text-xs font-bold opacity-60 cursor-not-allowed"
              >
                طلب تفعيل مسبق
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
