"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupStringReferences = main;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
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
async function cleanupBooks() {
    try {
        console.log("🔍 Finding books with string references...");
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error("Database connection is not established");
        }
        const booksToDelete = await db
            .collection("books")
            .find({
            $or: [
                { authors: { $type: "string" } },
                { authors: { $elemMatch: { $type: "string" } } },
                { categories: { $type: "string" } },
                { categories: { $elemMatch: { $type: "string" } } },
                { publisher: { $type: "string" } },
            ],
        })
            .toArray();
        console.log(`📚 Found ${booksToDelete.length} books with string references`);
        if (booksToDelete.length === 0) {
            console.log("✅ No books need cleanup!");
            return;
        }
        console.log("\n📋 Books to be removed:");
        booksToDelete.forEach((book, index) => {
            console.log(`  ${index + 1}. ${book.title} (ID: ${book._id})`);
        });
        const deleteResult = await db.collection("books").deleteMany({
            $or: [
                { authors: { $type: "string" } },
                { authors: { $elemMatch: { $type: "string" } } },
                { categories: { $type: "string" } },
                { categories: { $elemMatch: { $type: "string" } } },
                { publisher: { $type: "string" } },
            ],
        });
        console.log(`\n🗑️  Deleted ${deleteResult.deletedCount} books with string references`);
        console.log("✅ Database cleanup completed!");
        console.log("\n📝 Note: Administrators can now re-add books properly through the admin interface.");
    }
    catch (error) {
        console.error("❌ Cleanup failed:", error);
        throw error;
    }
}
async function main() {
    try {
        console.log("🚀 Starting Database Cleanup");
        console.log("============================");
        console.log("This will remove books with string references to prevent ObjectId cast errors.");
        console.log("Books can be re-added properly through the admin interface.\n");
        await connectDB();
        await cleanupBooks();
        console.log("\n🎉 Cleanup completed successfully!");
        console.log("The admin site should now work without ObjectId cast errors.");
    }
    catch (error) {
        console.error("💥 Cleanup failed:", error);
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
//# sourceMappingURL=cleanup-string-references.js.map