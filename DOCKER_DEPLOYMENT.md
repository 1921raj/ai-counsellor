# 🐳 Docker Deployment Guide - AI Counsellor

## 📦 Published Docker Images

The AI Counsellor application is available on Docker Hub:

- **Backend**: `dockerforgit/ai-counsellor-backend:latest`
- **Frontend**: `dockerforgit/ai-counsellor-frontend:latest`

### Docker Hub Links
- Backend: https://hub.docker.com/r/dockerforgit/ai-counsellor-backend
- Frontend: https://hub.docker.com/r/dockerforgit/ai-counsellor-frontend

---

## 🚀 Quick Start with Docker Compose

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### 1. Clone the Repository
```bash
git clone https://github.com/1921raj/ai-counsellor.git
cd ai-counsellor
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=3214
POSTGRES_DB=ai_counsellor

# Backend
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID=603527817862-hr6a8po12p97cv62f0q71ob5kmh93qiu.apps.googleusercontent.com

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=603527817862-hr6a8po12p97cv62f0q71ob5kmh93qiu.apps.googleusercontent.com
```

### 3. Start the Application
```bash
docker-compose up -d
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 5. Stop the Application
```bash
docker-compose down
```

---

## 🔨 Building Images Locally

### Build Backend
```bash
cd backend
docker build -t ai-counsellor-backend .
```

### Build Frontend
```bash
cd frontend
docker build -t ai-counsellor-frontend \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id \
  .
```

---

## 📤 Pushing to Docker Hub

### Using the Automated Script (Windows PowerShell)
```powershell
.\push_to_dockerhub.ps1
```

### Manual Push

1. **Login to Docker Hub**
```bash
docker login
```

2. **Tag Images**
```bash
docker tag ai-counsellor-backend dockerforgit/ai-counsellor-backend:latest
docker tag ai-counsellor-frontend dockerforgit/ai-counsellor-frontend:latest
```

3. **Push Images**
```bash
docker push dockerforgit/ai-counsellor-backend:latest
docker push dockerforgit/ai-counsellor-frontend:latest
```

---

## 🎯 Running Individual Containers

### Backend Only
```bash
docker run -d \
  --name ai-counsellor-backend \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://postgres:3214@host.docker.internal:5432/ai_counsellor \
  -e SECRET_KEY=your-secret-key \
  -e GEMINI_API_KEY=your-gemini-key \
  dockerforgit/ai-counsellor-backend:latest
```

### Frontend Only
```bash
docker run -d \
  --name ai-counsellor-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  dockerforgit/ai-counsellor-frontend:latest
```

---

## 🗄️ Database Setup

### Option 1: Use Docker PostgreSQL (Recommended)
Already included in `docker-compose.yml`

### Option 2: Use External PostgreSQL
Update the `DATABASE_URL` in your `.env` file:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### Initialize Database
```bash
# Access backend container
docker exec -it ai-counsellor-backend bash

# Run migrations
python create_db.py
python seed.py
```

---

## 🔧 Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `SECRET_KEY` | JWT secret key | Yes | - |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |

### Frontend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | http://localhost:8000 |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |

---

## 📊 Docker Compose Services

The `docker-compose.yml` includes:

1. **PostgreSQL Database**
   - Port: 5432
   - Volume: `postgres_data`

2. **Backend (FastAPI)**
   - Port: 8000
   - Depends on: PostgreSQL

3. **Frontend (Next.js)**
   - Port: 3000
   - Depends on: Backend

---

## 🔍 Troubleshooting

### Container Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f
```

### Restart Services
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Images
```bash
# Rebuild and restart
docker-compose up -d --build
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes database data)
docker-compose down -v

# Remove images
docker rmi dockerforgit/ai-counsellor-backend:latest
docker rmi dockerforgit/ai-counsellor-frontend:latest
```

---

## 🌐 Production Deployment

### Using Docker Hub Images

1. **Pull Images**
```bash
docker pull dockerforgit/ai-counsellor-backend:latest
docker pull dockerforgit/ai-counsellor-frontend:latest
```

2. **Create Production docker-compose.yml**
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    image: dockerforgit/ai-counsellor-backend:latest
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      SECRET_KEY: ${SECRET_KEY}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
    depends_on:
      - db
    restart: always

  frontend:
    image: dockerforgit/ai-counsellor-frontend:latest
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
    depends_on:
      - backend
    ports:
      - "80:3000"
    restart: always

volumes:
  postgres_data:
```

3. **Deploy**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 Health Checks

### Backend Health
```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "message": "AI Counsellor API",
  "version": "1.0.0",
  "status": "running"
}
```

### Frontend Health
```bash
curl http://localhost:3000/
```

Should return the landing page HTML.

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong SECRET_KEY** - Generate with: `openssl rand -hex 32`
3. **Secure database passwords** - Use complex passwords in production
4. **Enable HTTPS** - Use reverse proxy (nginx) with SSL certificates
5. **Limit CORS origins** - Update `FRONTEND_URL` in production

---

## 📈 Monitoring

### Container Stats
```bash
docker stats
```

### Resource Usage
```bash
docker-compose ps
docker system df
```

---

## 🆘 Support

For issues or questions:
- GitHub Issues: https://github.com/1921raj/ai-counsellor/issues
- Documentation: See `COMPLETE_DOCUMENTATION.md`

---

## 📜 License

This project is part of an AI Hackathon assignment.

---

**Built with ❤️ using Docker, FastAPI, Next.js, and PostgreSQL**
