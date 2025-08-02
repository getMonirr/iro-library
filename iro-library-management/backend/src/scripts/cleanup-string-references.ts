/**
 * Simple cleanup script to remove books with string references
 * This allows the application to work, and administrators can re-add books properly through the UI
 */

import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

async function cleanupBooks() {
  try {
    console.log("🔍 Finding books with string references...");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection is not established");
    }

    // Find books that have string authors, categories, or publishers
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

    console.log(
      `📚 Found ${booksToDelete.length} books with string references`
    );

    if (booksToDelete.length === 0) {
      console.log("✅ No books need cleanup!");
      return;
    }

    // List the books to be deleted
    console.log("\n📋 Books to be removed:");
    booksToDelete.forEach((book, index) => {
      console.log(`  ${index + 1}. ${book.title} (ID: ${book._id})`);
    });

    // Delete the problematic books
    const deleteResult = await db.collection("books").deleteMany({
      $or: [
        { authors: { $type: "string" } },
        { authors: { $elemMatch: { $type: "string" } } },
        { categories: { $type: "string" } },
        { categories: { $elemMatch: { $type: "string" } } },
        { publisher: { $type: "string" } },
      ],
    });

    console.log(
      `\n🗑️  Deleted ${deleteResult.deletedCount} books with string references`
    );
    console.log("✅ Database cleanup completed!");
    console.log(
      "\n📝 Note: Administrators can now re-add books properly through the admin interface."
    );
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Starting Database Cleanup");
    console.log("============================");
    console.log(
      "This will remove books with string references to prevent ObjectId cast errors."
    );
    console.log(
      "Books can be re-added properly through the admin interface.\n"
    );

    await connectDB();
    await cleanupBooks();

    console.log("\n🎉 Cleanup completed successfully!");
    console.log("The admin site should now work without ObjectId cast errors.");
  } catch (error) {
    console.error("💥 Cleanup failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the cleanup
if (require.main === module) {
  main();
}

export { main as cleanupStringReferences };
