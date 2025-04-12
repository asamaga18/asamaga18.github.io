import React, { useState } from "react";
import './Browse.css';

interface Item {
  id: string;
  title: string;
  updatedAt: string;
}

interface FilterChip {
  id: string;
  label: string;
  isSelected: boolean;
}

const Browse: React.FC = () => {
  const [filterChips, setFilterChips] = useState<FilterChip[]>([
    { id: '1', label: 'Tomatoes', isSelected: false },
    { id: '2', label: 'Lettuce', isSelected: true },
    { id: '3', label: 'Cabbage', isSelected: false },
    { id: '4', label: 'Peppers', isSelected: false },
    { id: '5', label: 'Squash', isSelected: false },
  ]);

  const mockItems: Item[] = Array(15).fill(null).map((_, index) => ({
    id: index.toString(),
    title: 'Title',
    updatedAt: index % 3 === 0 ? 'today' : 
               index % 3 === 1 ? 'yesterday' : 
               '2 days ago'
  }));

  const toggleChip = (chipId: string) => {
    setFilterChips(chips => 
      chips.map(chip => 
        chip.id === chipId ? { ...chip, isSelected: !chip.isSelected } : chip
      )
    );
  };

  return (
    <div className="browse-page">
      <nav className="sidebar">
        <button className="menu-button">
          <span className="menu-icon">☰</span>
        </button>
        <button className="add-button">
          <span className="plus-icon">+</span>
        </button>
        <div className="nav-items">
          <div className="nav-item active">
            <span className="nav-icon">🔍</span>
            <span>Browse</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">👥</span>
            <span>Communities</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">📝</span>
            <span>Post</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <header className="top-bar">
          <button className="back-button">←</button>
          <h1>Browse</h1>
          <div className="top-bar-icons">
            <button className="icon-button">📎</button>
            <button className="icon-button">📅</button>
            <button className="icon-button">⋮</button>
          </div>
        </header>

        <div className="filter-chips">
          {filterChips.map(chip => (
            <button
              key={chip.id}
              className={`filter-chip ${chip.isSelected ? 'selected' : ''}`}
              onClick={() => toggleChip(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="items-grid">
          {mockItems.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-placeholder"></div>
              <div className="item-details">
                <h3>{item.title}</h3>
                <p>Updated {item.updatedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Browse;