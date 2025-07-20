import dotenv from "dotenv";
import mongoose from "mongoose";
import Book from "../models/Book";
import User from "../models/User";

// Load environment variables
dotenv.config();

// Sample books data
const sampleBooks = [
  {
    title: "Introduction to Islamic Philosophy",
    subtitle: "A Comprehensive Guide",
    authors: ["Dr. Ahmad Hassan", "Prof. Fatima Al-Zahra"],
    isbn: "978-1234567890",
    isbn13: "9781234567890",
    publisher: "Islamic Research Publications",
    publishedDate: new Date("2020-01-15"),
    language: "English",
    pages: 456,
    description:
      "A comprehensive introduction to Islamic philosophy covering major themes and thinkers throughout history.",
    categories: ["Islamic Philosophy", "History", "Research & Reference"],
    tags: ["philosophy", "islam", "theology", "history"],
    format: "physical" as const,
    digitalFormats: [],
    totalCopies: 5,
    availableCopies: 5,
    location: {
      shelf: "A1",
      section: "Philosophy",
      floor: "First Floor",
    },
    acquisitionInfo: {
      acquisitionDate: new Date("2020-01-01"),
      source: "purchase" as const,
      cost: 45.99,
      notes: "Initial collection purchase",
    },
    condition: "excellent" as const,
    rating: {
      average: 4.5,
      count: 12,
    },
    statistics: {
      views: 150,
      likes: 23,
      comments: 8,
      shares: 5,
      borrows: 8,
    },
    isActive: true,
    isFeatured: true,
  },
  {
    title: "Quran and Modern Science",
    authors: ["Dr. Muhammad Ali"],
    isbn: "978-1234567891",
    publisher: "Scientific Islamic Press",
    publishedDate: new Date("2019-06-10"),
    language: "English",
    pages: 324,
    description:
      "Exploring the relationship between Quranic teachings and modern scientific discoveries.",
    categories: [
      "Science & Technology",
      "Research & Reference",
      "Contemporary Issues",
    ],
    tags: ["quran", "science", "modern", "research"],
    format: "both" as const,
    digitalFormats: ["pdf", "epub"],
    totalCopies: 8,
    availableCopies: 6,
    location: {
      shelf: "B2",
      section: "Science",
      floor: "First Floor",
    },
    acquisitionInfo: {
      acquisitionDate: new Date("2019-05-15"),
      source: "donation" as const,
      donor: "Dr. Sarah Ahmed",
      notes: "Donated by alumni",
    },
    condition: "good" as const,
    rating: {
      average: 4.7,
      count: 18,
    },
    statistics: {
      views: 230,
      likes: 34,
      comments: 12,
      shares: 8,
      borrows: 15,
    },
    isActive: true,
    isFeatured: true,
  },
  {
    title: "History of Islamic Civilization",
    authors: ["Prof. Omar Ibn Khaldun", "Dr. Aisha Rahman"],
    isbn: "978-1234567892",
    publisher: "Heritage Publications",
    publishedDate: new Date("2021-03-20"),
    language: "English",
    pages: 678,
    description:
      "A detailed account of Islamic civilization from its origins to the modern era.",
    categories: ["History", "Research & Reference", "General Knowledge"],
    tags: ["history", "civilization", "islam", "culture"],
    format: "physical" as const,
    digitalFormats: [],
    totalCopies: 3,
    availableCopies: 2,
    location: {
      shelf: "C3",
      section: "History",
      floor: "Second Floor",
    },
    acquisitionInfo: {
      acquisitionDate: new Date("2021-02-28"),
      source: "purchase" as const,
      cost: 65.0,
      notes: "Latest edition purchase",
    },
    condition: "excellent" as const,
    rating: {
      average: 4.8,
      count: 25,
    },
    statistics: {
      views: 180,
      likes: 42,
      comments: 15,
      shares: 12,
      borrows: 22,
    },
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Arabic Grammar Fundamentals",
    authors: ["Sheikh Abdullah Al-Nahwi"],
    isbn: "978-1234567893",
    publisher: "Language Learning Press",
    publishedDate: new Date("2018-09-05"),
    language: "English",
    pages: 256,
    description:
      "Essential Arabic grammar rules and exercises for beginners and intermediate learners.",
    categories: ["Arabic Language", "Education", "Literature"],
    tags: ["arabic", "grammar", "language", "learning"],
    format: "both" as const,
    digitalFormats: ["pdf"],
    totalCopies: 10,
    availableCopies: 8,
    location: {
      shelf: "D1",
      section: "Languages",
      floor: "First Floor",
    },
    acquisitionInfo: {
      acquisitionDate: new Date("2018-08-20"),
      source: "purchase" as const,
      cost: 32.5,
      notes: "Educational material",
    },
    condition: "good" as const,
    rating: {
      average: 4.2,
      count: 35,
    },
    statistics: {
      views: 420,
      likes: 56,
      comments: 28,
      shares: 15,
      borrows: 45,
    },
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Islamic Art and Architecture",
    authors: ["Dr. Layla Al-Fann", "Prof. Yusuf Mu'mar"],
    isbn: "978-1234567894",
    publisher: "Art Heritage Books",
    publishedDate: new Date("2022-01-10"),
    language: "English",
    pages: 512,
    description:
      "A visual journey through Islamic art and architectural marvels across different periods and regions.",
    categories: ["Islamic Art", "History", "General Knowledge"],
    tags: ["art", "architecture", "islamic", "visual", "heritage"],
    format: "physical" as const,
    digitalFormats: [],
    totalCopies: 4,
    availableCopies: 3,
    location: {
      shelf: "E2",
      section: "Arts",
      floor: "Second Floor",
    },
    acquisitionInfo: {
      acquisitionDate: new Date("2022-01-05"),
      source: "purchase" as const,
      cost: 89.99,
      notes: "Special collection item",
    },
    condition: "excellent" as const,
    rating: {
      average: 4.9,
      count: 14,
    },
    statistics: {
      views: 95,
      likes: 28,
      comments: 6,
      shares: 4,
      borrows: 12,
    },
    isActive: true,
    isFeatured: true,
  },
  {
    title: "Contemporary Islamic Thought",
    authors: ["Dr. Hassan Al-Mu'asir"],
    isbn: "978-1234567895",
    publisher: "Modern Islamic Press",
    publishedDate: new Date("2023-05-15"),
    language: "English",
    pages: 298,
    description:
      "Examining contemporary issues in Islamic thought and their relevance to modern society.",
    categories: [
      "Islamic Philosophy",
      "Contemporary Issues",
      "Research & Reference",
    ],
    tags: ["contemporary", "modern", "thought", "society"],
    format: "digital" as const,
    digitalFormats: ["pdf", "epub", "mobi"],
    totalCopies: 1,
    availableCopies: 1,
    location: {
      shelf: "Digital",
      section: "E-Books",
      floor: "Digital Library",
    },
    acquisitionInfo: {
      acquisitionDate: new Date("2023-05-10"),
      source: "purchase" as const,
      cost: 25.99,
      notes: "Digital only purchase",
    },
    condition: "excellent" as const,
    rating: {
      average: 4.3,
      count: 8,
    },
    statistics: {
      views: 67,
      likes: 15,
      comments: 3,
      shares: 2,
      borrows: 6,
    },
    isActive: true,
    isFeatured: false,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/iro-library";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing books
    await Book.deleteMany({});
    console.log("Cleared existing books");

    // Create a sample admin user if it doesn't exist
    const adminUser = await User.findOne({ email: "admin@iro.com" });
    let adminId;

    if (!adminUser) {
      const newAdmin = await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@iro.com",
        password: "admin123",
        role: "admin",
        isActive: true,
        membershipStatus: "active",
      });
      adminId = newAdmin._id;
      console.log("Created admin user");
    } else {
      adminId = adminUser._id;
      console.log("Using existing admin user");
    }

    // Add metadata to books
    const booksWithMetadata = sampleBooks.map((book) => ({
      ...book,
      metadata: {
        addedBy: adminId,
        lastModifiedBy: adminId,
        addedAt: new Date(),
        lastModifiedAt: new Date(),
      },
    }));

    // Insert sample books
    const createdBooks = await Book.insertMany(booksWithMetadata);
    console.log(`Inserted ${createdBooks.length} books`);

    console.log("Database seeding completed successfully!");

    // Display created books
    createdBooks.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.authors.join(", ")}`);
    });
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

export default seedDatabase;

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
