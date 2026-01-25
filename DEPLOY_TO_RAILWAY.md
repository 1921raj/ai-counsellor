# Deploying AI Counsellor to Railway

Since the Railway CLI is not installed, the easiest way to deploy is by connecting your GitHub repository.

## Step 1: Push Code to GitHub
1. Create a new repository on GitHub (e.g., `ai-counsellor`).
2. Run the following commands in your terminal (replace `YOUR_GITHUB_USERNAME`):
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ai-counsellor.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Create Project on Railway
1. Log in to [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your `ai-counsellor` repository.

## Step 3: Configure Services
You need to split the monorepo into two services (Backend & Frontend) and add a Database.

### 1. Database (PostgreSQL)
*   In your Railway project canvas, right-click -> **Add Database** -> **PostgreSQL**.
*   This will automatically create a `DATABASE_URL` variable.

### 2. Backend Service
*   Click on the repo card that was created.
*   Go to **Settings** -> **Root Directory** and change it to `/backend`.
*   Go to **Variables** and add:
    *   `GEMINI_API_KEY`: (Paste your key: `AIzaSyDW...`)
    *   `SECRET_KEY`: `your-secret-key-123`
    *   `PORT`: `8000`
    *   `DATABASE_URL`: (Railway allows you to reference the Postgres variable `${{PostgreSQL.DATABASE_URL}}`)
*   Railway will detect the `Dockerfile` and build it.

### 3. Frontend Service
*   In the project canvas, click **+ New** -> **GitHub Repo** -> Select the same `ai-counsellor` repo again.
*   This creates a second service for the frontend.
*   Go to **Settings** -> **Root Directory** and change it to `/frontend`.
*   Go to **Variables** and add:
    *   `NEXT_PUBLIC_API_URL`: `https://your-backend-url.up.railway.app` (You get this URL from the Backend service's Settings -> Networking).
*   Railway will detect the `Dockerfile` and build it.

## Step 4: Finalize
*   Once both services deploy, open the Frontend URL provided by Railway.
*   Your app is live!
