# Admin Management System

This document outlines the comprehensive admin management system that includes role-based access control, activity tracking, and secure password management.

## Features

### 1. Role-Based Admin Management

- **Super Admin**: Can create and manage other admin accounts
- **Admin**: Standard admin privileges for library management
- **Librarian**: Basic library operations

### 2. First Login Security

- New admins must change their password on first login
- Temporary passwords are generated and provided securely
- Password change is enforced until completed

### 3. Activity Tracking

- All system activities are logged automatically
- Categorized by action type (auth, user management, book management, etc.)
- Severity levels (low, medium, high, critical)
- IP address and user agent tracking
- Automatic log cleanup after 90 days

## Backend Implementation

### Models

#### User Model (`backend/src/models/User.ts`)

Enhanced with admin management fields:

```typescript
{
  role: "user" | "admin" | "librarian" | "super_admin",
  isFirstLogin: boolean,
  mustChangePassword: boolean,
  createdBy: ObjectId // Reference to admin who created this user
}
```

#### ActivityLog Model (`backend/src/models/ActivityLog.ts`)

Comprehensive activity tracking:

```typescript
{
  user: ObjectId,
  action: string,
  resource: string,
  category: "auth" | "user_management" | "book_management" | "borrowing" | "system" | "security",
  severity: "low" | "medium" | "high" | "critical",
  details: Record<string, any>,
  ipAddress: string,
  userAgent: string,
  timestamp: Date
}
```

### Controllers

#### Admin Controller (`backend/src/controllers/adminController.ts`)

- `createAdmin` - Super admin only, creates new admin accounts
- `changeFirstLoginPassword` - Handles mandatory password changes
- `getAllAdmins` - Lists all admin accounts with pagination
- `toggleAdminStatus` - Enable/disable admin accounts
- `resetAdminPassword` - Generate new temporary passwords
- `getActivityLogs` - Retrieve system activity logs

### Middleware

#### Activity Logger (`backend/src/middleware/activityLogger.ts`)

Automatically logs all activities with:

- User identification
- Action categorization
- IP and user agent capture
- Severity assessment

#### Authentication (`backend/src/middleware/auth.ts`)

Enhanced with:

- First login detection
- Password change enforcement
- Role-based access control

### Routes

#### Admin Routes (`backend/src/routes/admin.routes.ts`)

```
POST /api/admin/create - Create new admin (super admin only)
POST /api/admin/change-first-login-password - Change password on first login
GET /api/admin/admins - List all admins
PATCH /api/admin/:id/toggle-status - Enable/disable admin
PATCH /api/admin/:id/reset-password - Reset admin password
GET /api/admin/activity-logs - Get activity logs
```

## Frontend Implementation

### Services

#### Admin Service (`frontend/admin-site/src/services/adminService.ts`)

API integration for all admin management operations.

#### Auth Service (`frontend/admin-site/src/services/authService.ts`)

Enhanced to support super_admin role and authentication flows.

### Hooks

#### useAdmins (`frontend/admin-site/src/hooks/useAdmins.ts`)

React Query hooks for:

- Admin listing and management
- Password operations
- Activity log retrieval
- Real-time updates

### Pages

#### Admin Management (`frontend/admin-site/src/app/dashboard/admin-management/page.tsx`)

Complete admin CRUD interface with:

- Create admin modal
- Status toggles
- Password reset functionality
- Search and filtering

#### Activity Logs (`frontend/admin-site/src/app/dashboard/activity-logs/page.tsx`)

Comprehensive activity monitoring with:

- Category and severity filtering
- Date range selection
- Detailed log inspection
- Pagination

#### Change Password (`frontend/admin-site/src/app/dashboard/change-password/page.tsx`)

Secure password change form for first login requirement.

### Navigation

Dynamic menu based on user role:

- Super admins see "Admin Management" and "Activity Logs"
- Regular admins see standard dashboard items

## Setup Instructions

### 1. Database Setup

No additional setup required - models will auto-create collections.

### 2. Create First Super Admin

Run this script in MongoDB or create manually:

```javascript
// Create first super admin account
db.users.insertOne({
  firstName: "Super",
  lastName: "Admin",
  email: "superadmin@library.com",
  phone: "+1234567890",
  password: "$2b$10$hashedPasswordHere", // Hash your password
  role: "super_admin",
  isActive: true,
  isFirstLogin: false,
  mustChangePassword: false,
  membershipStatus: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### 3. Environment Variables

Ensure these are set in your backend:

```
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

### 4. Frontend Configuration

Update API base URL in `frontend/admin-site/src/lib/api.ts` if needed.

## Security Features

### Password Management

- Secure temporary password generation
- Enforced password changes on first login
- Password complexity requirements
- Secure password storage with bcrypt

### Activity Tracking

- All administrative actions logged
- IP address and user agent tracking
- Automatic log retention policy
- Security event categorization

### Access Control

- Role-based navigation and features
- API endpoint protection
- Super admin privilege enforcement
- Session management

## Usage Workflow

### Creating New Admins

1. Super admin logs into admin dashboard
2. Navigates to "Admin Management"
3. Clicks "Create Admin"
4. Fills in admin details
5. System generates temporary password
6. Super admin provides credentials to new admin

### First Login Process

1. New admin logs in with temporary credentials
2. System detects first login
3. Redirects to password change page
4. Admin must set new password
5. System updates login status
6. Admin gains access to dashboard

### Activity Monitoring

1. Super admin navigates to "Activity Logs"
2. Views all system activities
3. Filters by category, severity, or date
4. Inspects detailed log information
5. Monitors security events

## API Documentation

### Authentication Required

All admin endpoints require valid JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Response Format

```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "pagination": {
    "currentPage": number,
    "totalPages": number,
    "totalItems": number
  }
}
```

### Error Handling

- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient privileges)
- 404: Not found
- 400: Bad request (validation errors)
- 500: Internal server error

## Monitoring and Maintenance

### Log Cleanup

Activity logs automatically expire after 90 days via MongoDB TTL index.

### Performance

- Activity logs are indexed for efficient querying
- Pagination implemented for large datasets
- React Query caching for optimal frontend performance

### Security Monitoring

Monitor activity logs for:

- Failed login attempts
- Privilege escalation attempts
- Unusual activity patterns
- Security-related actions

## Troubleshooting

### Common Issues

1. **Super admin can't create admins**

   - Verify user role is exactly "super_admin"
   - Check JWT token is valid
   - Ensure admin creation endpoint is accessible

2. **New admin can't change password**

   - Verify isFirstLogin is true
   - Check password requirements
   - Ensure change password endpoint is working

3. **Activity logs not appearing**
   - Check activity logger middleware is applied
   - Verify database connection
   - Check for console errors

### Log Analysis

Use MongoDB queries to analyze activities:

```javascript
// Find failed login attempts
db.activitylogs.find({
  action: "LOGIN_FAILED",
  category: "auth",
});

// Find admin creation activities
db.activitylogs.find({
  action: "CREATE_ADMIN",
  category: "user_management",
});
```
