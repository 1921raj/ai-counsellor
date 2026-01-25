# AI Counsellor - Quick Start Guide

## 🚀 Getting Started

Follow these steps to get the AI Counsellor platform running on your local machine.

### Step 1: PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed):
   - Download from https://www.postgresql.org/download/
   - Install and remember your password

2. **Create Database**:
   ```bash
   # Open PostgreSQL command line (psql)
   psql -U postgres
   
   # Create database
   CREATE DATABASE ai_counsellor;
   
   # Exit
   \q
   ```

### Step 2: Backend Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**:
   - Open `.env` file
   - Update `DATABASE_URL` with your PostgreSQL password:
     ```
     DATABASE_URL=postgresql://postgres:3214@localhost:5432/ai_counsellor
     ```
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your-api-key-here
     ```
   - Get API key from: https://makersuite.google.com/app/apikey

5. **Seed database**:
   ```bash
   python seed.py
   ```
   
   You should see: "Successfully seeded 19 universities!"

6. **Run backend**:
   ```bash
   python main.py
   ```
   
   Backend will run on http://localhost:8000
   API docs available at http://localhost:8000/docs

### Step 3: Frontend Setup

1. **Open new terminal** and navigate to frontend:
   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   
   Frontend will run on http://localhost:3000

### Step 4: Test the Application

1. **Open browser** and go to http://localhost:3000

2. **Create account**:
   - Click "Get Started"
   - Fill in signup form
   - Submit

3. **Complete onboarding**:
   - Fill in all 4 steps of the onboarding form
   - Academic background
   - Study goals
   - Budget & funding
   - Exams & readiness

4. **Explore features**:
   - View dashboard
   - Chat with AI Counsellor
   - Discover universities
   - Shortlist universities
   - Complete tasks

## 🎯 Key Features to Test

### 1. AI Counsellor Chat
- Go to Dashboard → "Chat with AI Counsellor"
- Try these prompts:
  - "Analyze my profile"
  - "Recommend universities for me"
  - "What should I do next?"

### 2. University Discovery
- Go to Dashboard → "Explore Universities"
- Filter by Dream/Target/Safe
- View AI analysis for each university
- Add universities to shortlist

### 3. Profile Management
- View profile summary on dashboard
- Check profile strength indicators
- Edit profile if needed

### 4. Task Management
- View AI-generated tasks
- Mark tasks as complete
- Track progress

## 🐛 Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database exists: `psql -U postgres -l`
- Check `.env` file has correct credentials

### Frontend won't start
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then reinstall
- Check if port 3000 is available

### Database errors
- Ensure PostgreSQL service is running
- Check database URL in `.env`
- Try recreating database:
  ```sql
  DROP DATABASE ai_counsellor;
  CREATE DATABASE ai_counsellor;
  ```
  Then run `python seed.py` again

### API errors
- Check if backend is running on port 8000
- Verify Gemini API key is valid
- Check browser console for detailed errors

## 📝 Demo Video Tips

When recording your demo video:

1. **Start with landing page** - Show the design
2. **Signup flow** - Create a new account
3. **Onboarding** - Complete all 4 steps
4. **Dashboard** - Show profile summary and stage progress
5. **AI Counsellor** - Have a conversation, show actions
6. **Universities** - Browse, filter, shortlist
7. **Profile strength** - Show the indicators
8. **Tasks** - Complete a task

Keep it 3-5 minutes, focus on the flow and AI capabilities!

## 🚢 Deployment

### Backend (Railway/Render)
1. Create account on Railway.app or Render.com
2. Create new PostgreSQL database
3. Deploy Python app
4. Set environment variables
5. Run seed command

### Frontend (Vercel)
1. Push code to GitHub
2. Import to Vercel
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy

## ✅ Final Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Database seeded with universities
- [ ] Can create account and login
- [ ] Onboarding flow works
- [ ] Dashboard displays correctly
- [ ] AI Counsellor responds
- [ ] Universities load and can be shortlisted
- [ ] Tasks can be completed
- [ ] All pages are responsive

## 🎉 You're Ready!

Your AI Counsellor platform is now running. Good luck with your hackathon submission!

For questions or issues, check:
- API documentation: http://localhost:8000/docs
- Main README: ../README.md
- Implementation plan: ../.agent/workflows/project-plan.md
