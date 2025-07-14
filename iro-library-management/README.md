# IRO Library Management System

A comprehensive library management system for the Islamic Research Organization (IRO). This system provides both user-facing and administrative interfaces for managing books, users, borrowing, and interactions within the library ecosystem.

## 🏗️ Architecture

The system consists of three main components:

```
iro-library-management/
├── backend/           # Node.js + TypeScript + MongoDB API
├── frontend/
│   ├── user-site/     # Next.js user interface (Port 3000)
│   └── admin-site/    # Next.js admin interface (Port 3001)
└── README.md
```

## ✨ Features

### User Features

- **Book Discovery**: Browse, search, and filter books by categories, authors, language
- **User Authentication**: Login with email or phone number
- **Book Interactions**: Like, comment, and share books
- **Borrowing System**: Borrow books and track return dates
- **User Profile**: Manage personal information and preferences
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Theme switching support
- **Real-time Updates**: Live notifications and updates

### Admin Features

- **Dashboard**: Overview of library statistics and activities
- **Book Management**: Add, edit, and manage the book catalog
- **User Management**: Manage user accounts and permissions
- **Borrowing Management**: Track and manage book loans
- **Role-based Access**: Admin and Librarian roles with different permissions
- **Analytics**: Detailed reports and analytics
- **Content Moderation**: Manage comments and user interactions

### Technical Features

- **TypeScript**: Full type safety across the stack
- **Modular Architecture**: Clean, maintainable code structure
- **Security**: JWT authentication, input validation, rate limiting
- **Performance**: Optimized queries, caching, and pagination
- **Scalability**: Designed to handle growing user base and book collection
- **API Documentation**: Comprehensive API documentation

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting, XSS Protection
- **File Upload**: Cloudinary integration
- **Email**: Nodemailer
- **Logging**: Winston

### Frontend (User Site)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Custom components with Lucide icons
- **Theme**: Next-themes for dark/light mode
- **Notifications**: React Hot Toast

### Frontend (Admin Site)

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Data Tables**: TanStack Table
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Date Pickers**: React Datepicker
- **Select Components**: React Select

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 5.0+
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd iro-library-management
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   copy .env.example .env
   # Update .env with your configuration
   npm run dev
   ```

3. **Setup User Site**

   ```bash
   cd frontend/user-site
   npm install
   npm run dev
   ```

4. **Setup Admin Site**
   ```bash
   cd frontend/admin-site
   npm install
   npm run dev
   ```

### Default Access

- **API**: http://localhost:5000
- **User Site**: http://localhost:3000
- **Admin Site**: http://localhost:3001

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/signup       # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/me          # Get current user
POST /api/auth/forgot-password  # Forgot password
PATCH /api/auth/reset-password  # Reset password
```

### Book Endpoints

```
GET    /api/books           # Get all books (with filtering)
GET    /api/books/:id       # Get single book
POST   /api/books           # Create book (Admin/Librarian)
PATCH  /api/books/:id       # Update book (Admin/Librarian)
DELETE /api/books/:id       # Delete book (Admin/Librarian)
GET    /api/books/featured  # Get featured books
GET    /api/books/popular   # Get popular books
GET    /api/books/search    # Search books
```

### User Management

```
GET    /api/users           # Get all users (Admin)
GET    /api/users/:id       # Get user profile
PATCH  /api/users/:id       # Update user profile
```

### Borrowing System

```
POST   /api/borrows         # Borrow a book
GET    /api/borrows         # Get borrowing history
PATCH  /api/borrows/:id/return  # Return a book
PATCH  /api/borrows/:id/renew   # Renew a book
```

## 🏛️ Database Schema

### User Collection

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: ['admin', 'librarian', 'member'],
  profilePicture: String,
  isActive: Boolean,
  membershipStatus: ['active', 'suspended', 'expired'],
  preferences: {
    notifications: { email, sms, push },
    language: String,
    theme: ['light', 'dark']
  },
  address: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Book Collection

