from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)
    status = Column(String, default='New') # e.g., New, Hot Lead, Qualified, Escalated, Closed Won, Closed Lost
    next_action = Column(String, default='استكمال التواصل وتأهيل العميل')
    last_active = Column(DateTime, default=datetime.utcnow)

    activity_logs = relationship("ActivityLog", back_populates="lead", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="lead", cascade="all, delete-orphan")

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    action_type = Column(String)
    message_body = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="activity_logs")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    title = Column(String)
    suggested_message = Column(Text, nullable=True)
    priority = Column(String, default="عالية") # عالية, متوسطة, منخفضة
    status = Column(String, default="جارية")   # جارية, مكتملة, متأخرة
    assignee = Column(String, default="AI Agent 2")
    created_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="tasks")

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="شركة URBAN العقارية")
    contact_email = Column(String, default="mohamedaymanessawy2004@gmail.com")
    whatsapp_enabled = Column(String, default="true")
    gmail_enabled = Column(String, default="true")
    followup_mode = Column(String, default="automatic") # automatic vs manual
    created_at = Column(DateTime, default=datetime.utcnow)
