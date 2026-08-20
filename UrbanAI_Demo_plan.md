# Urban AI - MVP Demo Implementation Plan (FastAPI Version)
**Context for AI Agent:** You are an expert Full-Stack Developer (FastAPI + React). Your task is to build a functional MVP Demo for "Urban AI", an AI-powered WhatsApp sales agent. 
The system must be built using free tools for local testing (SQLite, Twilio Sandbox, Ngrok, and standard React). Do NOT hallucinate external paid libraries. Proceed step-by-step and ask for confirmation before moving to the next phase.

## Tech Stack
- **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy, Pydantic.
- **Database:** SQLite (for fast local demo).
- **Frontend:** React (Vite), Tailwind CSS, Lucide React.
- **Integrations:** Twilio WhatsApp Sandbox (Free), OpenAI/Anthropic API.

---

## Phase 1: Backend Setup & Database Models
- [x] 1. Initialize a new Python virtual environment and install the core backend packages: `pip install fastapi uvicorn sqlalchemy pydantic`.
- [x] 2. Create `database.py`: Set up the SQLite database engine, session local, and declarative base using SQLAlchemy.
- [x] 3. Create `models.py` (SQLAlchemy Models):
  - `Lead`: 
    - `id` (Integer, Primary Key)
    - `phone_number` (String, unique=True, index=True)
    - `name` (String, nullable=True)
    - `status` (String, default='New') # e.g., New, Hot Lead, Qualified
    - `last_active` (DateTime, default=datetime.utcnow)
  - `ActivityLog`:
    - `id` (Integer, Primary Key)
    - `lead_id` (Integer, ForeignKey to Lead.id)
    - `action_type` (String)
    - `message_body` (Text)
    - `timestamp` (DateTime, default=datetime.utcnow)
- [x] 4. Create `schemas.py` (Pydantic Models) for serialization (Lead response, ActivityLog response).
- [x] 5. Create `main.py`: Initialize the FastAPI app, configure `CORSMiddleware` (allow all origins for local testing), and run `models.Base.metadata.create_all(bind=engine)` to create the SQLite tables.

## Phase 2: AI & WhatsApp Webhook Logic
- [x] 1. Install required packages: `pip install twilio openai python-dotenv python-multipart`. *(Note: python-multipart is required to parse Twilio's Form Data)*.
- [x] 2. Create `services.py` to handle AI logic:
  - Write `generate_ai_response(user_message)` that sends the message to the LLM (OpenRouter / OpenAI) with a System Prompt acting as an "Urban AI Sales Agent for a Real Estate/Service business".
  - Return the text response and a suggested lead status (e.g., 'Hot Lead' if asking for pricing, 'Escalated' for human takeover).
- [x] 3. Update `main.py` with the Webhook Endpoint:
  - Create `@app.post("/webhook/whatsapp")`.
  - Important: Twilio sends data as `application/x-www-form-urlencoded`. Use FastAPI's `Form(...)` to extract `From` and `Body`.
  - Database Flow: Find or create the `Lead` by phone number -> Log the incoming message in `ActivityLog` -> Call `generate_ai_response()` -> Update `Lead` status -> Log the AI's reply -> Send reply via Twilio Python Client.
  - Return a valid TwiML empty response (XML) or plain string to acknowledge receipt to Twilio.

## Phase 3: REST API for Dashboard
- [x] 1. Add GET endpoints in `main.py` for the React frontend:
  - `@app.get("/api/leads", response_model=List[schemas.LeadWithLogs])`: Return all leads ordered by `last_active` descending, including their activity logs.
  - `@app.get("/api/stats")`: Return simple aggregations (e.g., total_leads, hot_leads, total_interactions).
  - `@app.put("/api/leads/{id}/status")`: Update lead status with human resolution logging.

## Phase 4: Frontend Dashboard (React + Vite)
- [x] 1. Initialize a Vite React project named `urban_ai_frontend` and install: `npm install tailwindcss @tailwindcss/vite axios lucide-react react-router-dom`.
- [x] 2. Set up Tailwind CSS configuration and Arabic typography (Almarai + IBM Plex Sans Arabic) with native RTL support.
- [x] 3. Create full Arabic UI matching the mockup with 6 pages:
  - **Sidebar:** Navigation (الرئيسية، العملاء، المهام، AI Agents، التقارير، الإعدادات).
  - **Top Stats Row:** Metrics connected to `/api/stats` and live data.
  - **Main Pages:** Dashboard overview, Leads table with Human-in-the-Loop buttons, Tasks table, AI Agents (2 agents), Analytics/Reports, and Settings.
- [x] 4. Implement Live Polling: Use `useEffect` with `setInterval` to fetch data from `http://localhost:8000/api/...` every 3 seconds for real-time live updates.

## Phase 5: Run & Test Instructions (Output to User)
- [x] 1. Provide exact commands to run the FastAPI server: `uvicorn main:app --reload`.
- [x] 2. Provide exact commands to run the React server: `npm run dev`.
- [x] 3. Testing via Postman / Webhook simulation or ngrok.