```javascript
{
  title: String,
  authors: [String],
  isbn: String,
  categories: [String],
  language: String,
  description: String,
  coverImage: String,
  format: ['physical', 'digital', 'both'],
  totalCopies: Number,
  availableCopies: Number,
  location: { shelf, section, floor },
  rating: { average, count },
  statistics: { views, likes, comments, shares, borrows },
  isActive: Boolean,
  isFeatured: Boolean,
  metadata: { addedBy, lastModifiedBy, lastModifiedAt },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (Admin, Librarian, Member)
- **Password Security**: Bcrypt hashing with salt rounds
- **Input Validation**: Comprehensive validation using Express Validator
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configured Cross-Origin Resource Sharing
- **XSS Protection**: Cross-site scripting prevention
- **SQL Injection**: NoSQL injection prevention
- **Security Headers**: Helmet.js for security headers

## 📊 Features in Detail

### Book Management

- **Comprehensive Catalog**: Support for physical and digital books
- **Rich Metadata**: ISBN, categories, authors, descriptions, cover images
- **Multi-format Support**: PDF, EPUB, MOBI, audiobooks
- **Location Tracking**: Shelf, section, floor organization
- **Condition Tracking**: Book condition monitoring
- **Availability Management**: Real-time availability tracking

### User Interaction System

- **Reactions**: Like, love, bookmark, favorite books
- **Comments**: Nested commenting system with moderation
- **Sharing**: Social sharing capabilities
- **Reviews**: User reviews and ratings
- **Reading Lists**: Personal book collections

### Borrowing System

- **Digital & Physical**: Support for both book types
- **Renewal System**: Automated renewal with limits
- **Due Date Tracking**: Automatic overdue detection
- **Fine Management**: Late return fines calculation
- **Reservation System**: Book reservation queue
- **History Tracking**: Complete borrowing history

### Administrative Tools

- **User Management**: Account creation, suspension, role management
- **Content Moderation**: Comment and review moderation
- **Analytics Dashboard**: Usage statistics and trends
- **Reporting**: Comprehensive reporting system
- **Bulk Operations**: Batch operations for efficiency

## 🎨 UI/UX Features

### Design System

- **Islamic-inspired Design**: Green color palette with Islamic patterns
- **Responsive Layout**: Mobile-first responsive design
- **Dark/Light Themes**: User-preferred theme switching
- **Accessibility**: WCAG compliance for accessibility
- **Arabic Support**: RTL text support for Arabic content
- **Modern UI**: Clean, intuitive interface design

### User Experience

- **Progressive Enhancement**: Works without JavaScript
- **Offline Support**: Basic offline functionality
- **Search**: Advanced search with filters
- **Pagination**: Efficient content pagination
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🚀 Deployment

### Backend Deployment

```bash
cd backend
npm run build
npm start
```

### Frontend Deployment

```bash
cd frontend/user-site
npm run build
npm start

cd frontend/admin-site
npm run build
npm start
```

### Environment Variables

Refer to `.env.example` files in each project for required environment variables.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend/user-site
npm test

cd frontend/admin-site
npm test
```

## 📈 Performance Optimization

- **Database Indexing**: Optimized MongoDB indexes
- **Query Optimization**: Efficient database queries
- **Caching**: Strategic caching implementation
- **Image Optimization**: Cloudinary image optimization
- **Code Splitting**: Next.js automatic code splitting
- **Bundle Analysis**: Bundle size optimization

## 🔄 Version Control & Collaboration

- **Git Workflow**: Feature branch workflow
- **Code Standards**: ESLint and Prettier configuration
- **Commit Convention**: Conventional commit messages
- **Documentation**: Comprehensive code documentation

## 📞 Support & Contributing

For support or contributions:

1. Check existing issues
2. Create detailed bug reports
3. Follow coding standards
4. Write comprehensive tests
5. Update documentation

## 📄 License

This project is proprietary software developed for the Islamic Research Organization (IRO).

---

**Built with ❤️ for the Islamic Research Organization (IRO)**
