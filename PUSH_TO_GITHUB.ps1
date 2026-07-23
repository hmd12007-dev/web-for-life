# ============================================================
#  MEDICORE HOSPITAL - One-Click GitHub Push Script
#  Double-click this file OR right-click > Run with PowerShell
# ============================================================
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = 'Tls12'

$repoDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$username = "hmd12007-dev"
$repoName = "medicore-hospital"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MediCore Hospital - GitHub Push Tool  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "GitHub user : $username" -ForegroundColor White
Write-Host "Repository  : $repoName" -ForegroundColor White
Write-Host ""
Write-Host "You need a GitHub Personal Access Token (PAT)." -ForegroundColor Yellow
Write-Host ""
Write-Host "To create one (takes 30 seconds):" -ForegroundColor Yellow
Write-Host "  1. Open: https://github.com/settings/tokens/new" -ForegroundColor White
Write-Host "  2. Note: medicore-push" -ForegroundColor White
Write-Host "  3. Expiration: 7 days" -ForegroundColor White
Write-Host "  4. Tick the [repo] checkbox" -ForegroundColor White
Write-Host "  5. Click Generate token -> Copy it" -ForegroundColor White
Write-Host ""

$token = Read-Host "Paste your GitHub token here (input is hidden)" 
# Read-Host doesn't hide by default - use SecureString then convert
# Fallback: just read as plain text since this is local
if (-not $token) {
    $secToken = Read-Host "Token" -AsSecureString
    $token = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secToken)
    )
}

$token = $token.Trim()

if ($token.Length -lt 10) {
    Write-Host "ERROR: Token looks too short. Exiting." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 1/3 - Creating repository on GitHub..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "token $token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "medicore-push-script"
}

$body = @{
    name        = $repoName
    description = "MediCore Hospital - Modern responsive medical website with 10 pages, dark mode, AOS animations, gallery lightbox, FAQ accordion, contact form validation"
    private     = $false
    auto_init   = $false
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "https://api.github.com/user/repos" `
        -Method POST -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "  Repository created: $($resp.html_url)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 422) {
        Write-Host "  Repository already exists - will push to existing repo." -ForegroundColor Yellow
    } elseif ($statusCode -eq 401) {
        Write-Host "  ERROR: Token is invalid or expired. Please check and retry." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    } else {
        Write-Host "  API error $statusCode - $($_.Exception.Message)" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "Step 2/3 - Configuring remote..." -ForegroundColor Cyan

Set-Location $repoDir

git remote remove origin 2>$null
$remoteUrl = "https://${token}@github.com/${username}/${repoName}.git"
git remote add origin $remoteUrl
Write-Host "  Remote set." -ForegroundColor Green

Write-Host ""
Write-Host "Step 3/3 - Pushing to GitHub..." -ForegroundColor Cyan

git push -u origin main 2>&1 | ForEach-Object { Write-Host "  $_" }

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Your code is on GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  GitHub : https://github.com/$username/$repoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Next - Deploy to Vercel (FREE, 1 minute):" -ForegroundColor Yellow
    Write-Host "    1. Go to https://vercel.com/new" -ForegroundColor White
    Write-Host "    2. Click 'Continue with GitHub'" -ForegroundColor White
    Write-Host "    3. Import: $username/$repoName" -ForegroundColor White
    Write-Host "    4. Framework: Other | Root: ./" -ForegroundColor White
    Write-Host "    5. Click Deploy - live in 30 seconds!" -ForegroundColor White
    Write-Host ""

    # Remove the token from remote URL for security
    git remote set-url origin "https://github.com/$username/$repoName.git"
    Write-Host "  (Token removed from remote URL for security)" -ForegroundColor DarkGray
} else {
    Write-Host ""
    Write-Host "  Push FAILED. Possible reasons:" -ForegroundColor Red
    Write-Host "  - Token doesn't have 'repo' scope" -ForegroundColor Yellow
    Write-Host "  - Token expired" -ForegroundColor Yellow
    Write-Host "  - Wrong username" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to close"
