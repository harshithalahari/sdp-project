import React from 'react';
import './MenuItem.css';

const MenuItem = ({ item, addToCart }) => {
  return (
    <div className="menu-item">
      <div className="item-image">{item.image}</div>
      <div className="item-details">
        <h3>{item.name}</h3>
        <p className="item-description">{item.description}</p>
        <div className="item-price">₹{item.price}</div>
        <button 
          className="add-to-cart-btn"
          onClick={() => addToCart(item)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuItem;