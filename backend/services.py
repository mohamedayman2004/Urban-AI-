import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY", "dummy_key_for_testing"),
    timeout=8.0
)

# Prioritized list of active free models on OpenRouter
FALLBACK_MODELS = [
    "openai/gpt-oss-20b:free",
    "google/gemma-4-26b-a4b-it:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "liquid/lfm-2.5-2.6b:free"
]

SYSTEM_PROMPT = """
You are the Urban AI Sales Agent for a Real Estate and Property Services company based in Saudi Arabia and Egypt.
Your goal is to be friendly, concise, and professional in fluent Arabic.
Analyze the customer's message and generate a helpful sales response.
Also, determine a suggested lead status and the single best next action recommendation for the sales team.

Return your response in JSON format exactly like this:
{
    "response_text": "رد المبيعات المناسب بالعربية هنا",
    "suggested_status": "Status Here",
    "next_action": "توصية الخطوة التالية للمبيعات هنا بالعربية"
}

Statuses you must choose from:
- 'Hot Lead': If the user asks for pricing (أسعار), wants to buy/rent (شراء / حجز), or asks for a meeting (ميتنج / اجتماع).
- 'Qualified': If the user asks general questions about services, projects, or company capabilities.
- 'Escalated': If the user asks for a human, manager (مدير / إدارة), custom discount (خصم), or has a complex request.
- 'New': Simple greetings (أهلاً / مرحبا) or unclear intent.
"""

def generate_ai_response(user_message: str) -> dict:
    # Try models in order of priority
    for model_name in FALLBACK_MODELS:
        try:
            print(f"Calling model: {model_name}...")
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
            )
            content = response.choices[0].message.content or ""
            if not content.strip():
                continue

            # Strip markdown code blocks if returned (e.g. ```json ... ```)
            clean_content = content.strip()
            if clean_content.startswith("```"):
                clean_content = clean_content.split("```")[1]
                if clean_content.startswith("json"):
                    clean_content = clean_content[4:]
                clean_content = clean_content.strip()

            try:
                result = json.loads(clean_content)
                status = result.get("suggested_status", "Qualified")
                reply = result.get("response_text", content)
                next_act = result.get("next_action")
                if not next_act:
                    if status == "Hot Lead":
                        next_act = "📞 جدولة مكالمة استشارية وتجهيز عرض السعر"
                    elif status == "Escalated":
                        next_act = "⚠️ مراجعة طلب الخصم من قبل الإدارة"
                    else:
                        next_act = "📄 إرسال كتالوج المشاريع والخدمات"

                return {
                    "response_text": reply,
                    "suggested_status": status,
                    "next_action": next_act
                }
            except Exception:
                # If LLM returned valid Arabic text but not JSON, classify intelligently
                status = "Qualified"
                next_act = "📄 إرسال كتالوج المشاريع والخدمات"
                if any(w in user_message for w in ["سعر", "أسعار", "شراء", "احجز", "موعد", "ميتنج", "pricing", "buy", "meeting"]):
                    status = "Hot Lead"
                    next_act = "📞 جدولة مكالمة Zoom وتجهيز عرض السعر"
                elif any(w in user_message for w in ["مدير", "مسؤول", "إدارة", "خصم", "شكوى", "manager", "discount"]):
                    status = "Escalated"
                    next_act = "⚠️ مراجعة طلب الخصم من قبل الإدارة"
                
                return {
                    "response_text": content,
                    "suggested_status": status,
                    "next_action": next_act
                }

        except Exception as err:
            print(f"Model {model_name} failed: {err}. Trying next fallback model...")
            continue

    # Final intelligent local fallback if OpenRouter is completely unreachable
    status = "Qualified"
    reply = "أهلاً بك في Urban AI! نحن نقدم خدمات التطوير العقاري وإدارة المشاريع وحلول المبيعات الذكية. يسعدنا الإجابة على أي استفسار لديك."
    next_act = "📄 إرسال كتالوج المشاريع والخدمات"
    
    if any(w in user_message for w in ["سعر", "أسعار", "شراء", "احجز", "موعد", "ميتنج", "pricing", "buy"]):
        status = "Hot Lead"
        reply = "أهلاً بك! نوفر باقات وأسعار مخصصة تناسب متطلبات مشروعك، مع إمكانية جدولة اجتماع استشاري مع فريق المبيعات اليوم. هل تفضل موعداً صباحياً أم مسائياً؟"
        next_act = "📞 جدولة مكالمة Zoom وتجهيز عرض السعر"
    elif any(w in user_message for w in ["مدير", "مسؤول", "إدارة", "خصم", "شكوى", "manager", "discount"]):
        status = "Escalated"
        reply = "تم استلام طلبكم وسيتم تحويله مباشرة إلى الإدارة وممثل خدمة العملاء لمناقشة الخصم الخاص والتفاصيل. سيتم التواصل معكم في أقرب وقت."
        next_act = "⚠️ مراجعة طلب الخصم من قبل الإدارة"

    return {
        "response_text": reply,
        "suggested_status": status,
        "next_action": next_act
    }

FOLLOWUP_PROMPT = """
You are the Urban AI Follow-up Agent (وكيل المتابعة وإعادة التنشيط).
Your task is to craft a polite, brief, and highly effective re-engagement message in Arabic for a real estate client who hasn't responded recently.
Reference their previous conversation context naturally and suggest a friendly next step (e.g. answering remaining questions, checking if they are still interested in scheduling a quick consultation call or viewing options).
Return ONLY the Arabic text of the message with NO extra commentary or quotes.
"""

