export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: "admin" | "librarian" | "member";
  profilePicture?: string;
  isActive: boolean;
  fullName: string;
  membershipStatus: "active" | "suspended" | "expired";
  membershipDate: string;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    theme: "light" | "dark";
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  _id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  isbn?: string;
  isbn13?: string;
  publisher?: string;
  publishedDate?: string;
  language: string;
  pages?: number;
  description?: string;
  categories: string[];
  tags: string[];
  coverImage?: string;
  thumbnailImage?: string;
  format: "physical" | "digital" | "both";
  digitalFormats: ("pdf" | "epub" | "mobi" | "audiobook")[];
  totalCopies: number;
  availableCopies: number;
  isAvailable: boolean;
  location: {
    shelf: string;
    section: string;
    floor?: string;
  };
  fullLocation: string;
  condition: "excellent" | "good" | "fair" | "poor" | "damaged";
  rating: {
    average: number;
    count: number;
  };
  statistics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    borrows: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
  minimumAge?: number;
  maxBorrowDays: number;
  renewalLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface Borrow {
  _id: string;
  user: string | User;
  book: string | Book;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  actualReturnDate?: string;
  status: "active" | "returned" | "overdue" | "lost" | "damaged";
  renewalCount: number;
  daysBorrowed: number;
  daysOverdue: number;
  totalFines: number;
  fines: Array<{
    type: "late_return" | "damage" | "lost" | "other";
    amount: number;
    description: string;
    dateIssued: string;
    datePaid?: string;
    status: "pending" | "paid" | "waived";
  }>;
  digitalAccess?: {
    accessGranted: boolean;
    accessExpiry: string;
    downloadCount: number;
    maxDownloads: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: string | User;
  book: string | Book;
  parentComment?: string;
  content: string;
  isEdited: boolean;
  likes: number;
  replyCount: number;
  replies: Comment[];
  isReported: boolean;
  isModerated: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  _id: string;
  user: string | User;
  book: string | Book;
  type: "like" | "love" | "dislike" | "bookmark" | "favorite";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  results?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LoginCredentials {
  identifier: string; // email or phone
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  occupation?: string;
}

export interface BookFilters {
  page?: number;
  limit?: number;
  category?: string;
  author?: string;
  language?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface BorrowRequest {
  bookId: string;
  borrowDays?: number;
}

export interface ReactionRequest {
  bookId: string;
  type: "like" | "love" | "dislike" | "bookmark" | "favorite";
}

export interface CommentRequest {
  bookId: string;
  content: string;
  parentCommentId?: string;
}
