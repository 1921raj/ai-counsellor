# AI Counsellor - Study Abroad Guidance Platform

A comprehensive, AI-powered platform that guides students through their study-abroad journey with structured, stage-based counseling.

## 🎯 Project Overview

AI Counsellor is a guided platform that helps students make confident study-abroad decisions through:
- **AI-Powered Counseling**: Personalized guidance using Google Gemini
- **Stage-Based Flow**: Structured journey from profile building to application
- **University Matching**: Smart recommendations categorized as Dream/Target/Safe
- **Decision Enforcement**: University locking system for focused applications
- **Task Management**: AI-generated to-dos based on user progress

## 🏗️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI**: Google Gemini API
- **Authentication**: JWT with bcrypt
- **ORM**: SQLAlchemy

### Frontend
- **Framework**: Next.js 14 (React + TypeScript)
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **HTTP Client**: Axios
- **UI Components**: Custom components with Lucide icons

## 📁 Project Structure

```
aihackathon/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database configuration
│   ├── auth.py              # Authentication utilities
│   ├── ai_counsellor.py     # AI service
│   ├── seed.py              # Database seeding
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   ├── onboarding/      # Onboarding flow (TO CREATE)
│   │   ├── dashboard/       # Main dashboard (TO CREATE)
│   │   ├── universities/    # University discovery (TO CREATE)
│   │   ├── chat/            # AI Counsellor chat (TO CREATE)
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   └── ui/              # Reusable components
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   └── utils.ts         # Utilities
│   └── package.json
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- Google Gemini API Key

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Create virtual environment**:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL**:
- Create a database named `ai_counsellor`
- Update `.env` with your database credentials:
```env
DATABASE_URL=postgresql://postgres:3214@localhost:5432/ai_counsellor
```

5. **Add Gemini API Key**:
- Get your API key from https://makersuite.google.com/app/apikey
- Add to `.env`:
```env
GEMINI_API_KEY=your-api-key-here
```

6. **Seed the database**:
```bash
python seed.py
```

7. **Run the backend**:
```bash
python main.py
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📋 Remaining Implementation

### Critical Pages to Create:

1. **Onboarding Page** (`/app/onboarding/page.tsx`)
   - Multi-step form for profile creation
   - Academic background, study goals, budget, exams
   - Profile strength calculation
   - Redirect to dashboard on completion

2. **Dashboard** (`/app/dashboard/page.tsx`)
   - Profile summary card
   - Current stage indicator
   - Profile strength visualization
   - AI-generated to-do list
   - Quick actions (Chat with AI, Explore Universities)

3. **University Discovery** (`/app/universities/page.tsx`)
   - List of recommended universities
   - Filters (country, budget, program)
   - Dream/Target/Safe categorization
   - Shortlist functionality
   - University detail cards with fit analysis

4. **AI Counsellor Chat** (`/app/chat/page.tsx`)
   - Real-time chat interface
   - Message history
   - Action buttons (Shortlist, Create Task, Lock University)
   - Context-aware responses

5. **University Locking Flow**
   - Lock/unlock universities
   - Warning system for unlocking
   - Application guidance unlock after locking

6. **Profile Management** (`/app/profile/page.tsx`)
   - Editable profile form
   - Real-time updates
   - Recalculation of recommendations

## 🎨 Design Guidelines

- **Color Scheme**: Dark mode with indigo/purple gradients
- **Typography**: Inter font family
- **Components**: Glass morphism effects
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first approach

## 🔑 Key Features to Implement

### Stage-Based Flow
- ✅ Building Profile
- ✅ Discovering Universities
- ✅ Finalizing Universities
- ✅ Preparing Applications

### AI Counsellor Capabilities
- ✅ Profile analysis
- ✅ University recommendations
- ✅ Risk assessment
- ✅ Action execution (shortlist, tasks)
- ⏳ Real-time chat interface

### University System
- ✅ Database with 19 universities
- ✅ Filtering and matching
- ✅ Fit score calculation
- ⏳ Shortlisting UI
- ⏳ Locking mechanism UI

### Task Management
- ✅ AI-generated tasks
- ✅ Priority system
- ⏳ Task completion UI
- ⏳ Progress tracking

## 📝 API Endpoints

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Profile
- `POST /profile` - Create profile
- `GET /profile` - Get profile
- `PUT /profile` - Update profile

### Universities
- `GET /universities` - List universities
- `GET /universities/recommendations` - Get recommendations

### Shortlist
- `POST /shortlist` - Add to shortlist
- `GET /shortlist` - Get shortlist
- `POST /shortlist/lock` - Lock/unlock university
- `DELETE /shortlist/{id}` - Remove from shortlist

### Tasks
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### Chat
- `GET /chat/history` - Get chat history
- `POST /chat` - Send message to AI

### Dashboard
- `GET /dashboard` - Get dashboard data

## 🎯 Submission Checklist

- [ ] Backend running with PostgreSQL
- [ ] Frontend running with all pages
- [ ] Complete onboarding flow
- [ ] AI Counsellor chat working
- [ ] University discovery and shortlisting
- [ ] University locking enforced
- [ ] Task management functional
- [ ] Responsive design
- [ ] Demo video (3-5 minutes)
- [ ] Deployment link

## 🚢 Deployment

### Backend (Railway/Render)
1. Create account on Railway or Render
2. Create PostgreSQL database
3. Deploy FastAPI app
4. Set environment variables
5. Run seed script

### Frontend (Vercel)
1. Push code to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

## 📞 Support

For issues or questions:
- Check API documentation at `/docs`
- Review implementation plan in `.agent/workflows/project-plan.md`
- Test endpoints using the Swagger UI

## 🏆 Success Criteria

1. ✅ Complete stage-based flow working
2. ✅ AI Counsellor takes actions (not just chat)
3. ✅ University locking enforced
4. ✅ Profile-driven recommendations
5. ✅ Clean, intuitive UI
6. ✅ Working deployment link

---

**Good luck with your hackathon! 🚀**
