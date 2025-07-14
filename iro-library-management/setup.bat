@echo off
echo Installing IRO Library Management System...
echo.

echo Step 1: Installing root dependencies...
npm install
echo.

echo Step 2: Setting up backend...
cd backend
npm install
if not exist .env copy .env.example .env
echo Backend setup complete!
cd ..
echo.

echo Step 3: Setting up user site...
cd frontend\user-site
npm install
if not exist .env.local copy .env.example .env.local
echo User site setup complete!
cd ..\..
echo.

echo Step 4: Setting up admin site...
cd frontend\admin-site
npm install
if not exist .env.local copy .env.example .env.local
echo Admin site setup complete!
cd ..\..
echo.

echo ========================================
echo IRO Library Management System Setup Complete!
echo ========================================
echo.
echo Please update the following configuration files:
echo - backend\.env (Database connection, JWT secrets, etc.)
echo - frontend\user-site\.env.local (API URL, external services)
echo - frontend\admin-site\.env.local (API URL, external services)
echo.
echo To start the development servers:
echo npm run dev
echo.
echo Individual components:
echo - Backend API: npm run dev:backend (Port 5000)
echo - User Site: npm run dev:user-site (Port 3000) 
echo - Admin Site: npm run dev:admin-site (Port 3001)
echo.
echo For production build:
echo npm run build
echo npm start
echo.
pause
