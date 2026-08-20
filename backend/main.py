from fastapi import FastAPI, Depends, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from twilio.twiml.messaging_response import MessagingResponse
from typing import List

import models
import schemas
from database import engine, get_db
from services import generate_ai_response, send_escalation_email, generate_ai_followup_message

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Urban AI Demo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Urban AI Demo API"}

@app.post("/api/demo/reset")
def reset_demo_data(db: Session = Depends(get_db)):
    db.query(models.ActivityLog).delete()
    db.query(models.Task).delete()
    db.query(models.Lead).delete()
    db.commit()
    return {"message": "Demo database wiped clean successfully", "status": "success"}

@app.post("/api/companies", response_model=schemas.CompanyResponse)
def create_or_update_company(data: schemas.CompanyCreate, db: Session = Depends(get_db)):
    company = db.query(models.Company).first()
    if not company:
        company = models.Company(
            name=data.name,
            contact_email=data.contact_email,
            whatsapp_enabled="true" if data.whatsapp_enabled else "false",
            gmail_enabled="true" if data.gmail_enabled else "false",
            followup_mode=data.followup_mode
        )
        db.add(company)
    else:
        company.name = data.name
        company.contact_email = data.contact_email
        company.whatsapp_enabled = "true" if data.whatsapp_enabled else "false"
        company.gmail_enabled = "true" if data.gmail_enabled else "false"
        company.followup_mode = data.followup_mode
    db.commit()
    db.refresh(company)
    return company

@app.get("/api/companies/current", response_model=schemas.CompanyResponse)
def get_current_company(db: Session = Depends(get_db)):
    company = db.query(models.Company).first()
    if not company:
        company = models.Company(
            name="شركة URBAN العقارية",
            contact_email="mohamedaymanessawy2004@gmail.com",
            whatsapp_enabled="true",
            gmail_enabled="true",
            followup_mode="automatic"
        )
        db.add(company)
        db.commit()
        db.refresh(company)
    return company

@app.post("/webhook/whatsapp")
def whatsapp_webhook(
    From: str = Form(None),
    from_: str = Form(None, alias="from"),
    Body: str = Form(None),
    body: str = Form(None, alias="body"),
    db: Session = Depends(get_db)
):
    sender = From or from_ or ""
    message_body = Body or body or ""
    phone = sender.replace("whatsapp:", "")
    
    # Find or create the Lead
    lead = db.query(models.Lead).filter(models.Lead.phone_number == phone).first()
    if not lead:
        lead = models.Lead(phone_number=phone)
        db.add(lead)
        db.commit()
        db.refresh(lead)
    
    # Log the incoming message
    inbound_log = models.ActivityLog(
        lead_id=lead.id,
        action_type="User Message",
        message_body=message_body
    )
    db.add(inbound_log)
    
    # Call AI
    ai_result = generate_ai_response(message_body)
    ai_text = ai_result["response_text"]
    ai_status = ai_result["suggested_status"]
    
    # Update Lead status & next action
    lead.status = ai_status
    if "next_action" in ai_result:
        lead.next_action = ai_result["next_action"]
    
    # Log AI's reply
    outbound_log = models.ActivityLog(
        lead_id=lead.id,
        action_type="AI Reply",
        message_body=ai_text
    )
    db.add(outbound_log)

    # If Escalated, trigger Instant Email Notification to Manager
    if ai_status == "Escalated":
        send_escalation_email(lead.id, phone, message_body, ai_text)
        email_log = models.ActivityLog(
            lead_id=lead.id,
            action_type="Escalation Email",
            message_body=f"📧 تم إرسال إيميل تنبيه فوري للإدارة مع أزرار الإجراء المباشر"
        )
        db.add(email_log)

    db.commit()
    
    # Send reply via Twilio TwiML
    resp = MessagingResponse()
    resp.message(ai_text)
    
    return Response(content=str(resp), media_type="application/xml")

@app.get("/api/leads", response_model=List[schemas.LeadWithLogs])
def get_leads(db: Session = Depends(get_db)):
    leads = db.query(models.Lead).order_by(models.Lead.last_active.desc()).all()
    return leads

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_leads = db.query(models.Lead).count()
    hot_leads = db.query(models.Lead).filter(models.Lead.status == "Hot Lead").count()
    total_interactions = db.query(models.ActivityLog).count()
    open_tasks = db.query(models.Task).filter(models.Task.status == "جارية").count()
    pending_approvals = db.query(models.Lead).filter(models.Lead.status == "Escalated").count()
    
    return {
        "total_leads": total_leads,
        "hot_leads": hot_leads,
        "total_interactions": total_interactions,
        "open_tasks": open_tasks,
        "pending_approvals": pending_approvals
    }

from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from datetime import datetime

class StatusUpdate(BaseModel):
    status: str

