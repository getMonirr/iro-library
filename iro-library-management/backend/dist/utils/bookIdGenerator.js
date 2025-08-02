"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBookId = generateBookId;
exports.isBookIdUnique = isBookIdUnique;
exports.generateUniqueBookId = generateUniqueBookId;
const Book_1 = __importDefault(require("../models/Book"));
async function generateBookId() {
    const currentYear = new Date().getFullYear();
    const prefix = `IRO-${currentYear}-`;
    const latestBook = await Book_1.default.findOne({
        bookId: { $regex: `^${prefix}` },
    })
        .sort({ bookId: -1 })
        .select("bookId")
        .lean();
    let nextNumber = 1;
    if (latestBook && latestBook.bookId) {
        const numberPart = latestBook.bookId.split("-")[2];
        if (numberPart) {
            nextNumber = parseInt(numberPart, 10) + 1;
        }
    }
    const formattedNumber = nextNumber.toString().padStart(6, "0");
    return `${prefix}${formattedNumber}`;
}
async function isBookIdUnique(bookId) {
    const existingBook = await Book_1.default.findOne({ bookId });
    return !existingBook;
}
async function generateUniqueBookId() {
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
        const bookId = await generateBookId();
        const isUnique = await isBookIdUnique(bookId);
        if (isUnique) {
            return bookId;
        }
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error("Unable to generate unique book ID after multiple attempts");
}
//# sourceMappingURL=bookIdGenerator.js.map