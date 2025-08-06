# Vercel Deployment Guide for IRO Library Management System

## 🚀 Deployment Overview

Your IRO Library Management system will be deployed across 3 separate Vercel projects:

1. **Backend API** - `iro-library-backend.vercel.app`
2. **User Site** - `iro-library-user.vercel.app` 
3. **Admin Site** - `iro-library-admin.vercel.app`

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free, no credit card needed)
3. **MongoDB Atlas Account** - Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) (free, no credit card needed)

## 🗄️ Step 1: Setup MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (choose the free M0 tier)
3. Create a database user with username/password
4. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)
5. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## 🔧 Step 2: Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" and import your `iro-library` repository
3. **Important**: Set the root directory to `backend/`
4. Add these environment variables in Vercel dashboard:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12
```

5. Deploy the backend

## 🌐 Step 3: Deploy User Site

1. Create another new project in Vercel
2. Import the same repository
3. **Important**: Set the root directory to `frontend/user-site/`
4. Add environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

5. Deploy the user site

## ⚙️ Step 4: Deploy Admin Site

1. Create a third new project in Vercel
2. Import the same repository again
3. **Important**: Set the root directory to `frontend/admin-site/`
4. Add environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

5. Deploy the admin site

## 🔑 Step 5: Update API URLs

After deploying the backend, update the API URLs in both frontend projects:

1. Go to each frontend project's settings in Vercel
2. Update the `NEXT_PUBLIC_API_URL` environment variable with your actual backend URL
3. Redeploy both frontend projects

## 🎯 Step 6: Test Your Deployment

1. Visit your user site URL
2. Visit your admin site URL  
3. Test user registration and login
4. Test book browsing and search
5. Test admin functions

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend CORS settings allow your frontend URLs
2. **Database Connection**: Verify your MongoDB Atlas connection string and whitelist settings
3. **Environment Variables**: Double-check all environment variables are set correctly
4. **Build Errors**: Check the build logs in Vercel dashboard for specific errors

### Environment Variables Checklist:

**Backend:**
- ✅ NODE_ENV=production
- ✅ MONGODB_URI=(your MongoDB Atlas connection string)
- ✅ JWT_SECRET=(long random string)
- ✅ JWT_EXPIRE=7d
- ✅ BCRYPT_SALT_ROUNDS=12

**Frontend (both sites):**
- ✅ NEXT_PUBLIC_API_URL=(your backend Vercel URL + /api)

## 📞 Need Help?

If you encounter any issues during deployment, let me know and I'll help you troubleshoot!

## 🎉 Success!

Once deployed, you'll have:
- ✅ Scalable serverless backend
- ✅ Fast static frontend sites
- ✅ Free MongoDB database
- ✅ Automatic deployments on git push
- ✅ HTTPS by default
- ✅ Global CDN for fast loading

Your IRO Library Management system is now live and accessible worldwide! 🌍
