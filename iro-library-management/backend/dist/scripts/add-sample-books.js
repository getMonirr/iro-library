"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSampleBooks = main;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const Author_1 = __importDefault(require("../models/Author"));
const Book_1 = __importDefault(require("../models/Book"));
const Category_1 = __importDefault(require("../models/Category"));
const Publisher_1 = __importDefault(require("../models/Publisher"));
dotenv_1.default.config();
const sampleBooks = [
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        isbn: "9780547928210",
        authorName: "J.R.R. Tolkien",
        categoryName: "Fantasy",
        publisherName: "Houghton Mifflin Harcourt",
        publishedYear: 1954,
        totalCopies: 5,
        description: "The first volume of the epic fantasy trilogy following Frodo's journey to destroy the One Ring.",
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
        description: "A gripping tale of racial injustice and childhood innocence in the American South.",
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
        description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
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
        description: "A romantic novel about manners, upbringing, morality, and marriage in Georgian England.",
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
        description: "A critique of the American Dream set in the Jazz Age of the 1920s.",
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
        description: "An epic science fiction novel set on the desert planet Arrakis.",
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
        description: "A controversial novel about teenage rebellion and alienation.",
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
        description: "The first book in the Harry Potter series about a young wizard's adventures.",
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
        description: "A fantasy adventure novel about Bilbo Baggins' unexpected journey.",
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
        description: "A dystopian novel about a technologically advanced future society.",
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
        description: "A fantasy novel about children who discover a magical world through a wardrobe.",
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
        description: "An allegorical novella about farm animals who rebel against their human farmer.",
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
        description: "A landmark novel of magical realism chronicling seven generations of a family.",
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
        description: "A philosophical novel about a shepherd's journey to find his personal legend.",
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
        description: "A dystopian novel about a future society where books are banned and burned.",
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
        description: "A powerful story of friendship, redemption, and the devastating cost of war.",
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
        description: "A philosophical adventure novel about a boy stranded on a lifeboat with a tiger.",
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
        description: "A touching story narrated by Death about a girl living in Nazi Germany.",
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
        description: "A darkly comic anti-war novel about Billy Pilgrim's experiences in WWII.",
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
        description: "A dystopian novel about women's rights in a totalitarian theocracy.",
        language: "English",
    },
];
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
async function findOrCreateAuthor(name) {
    try {
        let author = await Author_1.default.findOne({ name });
        if (!author) {
            console.log(`📝 Creating new author: ${name}`);
            author = new Author_1.default({
                name,
                biography: `Biography for ${name}`,
                nationality: "Unknown",
                birthDate: new Date(1900, 0, 1),
                metadata: {
                    addedBy: new mongoose_1.default.Types.ObjectId(),
                    lastModifiedBy: new mongoose_1.default.Types.ObjectId(),
                    addedAt: new Date(),
                    lastModifiedAt: new Date(),
                },
            });
            await author.save();
        }
        return author._id;
    }
    catch (error) {
        console.error(`❌ Error creating author ${name}:`, error);
        throw error;
    }
}
async function findOrCreateCategory(name) {
    try {
        let category = await Category_1.default.findOne({ name });
        if (!category) {
            console.log(`📚 Creating new category: ${name}`);
            category = new Category_1.default({
                name,
                description: `Books in the ${name} category`,
                metadata: {
                    addedBy: new mongoose_1.default.Types.ObjectId(),
                    lastModifiedBy: new mongoose_1.default.Types.ObjectId(),
                    addedAt: new Date(),
                    lastModifiedAt: new Date(),
                },
            });
            await category.save();
        }
        return category._id;
    }
    catch (error) {
        console.error(`❌ Error creating category ${name}:`, error);
        throw error;
    }
}
async function findOrCreatePublisher(name) {
    try {
        let publisher = await Publisher_1.default.findOne({ name });
        if (!publisher) {
            console.log(`🏢 Creating new publisher: ${name}`);
            publisher = new Publisher_1.default({
                name,
                address: "Unknown Address",
                contactInfo: {
                    email: `contact@${name.toLowerCase().replace(/\s+/g, "")}.com`,
                    phone: "Unknown",
                },
                metadata: {
                    addedBy: new mongoose_1.default.Types.ObjectId(),
                    lastModifiedBy: new mongoose_1.default.Types.ObjectId(),
                    addedAt: new Date(),
                    lastModifiedAt: new Date(),
                },
            });
            await publisher.save();
        }
        return publisher._id;
    }
    catch (error) {
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
                const existingBook = await Book_1.default.findOne({ isbn: bookData.isbn });
                if (existingBook) {
                    console.log(`⏭️  Skipping existing book: ${bookData.title}`);
                    continue;
                }
                console.log(`\n📖 Processing: ${bookData.title}`);
                const authorId = await findOrCreateAuthor(bookData.authorName);
                const categoryId = await findOrCreateCategory(bookData.categoryName);
                const publisherId = await findOrCreatePublisher(bookData.publisherName);
                const book = new Book_1.default({
                    bookId: `BK-${bookData.isbn.slice(-6)}`,
                    title: bookData.title,
                    isbn: bookData.isbn,
                    authors: [authorId],
                    categories: [categoryId],
                    publisher: publisherId,
                    publishedYear: bookData.publishedYear,
                    totalCopies: bookData.totalCopies,
                    availableCopies: bookData.totalCopies,
                    description: bookData.description,
                    language: bookData.language,
                    format: "physical",
                    location: {
                        shelf: `S-${Math.floor(Math.random() * 100) + 1}`,
                        section: bookData.categoryName.charAt(0),
                        floor: "Ground Floor",
                    },
                    acquisitionInfo: {
                        acquisitionDate: new Date(),
                        source: "purchase",
                        cost: Math.floor(Math.random() * 50) + 10,
                    },
                    condition: "excellent",
                    tags: [bookData.categoryName.toLowerCase()],
                    rating: {
                        average: 4 + Math.random(),
                        count: Math.floor(Math.random() * 50) + 10,
                    },
                    statistics: {
                        views: Math.floor(Math.random() * 1000),
                        likes: Math.floor(Math.random() * 100),
                        comments: Math.floor(Math.random() * 20),
                        shares: Math.floor(Math.random() * 10),
                        borrows: Math.floor(Math.random() * 30),
                    },
                    isActive: true,
                    isFeatured: Math.random() > 0.7,
                    isRestricted: false,
                    maxBorrowDays: 14,
                    renewalLimit: 2,
                    reservationLimit: 5,
                    metadata: {
                        addedBy: new mongoose_1.default.Types.ObjectId(),
                        lastModifiedBy: new mongoose_1.default.Types.ObjectId(),
                        lastModifiedAt: new Date(),
                    },
                });
                await book.save();
                addedCount++;
                console.log(`✅ Added: ${bookData.title}`);
            }
            catch (error) {
                console.error(`❌ Failed to add book ${bookData.title}:`, error);
            }
        }
        console.log(`\n🎉 Successfully added ${addedCount} books to the database!`);
    }
    catch (error) {
        console.error("❌ Failed to add sample books:", error);
        throw error;
    }
}
async function main() {
    try {
        console.log("🚀 Starting Sample Books Addition");
        console.log("================================");
        console.log("This will add 20 sample books with proper ObjectId references.\n");
        await connectDB();
        await addSampleBooks();
        console.log("\n🎉 Sample books addition completed successfully!");
        console.log("The admin site now has sample data to work with.");
    }
    catch (error) {
        console.error("💥 Sample books addition failed:", error);
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
//# sourceMappingURL=add-sample-books.js.map