import React, { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
}

interface Publisher {
  _id: string;
  name: string;
  description: string;
  website?: string;
}

interface FormData {
  categories: Category[];
  publishers: Publisher[];
}

interface BookFormData {
  title: string;
  authors: string[];
  categories: string[];
  publisher: string;
  isbn: string;
  publishedDate: string;
  language: string;
  pages: number;
  description: string;
  totalCopies: number;
  availableCopies: number;
  format: "physical" | "digital" | "both";
  location: {
    shelf: string;
    section: string;
    floor: string;
  };
}

const BookForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    categories: [],
    publishers: [],
  });
  const [bookData, setBookData] = useState<BookFormData>({
    title: "",
    authors: [""],
    categories: [],
    publisher: "",
    isbn: "",
    publishedDate: "",
    language: "English",
    pages: 0,
    description: "",
    totalCopies: 1,
    availableCopies: 1,
    format: "physical",
    location: {
      shelf: "",
      section: "",
      floor: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and publishers on component mount
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/books/form-data"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch form data");
        }
        const data = await response.json();
        setFormData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested object properties (e.g., location.shelf)
      const [parent, child] = name.split(".");
      setBookData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setBookData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle array changes (authors)
  const handleAuthorChange = (index: number, value: string) => {
    setBookData((prev) => ({
      ...prev,
      authors: prev.authors.map((author, i) => (i === index ? value : author)),
    }));
  };

  const addAuthor = () => {
    setBookData((prev) => ({
      ...prev,
      authors: [...prev.authors, ""],
    }));
  };

  const removeAuthor = (index: number) => {
    setBookData((prev) => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index),
    }));
  };

  // Handle category selection (multiple)
  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    setBookData((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryName]
        : prev.categories.filter((cat) => cat !== categoryName),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would typically send the data to your API
    console.log("Book data to submit:", bookData);

    // Example API call (you'll need to implement the actual endpoint)
    try {
      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        alert("Book added successfully!");
        // Reset form or redirect
      } else {
        alert("Failed to add book");
      }
    } catch (err) {
      console.error("Error submitting book:", err);
      alert("Error submitting book");
    }
  };

  if (loading) return <div className="loading">Loading form data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="book-form-container">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit} className="book-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={bookData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Authors *</label>
            {bookData.authors.map((author, index) => (
              <div key={index} className="author-input">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => handleAuthorChange(index, e.target.value)}
                  placeholder="Author name"
                  required
                />
                {bookData.authors.length > 1 && (
                  <button type="button" onClick={() => removeAuthor(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addAuthor}>
              Add Author
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={bookData.isbn}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <input
              type="text"
              id="language"
              name="language"
              value={bookData.language}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pages">Pages</label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={bookData.pages}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="publishedDate">Published Date</label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={bookData.publishedDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="form-section">
          <h3>Categories *</h3>
          <div className="categories-grid">
            {formData.categories.map((category) => (
              <div key={category._id} className="category-item">
                <label>
                  <input
                    type="checkbox"
                    checked={bookData.categories.includes(category.name)}
                    onChange={(e) =>
                      handleCategoryChange(category.name, e.target.checked)
                    }
                  />
                  <span className="category-name">{category.name}</span>
                  <span className="category-description">
                    {category.description}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Publisher */}
        <div className="form-section">
          <h3>Publisher</h3>
          <div className="form-group">
            <label htmlFor="publisher">Select Publisher</label>
            <select
              id="publisher"
              name="publisher"
              value={bookData.publisher}
              onChange={handleInputChange}
            >
              <option value="">-- Select Publisher --</option>
              {formData.publishers.map((publisher) => (
                <option key={publisher._id} value={publisher.name}>
                  {publisher.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="form-section">
          <h3>Description</h3>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={bookData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </div>

        {/* Physical Information */}
        <div className="form-section">
          <h3>Physical Information</h3>

          <div className="form-group">
            <label htmlFor="format">Format *</label>
            <select
              id="format"
              name="format"
              value={bookData.format}
              onChange={handleInputChange}
              required
            >
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="totalCopies">Total Copies *</label>
            <input
              type="number"
              id="totalCopies"
              name="totalCopies"
              value={bookData.totalCopies}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="availableCopies">Available Copies *</label>
            <input
              type="number"
              id="availableCopies"
              name="availableCopies"
              value={bookData.availableCopies}
              onChange={handleInputChange}
              min="0"
              max={bookData.totalCopies}
              required
            />
          </div>

          {(bookData.format === "physical" || bookData.format === "both") && (
            <>
              <div className="form-group">
                <label htmlFor="location.shelf">Shelf *</label>
                <input
                  type="text"
                  id="location.shelf"
                  name="location.shelf"
                  value={bookData.location.shelf}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location.section">Section *</label>
                <input
                  type="text"
                  id="location.section"
                  name="location.section"
                  value={bookData.location.section}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location.floor">Floor</label>
                <input
                  type="text"
                  id="location.floor"
                  name="location.floor"
                  value={bookData.location.floor}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => console.log("Cancel")}>
            Cancel
          </button>
          <button type="submit">Add Book</button>
        </div>
      </form>

      {/* Display selected data for debugging */}
      <div
        className="debug-info"
        style={{ marginTop: "2rem", padding: "1rem", background: "#f5f5f5" }}
      >
        <h4>Form Data (Debug)</h4>
        <pre>{JSON.stringify(bookData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default BookForm;
