import Book from "../models/Book";

/**
 * Generate a unique book ID with IRO prefix
 * Format: IRO-YYYY-NNNNNN (where YYYY is year and NNNNNN is sequential number)
 * Example: IRO-2025-000001, IRO-2025-000002, etc.
 */
export async function generateBookId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `IRO-${currentYear}-`;

  // Find the latest book ID for the current year
  const latestBook = await Book.findOne({
    bookId: { $regex: `^${prefix}` },
  })
    .sort({ bookId: -1 })
    .select("bookId")
    .lean();

  let nextNumber = 1;

  if (latestBook && latestBook.bookId) {
    // Extract the number part from the latest book ID
    const numberPart = latestBook.bookId.split("-")[2];
    if (numberPart) {
      nextNumber = parseInt(numberPart, 10) + 1;
    }
  }

  // Format the number with leading zeros (6 digits)
  const formattedNumber = nextNumber.toString().padStart(6, "0");

  return `${prefix}${formattedNumber}`;
}

/**
 * Check if a book ID already exists
 */
export async function isBookIdUnique(bookId: string): Promise<boolean> {
  const existingBook = await Book.findOne({ bookId });
  return !existingBook;
}

/**
 * Generate a guaranteed unique book ID
 * This function will retry if a collision occurs (very unlikely but possible)
 */
export async function generateUniqueBookId(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const bookId = await generateBookId();
    const isUnique = await isBookIdUnique(bookId);

    if (isUnique) {
      return bookId;
    }

    attempts++;
    // Wait a small amount before retrying
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  throw new Error("Unable to generate unique book ID after multiple attempts");
}
