$ErrorActionPreference = "Stop"

# Configuration
$DockerUsername = "dockerforgit"
$BackendImageName = "ai-counsellor-backend"
$FrontendImageName = "ai-counsellor-frontend"
$Tag = "latest"
$GoogleClientId = "603527817862-hr6a8po12p97cv62f0q71ob5kmh93qiu.apps.googleusercontent.com"

# 1. Build Images
Write-Host "`nBuilding Backend..." -ForegroundColor Cyan
docker build -t "${DockerUsername}/${BackendImageName}:${Tag}" ./backend

Write-Host "`nBuilding Frontend..." -ForegroundColor Cyan
docker build -t "${DockerUsername}/${FrontendImageName}:${Tag}" `
    --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 `
    --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=$GoogleClientId `
    ./frontend

# 2. Push Images
Write-Host "`nPushing Backend to Docker Hub..." -ForegroundColor Cyan
docker push "${DockerUsername}/${BackendImageName}:${Tag}"

Write-Host "`nPushing Frontend to Docker Hub..." -ForegroundColor Cyan
docker push "${DockerUsername}/${FrontendImageName}:${Tag}"

Write-Host "`n✅ Successfully uploaded images to Docker Hub!" -ForegroundColor Green
Write-Host "Backend: ${DockerUsername}/${BackendImageName}:${Tag}"
Write-Host "Frontend: ${DockerUsername}/${FrontendImageName}:${Tag}"
