---
description: AI Counsellor - Complete Implementation Plan
---

# AI Counsellor Platform - Implementation Plan

## Project Overview
A guided, stage-based platform for study-abroad decisions with AI-powered counseling.

## Tech Stack
- **Frontend**: Next.js 14 (React) with TypeScript
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)

## Phase 1: Project Setup & Infrastructure
1. Initialize Next.js project with TypeScript
2. Set up FastAPI backend with PostgreSQL
3. Configure database schema and migrations
4. Set up environment variables and API keys
5. Implement basic authentication system

## Phase 2: Core User Flow
1. **Landing Page**
   - Hero section with value proposition
   - CTA buttons (Get Started, Login)
   - Clean, modern design

2. **Authentication**
   - Signup/Login forms
   - Google OAuth integration
   - Session management

3. **Onboarding System**
   - Multi-step form for profile creation
   - Academic background collection
   - Study goals and preferences
   - Budget and exam readiness
   - Profile completion gate

## Phase 3: Dashboard & Profile
1. **Dashboard**
   - Profile summary card
   - Profile strength indicator
   - Current stage tracker
   - AI-generated to-do list
   - Quick actions panel

2. **Profile Management**
   - Editable profile sections
   - Real-time validation
   - Auto-save functionality

## Phase 4: AI Counsellor (Core Feature)
1. **Chat Interface**
   - Real-time messaging with Gemini API
   - Context-aware responses
   - Action buttons in chat
   - Chat history persistence

2. **AI Capabilities**
   - Profile analysis
   - University recommendations (Dream/Target/Safe)
   - Risk assessment
   - Action execution (shortlist, lock, create tasks)
   - Stage-based guidance

## Phase 5: University Discovery
1. **University Database**
   - Research and populate university data
   - Integration with free APIs (if available)
   - Filtering and search functionality

2. **Recommendation Engine**
   - Profile-based matching
   - Budget filtering
   - Country preferences
   - Competition level assessment

3. **University Cards**
   - Detailed information display
   - Fit analysis
   - Risk indicators
   - Cost breakdown
   - Acceptance likelihood

## Phase 6: University Locking & Application
1. **Locking Mechanism**
   - Commitment flow
   - Lock/unlock functionality
   - Warning system

2. **Application Guidance**
   - Document checklist
   - Timeline visualization
   - Task generation
   - Progress tracking

## Phase 7: Polish & Deployment
1. **UI/UX Refinement**
   - Responsive design
   - Loading states
   - Error handling
   - Animations and transitions

2. **Testing**
   - End-to-end flow testing
   - API testing
   - Database integrity

3. **Deployment**
   - Frontend to Vercel
   - Backend to Railway/Render
   - Database setup
   - Environment configuration

## Development Timeline
- **Day 1**: Setup + Landing + Auth
- **Day 2**: Onboarding + Dashboard
- **Day 3**: AI Counsellor + University Discovery
- **Day 4**: Locking + Application Guidance
- **Day 5**: Polish + Testing + Deployment

## Key Success Metrics
✅ Complete stage-based flow working
✅ AI Counsellor takes actions (not just chat)
✅ University locking enforced
✅ Profile-driven recommendations
✅ Clean, intuitive UI
✅ Working deployment link
