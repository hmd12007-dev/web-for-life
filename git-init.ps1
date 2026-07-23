$repo = "E:\coding site\SMIT Class\Assingments\medical web\medicore-hospital"
Set-Location $repo

Write-Host "=== Step 1: git init ===" -ForegroundColor Cyan
git init

Write-Host "=== Step 2: set branch to main ===" -ForegroundColor Cyan
git checkout -b main 2>$null
if ($LASTEXITCODE -ne 0) { git branch -M main }

Write-Host "=== Step 3: stage all files ===" -ForegroundColor Cyan
git add .

Write-Host "=== Step 4: first commit ===" -ForegroundColor Cyan
git commit -m "Initial commit: MediCore Hospital - 10-page responsive medical website"

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "Repo initialized. Files committed to main branch." -ForegroundColor Green
Write-Host "Run the following to push (replace USERNAME if different):" -ForegroundColor Yellow
Write-Host '  git remote add origin https://github.com/hmd12007-dev/medicore-hospital.git' -ForegroundColor White
Write-Host '  git push -u origin main' -ForegroundColor White
