$ErrorActionPreference = "Stop"

# Configuration
$DockerUsername = "dockerforgit"
$BackendImageName = "ai-counsellor-backend"
$FrontendImageName = "ai-counsellor-frontend"
$Tag = "latest"
$Version = "v1.0.5"
$GoogleClientId = "603527817862-hr6a8po12p97cv62f0q71ob5kmh93qiu.apps.googleusercontent.com"

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         AI Counsellor - Docker Build & Push Script        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "🔍 Checking Docker status..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running`n" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if logged in to Docker Hub
Write-Host "🔍 Checking Docker Hub authentication..." -ForegroundColor Yellow
$dockerConfig = Get-Content "$env:USERPROFILE\.docker\config.json" -Raw | ConvertFrom-Json
if ($dockerConfig.auths."https://index.docker.io/v1/") {
    Write-Host "✅ Already logged in to Docker Hub`n" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Not logged in. Please login to Docker Hub:" -ForegroundColor Yellow
    docker login
}

# 1. Build Backend Image
Write-Host "`n📦 Building Backend Image..." -ForegroundColor Cyan
Write-Host "   Image: ${DockerUsername}/${BackendImageName}:${Tag}" -ForegroundColor Gray
docker build -t "${DockerUsername}/${BackendImageName}:${Tag}" `
    -t "${DockerUsername}/${BackendImageName}:${Version}" `
    ./backend

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend image built successfully`n" -ForegroundColor Green
}
else {
    Write-Host "❌ Backend build failed" -ForegroundColor Red
    exit 1
}

# 2. Build Frontend Image
Write-Host "📦 Building Frontend Image..." -ForegroundColor Cyan
Write-Host "   Image: ${DockerUsername}/${FrontendImageName}:${Tag}" -ForegroundColor Gray
docker build -t "${DockerUsername}/${FrontendImageName}:${Tag}" `
    -t "${DockerUsername}/${FrontendImageName}:${Version}" `
    --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 `
    --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=$GoogleClientId `
    ./frontend

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend image built successfully`n" -ForegroundColor Green
}
else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

# 3. Push Backend to Docker Hub
Write-Host "🚀 Pushing Backend to Docker Hub..." -ForegroundColor Cyan
docker push "${DockerUsername}/${BackendImageName}:${Tag}"
docker push "${DockerUsername}/${BackendImageName}:${Version}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend pushed successfully`n" -ForegroundColor Green
}
else {
    Write-Host "❌ Backend push failed" -ForegroundColor Red
    exit 1
}

# 4. Push Frontend to Docker Hub
Write-Host "🚀 Pushing Frontend to Docker Hub..." -ForegroundColor Cyan
docker push "${DockerUsername}/${FrontendImageName}:${Tag}"
docker push "${DockerUsername}/${FrontendImageName}:${Version}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend pushed successfully`n" -ForegroundColor Green
}
else {
    Write-Host "❌ Frontend push failed" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ Successfully Deployed to Docker Hub!       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📦 Images Published:" -ForegroundColor Cyan
Write-Host "   Backend:  ${DockerUsername}/${BackendImageName}:${Tag}" -ForegroundColor White
Write-Host "             ${DockerUsername}/${BackendImageName}:${Version}" -ForegroundColor Gray
Write-Host "   Frontend: ${DockerUsername}/${FrontendImageName}:${Tag}" -ForegroundColor White
Write-Host "             ${DockerUsername}/${FrontendImageName}:${Version}" -ForegroundColor Gray

Write-Host "`n🔗 Docker Hub Links:" -ForegroundColor Cyan
Write-Host "   https://hub.docker.com/r/${DockerUsername}/${BackendImageName}" -ForegroundColor Blue
Write-Host "   https://hub.docker.com/r/${DockerUsername}/${FrontendImageName}" -ForegroundColor Blue

Write-Host "`n📝 To run locally with Docker Compose:" -ForegroundColor Cyan
Write-Host "   docker-compose up -d" -ForegroundColor White

Write-Host "`n📝 To pull and run individually:" -ForegroundColor Cyan
Write-Host "   docker pull ${DockerUsername}/${BackendImageName}:${Tag}" -ForegroundColor White
Write-Host "   docker pull ${DockerUsername}/${FrontendImageName}:${Tag}" -ForegroundColor White
Write-Host ""
