$Username = "dockerforgit"
$Password = Read-Host "Enter Docker Hub Password or Personal Access Token"

Write-Host "`n🔐 Authenticating with Docker Hub..." -ForegroundColor Yellow

# 1. Get JWT Token
$AuthBody = @{
    username = $Username
    password = $Password
} | ConvertTo-Json

try {
    $AuthResponse = Invoke-RestMethod -Uri "https://hub.docker.com/v2/users/login/" -Method Post -Body $AuthBody -ContentType "application/json"
    $JWT = $AuthResponse.token
}
catch {
    Write-Host "❌ Failed to authenticate. Check your credentials." -ForegroundColor Red
    exit
}

Write-Host "✅ Authenticated. Fetching repositories..." -ForegroundColor Green

# 2. Get All Repositories
$ReposUri = "https://hub.docker.com/v2/repositories/$Username/?page_size=100"
$Repos = Invoke-RestMethod -Uri $ReposUri -Method Get -Headers @{Authorization = "JWT $JWT" }

if ($Repos.count -eq 0) {
    Write-Host "📭 No repositories found for user '$Username'." -ForegroundColor Yellow
    exit
}

Write-Host "🗑️ Found $($Repos.count) repositories. Starting deletion..." -ForegroundColor Cyan

# 3. Delete Each Repository
foreach ($repo in $Repos.results) {
    $repoName = $repo.name
    Write-Host "🔥 Deleting repository: $repoName..." -ForegroundColor Red
    
    try {
        $DeleteUri = "https://hub.docker.com/v2/repositories/$Username/$repoName/"
        Invoke-RestMethod -Uri $DeleteUri -Method Delete -Headers @{Authorization = "JWT $JWT" }
        Write-Host "   ✅ Successfully deleted $repoName" -ForegroundColor Gray
    }
    catch {
        $err = $_.Exception.Message
        Write-Host "   ❌ Failed to delete $repoName : $err" -ForegroundColor Red
    }
}

Write-Host "`n✨ Cleanup complete! Allrepositories for '$Username' have been processed." -ForegroundColor Green
