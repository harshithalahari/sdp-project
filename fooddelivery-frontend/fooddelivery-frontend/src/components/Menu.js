import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

const Menu = ({ menuItems, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const categories = ['All', 'Veg', 'Non-Veg', 'Beverages', 'Desserts', 'Snacks'];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    onAddToCart(item);
    // Show quick notification
    const notification = document.createElement('div');
    notification.className = 'add-to-cart-notification';
    notification.textContent = `Added ${item.name} to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search for food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="view-cart-btn"
            onClick={() => navigate('/cart')}
          >
            🛒 View Cart
          </button>
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-item">
            <div className="item-image">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=Food'} />
              ) : (
                <div className="placeholder-image">🍽️</div>
              )}
            </div>
            <div className="item-content">
              <div className="item-header">
                <h3>{item.name}</h3>
                <span className="item-rating">⭐ {item.rating || 4.5}</span>
              </div>
              <p className="item-description">{item.description}</p>
              <div className="item-footer">
                <span className="item-price">${item.price}</span>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-items">
          <h3>No items found</h3>
          <p>Try changing your search or category filter</p>
        </div>
      )}
    </div>
  );
};

export default Menu;