def generate_ai_followup_message(phone: str, last_messages: list = None) -> str:
    context = "\n".join([f"- {m}" for m in last_messages]) if last_messages else "استفسار سابق عن العقارات والأسعار والخدمات"
    user_prompt = f"سياق المحادثة السابقة مع العميل {phone}:\n{context}\n\nاكتب رسالة متابعة وتذكير ذكية ولطيفة لإعادة تنشيط هذا العميل."
    
    for model_name in FALLBACK_MODELS:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": FOLLOWUP_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
            )
            content = response.choices[0].message.content or ""
            cleaned = content.strip().replace('"', '').replace('`', '').strip()
            # Validate output is meaningful Arabic text and not punctuation loops
            if len(cleaned) >= 15 and "!" * 4 not in cleaned and "?" * 4 not in cleaned:
                return cleaned
        except Exception:
            continue

    # Smart local fallback
    return "مرحباً بك! 👋 حابين نطمئن بخصوص استفسارك السابق عن مشاريعنا وعروضنا. هل ما زلت مهتماً أو تحب نحدد موعد مكالمة سريعة مع المستشار العقاري لمساعدتك؟"

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_escalation_email(lead_id: int, phone: str, user_message: str, ai_reply: str) -> bool:
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    manager_email = os.getenv("MANAGER_EMAIL", "manager@urbanai.com")
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")

    clean_p = phone.replace("+", "").replace(" ", "").replace("-", "")
    wa_link = f"https://wa.me/{clean_p}"
    tel_link = f"tel:{clean_p}"

    won_url = f"{backend_url}/api/leads/{lead_id}/quick-action?status=Closed%20Won"
    lost_url = f"{backend_url}/api/leads/{lead_id}/quick-action?status=Closed%20Lost"

    subject = f"⚠️ [تنبيه تصعيد عاجل] عميل يطلب تدخل الإدارة: {phone}"
    body_html = f"""
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; border: 1px solid #E3E8F0; border-radius: 12px; max-width: 600px; margin: auto; background-color: #ffffff; color: #16233B;">
        <div style="text-align: center; border-bottom: 2px solid #E3E8F0; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #D64545; margin: 0;">⚠️ تنبيه تصعيد فوري من Urban AI</h2>
            <p style="color: #5B6B82; font-size: 14px; margin-top: 5px;">العميل بحاجة لقرار وتواصل فوري من الإدارة</p>
        </div>

        <p style="font-size: 15px;"><strong>📱 رقم العميل:</strong> <span style="direction: ltr; display: inline-block; font-weight: bold;">{phone}</span></p>
        
        <p style="font-size: 15px; margin-bottom: 5px;"><strong>💬 طلب العميل:</strong></p>
        <div style="background-color: #FFF5F5; padding: 14px; border-radius: 8px; border-right: 4px solid #D64545; margin-bottom: 15px; font-size: 14px; line-height: 1.6;">
            {user_message}
        </div>

        <p style="font-size: 15px; margin-bottom: 5px;"><strong>🤖 رد الذكاء الاصطناعي الأولي:</strong></p>
        <div style="background-color: #F0FDF4; padding: 14px; border-radius: 8px; border-right: 4px solid #1F9D6D; margin-bottom: 25px; font-size: 14px; line-height: 1.6;">
            {ai_reply}
        </div>

        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px; text-align: center; margin-bottom: 20px;">
            <p style="font-weight: bold; margin-top: 0; margin-bottom: 15px; font-size: 15px;">⚡ اتخاذ قرار فوري بضغطة زر من الإيميل:</p>
            <div style="margin-bottom: 15px;">
                <a href="{won_url}" style="background-color: #1F9D6D; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; margin-left: 10px;">
                    ✅ الموافقة (تم الإغلاق)
                </a>
                <a href="{lost_url}" style="background-color: #D64545; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
                    ❌ رفض العرض (خسارة)
                </a>
            </div>
            
            <div style="border-top: 1px dashed #CBD5E1; padding-top: 14px; margin-top: 10px;">
                <p style="font-size: 13px; color: #475569; margin: 0 0 10px 0; font-weight: 600;">📱 أو التواصل المباشر مع العميل الآن:</p>
                <a href="{wa_link}" target="_blank" style="background-color: #25D366; color: #ffffff; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block; margin-left: 8px;">
                    💬 فتح محادثة WhatsApp
                </a>
                <a href="{tel_link}" style="background-color: #0E2A47; color: #ffffff; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block;">
                    📞 اتصال هاتفي
                </a>
            </div>
        </div>

        <p style="color: #94A3B8; font-size: 12px; text-align: center; margin: 0;">
            سيتم تحديث لوحة التحكم وسجل النشاط فور الضغط على أي إجراء.
        </p>
    </div>
    """

    print(f"\n==========================================")
    print(f"[EMAIL NOTIFICATION DISPATCHED]")
    print(f"To: {manager_email}")
    print(f"Lead ID: {lead_id}")
    print(f"Phone: {phone}")
    print(f"==========================================\n")

    if smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart()
            msg["From"] = smtp_user
            msg["To"] = manager_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body_html, "html"))
            
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.send_message(msg)
            print("SUCCESS: Email successfully sent via SMTP!")
            return True
        except Exception as e:
            print(f"FAILED: Failed to send email via SMTP: {e}")
            return False
    else:
        print("NOTE: SMTP credentials not set in .env. Email simulated & logged successfully.")
        return True
