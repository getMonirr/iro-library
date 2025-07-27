const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/iro-library")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    slug: String,
    isActive: { type: Boolean, default: true },
    metadata: {
      addedBy: mongoose.Schema.Types.ObjectId,
      lastModifiedBy: mongoose.Schema.Types.ObjectId,
      addedAt: { type: Date, default: Date.now },
      lastModifiedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

// Publisher Schema
const publisherSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    website: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    establishedYear: Number,
    logo: String,
    isActive: { type: Boolean, default: true },
    metadata: {
      addedBy: mongoose.Schema.Types.ObjectId,
      lastModifiedBy: mongoose.Schema.Types.ObjectId,
      addedAt: { type: Date, default: Date.now },
      lastModifiedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
const Publisher = mongoose.model("Publisher", publisherSchema);

// Sample categories
const sampleCategories = [
  {
    name: "Fiction",
    description:
      "Fictional literature including novels, short stories, and novellas",
    slug: "fiction",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Non-Fiction",
    description:
      "Factual books including biographies, history, science, and self-help",
    slug: "non-fiction",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Science Fiction",
    description:
      "Speculative fiction dealing with futuristic concepts and technology",
    slug: "science-fiction",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Fantasy",
    description: "Literature featuring magical or supernatural elements",
    slug: "fantasy",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Mystery",
    description: "Stories involving puzzles, crimes, or unexplained events",
    slug: "mystery",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Romance",
    description: "Love stories and romantic fiction",
    slug: "romance",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Thriller",
    description: "Suspenseful stories designed to keep readers on edge",
    slug: "thriller",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Biography",
    description: "Life stories of real people",
    slug: "biography",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "History",
    description: "Books about historical events, periods, and figures",
    slug: "history",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Psychology",
    description:
      "Books about human behavior, mental processes, and psychological theories",
    slug: "psychology",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Business",
    description:
      "Books about entrepreneurship, management, and business strategies",
    slug: "business",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Technology",
    description:
      "Books about computers, programming, and technological innovations",
    slug: "technology",
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
];

// Sample publishers
const samplePublishers = [
  {
    name: "Penguin Random House",
    description: "The world's largest trade book publisher",
    website: "https://www.penguinrandomhouse.com",
    email: "info@penguinrandomhouse.com",
    address: {
      city: "New York",
      state: "NY",
      country: "United States",
    },
    establishedYear: 2013,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "HarperCollins Publishers",
    description: "One of the largest English-language publishers",
    website: "https://www.harpercollins.com",
    email: "info@harpercollins.com",
    address: {
      city: "New York",
      state: "NY",
      country: "United States",
    },
    establishedYear: 1989,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Macmillan Publishers",
    description: "British publishing company",
    website: "https://www.macmillan.com",
    email: "info@macmillan.com",
    address: {
      city: "London",
      country: "United Kingdom",
    },
    establishedYear: 1843,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Simon & Schuster",
    description: "American publishing house",
    website: "https://www.simonandschuster.com",
    email: "info@simonandschuster.com",
    address: {
      city: "New York",
      state: "NY",
      country: "United States",
    },
    establishedYear: 1924,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Hachette Book Group",
    description: "Publishing company and division of Hachette Livre",
    website: "https://www.hachettebookgroup.com",
    email: "info@hachettebookgroup.com",
    address: {
      city: "New York",
      state: "NY",
      country: "United States",
    },
    establishedYear: 2006,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Scholastic Corporation",
    description: "American multinational publishing and education company",
    website: "https://www.scholastic.com",
    email: "info@scholastic.com",
    address: {
      city: "New York",
      state: "NY",
      country: "United States",
    },
    establishedYear: 1920,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Oxford University Press",
    description: "University press and department of the University of Oxford",
    website: "https://global.oup.com",
    email: "info@oup.com",
    address: {
      city: "Oxford",
      country: "United Kingdom",
    },
    establishedYear: 1586,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Cambridge University Press",
    description: "Publishing business of the University of Cambridge",
    website: "https://www.cambridge.org",
    email: "info@cambridge.org",
    address: {
      city: "Cambridge",
      country: "United Kingdom",
    },
    establishedYear: 1534,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "Bloomsbury Publishing",
    description: "British worldwide publishing house",
    website: "https://www.bloomsbury.com",
    email: "info@bloomsbury.com",
    address: {
      city: "London",
      country: "United Kingdom",
    },
    establishedYear: 1986,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
  {
    name: "McGraw-Hill Education",
    description: "American learning science company",
    website: "https://www.mheducation.com",
    email: "info@mheducation.com",
    address: {
      city: "New York",
      state: "NY",
      country: "United States",
    },
    establishedYear: 1888,
    isActive: true,
    metadata: {
      addedBy: new mongoose.Types.ObjectId(),
      lastModifiedBy: new mongoose.Types.ObjectId(),
    },
  },
];

async function seedCategoriesAndPublishers() {
  try {
    // Clear existing data
    console.log("Clearing existing categories and publishers...");
    await Category.deleteMany({});
    await Publisher.deleteMany({});

    // Insert categories
    console.log("Inserting sample categories...");
    const insertedCategories = await Category.insertMany(sampleCategories);

    // Insert publishers
    console.log("Inserting sample publishers...");
    const insertedPublishers = await Publisher.insertMany(samplePublishers);

    console.log(
      `Successfully inserted ${insertedCategories.length} categories!`
    );
    console.log(
      `Successfully inserted ${insertedPublishers.length} publishers!`
    );

    // Display summary
    const totalCategories = await Category.countDocuments({});
    const activeCategories = await Category.countDocuments({ isActive: true });
    const totalPublishers = await Publisher.countDocuments({});
    const activePublishers = await Publisher.countDocuments({ isActive: true });

    console.log("\n--- DATABASE SUMMARY ---");
    console.log(`Total categories: ${totalCategories}`);
    console.log(`Active categories: ${activeCategories}`);
    console.log(`Total publishers: ${totalPublishers}`);
    console.log(`Active publishers: ${activePublishers}`);
    console.log("------------------------\n");
  } catch (error) {
    console.error("Error seeding categories and publishers:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedCategoriesAndPublishers();
