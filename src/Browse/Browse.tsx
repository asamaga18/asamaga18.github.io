import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Browse.css';

interface FoodItem {
  id: number;
  name: string;
  location: string;
  quantity: string;
  price: string;
  description: string;
  image: string;
}

const Browse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - replace with actual data from your backend
  const foodItems: FoodItem[] = [
    {
      id: 1,
      name: "Fresh Vegetables",
      location: "College Park",
      quantity: "5 lbs",
      price: "Free",
      description: "Assorted fresh vegetables from local garden",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 2,
      name: "Canned Goods",
      location: "Baltimore",
      quantity: "10 cans",
      price: "$5",
      description: "Various canned goods including soup and beans",
      image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    // Add more mock items as needed
  ];

  const categories = ['all', 'vegetables', 'fruits', 'canned', 'dairy', 'grains'];

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.name.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Browse Available Food</h1>
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="food-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="food-card">
            <img src={item.image} alt={item.name} className="food-image" />
            <div className="food-info">
              <h3>{item.name}</h3>
              <p className="location">📍 {item.location}</p>
              <p className="quantity">Quantity: {item.quantity}</p>
              <p className="price">Price: {item.price}</p>
              <p className="description">{item.description}</p>
              <Link to={`/item/${item.id}`} className="view-details-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Browse;