# AI Counsellor API Endpoints

This document lists all available backend API endpoints for the AI Counsellor platform.

## 🔐 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register a new user account |
| `POST` | `/auth/login` | Authenticate user and receive JWT token |
| `GET` | `/auth/me` | Get current authenticated user details |

## 👤 Profile Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/profile` | Fetch student's academic and financial profile |
| `POST` | `/profile` | Create initial student profile (Onboarding) |
| `PUT` | `/profile` | Update profile data (Triggers AI recalculation) |

## 🎓 Universities
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/universities` | List all available universities |
| `GET` | `/universities/recommendations` | Get AI-matched universities based on profile |

## 📌 Shortlist & Decisions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/shortlist` | View student's shortlisted universities |
| `POST` | `/shortlist` | Add a university to the shortlist |
| `POST` | `/shortlist/lock` | Commit/Lock a university to start application |
| `DELETE` | `/shortlist/{shortlist_id}` | Remove university from shortlist |

## 📋 Task Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/tasks` | List all roadmap tasks for the student |
| `POST` | `/tasks` | Create a custom task |
| `PUT` | `/tasks/{task_id}` | Update task status (e.g., set to Completed) |
| `DELETE` | `/tasks/{task_id}` | Delete a task |

## 💬 AI Counsellor (Chat)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/chat` | Chat with the AI. Can trigger actions like task creation |
| `GET` | `/chat/history` | Retrieve full conversation history |

## 📊 Dashboard & System
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/dashboard` | Get high-level summary of progress, stats, and tasks |
| `GET` | `/` | API Health Check / Root |

---

## 🛠️ Global Parameters
- **Base URL**: `http://localhost:8000`
- **Auth Strategy**: Bearer Token (JWT) in Authorization Header
- **Content Type**: `application/json`
