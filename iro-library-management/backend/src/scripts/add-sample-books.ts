/**
 * Script to add 20 sample books with proper ObjectId references
 * This ensures all books have valid author, category, and publisher references
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import Author from "../models/Author";
import Book from "../models/Book";
import Category from "../models/Category";
import Publisher from "../models/Publisher";

// Load environment variables
dotenv.config();

interface BookData {
  title: string;
  isbn: string;
  authorName: string;
  categoryName: string;
  publisherName: string;
  publishedYear: number;
  totalCopies: number;
  description: string;
  language: string;
}

const sampleBooks: BookData[] = [
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    isbn: "9780547928210",
    authorName: "J.R.R. Tolkien",
    categoryName: "Fantasy",
    publisherName: "Houghton Mifflin Harcourt",
    publishedYear: 1954,
    totalCopies: 5,
    description:
      "The first volume of the epic fantasy trilogy following Frodo's journey to destroy the One Ring.",
    language: "English",
  },
  {
    title: "To Kill a Mockingbird",
    isbn: "9780061120084",
    authorName: "Harper Lee",
    categoryName: "Classic Literature",
    publisherName: "Harper Perennial",
    publishedYear: 1960,
    totalCopies: 4,
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South.",
    language: "English",
  },
  {
    title: "1984",
    isbn: "9780451524935",
    authorName: "George Orwell",
    categoryName: "Dystopian Fiction",
    publisherName: "Signet Classics",
    publishedYear: 1949,
    totalCopies: 6,
    description:
      "A dystopian social science fiction novel about totalitarian control and surveillance.",
    language: "English",
  },
  {
    title: "Pride and Prejudice",
    isbn: "9780141439518",
    authorName: "Jane Austen",
    categoryName: "Romance",
    publisherName: "Penguin Classics",
    publishedYear: 1813,
    totalCopies: 3,
    description:
      "A romantic novel about manners, upbringing, morality, and marriage in Georgian England.",
    language: "English",
  },
  {
    title: "The Great Gatsby",
    isbn: "9780743273565",
    authorName: "F. Scott Fitzgerald",
    categoryName: "Classic Literature",
    publisherName: "Scribner",
    publishedYear: 1925,
    totalCopies: 4,
    description:
      "A critique of the American Dream set in the Jazz Age of the 1920s.",
    language: "English",
  },
  {
    title: "Dune",
    isbn: "9780441172719",
    authorName: "Frank Herbert",
    categoryName: "Science Fiction",
    publisherName: "Ace Books",
    publishedYear: 1965,
    totalCopies: 3,
    description:
      "An epic science fiction novel set on the desert planet Arrakis.",
    language: "English",
  },
  {
    title: "The Catcher in the Rye",
    isbn: "9780316769174",
    authorName: "J.D. Salinger",
    categoryName: "Coming of Age",
    publisherName: "Little, Brown and Company",
    publishedYear: 1951,
    totalCopies: 4,
    description:
      "A controversial novel about teenage rebellion and alienation.",
    language: "English",
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    isbn: "9780747532699",
    authorName: "J.K. Rowling",
    categoryName: "Fantasy",
    publisherName: "Bloomsbury",
    publishedYear: 1997,
    totalCopies: 8,
    description:
      "The first book in the Harry Potter series about a young wizard's adventures.",
    language: "English",
  },
  {
    title: "The Hobbit",
    isbn: "9780547928227",
    authorName: "J.R.R. Tolkien",
    categoryName: "Fantasy",
    publisherName: "Houghton Mifflin Harcourt",
    publishedYear: 1937,
    totalCopies: 5,
    description:
      "A fantasy adventure novel about Bilbo Baggins' unexpected journey.",
    language: "English",
  },
  {
    title: "Brave New World",
    isbn: "9780060850524",
    authorName: "Aldous Huxley",
    categoryName: "Dystopian Fiction",
    publisherName: "Harper Perennial",
    publishedYear: 1932,
    totalCopies: 3,
    description:
      "A dystopian novel about a technologically advanced future society.",
    language: "English",
  },
  {
    title: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
    isbn: "9780066238500",
    authorName: "C.S. Lewis",
    categoryName: "Fantasy",
    publisherName: "HarperCollins",
    publishedYear: 1950,
    totalCopies: 6,
    description:
      "A fantasy novel about children who discover a magical world through a wardrobe.",
    language: "English",
  },
  {
    title: "Animal Farm",
    isbn: "9780451526342",
    authorName: "George Orwell",
    categoryName: "Political Satire",
    publisherName: "Signet Classics",
    publishedYear: 1945,
    totalCopies: 4,
    description:
      "An allegorical novella about farm animals who rebel against their human farmer.",
    language: "English",
  },
  {
    title: "One Hundred Years of Solitude",
    isbn: "9780060883287",
    authorName: "Gabriel García Márquez",
    categoryName: "Magical Realism",
    publisherName: "Harper Perennial",
    publishedYear: 1967,
    totalCopies: 2,
    description:
      "A landmark novel of magical realism chronicling seven generations of a family.",
    language: "English",
  },
  {
    title: "The Alchemist",
    isbn: "9780061122415",
    authorName: "Paulo Coelho",
    categoryName: "Philosophy",
    publisherName: "HarperOne",
    publishedYear: 1988,
    totalCopies: 5,
    description:
      "A philosophical novel about a shepherd's journey to find his personal legend.",
    language: "English",
  },
  {
    title: "Fahrenheit 451",
    isbn: "9781451673319",
    authorName: "Ray Bradbury",
    categoryName: "Dystopian Fiction",
    publisherName: "Simon & Schuster",
    publishedYear: 1953,
    totalCopies: 3,
    description:
      "A dystopian novel about a future society where books are banned and burned.",
    language: "English",
  },
  {
    title: "The Kite Runner",
    isbn: "9781594631931",
    authorName: "Khaled Hosseini",
    categoryName: "Contemporary Fiction",
    publisherName: "Riverhead Books",
    publishedYear: 2003,
    totalCopies: 4,
    description:
      "A powerful story of friendship, redemption, and the devastating cost of war.",
    language: "English",
  },
  {
    title: "Life of Pi",
    isbn: "9780156027328",
    authorName: "Yann Martel",
    categoryName: "Adventure",
    publisherName: "Harcourt",
    publishedYear: 2001,
    totalCopies: 3,
    description:
      "A philosophical adventure novel about a boy stranded on a lifeboat with a tiger.",
    language: "English",
  },
  {
    title: "The Book Thief",
    isbn: "9780375842207",
    authorName: "Markus Zusak",
    categoryName: "Historical Fiction",
    publisherName: "Knopf Books",
    publishedYear: 2005,
    totalCopies: 4,
    description:
      "A touching story narrated by Death about a girl living in Nazi Germany.",
    language: "English",
  },
  {
    title: "Slaughterhouse-Five",
    isbn: "9780440180296",
    authorName: "Kurt Vonnegut",
    categoryName: "Dark Comedy",
    publisherName: "Dell",
    publishedYear: 1969,
    totalCopies: 2,
    description:
      "A darkly comic anti-war novel about Billy Pilgrim's experiences in WWII.",
    language: "English",
  },
  {
    title: "The Handmaid's Tale",
    isbn: "9780385490818",
    authorName: "Margaret Atwood",
    categoryName: "Dystopian Fiction",
    publisherName: "Anchor Books",
    publishedYear: 1985,
    totalCopies: 3,
    description:
      "A dystopian novel about women's rights in a totalitarian theocracy.",
    language: "English",
  },
];

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

async function findOrCreateAuthor(name: string): Promise<any> {
  try {
    let author = await Author.findOne({ name });

    if (!author) {
      console.log(`📝 Creating new author: ${name}`);
      author = new Author({
        name,
        biography: `Biography for ${name}`,
        nationality: "Unknown",
        birthDate: new Date(1900, 0, 1), // Default birth date
        metadata: {
          addedBy: new mongoose.Types.ObjectId(), // Default admin ID
          lastModifiedBy: new mongoose.Types.ObjectId(),
          addedAt: new Date(),
          lastModifiedAt: new Date(),
        },
      });
      await author.save();
    }

    return author._id;
  } catch (error) {
    console.error(`❌ Error creating author ${name}:`, error);
    throw error;
  }
}

async function findOrCreateCategory(name: string): Promise<any> {
  try {
    let category = await Category.findOne({ name });

    if (!category) {
      console.log(`📚 Creating new category: ${name}`);
      category = new Category({
        name,
        description: `Books in the ${name} category`,
        metadata: {
          addedBy: new mongoose.Types.ObjectId(), // Default admin ID
          lastModifiedBy: new mongoose.Types.ObjectId(),
          addedAt: new Date(),
          lastModifiedAt: new Date(),
        },
      });
      await category.save();
    }

    return category._id;
  } catch (error) {
    console.error(`❌ Error creating category ${name}:`, error);
    throw error;
  }
}

async function findOrCreatePublisher(name: string): Promise<any> {
  try {
    let publisher = await Publisher.findOne({ name });

    if (!publisher) {
      console.log(`🏢 Creating new publisher: ${name}`);
      publisher = new Publisher({
        name,
        address: "Unknown Address",
        contactInfo: {
          email: `contact@${name.toLowerCase().replace(/\s+/g, "")}.com`,
          phone: "Unknown",
        },
        metadata: {
          addedBy: new mongoose.Types.ObjectId(), // Default admin ID
          lastModifiedBy: new mongoose.Types.ObjectId(),
          addedAt: new Date(),
          lastModifiedAt: new Date(),
        },
      });
      await publisher.save();
    }

    return publisher._id;
  } catch (error) {
    console.error(`❌ Error creating publisher ${name}:`, error);
    throw error;
  }
}

async function addSampleBooks() {
  try {
    console.log("📚 Adding sample books to the database...");

    let addedCount = 0;

    for (const bookData of sampleBooks) {
      try {
        // Check if book already exists
        const existingBook = await Book.findOne({ isbn: bookData.isbn });
        if (existingBook) {
          console.log(`⏭️  Skipping existing book: ${bookData.title}`);
          continue;
        }

        console.log(`\n📖 Processing: ${bookData.title}`);

        // Create or find references
        const authorId = await findOrCreateAuthor(bookData.authorName);
        const categoryId = await findOrCreateCategory(bookData.categoryName);
        const publisherId = await findOrCreatePublisher(bookData.publisherName);

        // Create the book
        const book = new Book({
          bookId: `BK-${bookData.isbn.slice(-6)}`, // Generate bookId from last 6 digits of ISBN
          title: bookData.title,
          isbn: bookData.isbn,
          authors: [authorId], // Array of ObjectIds
          categories: [categoryId], // Array of ObjectIds
          publisher: publisherId, // Single ObjectId
          publishedYear: bookData.publishedYear,
          totalCopies: bookData.totalCopies,
          availableCopies: bookData.totalCopies,
          description: bookData.description,
          language: bookData.language,
          format: "physical",
          location: {
            shelf: `S-${Math.floor(Math.random() * 100) + 1}`, // Random shelf number
            section: bookData.categoryName.charAt(0), // First letter of category
            floor: "Ground Floor",
          },
          acquisitionInfo: {
            acquisitionDate: new Date(),
            source: "purchase",
            cost: Math.floor(Math.random() * 50) + 10, // Random price between $10-60
          },
          condition: "excellent",
          tags: [bookData.categoryName.toLowerCase()],
          rating: {
            average: 4 + Math.random(), // Random rating between 4-5
            count: Math.floor(Math.random() * 50) + 10, // Random count 10-60
          },
          statistics: {
            views: Math.floor(Math.random() * 1000),
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20),
            shares: Math.floor(Math.random() * 10),
            borrows: Math.floor(Math.random() * 30),
          },
          isActive: true,
          isFeatured: Math.random() > 0.7, // 30% chance of being featured
          isRestricted: false,
          maxBorrowDays: 14,
          renewalLimit: 2,
          reservationLimit: 5,
          metadata: {
            addedBy: new mongoose.Types.ObjectId(), // Default admin ID
            lastModifiedBy: new mongoose.Types.ObjectId(),
            lastModifiedAt: new Date(),
          },
        });

        await book.save();
        addedCount++;
        console.log(`✅ Added: ${bookData.title}`);
      } catch (error) {
        console.error(`❌ Failed to add book ${bookData.title}:`, error);
        // Continue with next book
      }
    }

    console.log(`\n🎉 Successfully added ${addedCount} books to the database!`);
  } catch (error) {
    console.error("❌ Failed to add sample books:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Starting Sample Books Addition");
    console.log("================================");
    console.log(
      "This will add 20 sample books with proper ObjectId references.\n"
    );

    await connectDB();
    await addSampleBooks();

    console.log("\n🎉 Sample books addition completed successfully!");
    console.log("The admin site now has sample data to work with.");
  } catch (error) {
    console.error("💥 Sample books addition failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { main as addSampleBooks };
