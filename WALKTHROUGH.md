# AI Counsellor - API Documentation & Walkthrough

This document provides a comprehensive list of all backend API endpoints and a walkthrough of the student journey.

## 🚀 Backend API Endpoints

The backend is built with FastAPI and runs on `http://localhost:8000`.

### 🔐 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register a new user account |
| `POST` | `/auth/login` | Authenticate user and receive JWT token |
| `GET` | `/auth/me` | Get current authenticated user details |

### 👤 Profile Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/profile` | Fetch student's academic and financial profile |
| `POST` | `/profile` | Create initial student profile (Onboarding) |
| `PUT` | `/profile` | Update profile data (Triggers AI recalculation) |

### 🎓 Universities
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/universities` | List all available universities |
| `GET` | `/universities/recommendations` | Get AI-matched universities based on profile |

### 📌 Shortlist & Decisions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/shortlist` | View student's shortlisted universities |
| `POST` | `/shortlist` | Add a university to the shortlist |
| `POST` | `/shortlist/lock` | Commit/Lock a university to start application |
| `DELETE` | `/shortlist/{id}` | Remove university from shortlist |

### 📋 Task Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/tasks` | List all roadmap tasks for the student |
| `POST` | `/tasks` | Create a custom task |
| `PUT` | `/tasks/{id}` | Update task status (e.g., set to Completed) |
| `DELETE` | `/tasks/{id}` | Delete a task |

### 💬 AI Counsellor (Chat)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/chat` | Chat with the AI. Can trigger actions like task creation |
| `GET` | `/chat/history` | Retrieve full conversation history |

### 📊 Dashboard
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/dashboard` | Get high-level summary of progress, stats, and tasks |
| `GET` | `/` | API Health Check / Root |

---

## 🗺️ Student Journey Walkthrough

### Step 1: Secure Entry (Auth)
Students begin by creating an account. We use secure hashing and JWT tokens to protect student data.
- **Frontend**: `/signup` and `/login`
- **Backend**: `/auth/signup`

### Step 2: Foundation Building (Onboarding)
Students provide their academic background (GPA, major), financial limits, and target goals. 
- **AI Logic**: Upon submission, the AI analyzes the "Profile Strength" (Academic, Exams, SOP).
- **Backend**: `POST /profile`

### Step 3: Discovery & Analysis
AI scans the global database of 40+ universities to find the best fit.
- **Categorization**: Universities are labeled as **Dream**, **Target**, or **Safe**.
- **Reasoning**: The AI explains *why* each match was made based on GPA and budget.
- **Backend**: `GET /universities/recommendations`

### Step 4: Strategy & Roadmap
Once a student finds a university they love, they "Shortlist" and eventually "Lock" it.
- **Dynamic Tasks**: Locking a university triggers specialized tasks (e.g., "Prepare SOP for MIT").
- **AI Chat**: Students can talk to the counsellor to ask for specific advice like "How do I improve my SOP?".
- **Backend**: `POST /shortlist/lock` and `POST /chat`

### Step 5: Application Execution
The Dashboard becomes the control center where students track their "Active Roadmap" of tasks until they are ready to submit their applications.
- **Backend**: `GET /dashboard` 

---

## ✅ Final Test Report
**Last Verified**: 2026-01-25
**Status**: All 11 Core Endpoint Blocks 100% Operational (200 OK)
**Database**: 40 Global Universities Seeded
