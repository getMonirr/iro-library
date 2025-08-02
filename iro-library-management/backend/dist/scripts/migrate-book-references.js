"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateBooksReferences = main;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const Author_1 = __importDefault(require("../models/Author"));
const Category_1 = __importDefault(require("../models/Category"));
const Publisher_1 = __importDefault(require("../models/Publisher"));
dotenv_1.default.config();
async function connectDB() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
async function findOrCreateAuthor(authorName) {
    try {
        let author = await Author_1.default.findOne({ name: authorName });
        if (!author) {
            console.log(`  📝 Creating new author: ${authorName}`);
            author = await Author_1.default.create({
                name: authorName,
                slug: authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                bio: `Author: ${authorName}`,
                isActive: true
            });
        }
        return new mongoose_1.default.Types.ObjectId(author._id);
    }
    catch (error) {
        console.error(`❌ Error finding/creating author ${authorName}:`, error);
        throw error;
    }
}
async function findOrCreateCategory(categoryName) {
    try {
        let category = await Category_1.default.findOne({ name: categoryName });
        if (!category) {
            console.log(`  📝 Creating new category: ${categoryName}`);
            category = await Category_1.default.create({
                name: categoryName,
                slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                description: `Category: ${categoryName}`,
                isActive: true
            });
        }
        return new mongoose_1.default.Types.ObjectId(category._id);
    }
    catch (error) {
        console.error(`❌ Error finding/creating category ${categoryName}:`, error);
        throw error;
    }
}
async function findOrCreatePublisher(publisherName) {
    try {
        let publisher = await Publisher_1.default.findOne({ name: publisherName });
        if (!publisher) {
            console.log(`  📝 Creating new publisher: ${publisherName}`);
            publisher = await Publisher_1.default.create({
                name: publisherName,
                slug: publisherName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                description: `Publisher: ${publisherName}`,
                isActive: true
            });
        }
        return new mongoose_1.default.Types.ObjectId(publisher._id);
    }
    catch (error) {
        console.error(`❌ Error finding/creating publisher ${publisherName}:`, error);
        throw error;
    }
}
async function migrateBooks() {
    try {
        console.log("🔍 Finding books that need migration...");
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error("Database connection is not established");
        }
        const books = await db.collection('books').find({}).toArray();
        console.log(`📚 Found ${books.length} books to check`);
        let migratedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        for (const book of books) {
            try {
                console.log(`\n📖 Processing book: ${book.title}`);
                let needsUpdate = false;
                const updateData = {};
                if (book.authors && Array.isArray(book.authors)) {
                    const authorIds = [];
                    let hasStringAuthors = false;
                    for (const author of book.authors) {
                        if (typeof author === 'string') {
                            hasStringAuthors = true;
                            console.log(`  🔄 Converting author: ${author}`);
                            const authorId = await findOrCreateAuthor(author);
                            authorIds.push(authorId);
                        }
                        else if (mongoose_1.default.Types.ObjectId.isValid(author)) {
                            authorIds.push(new mongoose_1.default.Types.ObjectId(author));
                        }
                    }
                    if (hasStringAuthors) {
                        updateData.authors = authorIds;
                        needsUpdate = true;
                    }
                }
                if (book.categories && Array.isArray(book.categories)) {
                    const categoryIds = [];
                    let hasStringCategories = false;
                    for (const category of book.categories) {
                        if (typeof category === 'string') {
                            hasStringCategories = true;
                            console.log(`  🔄 Converting category: ${category}`);
                            const categoryId = await findOrCreateCategory(category);
                            categoryIds.push(categoryId);
                        }
                        else if (mongoose_1.default.Types.ObjectId.isValid(category)) {
                            categoryIds.push(new mongoose_1.default.Types.ObjectId(category));
                        }
                    }
                    if (hasStringCategories) {
                        updateData.categories = categoryIds;
                        needsUpdate = true;
                    }
                }
                if (book.publisher && typeof book.publisher === 'string') {
                    console.log(`  🔄 Converting publisher: ${book.publisher}`);
                    const publisherId = await findOrCreatePublisher(book.publisher);
                    updateData.publisher = publisherId;
                    needsUpdate = true;
                }
                if (needsUpdate) {
                    const db = mongoose_1.default.connection.db;
                    if (!db) {
                        throw new Error("Database connection is not established");
                    }
                    await db.collection('books').updateOne({ _id: book._id }, { $set: updateData });
                    console.log(`  ✅ Updated book: ${book.title}`);
                    migratedCount++;
                }
                else {
                    console.log(`  ⏭️  Book already has proper references: ${book.title}`);
                    skippedCount++;
                }
            }
            catch (error) {
                console.error(`❌ Error processing book ${book.title}:`, error);
                errorCount++;
            }
        }
        console.log("\n📊 Migration Summary:");
        console.log(`  ✅ Migrated books: ${migratedCount}`);
        console.log(`  ⏭️  Skipped books: ${skippedCount}`);
        console.log(`  ❌ Error books: ${errorCount}`);
        console.log(`  📚 Total books: ${books.length}`);
    }
    catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    }
}
async function main() {
    try {
        console.log("🚀 Starting Book Reference Migration");
        console.log("=====================================");
        await connectDB();
        await migrateBooks();
        console.log("\n🎉 Migration completed successfully!");
    }
    catch (error) {
        console.error("💥 Migration failed:", error);
        process.exit(1);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log("👋 Disconnected from MongoDB");
        process.exit(0);
    }
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=migrate-book-references.js.map