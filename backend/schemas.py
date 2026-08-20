from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ActivityLogBase(BaseModel):
    action_type: str
    message_body: str

class ActivityLogResponse(ActivityLogBase):
    id: int
    lead_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class LeadBase(BaseModel):
    phone_number: str
    name: Optional[str] = None

class LeadResponse(LeadBase):
    id: int
    status: str
    next_action: Optional[str] = None
    last_active: datetime

    class Config:
        from_attributes = True

class TaskResponse(BaseModel):
    id: int
    lead_id: Optional[int] = None
    title: str
    suggested_message: Optional[str] = None
    priority: str
    status: str
    assignee: str
    created_at: datetime
    due_date: datetime
    phone_number: Optional[str] = None

    class Config:
        from_attributes = True

class LeadWithLogs(LeadResponse):
    activity_logs: List[ActivityLogResponse] = []
    tasks: List[TaskResponse] = []

    class Config:
        from_attributes = True

class CompanyCreate(BaseModel):
    name: str = "شركة URBAN العقارية"
    contact_email: str = "mohamedaymanessawy2004@gmail.com"
    whatsapp_enabled: bool = True
    gmail_enabled: bool = True
    followup_mode: str = "automatic"

class CompanyResponse(BaseModel):
    id: int
    name: str
    contact_email: str
    whatsapp_enabled: str
    gmail_enabled: str
    followup_mode: str
    created_at: datetime

    class Config:
        from_attributes = True
