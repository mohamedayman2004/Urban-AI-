import { useNavigate } from 'react-router-dom'
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  PhoneCall, 
  Users, 
  BarChart3, 
  Mail,
  ChevronLeft
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0E2A47] font-sans overflow-x-hidden select-none" dir="rtl">
      
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/80 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
              U
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-primary font-heading flex items-center gap-2">
                URBAN AI
                <span className="bg-accent-teal/10 text-accent-teal text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Enterprise
                </span>
              </div>
              <div className="text-[11px] text-text-body font-medium">وكلاء المبيعات وإدارة العملاء الذكية</div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-text-body">
            <a href="#features" className="hover:text-primary transition">المميزات</a>
            <a href="#how-it-works" className="hover:text-primary transition">كيف تعمل المنصة</a>
            <a href="#agents" className="hover:text-primary transition">وكلاء AI</a>
            <a href="#integration" className="hover:text-primary transition">التكاملات</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-bold text-text-heading hover:text-primary px-4 py-2.5 rounded-xl hover:bg-bg transition cursor-pointer hidden sm:block"
            >
              دخول لوحة التحكم
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer transform hover:scale-[1.02]"
            >
              <span>ابدأ الآن مجاناً</span>
              <ArrowLeft size={14} />
            </button>
          </div>

        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-16 pb-24 px-8 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/15 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-2xs">
            <Sparkles size={14} className="text-accent-teal" />
            <span>منصة المبيعات الذكية الأولى للشركات العقارية والتجارية</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-text-heading font-heading leading-[1.25] tracking-tight mb-6 max-w-4xl">
            حوّل كل رسالة واتساب إلى <span className="text-accent-teal relative inline-block">صفقة مغلقة</span> بالذكاء الاصطناعي 24/7
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-text-body max-w-2xl leading-relaxed mb-10">
            وكلاء ذكاء اصطناعي يتولون استقبال العملاء فورياً، تأهيل نية الشراء، إرسال المتابعات الذكية، وتصعيد الصفقات للإدارة بضغطة زر واحدة.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center mb-16">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-extrabold text-sm px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-3 cursor-pointer transform hover:scale-105"
            >
              <span>🚀 اشترك وسجّل شركتك الآن</span>
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-white hover:bg-bg text-text-heading border border-border font-bold text-sm px-7 py-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📊 استعراض لوحة التحكم لايف</span>
            </button>
          </div>

          {/* Feature Highlights Ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            {[
              { icon: Zap, label: 'استجابة في أقل من ثانية', sub: 'ردود فورية على WhatsApp' },
              { icon: Users, label: 'تأهيل وتصنيف العملاء', sub: 'Hot vs Cold Leads' },
              { icon: Mail, label: 'تصعيد بضغطة زر', sub: '1-Click Action عبر Gmail' },
              { icon: Clock, label: 'متابعة ذكية آلية', sub: 'إعادة تنشيط العملاء الخاملين' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-4 text-right shadow-2xs flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <Icon size={16} className="text-accent-teal shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <div className="text-[11px] text-text-body">{item.sub}</div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ==================== CORE AGENTS SECTION ==================== */}
      <section id="agents" className="py-20 px-8 bg-white border-y border-border">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold text-accent-teal uppercase tracking-widest mb-2">منظومة الوكلاء الأذكياء</h2>
            <h3 className="text-3xl font-bold text-text-heading font-heading">وكيلان مخصصان لقيادة عمليات المبيعات</h3>
            <p className="text-sm text-text-body mt-2">يعملان بتكامل تام لتحويل كل زائر لعميل دائم ومتابعة كل فرصة حتى الإغلاق.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Agent 1 */}
            <div className="bg-[#F8FAFC] border border-border rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                  <MessageSquare size={28} />
                </div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-text-heading">AI Agent 1: وكيل المبيعات والاستقبال</h4>
                    <span className="text-xs text-primary font-semibold">استقبال فوري • تأهيل ذكي • تصعيد للإدارة</span>
                  </div>
                  <span className="bg-green-100 text-accent-teal text-xs font-bold px-2.5 py-1 rounded-full">نشط 24/7</span>
                </div>
                <p className="text-xs text-text-body leading-relaxed mb-6">
                  يتولى الرد على جميع رسائل WhatsApp بلغة عربية احترافية، استخراج نية الشراء، وتصنيف العميل فورياً في الـ CRM وتنبيه الإدارة عند التفاوض المالي.
                </p>
                <div className="bg-white rounded-xl p-4 border border-border mb-6">
                  <div className="text-xs font-bold text-text-heading mb-2">أبرز القدرات:</div>
                  <ul className="flex flex-col gap-2 text-xs text-text-body">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent-teal shrink-0" /> الرد الفوري على استفسارات الأسعار والمشاريع</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent-teal shrink-0" /> تصنيف نية الشراء (Hot Lead / Qualified / Escalated)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent-teal shrink-0" /> اقتراح الخطوة البيعية التالية (AI Next Action)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Agent 2 */}
            <div className="bg-[#F8FAFC] border border-border rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-green-100 text-accent-teal flex items-center justify-center mb-6">
                  <Clock size={28} />
                </div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-text-heading">AI Agent 2: وكيل المتابعة وإعادة التنشيط</h4>
                    <span className="text-xs text-primary font-semibold">رصد العملاء الخاملين • رسائل مخصصة • تذكيرات</span>
                  </div>
                  <span className="bg-green-100 text-accent-teal text-xs font-bold px-2.5 py-1 rounded-full">نشط 24/7</span>
                </div>
                <p className="text-xs text-text-body leading-relaxed mb-6">
                  يراقب العملاء الذين توقفوا عن الرد، ويولد رسائل متابعة ذكية مخصصة لسياق كل عميل لضمان استمرار المحادثة حتى إتمام التعاقد.
                </p>
                <div className="bg-white rounded-xl p-4 border border-border mb-6">
                  <div className="text-xs font-bold text-text-heading mb-2">أبرز القدرات:</div>
                  <ul className="flex flex-col gap-2 text-xs text-text-body">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent-teal shrink-0" /> كشف تلقائي للعملاء المنقطعين عن التواصل</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent-teal shrink-0" /> صياغة رسائل متابعة عربية مخصصة بحسب سياق الشات</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent-teal shrink-0" /> إرسال فوري بضغطة زر واحدة وتحديث سجل النشاط</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold text-accent-teal uppercase tracking-widest mb-2">بساطة الاستخدام</h2>
            <h3 className="text-3xl font-bold text-text-heading font-heading">ابدأ تشغيل المنصة في 3 خطوات بسيطة</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs text-right relative">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mb-4 text-sm">
                1
              </div>
              <h4 className="font-bold text-base text-text-heading mb-2">تسجيل بيانات شركتك</h4>
              <p className="text-xs text-text-body leading-relaxed">
                أدخل اسم الشركة والبريد الإلكتروني وحدد تفضيلات وقنوات العمل في أقل من 30 ثانية.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs text-right relative">
              <div className="w-10 h-10 rounded-full bg-accent-teal text-white font-bold flex items-center justify-center mb-4 text-sm">
                2
              </div>
              <h4 className="font-bold text-base text-text-heading mb-2">ربط واتساب والبريد</h4>
              <p className="text-xs text-text-body leading-relaxed">
                تفعيل الـ Webhook وربط إيميل المدير لاستقبال إشعارات وتنبيهات التصعيد الفورية.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs text-right relative">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mb-4 text-sm">
                3
              </div>
              <h4 className="font-bold text-base text-text-heading mb-2">إطلاق المنصة وزيادة الصفقات</h4>
              <p className="text-xs text-text-body leading-relaxed">
                الوكيل الذكي يبدأ فوراً في استقبال وتأهيل العملاء وإغلاق الصفقات عبر لوحة التحكم.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== BOTTOM CTA BANNER ==================== */}
      <section className="py-16 px-8 bg-primary text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-4">
            جاهز لمضاعفة مبيعات شركتك بالذكاء الاصطناعي؟
          </h2>
          <p className="text-sm text-white/80 max-w-xl mb-8 leading-relaxed">
            انضم إلى الجيل القادم من شركات المبيعات الذكية وابدأ تجربة استقبال وتأهيل عملائك الآن.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-accent-teal hover:bg-accent-teal/90 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <span>🚀 اشترك الآن وابدأ فوراً</span>
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-7 py-3.5 rounded-xl transition cursor-pointer"
            >
              <span>لوحة التحكم المباشرة</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#081C30] text-white/70 py-8 px-8 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div>
            <span className="font-bold text-white">URBAN AI Enterprise</span> — منصة المبيعات وخدمة العملاء الذكية.
          </div>
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </div>
        </div>
      </footer>

    </div>
  )
}
