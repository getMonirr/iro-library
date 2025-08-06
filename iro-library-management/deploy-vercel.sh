#!/bin/bash

# Vercel Deployment Helper Script for IRO Library Management System

echo "🚀 IRO Library Management System - Vercel Deployment Helper"
echo "============================================================"

echo ""
echo "📋 Pre-deployment Checklist:"
echo "✅ GitHub repository created and code pushed"
echo "✅ Vercel account created (vercel.com)"
echo "✅ MongoDB Atlas account created (mongodb.com/atlas)"
echo ""

echo "🔗 Important Links:"
echo "• Vercel Dashboard: https://vercel.com/dashboard"
echo "• MongoDB Atlas: https://cloud.mongodb.com/"
echo "• GitHub Repository: https://github.com/getMonirr/iro-library"
echo ""

echo "📦 Deployment Order:"
echo "1. Setup MongoDB Atlas database"
echo "2. Deploy Backend API first"
echo "3. Deploy User Site (update API URL)"
echo "4. Deploy Admin Site (update API URL)"
echo ""

echo "🌐 Expected URLs after deployment:"
echo "• Backend API: https://iro-library-backend.vercel.app"
echo "• User Site: https://iro-library-user.vercel.app"
echo "• Admin Site: https://iro-library-admin.vercel.app"
echo ""

echo "💡 Environment Variables Needed:"
echo ""
echo "Backend (.env):"
echo "NODE_ENV=production"
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iro-library"
echo "JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random"
echo "JWT_EXPIRE=7d"
echo "BCRYPT_SALT_ROUNDS=12"
echo ""
echo "Frontend (.env.local):"
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api"
echo ""

echo "📖 For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Ready to deploy! Follow the guide and let me know if you need help!"