@app.get("/api/leads/{lead_id}/quick-action", response_class=HTMLResponse)
def quick_action_from_email(lead_id: int, status: str, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        return HTMLResponse(content="<h1>العميل غير موجود</h1>", status_code=404)
        
    old_status = lead.status
    lead.status = status
    lead.last_active = datetime.utcnow()
    
    # Log human resolution via Email
    status_label = "تمت الموافقة (تم الإغلاق)" if status == "Closed Won" else "تم الرفض (خسارة)"
    color = "#1F9D6D" if status == "Closed Won" else "#D64545"
    
    log = models.ActivityLog(
        lead_id=lead.id,
        action_type="Human Resolution (Email)",
        message_body=f"تم اتخاذ القرار بضغطة زر من الإيميل: {status_label}"
    )
    db.add(log)
    db.commit()
    
    html_content = f"""
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <title>تم تحديث حالة العميل</title>
        <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600&display=swap" rel="stylesheet">
        <style>
            body {{
                font-family: 'IBM Plex Sans Arabic', sans-serif;
                background-color: #F7F9FC;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }}
            .card {{
                background: white;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                text-align: center;
                max-width: 450px;
                border: 1px solid #E3E8F0;
            }}
            h1 {{ font-family: 'Almarai', sans-serif; color: #16233B; margin-bottom: 10px; }}
            .badge {{
                display: inline-block;
                background-color: {color};
                color: white;
                padding: 8px 18px;
                border-radius: 30px;
                font-weight: bold;
                font-size: 16px;
                margin: 15px 0;
            }}
            p {{ color: #5B6B82; font-size: 15px; }}
            .btn {{
                display: inline-block;
                background-color: #0E2A47;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: bold;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="card">
            <h1>✅ تم اتخاذ الإجراء بنجاح!</h1>
            <p>رقم العميل: <strong>{lead.phone_number}</strong></p>
            <div>حالة العميل الجديدة:</div>
            <p>تم تحديث لوحة التحكم وسجل النشاط في النظام في الوقت الفعلي.</p>
            <div style="margin-top: 25px; display: flex; flex-direction: column; gap: 10px;">
                <a href="https://wa.me/{lead.phone_number.replace('+', '').replace(' ', '').replace('-', '')}" target="_blank" style="background-color: #25D366; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold; display: block;">
                    💬 تواصل مع العميل عبر WhatsApp الآن
                </a>
                <a href="http://localhost:5173/clients" class="btn" style="margin-top: 0; background-color: #0E2A47;">
                    📊 الذهاب إلى لوحة التحكم
                </a>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.put("/api/leads/{lead_id}/status")
def update_lead_status(lead_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        return Response(status_code=404, content="Lead not found")
        
    old_status = lead.status
    lead.status = payload.status
    lead.last_active = datetime.utcnow()
    
    # Log human resolution
    log = models.ActivityLog(
        lead_id=lead.id,
        action_type="Human Resolution",
        message_body=f"تم تعديل الحالة يدوياً من {old_status} إلى {payload.status}"
    )
    db.add(log)
    db.commit()
    
    return {"message": "Status updated"}

# ==================== MODULE 2: TASKS & FOLLOW-UP AGENT ENDPOINTS ====================

@app.get("/api/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).order_by(models.Task.created_at.desc()).all()
    results = []
    for t in tasks:
        item = schemas.TaskResponse.from_orm(t)
        if t.lead:
            item.phone_number = t.lead.phone_number
        results.append(item)
    return results

@app.post("/api/leads/{lead_id}/followup")
def create_lead_followup(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        return Response(status_code=404, content="Lead not found")
        
    # Get previous conversation logs
    logs = [log.message_body for log in lead.activity_logs if log.action_type == "User Message"]
    
    # Generate contextual follow-up message using AI
    suggested_msg = generate_ai_followup_message(lead.phone_number, logs)
    
    # Create Task record
    task = models.Task(
        lead_id=lead.id,
        title=f"متابعة ذكية مع العميل {lead.phone_number}",
        suggested_message=suggested_msg,
        priority="عالية" if lead.status == "Hot Lead" else "متوسطة",
        status="جارية",
        assignee="AI Agent 2 - المتابعة والتذكير"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    
    return {
        "message": "Follow-up task created",
        "task_id": task.id,
        "suggested_message": suggested_msg
    }

@app.post("/api/tasks/{task_id}/send")
def send_followup_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        return Response(status_code=404, content="Task not found")
        
    task.status = "مكتملة"
    
    # Log the follow-up message as an AI Activity Log
    if task.lead_id and task.suggested_message:
        log = models.ActivityLog(
            lead_id=task.lead_id,
            action_type="AI Follow-up Sent",
            message_body=f"⚡ رسالة متابعة ذكية: {task.suggested_message}"
        )
        db.add(log)
        
        # Update lead last_active
        if task.lead:
            task.lead.last_active = datetime.utcnow()
            
    db.commit()
    return {"message": "Follow-up sent successfully", "status": "مكتملة"}

@app.post("/api/tasks/scan-dormant")
def scan_dormant_leads(db: Session = Depends(get_db)):
    leads = db.query(models.Lead).all()
    created_count = 0
    for lead in leads:
        # Check if lead already has an open task
        open_task = db.query(models.Task).filter(models.Task.lead_id == lead.id, models.Task.status == "جارية").first()
        if not open_task and lead.status not in ["Closed Won", "Closed Lost"]:
            logs = [log.message_body for log in lead.activity_logs if log.action_type == "User Message"]
            msg = generate_ai_followup_message(lead.phone_number, logs)
            task = models.Task(
                lead_id=lead.id,
                title=f"إعادة تنشيط ومتابعة {lead.phone_number}",
                suggested_message=msg,
                priority="عالية" if lead.status == "Hot Lead" else "متوسطة",
                status="جارية",
                assignee="AI Agent 2 - المتابعة والتذكير"
            )
            db.add(task)
            created_count += 1
    db.commit()
    return {"message": f"Created {created_count} new follow-up tasks"}

