# IRO Library Management System - Backend

A comprehensive library management system backend for the Islamic Research Organization (IRO).

## Features

- **User Management**: Registration, authentication, and role-based access control
- **Book Management**: Complete CRUD operations for book catalog
- **Borrowing System**: Track book borrowing, returns, and renewals
- **User Interactions**: Like, comment, and share functionality
- **Admin Dashboard**: Administrative controls and reporting
- **Security**: JWT authentication, input validation, and security middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Authentication**: JWT
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── server.ts       # Application entry point
├── dist/               # Compiled JavaScript
├── logs/               # Application logs
└── package.json
```

## Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   copy .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Database connection string
   - JWT secrets
   - Email configuration
   - Cloudinary settings (for file uploads)

## Development

1. Start MongoDB (make sure MongoDB is running)

2. Start the development server:

   ```bash
   npm run dev
   ```

3. The server will be running at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Forgot password
- `PATCH /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/update-password` - Update password

### Books

- `GET /api/books` - Get all books (with filtering and pagination)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin/Librarian)
- `PATCH /api/books/:id` - Update book (Admin/Librarian)
- `DELETE /api/books/:id` - Delete book (Admin/Librarian)
- `GET /api/books/featured` - Get featured books
- `GET /api/books/popular` - Get popular books
- `GET /api/books/categories` - Get book categories
- `GET /api/books/search` - Search books

### Users

- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update user profile

### Borrowing

- `POST /api/borrows` - Borrow a book
- `GET /api/borrows` - Get user's borrowing history
- `PATCH /api/borrows/:id/return` - Return a book
- `PATCH /api/borrows/:id/renew` - Renew a book

### Reactions

- `POST /api/reactions` - Add/Update reaction to book
- `DELETE /api/reactions/:id` - Remove reaction
- `GET /api/reactions/book/:bookId` - Get book reactions

### Comments

- `POST /api/comments` - Add comment to book
- `GET /api/comments/book/:bookId` - Get book comments
- `PATCH /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Admin

- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Manage users
- `GET /api/admin/books` - Manage books
- `GET /api/admin/borrows` - Manage borrows

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- XSS protection
- NoSQL injection prevention
- Security headers with Helmet

## Error Handling

The application includes comprehensive error handling with:

- Custom error classes
- Global error middleware
- Detailed error logging
- User-friendly error messages
- Development vs production error responses

## Logging

Winston logger is configured for:

- Request logging
- Error logging
- File rotation
- Different log levels for development and production

## Environment Variables

Required environment variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iro-library
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
ADMIN_FRONTEND_URL=http://localhost:3001
```

## Testing

Run tests with:

```bash
npm test
```

## Building for Production

1. Build the TypeScript code:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Follow TypeScript best practices
2. Use meaningful commit messages
3. Add proper error handling
4. Include input validation
5. Update documentation for API changes
