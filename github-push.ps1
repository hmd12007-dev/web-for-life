# github-push.ps1
# Creates GitHub repo via API and pushes code
# Usage: Set your GitHub token below, then run this script

param(
    [string]$Token = $env:GITHUB_TOKEN,
    [string]$RepoName = "medicore-hospital",
    [string]$Username = "hmd12007-dev"
)

$repo = "E:\coding site\SMIT Class\Assingments\medical web\medicore-hospital"
Set-Location $repo

if (-not $Token) {
    Write-Host "ERROR: No GitHub token found." -ForegroundColor Red
    Write-Host "Set it as: `$env:GITHUB_TOKEN = 'your_token_here'" -ForegroundColor Yellow
    Write-Host "Or pass it: .\github-push.ps1 -Token 'your_token_here'" -ForegroundColor Yellow
    exit 1
}

Write-Host "=== Creating GitHub repository '$RepoName' ===" -ForegroundColor Cyan

$headers = @{
    "Authorization" = "token $Token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "medicore-deploy"
}

$body = @{
    name        = $RepoName
    description = "MediCore Hospital - Modern responsive medical website with 10 pages, dark mode, and all interactive features"
    private     = $false
    auto_init   = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" `
        -Method POST -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Repository created: $($response.html_url)" -ForegroundColor Green
} catch {
    $err = $_.Exception.Message
    if ($err -match "already exists" -or $err -match "422") {
        Write-Host "Repo may already exist - continuing with push..." -ForegroundColor Yellow
    } else {
        Write-Host "API error: $err" -ForegroundColor Red
        exit 1
    }
}

$remoteUrl = "https://${Token}@github.com/${Username}/${RepoName}.git"

Write-Host "=== Adding remote origin ===" -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin $remoteUrl

Write-Host "=== Pushing to GitHub ===" -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host " URL: https://github.com/$Username/$RepoName" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next - Deploy to Vercel:" -ForegroundColor Cyan
    Write-Host " 1. Go to https://vercel.com/new" -ForegroundColor White
    Write-Host " 2. Import: $Username/$RepoName" -ForegroundColor White
    Write-Host " 3. Framework: Other (Static)" -ForegroundColor White
    Write-Host " 4. Root Directory: ./" -ForegroundColor White
    Write-Host " 5. Click Deploy!" -ForegroundColor White
} else {
    Write-Host "Push failed. Check your token and try again." -ForegroundColor Red
}
