$BackendImageName = "git4dock/ai-counsellor-backend"
$FrontendImageName = "git4dock/ai-counsellor-frontend"
$Version = "v1.5.8"
$GoogleClientID = "603527817862-hr6a8po12p97cv62f0q71ob5kmh93qiu.apps.googleusercontent.com"

Write-Host "Starting Build & Push Protocol [$Version]"

# 1. Build Backend
Write-Host "Building Backend..."
docker build -t ${BackendImageName}:latest -t ${BackendImageName}:${Version} ./backend
if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }

# 2. Build Frontend
Write-Host "Building Frontend..."
docker build --build-arg NEXT_PUBLIC_API_URL=https://ai-counsellor-backend-production.up.railway.app --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GoogleClientID} -t ${FrontendImageName}:latest -t ${FrontendImageName}:${Version} ./frontend
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }

# 3. Push to Docker Hub
Write-Host "Pushing to Docker Hub..."
docker push ${BackendImageName}:latest
docker push ${BackendImageName}:${Version}
docker push ${FrontendImageName}:latest
docker push ${FrontendImageName}:${Version}

Write-Host "Deployment Complete!"
