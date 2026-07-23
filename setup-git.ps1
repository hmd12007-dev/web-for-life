# setup-git.ps1 – Initialize repo, commit all files, add remote, push to GitHub
# Run from inside medicore-hospital/ folder

Set-Location $PSScriptRoot

# 1. Init
git init
git checkout -b main

# 2. Stage everything
git add .

# 3. First commit
git commit -m "Initial commit: MediCore Hospital website - 10 pages, responsive design, dark mode, all features"

# 4. Add remote – update URL after creating repo on GitHub
# git remote add origin https://github.com/hmd12007-dev/medicore-hospital.git
# git push -u origin main

Write-Host ""
Write-Host "=============================================="
Write-Host " Repo initialized and committed successfully!"
Write-Host " Now:"
Write-Host " 1. Create repo on https://github.com/new"
Write-Host "    Name: medicore-hospital"
Write-Host "    Visibility: Public"
Write-Host "    DO NOT initialize with README"
Write-Host " 2. Then run these two commands:"
Write-Host '    git remote add origin https://github.com/hmd12007-dev/medicore-hospital.git'
Write-Host '    git push -u origin main'
Write-Host "=============================================="
