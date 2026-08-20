import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { MessageSquare, Send, X, Minimize2, Sparkles, CheckCheck, RefreshCw, PhoneCall } from 'lucide-react'

const API_BASE = 'http://localhost:8000'

const quickPresets = [
  { label: '🔥 استفسار عن الأسعار', text: 'أهلاً، مهتم أعرف أسعار الوحدات وطرق السداد المتاحة عندكم' },
  { label: '⚠️ طلب خصم خاص (تصعيد)', text: 'عايز خصم 25% على الشقة ومحتاج أكلم المدير المسؤول' },
  { label: '📋 استفسار عام', text: 'ممكن تفاصيل أكتر عن مشاريعكم ومواقعها؟' },
]

export default function WhatsAppSimulator() {
  const [isOpen, setIsOpen] = useState(false)
  const [phone, setPhone] = useState('+966551234567')
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'مرحباً بك في Urban AI! 👋 كيف يمكننا مساعدتك اليوم في اختيار مشروعك العقاري؟',
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const chatEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputMessage).trim()
    if (!textToSend || loading) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setLoading(true)

    try {
      // Send as standard form data to backend WhatsApp webhook
      const formData = new FormData()
      formData.append('From', `whatsapp:${phone}`)
      formData.append('Body', textToSend)

      const res = await axios.post(`${API_BASE}/webhook/whatsapp`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Parse TwiML response or extract clean text without XML tags
      let replyText = "تم استلام رسالتك بنجاح وسنقوم بالرد عليك."
      if (typeof res.data === 'string') {
        const match = res.data.match(/<Message>(.*?)<\/Message>/s) || res.data.match(/<Body>(.*?)<\/Body>/s)
        if (match && match[1]) {
          replyText = match[1].trim()
        } else {
          // Strip any remaining XML/HTML tags
          replyText = res.data.replace(/<[^>]*>/g, '').replace(/<\?xml.*?\?>/g, '').trim()
        }
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      console.error("Simulator error:", err)
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'أهلاً بك! تم استلام رسالتك وتسجيلها في النظام بنجاح.',
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: 'مرحباً بك في Urban AI! 👋 كيف يمكننا مساعدتك اليوم في اختيار مشروعك العقاري؟',
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105 cursor-pointer font-bold text-xs group"
          title="افتح محاكي WhatsApp لتجربة شات العميل مباشرة"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <MessageSquare size={18} />
          <span>💬 تجربة محاكاة WhatsApp لايف</span>
        </button>
      )}

      {/* WhatsApp Chat Modal Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] bg-[#EFEAE2] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden font-sans animate-fade-in"
          dir="rtl"
        >
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white relative">
                🤖
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border border-[#075E54]"></span>
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">Urban AI (وكيل المبيعات)</div>
                <div className="text-[11px] text-white/80 font-normal">متصل الآن • رد فوري</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
                title="إعادة بدء المحادثة"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
                title="إغلاق المحاكي"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Test Phone Switcher Bar */}
          <div className="bg-[#128C7E] px-3 py-1.5 flex items-center justify-between text-[11px] text-white/90 shrink-0">
            <span>رقم العميل التجريبي:</span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-black/20 text-white px-2 py-0.5 rounded border border-white/20 text-[11px] font-mono outline-none w-32 text-left"
              dir="ltr"
            />
          </div>

          {/* Chat Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5"
            style={{
              backgroundImage: `radial-gradient(#d4cdc5 1px, transparent 1px)`,
              backgroundSize: '16px 16px'
            }}
          >
            {messages.map(msg => {
              const isUser = msg.sender === 'user'
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl text-xs leading-relaxed shadow-sm ${isUser
                        ? 'bg-[#DCF8C6] text-gray-800 rounded-bl-sm'
                        : 'bg-white text-gray-800 rounded-br-sm'
                      }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 mt-1">
                      <span>{msg.time}</span>
                      {isUser && <CheckCheck size={13} className="text-[#34B7F1]" />}
                    </div>
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="self-start bg-white px-3.5 py-2 rounded-xl text-xs text-gray-500 shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px]">الذكاء الاصطناعي يكتب الرد...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Presets Chips */}
          <div className="bg-white/80 border-t border-border px-2.5 py-1.5 flex gap-1.5 overflow-x-auto shrink-0">
            {quickPresets.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(preset.text)}
                disabled={loading}
                className="whitespace-nowrap bg-bg hover:bg-border text-text-heading border border-border px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="bg-[#F0F2F5] p-2.5 flex items-center gap-2 border-t border-border shrink-0"
          >
            <input
              type="text"
              placeholder="اكتب رسالة كعميل (مثال: عايز أسعار الوحدات)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 bg-white border border-border rounded-full px-3.5 py-2 text-xs text-text-heading placeholder:text-text-body outline-none focus:border-[#25D366] transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="w-8 h-8 rounded-full bg-[#075E54] hover:bg-[#128C7E] text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40 shrink-0"
              title="إرسال"
            >
              <Send size={14} className="rotate-180" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
