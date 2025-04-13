
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import './Browse.css';

interface FoodItem {
  _id?: string;
  item_name: string;
  category: string;
  location: string;
  quantity: string;
  price: string;
  description: string;
  image_url?: string;
}

const Browse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['all']);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching from:', `${import.meta.env.VITE_API_BASE}/posts`);
        
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/posts`);
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Received data:', data);
        setFoodItems(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCategoryChange = (selectedOptions: any) => {
    setSelectedCategory(selectedOptions.map((option: any) => option.value));
  };

  const foods = ['all', 'vegetables', 'fruits', 'canned', 'dairy', 'grains', 'requests', 'sales'];
  const categories = ['all', 'requests', 'sales'];

  const filteredItems = foodItems.filter(item => {
    const matchesSearch =
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory.includes('all') ||
      selectedCategory.includes(item.category?.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="browse-container">
        <Sidebar />
        <div className="loading-state">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="browse-container">
        <Sidebar />
        <div className="error-state">
          Error: {error}
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-container">
      <Sidebar />
      <div className="browse-header">
        <div className="browse-nav">
          <h1>Browse Available Food</h1>
        </div>
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="category-filters">
            <Select
              className="label-dropdown1"
              isMulti
              options={categories.map(category => ({
                value: category,
                label: category.charAt(0).toUpperCase() + category.slice(1)
              }))}
              placeholder="Post Type"
              onChange={handleCategoryChange}
            />
            <Select
              className="label-dropdown2"
              isMulti
              options={foods.map(food => ({
                value: food,
                label: food.charAt(0).toUpperCase() + food.slice(1)
              }))}
              placeholder="Food Type"
              onChange={handleCategoryChange}
            />
          </div>
        </div>
      </div>

      <div className="food-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items">No items found</div>
        ) : (
          filteredItems.map((item, index) => (
            <div key={item._id || index} className="food-card">
              <img
                src={item.image_url || "https://via.placeholder.com/150"}
                alt={item.item_name}
                className="food-image"
              />
              <div className="food-info">
                <h3>{item.item_name}</h3>
                <p className="location">📍 {item.location}</p>
                <p className="quantity">Quantity: {item.quantity}</p>
                <p className="price">Price: {item.price}</p>
                <p className="description">{item.description}</p>
                <Link to={`/item/${item._id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Browse;
