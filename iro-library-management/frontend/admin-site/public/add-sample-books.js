// Simple script to add sample books through the API
// Run this in the browser console after logging in to the admin site

const sampleBooks = [
  {
    title: "Introduction to Islamic Philosophy",
    subtitle: "A Comprehensive Guide", 
    authors: ["Dr. Ahmad Hassan", "Prof. Fatima Al-Zahra"],
    isbn: "978-1234567890",
    description: "A comprehensive introduction to Islamic philosophy covering major themes and thinkers throughout history.",
    categories: ["Philosophy", "Islamic Studies", "Religion"],
    tags: ["philosophy", "islam", "theology", "history"],
    format: "physical",
    totalCopies: 5,
    location: {
      shelf: "A1",
      section: "Philosophy",
    },
    coverImage: "https://via.placeholder.com/300x400/4F46E5/white?text=Islamic+Philosophy",
    isFeatured: true
  },
  {
    title: "Quran and Modern Science",
    authors: ["Dr. Muhammad Ali"],
    isbn: "978-1234567891",
    description: "Exploring the relationship between Quranic teachings and modern scientific discoveries.",
    categories: ["Science", "Islamic Studies", "Religion"],
    tags: ["quran", "science", "modern", "research"],
    format: "both",
    totalCopies: 8,
    location: {
      shelf: "B2",
      section: "Science",
    },
    coverImage: "https://via.placeholder.com/300x400/059669/white?text=Quran+Science",
    isFeatured: true
  },
  {
    title: "History of Islamic Civilization",
    authors: ["Prof. Omar Ibn Khaldun", "Dr. Aisha Rahman"],
    isbn: "978-1234567892",
    description: "A detailed account of Islamic civilization from its origins to the modern era.",
    categories: ["History", "Islamic Studies"],
    tags: ["history", "civilization", "islam", "culture"],
    format: "physical",
    totalCopies: 3,
    location: {
      shelf: "C3",
      section: "History",
    },
    coverImage: "https://via.placeholder.com/300x400/DC2626/white?text=Islamic+History",
    isFeatured: false
  },
  {
    title: "Arabic Grammar Fundamentals",
    authors: ["Sheikh Abdullah Al-Nahwi"],
    isbn: "978-1234567893",
    description: "Essential Arabic grammar rules and exercises for beginners and intermediate learners.",
    categories: ["Language", "Arabic", "Education"],
    tags: ["arabic", "grammar", "language", "learning"],
    format: "both",
    totalCopies: 10,
    location: {
      shelf: "D1",
      section: "Languages",
    },
    coverImage: "https://via.placeholder.com/300x400/7C2D12/white?text=Arabic+Grammar",
    isFeatured: false
  },
  {
    title: "Islamic Art and Architecture", 
    authors: ["Dr. Layla Al-Fann", "Prof. Yusuf Mu'mar"],
    isbn: "978-1234567894",
    description: "A visual journey through Islamic art and architectural marvels across different periods and regions.",
    categories: ["Art", "Architecture", "Islamic Studies"],
    tags: ["art", "architecture", "islamic", "visual", "heritage"],
    format: "physical",
    totalCopies: 4,
    location: {
      shelf: "E2",
      section: "Arts",
    },
    coverImage: "https://via.placeholder.com/300x400/7C3AED/white?text=Islamic+Art",
    isFeatured: true
  }
];

async function addSampleBooks() {
  const token = localStorage.getItem('admin-token');
  if (!token) {
    console.error('Please login first');
    return;
  }

  console.log('Adding sample books...');
  
  for (let i = 0; i < sampleBooks.length; i++) {
    const book = sampleBooks[i];
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(book)
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        console.log(`✅ Added: ${book.title}`);
      } else {
        console.error(`❌ Failed to add ${book.title}:`, result);
      }
    } catch (error) {
      console.error(`❌ Error adding ${book.title}:`, error);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('✅ Finished adding sample books!');
  console.log('Refresh the books page to see the new books.');
}

// Run the function
console.log('📚 Sample Books Data Script Loaded');
console.log('Run addSampleBooks() to add sample data');

// Uncomment the line below to run automatically
// addSampleBooks();
