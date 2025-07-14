#!/usr/bin/env powershell

Write-Host "Installing IRO Library Management System..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Installing root dependencies..." -ForegroundColor Yellow
npm install
Write-Host ""

Write-Host "Step 2: Setting up backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
}
Write-Host "Backend setup complete!" -ForegroundColor Green
Set-Location ..
Write-Host ""

Write-Host "Step 3: Setting up user site..." -ForegroundColor Yellow
Set-Location frontend/user-site
npm install
if (!(Test-Path .env.local)) {
    Copy-Item .env.example .env.local
}
Write-Host "User site setup complete!" -ForegroundColor Green
Set-Location ../..
Write-Host ""

Write-Host "Step 4: Setting up admin site..." -ForegroundColor Yellow
Set-Location frontend/admin-site
npm install
if (!(Test-Path .env.local)) {
    Copy-Item .env.example .env.local
}
Write-Host "Admin site setup complete!" -ForegroundColor Green
Set-Location ../..
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "IRO Library Management System Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please update the following configuration files:" -ForegroundColor Yellow
Write-Host "- backend\.env (Database connection, JWT secrets, etc.)"
Write-Host "- frontend\user-site\.env.local (API URL, external services)"
Write-Host "- frontend\admin-site\.env.local (API URL, external services)"
Write-Host ""
Write-Host "To start the development servers:" -ForegroundColor Green
Write-Host "npm run dev"
Write-Host ""
Write-Host "Individual components:" -ForegroundColor Yellow
Write-Host "- Backend API: npm run dev:backend (Port 5000)"
Write-Host "- User Site: npm run dev:user-site (Port 3000)"
Write-Host "- Admin Site: npm run dev:admin-site (Port 3001)"
Write-Host ""
Write-Host "For production build:" -ForegroundColor Green
Write-Host "npm run build"
Write-Host "npm start"
Write-Host ""
