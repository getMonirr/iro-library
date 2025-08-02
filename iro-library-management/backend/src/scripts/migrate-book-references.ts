/**
 * Migration script to convert existing book data from string references to ObjectId references
 * This script handles the conversion of authors, categories, and publishers from string values
 * to proper ObjectId references in the Book collection.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import Author from "../models/Author";
import Category from "../models/Category";
import Publisher from "../models/Publisher";

// Load environment variables
dotenv.config();

interface LegacyBook {
  _id: string;
  authors: any[]; // Could be strings or ObjectIds
  categories: any[]; // Could be strings or ObjectIds
  publisher?: any; // Could be string or ObjectId
  [key: string]: any;
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

async function findOrCreateAuthor(authorName: string): Promise<mongoose.Types.ObjectId> {
  try {
    // First, try to find existing author by name
    let author = await Author.findOne({ name: authorName });
    
    if (!author) {
      // Create new author if not found
      console.log(`  📝 Creating new author: ${authorName}`);
      author = await Author.create({
        name: authorName,
        slug: authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        bio: `Author: ${authorName}`, // Basic bio
        isActive: true
      });
    }
    
    return new mongoose.Types.ObjectId(author._id);
  } catch (error) {
    console.error(`❌ Error finding/creating author ${authorName}:`, error);
    throw error;
  }
}

async function findOrCreateCategory(categoryName: string): Promise<mongoose.Types.ObjectId> {
  try {
    // First, try to find existing category by name
    let category = await Category.findOne({ name: categoryName });
    
    if (!category) {
      // Create new category if not found
      console.log(`  📝 Creating new category: ${categoryName}`);
      category = await Category.create({
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        description: `Category: ${categoryName}`, // Basic description
        isActive: true
      });
    }
    
    return new mongoose.Types.ObjectId(category._id as string);
  } catch (error) {
    console.error(`❌ Error finding/creating category ${categoryName}:`, error);
    throw error;
  }
}

async function findOrCreatePublisher(publisherName: string): Promise<mongoose.Types.ObjectId> {
  try {
    // First, try to find existing publisher by name
    let publisher = await Publisher.findOne({ name: publisherName });
    
    if (!publisher) {
      // Create new publisher if not found
      console.log(`  📝 Creating new publisher: ${publisherName}`);
      publisher = await Publisher.create({
        name: publisherName,
        slug: publisherName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        description: `Publisher: ${publisherName}`, // Basic description
        isActive: true
      });
    }
    
    return new mongoose.Types.ObjectId(publisher._id as string);
  } catch (error) {
    console.error(`❌ Error finding/creating publisher ${publisherName}:`, error);
    throw error;
  }
}

async function migrateBooks() {
  try {
    console.log("🔍 Finding books that need migration...");
    
    // Find all books - we'll check each one individually
    const db = mongoose.connection.db;
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
        const updateData: any = {};
        
        // Check and convert authors
        if (book.authors && Array.isArray(book.authors)) {
          const authorIds: mongoose.Types.ObjectId[] = [];
          let hasStringAuthors = false;
          
          for (const author of book.authors) {
            if (typeof author === 'string') {
              hasStringAuthors = true;
              console.log(`  🔄 Converting author: ${author}`);
              const authorId = await findOrCreateAuthor(author);
              authorIds.push(authorId);
            } else if (mongoose.Types.ObjectId.isValid(author)) {
              // Already an ObjectId, keep it
              authorIds.push(new mongoose.Types.ObjectId(author));
            }
          }
          
          if (hasStringAuthors) {
            updateData.authors = authorIds;
            needsUpdate = true;
          }
        }
        
        // Check and convert categories
        if (book.categories && Array.isArray(book.categories)) {
          const categoryIds: mongoose.Types.ObjectId[] = [];
          let hasStringCategories = false;
          
          for (const category of book.categories) {
            if (typeof category === 'string') {
              hasStringCategories = true;
              console.log(`  🔄 Converting category: ${category}`);
              const categoryId = await findOrCreateCategory(category);
              categoryIds.push(categoryId);
            } else if (mongoose.Types.ObjectId.isValid(category)) {
              // Already an ObjectId, keep it
              categoryIds.push(new mongoose.Types.ObjectId(category));
            }
          }
          
          if (hasStringCategories) {
            updateData.categories = categoryIds;
            needsUpdate = true;
          }
        }
        
        // Check and convert publisher
        if (book.publisher && typeof book.publisher === 'string') {
          console.log(`  🔄 Converting publisher: ${book.publisher}`);
          const publisherId = await findOrCreatePublisher(book.publisher);
          updateData.publisher = publisherId;
          needsUpdate = true;
        }
        
        // Update the book if needed
        if (needsUpdate) {
          const db = mongoose.connection.db;
          if (!db) {
            throw new Error("Database connection is not established");
          }
          
          await db.collection('books').updateOne(
            { _id: book._id },
            { $set: updateData }
          );
          console.log(`  ✅ Updated book: ${book.title}`);
          migratedCount++;
        } else {
          console.log(`  ⏭️  Book already has proper references: ${book.title}`);
          skippedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error processing book ${book.title}:`, error);
        errorCount++;
      }
    }
    
    console.log("\n📊 Migration Summary:");
    console.log(`  ✅ Migrated books: ${migratedCount}`);
    console.log(`  ⏭️  Skipped books: ${skippedCount}`);
    console.log(`  ❌ Error books: ${errorCount}`);
    console.log(`  📚 Total books: ${books.length}`);
    
  } catch (error) {
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
    
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the migration
if (require.main === module) {
  main();
}

export { main as migrateBooksReferences };

