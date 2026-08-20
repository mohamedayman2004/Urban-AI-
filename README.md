# 🏢 Urban AI Enterprise — Autonomous Sales & Lead Qualification Platform

<div align="center">

![Urban AI Banner](https://img.shields.io/badge/Platform-Urban%20AI%20Enterprise-0E2A47?style=for-the-badge&logo=openai&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![WhatsApp](https://img.shields.io/badge/Channel-WhatsApp%20Business%20API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Gmail](https://img.shields.io/badge/Escalation-Gmail%20SMTP%201--Click-EA4335?style=for-the-badge&logo=gmail&logoColor=white)

**منصة المبيعات وتأهيل العملاء الذكية المتكاملة للشركات العقارية والتجارية**  
*حوّل كل رسالة واتساب إلى صفقة مغلقة بالذكاء الاصطناعي 24/7 مع متابعة ذكية وتصعيد إداري بضغطة زر واحدة.*

</div>

---

## 🌟 أبرز المميزات (Key Features)

- 🤖 **وكيل المبيعات والاستقبال (AI Agent 1):** رد فوري باللغة العربية، تأهيل نية الشراء، وتصنيف العملاء لحظياً (`Hot Lead`, `Qualified`, `Escalated`).
- ⚡ **توصية الخطوة البيعية التالية (AI Next Action):** توليد الإجراء الأنسب لموظف المبيعات لكل عميل.
- 📬 **التصعيد الإداري بضغطة زر (Human-in-the-Loop 1-Click Action):** إشعارات Gmail فورية للتفاوض المالي مع أزرار قرار مباشرة (`[✅ موافقة]` / `[❌ رفض]`) وروابط اتصال وواتساب.
- 🔄 **وكيل المتابعة وإعادة التنشيط (AI Agent 2):** رصد العملاء الخاملين وصياغة رسائل متابعة عربية مخصصة لسياق الشات في صفحة المهام (`/tasks`).
- 💬 **محاكي واتساب المباشر المدمج (In-App WhatsApp Simulator):** نافذة شات تفاعلية لتجربة رسائل العملاء وردود الـ AI وتحديث الداشبورد لحظياً بدون الحاجة لـ Postman.
- 📊 **لوحة تحكم وتحليلات حقيقية (Executive CRM Dashboard):** متابعة العملاء، معدلات التحويل الحقيقية، والفلترة حسب الحالة.
- 🔌 **إدارة الأدوات المتصلة (Connected Tools):** تبويبات تحكم تفاعلية لقنوات التواصل (WhatsApp, Gmail)، أنظمة الـ CRM (HubSpot, Salesforce, Zoho)، وبوابات الدفع (Stripe/ERP).
- 🌐 **صفحة تعريفية متكاملة (Landing Page):** واجهة تسويقية جذابة لعرض مميزات المنصة والتسجيل السريع.

---

## 🏗️ البنية المعمارية (Architecture)

```
                       [عميل على واتساب / المحاكي]
                                   │
                                   ▼
                   [FastAPI Webhook: /webhook/whatsapp]
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
 [OpenRouter Multi-LLM]   [SQLite Central DB]       [Gmail SMTP Server]
(توليد الرد والتصنيف)    (حفظ العميل والنشاط)     (إشعار الإدارة بالتصعيد)
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                   [React + Vite Frontend Dashboard]
                (تحديث لحظي كل 3 ثوانٍ لمؤشرات الـ CRM)
```

---

## 📋 المتطلبات الأساسية (Prerequisites)

تأكد من تثبيت البرامج التالية على جهازك:
- **Python:** الإصدار `3.10` أو أحدث.
- **Node.js:** الإصدار `18.0` أو أحدث.
- **Git:** للتعامل مع المستودع.

---

## 🚀 طريقة التشغيل السريعة (Quick Start Guide)

### 1️⃣ استنساخ المشروع (Clone Repository)
```bash
git clone https://github.com/your-username/urban-ai-demo.git
cd urban-ai-demo
```

---

### 2️⃣ إعداد وتشغيل خادم الباك إند (Backend - FastAPI)

افتح نافذة Terminal جديدة ونفّذ الأوامر التالية:

```bash
# 1. الدخول لمجلد الباك إند
cd backend

# 2. إنشاء وتفعيل البيئة الافتراضية
# في ويندوز (Windows):
python -m venv venv
.\venv\Scripts\activate

# في ماك / لينكس (Mac/Linux):
python3 -m venv venv
source venv/bin/activate

# 3. تثبيت المكتبات المطلوبة
pip install -r requirements.txt

# 4. إعداد ملف المتغيرات البيئية
# قم بنسخ ملف .env.example إلى .env وعدّل المفاتيح:
copy .env.example .env

# 5. تشغيل السيرفر
uvicorn main:app --reload --port 8000
```

> 🌐 **سيعمل سيرفر الباك إند على:** `http://localhost:8000`  
> 📑 **توثيق الـ API (Swagger UI):** `http://localhost:8000/docs`

---

### 3️⃣ إعداد وتشغيل واجهة المستخدم (Frontend - React Vite)

افتح نافذة Terminal ثانية ونفّذ الأوامر التالية:

```bash
# 1. الدخول لمجلد الفرونت إند
cd urban_ai_frontend

# 2. تثبيت الحزم
npm install

# 3. تشغيل خادم التطوير
npm run dev
```

> 🖥️ **ستفتح المنصة على المتصفح عبر:** `http://localhost:5173/landing`

---

## ⚙️ إعداد المتغيرات البيئية (`backend/.env`)

أنشئ ملف `.env` داخل مجلد `backend` وضع بداخله القيم التالية:

```env
# مفتاح OpenRouter للذكاء الاصطناعي
OPENROUTER_API_KEY=your_openrouter_api_key_here

# بريد المدير لاستقبال إشعارات التصعيد
MANAGER_EMAIL=mohamedaymanessawy2004@gmail.com

# رابط الباك إند (لأزرار الإجراء السريع في الإيميل)
BACKEND_URL=http://localhost:8000

# إعدادات خادم بريد Gmail SMTP
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password_here
```

> 💡 **ملاحظة بخصوص كلمة مرور Gmail:** استخدم **App Password** (كلمة مرور التطبيقات) المكونة من 16 حرفاً من إعدادات الأمان في حساب Google الخاص بك.

---

## 🎯 سيناريو تجربة العرض التقديمي (Demo Presentation Flow)

1. **الصفحة التعريفية (`/landing`):** استعراض مميزات المنصة والضغط على `[ابدأ الآن]`.
2. **شاشة تسجيل الشركة (`/signup`):** إدخال اسم الشركة وتحديد قنوات التواصل وتفضيلات المتابعة.
3. **لوحة التحكم الرئيسية (`/`):** متابعة المؤشرات الحقيقية والصفقات المغلقة.
4. **محاكي WhatsApp التفاعلي:**
   - الضغط على الزر الأخضر العائم `[💬 تجربة محاكاة WhatsApp لايف]`.
   - اختيار رسالة تجريبية سريعة (مثل: `🔥 استفسار عن الأسعار` أو `⚠️ طلب خصم خاص`).
   - مشاهدة رد الـ AI الفوري وتصنيف العميل وإرسال إيميل التصعيد للمدير لايف!
5. **شاشة العملاء (`/clients`):** فتح شات العميل عبر الـ Drawer، والتواصل المباشر بضغطة زر (`[💬 واتساب]` / `[📞 اتصال]`).
6. **شاشة المهام (`/tasks`):** مراجعة رسائل المتابعة المولدة للعملاء الخاملين وإرسالها بنقرة واحدة.
7. **الأدوات المتصلة (`/integrations`):** استعراض والتحكم في قنوات التواصل وأنظمة الـ CRM.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router DOM.
- **Backend:** FastAPI, Python 3.11, Uvicorn, SQLAlchemy, Pydantic, Python-dotenv.
- **AI & LLMs:** OpenRouter Multi-LLM Fallback (GPT-OSS, Gemma, Llama-3.1, Nemotron, LFM).
- **Messaging & Channels:** Twilio WhatsApp TwiML Webhook, Python `smtplib` (Gmail SSL/TLS).
- **Database:** SQLite3 with ACID compliance.

---

## 📄 الترخيص (License)

هذا المشروع مخصص للعرض التجريبي والتجاري لشركة **Urban AI Enterprise** © 2026.
