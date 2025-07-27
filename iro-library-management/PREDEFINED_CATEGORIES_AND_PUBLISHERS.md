# Predefined Categories and Publishers System

## Overview

I've implemented a comprehensive system for predefined categories and publishers that can be used when adding or updating books. This system includes:

- **Category Management**: Predefined book categories with descriptions and slugs
- **Publisher Management**: Predefined publishers with contact information and details
- **Form Integration**: Easy-to-use dropdowns and selections for book forms

## Backend Implementation

### Models Created

1. **Category Model** (`src/models/Category.ts`)

   - Fields: name, description, slug, isActive, metadata
   - Auto-generates slugs from category names
   - Includes virtual field for books count
   - Proper indexing for performance

2. **Publisher Model** (`src/models/Publisher.ts`)
   - Fields: name, description, website, email, phone, address, establishedYear, logo, isActive, metadata
   - Includes virtual field for books count
   - Email and website validation
   - Proper indexing for performance

### Controllers Created

1. **Category Controller** (`src/controllers/category.controller.ts`)

   - `getAllCategories`: Paginated list with search and filtering
   - `getCategory`: Get single category by ID
   - `createCategory`: Create new category (admin only)
   - `updateCategory`: Update existing category (admin only)
   - `deleteCategory`: Soft delete category (admin only)
   - `getActiveCategories`: Get all active categories for dropdowns

2. **Publisher Controller** (`src/controllers/publisher.controller.ts`)
   - `getAllPublishers`: Paginated list with search and filtering
   - `getPublisher`: Get single publisher by ID
   - `createPublisher`: Create new publisher (admin only)
   - `updatePublisher`: Update existing publisher (admin only)
   - `deletePublisher`: Soft delete publisher (admin only)
   - `getActivePublishers`: Get all active publishers for dropdowns

### API Endpoints

#### Categories

- `GET /api/categories` - Get all categories (paginated)
- `GET /api/categories/active` - Get active categories for dropdowns
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PATCH /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

#### Publishers

- `GET /api/publishers` - Get all publishers (paginated)
- `GET /api/publishers/active` - Get active publishers for dropdowns
- `GET /api/publishers/:id` - Get single publisher
- `POST /api/publishers` - Create publisher (admin only)
- `PATCH /api/publishers/:id` - Update publisher (admin only)
- `DELETE /api/publishers/:id` - Delete publisher (admin only)

#### Book Form Data

- `GET /api/books/form-data` - Get both categories and publishers for form dropdowns

## Sample Data

### Pre-seeded Categories (12 total)

- Fiction
- Non-Fiction
- Science Fiction
- Fantasy
- Mystery
- Romance
- Thriller
- Biography
- History
- Psychology
- Business
- Technology

### Pre-seeded Publishers (10 total)

- Penguin Random House
- HarperCollins Publishers
- Macmillan Publishers
- Simon & Schuster
- Hachette Book Group
- Scholastic Corporation
- Oxford University Press
- Cambridge University Press
- Bloomsbury Publishing
- McGraw-Hill Education

## Usage Examples

### 1. Get Form Data for Book Creation/Update

```javascript
// Frontend API call
const getFormData = async () => {
  const response = await fetch("http://localhost:5000/api/books/form-data");
  const data = await response.json();

  // data.data.categories - array of active categories
  // data.data.publishers - array of active publishers
  return data;
};
```

### 2. Category Selection in Forms

```jsx
// React component example
const CategorySelector = ({ selectedCategories, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:5000/api/books/form-data")
      .then((res) => res.json())
      .then((data) => setCategories(data.data.categories));
  }, []);

  return (
    <div className="categories-grid">
      {categories.map((category) => (
        <div key={category._id} className="category-item">
          <label>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.name)}
              onChange={(e) =>
                onCategoryChange(category.name, e.target.checked)
              }
            />
            <span>{category.name}</span>
            <small>{category.description}</small>
          </label>
        </div>
      ))}
    </div>
  );
};
```

### 3. Publisher Dropdown

```jsx
// React component example
const PublisherSelect = ({ selectedPublisher, onPublisherChange }) => {
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/books/form-data")
      .then((res) => res.json())
      .then((data) => setPublishers(data.data.publishers));
  }, []);

  return (
    <select
      value={selectedPublisher}
      onChange={(e) => onPublisherChange(e.target.value)}
    >
      <option value="">-- Select Publisher --</option>
      {publishers.map((publisher) => (
        <option key={publisher._id} value={publisher.name}>
          {publisher.name}
        </option>
      ))}
    </select>
  );
};
```

## Admin Management

### Adding New Categories

```javascript
const addCategory = async (categoryData) => {
  const response = await fetch("http://localhost:5000/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      name: "New Category",
      description: "Description of the new category",
    }),
  });
  return response.json();
};
```

### Adding New Publishers

```javascript
const addPublisher = async (publisherData) => {
  const response = await fetch("http://localhost:5000/api/publishers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      name: "New Publisher",
      description: "Publisher description",
      website: "https://publisher.com",
      email: "info@publisher.com",
      address: {
        city: "City",
        country: "Country",
      },
    }),
  });
  return response.json();
};
```

## Integration with Book Forms

When creating or updating books, you can now:

1. **Select from predefined categories** instead of typing them manually
2. **Choose from a list of established publishers** with proper validation
3. **Ensure data consistency** across your library system
4. **Reduce data entry errors** and typos
5. **Maintain standardized categorization**

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── Category.ts
│   │   └── Publisher.ts
│   ├── controllers/
│   │   ├── category.controller.ts
│   │   └── publisher.controller.ts
│   ├── routes/
│   │   ├── category.routes.ts
│   │   └── publisher.routes.ts
│   ├── validators/
│   │   ├── category.validator.ts
│   │   └── publisher.validator.ts
│   └── middleware/
│       └── adminAuth.ts
├── scripts/
│   └── seedCategoriesAndPublishers.js
└── example-components/
    ├── BookForm.tsx (React example)
    └── BookForm.css
```

## Next Steps

1. **Frontend Integration**: Use the provided React component example to integrate with your admin site
2. **Admin Interface**: Create admin pages to manage categories and publishers
3. **Book Form Updates**: Update your existing book forms to use the dropdowns
4. **Data Migration**: If you have existing books, you may want to migrate their categories to match the predefined ones

## Testing

The system is ready to use! The backend server should be running and you can test the endpoints:

- `GET http://localhost:5000/api/books/form-data` - Get categories and publishers
- `GET http://localhost:5000/api/categories/active` - Get active categories
- `GET http://localhost:5000/api/publishers/active` - Get active publishers

All endpoints are working and returning the seeded data.
