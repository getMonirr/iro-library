# Vercel Deployment Helper Script for IRO Library Management System

Write-Host "IRO Library Management System - Vercel Deployment Helper" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green

Write-Host ""
Write-Host "Pre-deployment Checklist:" -ForegroundColor Yellow
Write-Host "- GitHub repository created and code pushed" -ForegroundColor Green
Write-Host "- Vercel account created (vercel.com)" -ForegroundColor Green
Write-Host "- MongoDB Atlas account created (mongodb.com/atlas)" -ForegroundColor Green
Write-Host ""

Write-Host "Important Links:" -ForegroundColor Cyan
Write-Host "• Vercel Dashboard: https://vercel.com/dashboard"
Write-Host "• MongoDB Atlas: https://cloud.mongodb.com/"
Write-Host "• GitHub Repository: https://github.com/getMonirr/iro-library"
Write-Host ""

Write-Host "Deployment Order:" -ForegroundColor Magenta
Write-Host "1. Setup MongoDB Atlas database"
Write-Host "2. Deploy Backend API first"
Write-Host "3. Deploy User Site (update API URL)"
Write-Host "4. Deploy Admin Site (update API URL)"
Write-Host ""

Write-Host "Expected URLs after deployment:" -ForegroundColor Blue
Write-Host "• Backend API: https://iro-library-backend.vercel.app"
Write-Host "• User Site: https://iro-library-user.vercel.app"
Write-Host "• Admin Site: https://iro-library-admin.vercel.app"
Write-Host ""

Write-Host "Environment Variables Needed:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend (.env):" -ForegroundColor White
Write-Host "NODE_ENV=production"
Write-Host "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iro-library"
Write-Host "JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random"
Write-Host "JWT_EXPIRE=7d"
Write-Host "BCRYPT_SALT_ROUNDS=12"
Write-Host ""
Write-Host "Frontend (.env.local):" -ForegroundColor White
Write-Host "NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api"
Write-Host ""

Write-Host "For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor Green
Write-Host ""
Write-Host "Ready to deploy! Follow the guide and let me know if you need help!" -ForegroundColor Green
