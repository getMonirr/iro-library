"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useBookQuery } from "@/hooks/useBooks";
import {
  AlertTriangle,
  BookMarked,
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Globe,
  Headphones,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  Package,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BookDetailsPage() {
  const params = useParams();
  const bookId = params.id as string;

  const { data: bookResponse, isLoading, error } = useBookQuery(bookId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading book details...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !bookResponse?.data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Book Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The book you're looking for doesn't exist or has been removed.
              </p>
              <Link
                href="/books"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Browse All Books
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const book = bookResponse.data;

  const formatAuthors = (authors: string[] | any[]) => {
    if (!authors || authors.length === 0) return "Unknown Author";
    return authors
      .map((author: any) => (typeof author === "object" ? author.name : author))
      .join(", ");
  };

  const formatPublisher = (publisher: string | any) => {
    if (!publisher) return null;
    return typeof publisher === "object" ? publisher.name : publisher;
  };

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case "excellent":
        return "text-green-600 dark:text-green-400";
      case "good":
        return "text-blue-600 dark:text-blue-400";
      case "fair":
        return "text-yellow-600 dark:text-yellow-400";
      case "poor":
        return "text-orange-600 dark:text-orange-400";
      case "damaged":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "purchase":
        return Package;
      case "donation":
        return Heart;
      case "exchange":
        return RefreshCw;
      default:
        return Info;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center mb-8 text-sm">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
            <Link
              href="/books"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Books
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
            <span className="text-gray-500 truncate">{book.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover and Actions */}
            <div className="lg:col-span-1">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/4] flex items-center justify-center mb-4 overflow-hidden">
                {book.coverImage || book.thumbnailImage ? (
                  <img
                    src={book.coverImage || book.thumbnailImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <BookOpen className="h-16 w-16 mx-auto mb-2" />
                    <p>No cover image</p>
                  </div>
                )}
              </div>

              {/* Availability Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Availability
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`font-medium ${
                        book.availableCopies > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {book.availableCopies > 0 ? "Available" : "Not Available"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Copies:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {book.availableCopies}/{book.totalCopies}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Format:
                    </span>
                    <span className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded capitalize">
                      {book.format}
                    </span>
                  </div>
                  {book.condition && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Condition:
                      </span>
                      <span
                        className={`font-medium capitalize ${getConditionColor(
                          book.condition
                        )}`}
                      >
                        {book.condition}
                      </span>
                    </div>
                  )}
                </div>

                {book.availableCopies > 0 && (
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200">
                    Request to Borrow
                  </button>
                )}

                {book.isRestricted && (
                  <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                      <span className="text-sm text-yellow-700 dark:text-yellow-300">
                        Restricted Access
                      </span>
                    </div>
                    {book.restrictionReason && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        {book.restrictionReason}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Digital Access */}
              {(book.format === "digital" || book.format === "both") && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Digital Access
                  </h3>
                  <div className="space-y-2">
                    {book.digitalFormats?.map((format, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {format}:
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                          {format === "audiobook" ? (
                            <Headphones className="h-4 w-4" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                    {book.fileUrl && (
                      <button className="w-full mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition duration-200">
                        <Download className="h-4 w-4" />
                        Download eBook
                      </button>
                    )}
                    {book.audioUrl && (
                      <button className="w-full mt-2 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm transition duration-200">
                        <Headphones className="h-4 w-4" />
                        Listen Audiobook
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Statistics & Engagement */}
              {book.statistics && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Book Statistics & Engagement
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {book.statistics.views.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        Views
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <Heart className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                        {book.statistics.likes.toLocaleString()}
                      </div>
                      <div className="text-sm text-red-700 dark:text-red-300">
                        Likes
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {book.statistics.comments.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Comments
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <BookMarked className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {book.statistics.borrows.toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">
                        Times Borrowed
                      </div>
                    </div>
                  </div>

                  {book.statistics.shares && (
                    <div className="mt-4 text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {book.statistics.shares.toLocaleString()} Shares
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Times shared on social media
                      </div>
                    </div>
                  )}

                  {/* Popularity Indicators */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {book.statistics.views > 1000 && (
                      <span className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        <Eye className="h-3 w-3 mr-1" />
                        Popular
                      </span>
                    )}
                    {book.statistics.likes > 100 && (
                      <span className="inline-flex items-center px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                        <Heart className="h-3 w-3 mr-1" />
                        Well Liked
                      </span>
                    )}
                    {book.statistics.borrows > 50 && (
                      <span className="inline-flex items-center px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        <BookMarked className="h-3 w-3 mr-1" />
                        Frequently Borrowed
                      </span>
                    )}
                    {book.statistics.comments > 20 && (
                      <span className="inline-flex items-center px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Discussion Starter
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                {book.isFeatured && (
                  <span className="inline-block px-3 py-1 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full mb-3">
                    ⭐ Featured Book
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                    {book.subtitle}
                  </h2>
                )}
              </div>

              {/* Comprehensive Book Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Primary Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Primary Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-500 block">
                          Authors
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {formatAuthors(book.authors)}
                        </span>
                      </div>
                    </div>

                    {formatPublisher(book.publisher) && (
                      <div className="flex items-start text-gray-600 dark:text-gray-400">
                        <Building2 className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-500 block">
                            Publisher
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {formatPublisher(book.publisher)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-500 block">
                          Category
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {book.category}
                        </span>
                        {book.categories && book.categories.length > 0 && (
                          <div className="mt-1">
                            <span className="text-sm text-gray-500 dark:text-gray-500 block">
                              Additional Categories
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {book.categories.map((cat, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {book.language && (
                      <div className="flex items-start text-gray-600 dark:text-gray-400">
                        <Globe className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-500 block">
                            Language
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {book.language}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Publication & Technical Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Publication & Technical
                  </h3>
                  <div className="space-y-4">
                    {(book.publishedYear || book.publishedDate) && (
                      <div className="flex items-start text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-500 block">
                            Published
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {book.publishedDate
                              ? new Date(
                                  book.publishedDate
                                ).toLocaleDateString()
                              : book.publishedYear}
                          </span>
                        </div>
                      </div>
                    )}

                    {book.pages && (
                      <div className="flex items-start text-gray-600 dark:text-gray-400">
                        <FileText className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-500 block">
                            Pages
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {book.pages} pages
                          </span>
                        </div>
                      </div>
                    )}

                    {book.isbn && (
                      <div className="flex items-start text-gray-600 dark:text-gray-400">
                        <Package className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-500 block">
                            ISBN
                          </span>
                          <span className="text-gray-900 dark:text-white font-mono text-sm">
                            {book.isbn}
                          </span>
                        </div>
                      </div>
                    )}

                    {book.location && (
                      <div className="flex items-start text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-500 block">
                            Physical Location
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {book.location.floor &&
                              `Floor ${book.location.floor}, `}
                            Section {book.location.section}, Shelf{" "}
                            {book.location.shelf}
                          </span>
                        </div>
                      </div>
                    )}

                    {book.bookId && (
                      <div className="flex items-start text-gray-600 dark:text-gray-400">
                        <Package className="h-4 w-4 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-500 block">
                            Book ID
                          </span>
                          <span className="text-gray-900 dark:text-white font-mono text-sm">
                            {book.bookId}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              {book.rating && book.rating.count > 0 && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {book.rating.average.toFixed(1)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      ({book.rating.count}{" "}
                      {book.rating.count === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(book.rating!.average)
                            ? "fill-current text-yellow-400"
                            : "stroke-current fill-transparent text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Description
                  </h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {book.tags && book.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag: string, index: number) => (
                      <Link
                        key={index}
                        href={`/books?search=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Borrowing Information */}
              {(book.maxBorrowDays ||
                book.renewalLimit ||
                book.reservationLimit ||
                book.minimumAge) && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Borrowing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {book.maxBorrowDays && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Max borrow period:
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">
                          {book.maxBorrowDays} days
                        </span>
                      </div>
                    )}
                    {book.renewalLimit && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Renewal limit:
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">
                          {book.renewalLimit} times
                        </span>
                      </div>
                    )}
                    {book.reservationLimit && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Reservation limit:
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">
                          {book.reservationLimit}
                        </span>
                      </div>
                    )}
                    {book.minimumAge && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Minimum age:
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">
                          {book.minimumAge} years
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Acquisition Information */}
              {book.acquisitionInfo && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Acquisition Information
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        {(() => {
                          const SourceIcon = getSourceIcon(
                            book.acquisitionInfo?.source
                          );
                          return (
                            <SourceIcon className="h-4 w-4 mr-2 text-gray-500" />
                          );
                        })()}
                        <span className="text-gray-600 dark:text-gray-400">
                          Source:
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2 capitalize">
                          {book.acquisitionInfo.source}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Acquired:
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">
                          {new Date(
                            book.acquisitionInfo.acquisitionDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {book.acquisitionInfo.cost && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Cost:
                          </span>
                          <span className="text-gray-900 dark:text-white ml-2">
                            ${book.acquisitionInfo.cost}
                          </span>
                        </div>
                      )}
                      {book.acquisitionInfo.donor && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Donor:
                          </span>
                          <span className="text-gray-900 dark:text-white ml-2">
                            {book.acquisitionInfo.donor}
                          </span>
                        </div>
                      )}
                    </div>
                    {book.acquisitionInfo.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          Notes:
                        </span>
                        <p className="text-gray-900 dark:text-white text-sm mt-1">
                          {book.acquisitionInfo.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comprehensive Metadata */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Complete Book Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* System Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                      System Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      {book.bookId && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-500">
                            Book ID:
                          </span>
                          <span className="text-gray-900 dark:text-white font-mono">
                            {book.bookId}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-500">
                          Status:
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              book.isActive
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                          >
                            {book.isActive ? "Active" : "Inactive"}
                          </span>
                          {book.isFeatured && (
                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-500">
                          Added:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-500">
                          Last Updated:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(book.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {book.metadata && (
                        <>
                          {book.metadata.addedBy && (
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-500">
                                Added By:
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {book.metadata.addedBy}
                              </span>
                            </div>
                          )}
                          {book.metadata.lastModifiedBy && (
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-500">
                                Modified By:
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {book.metadata.lastModifiedBy}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Physical Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                      Physical Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-500">
                          Format:
                        </span>
                        <span className="text-gray-900 dark:text-white capitalize">
                          {book.format}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-500">
                          Total Copies:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {book.totalCopies}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-500">
                          Available:
                        </span>
                        <span
                          className={`font-medium ${
                            book.availableCopies > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {book.availableCopies}
                        </span>
                      </div>
                      {book.condition && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-500">
                            Condition:
                          </span>
                          <span
                            className={`font-medium capitalize ${getConditionColor(
                              book.condition
                            )}`}
                          >
                            {book.condition}
                          </span>
                        </div>
                      )}
                      {book.location && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-500 block mb-1">
                            Location:
                          </span>
                          <div className="text-gray-900 dark:text-white text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            {book.location.floor &&
                              `Floor: ${book.location.floor}`}
                            {book.location.floor && <br />}
                            Section: {book.location.section}
                            <br />
                            Shelf: {book.location.shelf}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Digital & Access */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                      Digital & Access
                    </h4>
                    <div className="space-y-2 text-sm">
                      {book.digitalFormats &&
                        book.digitalFormats.length > 0 && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-500 block mb-1">
                              Digital Formats:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {book.digitalFormats.map((format, index) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded uppercase"
                                >
                                  {format}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {book.fileUrl && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-500">
                            eBook File:
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            Available
                          </span>
                        </div>
                      )}
                      {book.audioUrl && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-500">
                            Audio File:
                          </span>
                          <span className="text-purple-600 dark:text-purple-400">
                            Available
                          </span>
                        </div>
                      )}
                      {book.isRestricted && (
                        <div>
                          <span className="text-red-600 dark:text-red-400 text-xs flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Restricted Access
                          </span>
                          {book.restrictionReason && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {book.restrictionReason}
                            </p>
                          )}
                        </div>
                      )}
                      {book.minimumAge && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-500">
                            Min. Age:
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {book.minimumAge} years
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Borrowing Rules */}
                {(book.maxBorrowDays ||
                  book.renewalLimit ||
                  book.reservationLimit) && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                      Borrowing Rules
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {book.maxBorrowDays && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Max Period
                            </span>
                          </div>
                          <span className="font-medium text-blue-900 dark:text-blue-100">
                            {book.maxBorrowDays} days
                          </span>
                        </div>
                      )}
                      {book.renewalLimit && (
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Renewals
                            </span>
                          </div>
                          <span className="font-medium text-green-900 dark:text-green-100">
                            {book.renewalLimit}x
                          </span>
                        </div>
                      )}
                      {book.reservationLimit && (
                        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center">
                            <BookMarked className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Reservations
                            </span>
                          </div>
                          <span className="font-medium text-purple-900 dark:text-purple-100">
                            {book.reservationLimit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Books Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Books
            </h2>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>
                Related books will be shown here based on category and tags.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
