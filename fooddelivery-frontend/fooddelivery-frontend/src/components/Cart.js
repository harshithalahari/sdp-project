import React from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import './Cart.css';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveFromCart, totalAmount, user }) => {
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h2>🛒 Your Cart</h2>
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/menu" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>🛒 Your Cart ({cartItems.length} items)</h2>
        
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-category">{item.category}</p>
              </div>
              
              <div className="item-price">
                <span className="price">${item.price}</span>
              </div>
              
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <div className="item-total">
                <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              
              <button 
                className="remove-btn"
                onClick={() => onRemoveFromCart(item.id)}
              >
                🗑️ Remove
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items):</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>$2.99</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${(totalAmount * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span><strong>Total:</strong></span>
              <span><strong>${(totalAmount + 2.99 + (totalAmount * 0.08)).toFixed(2)}</strong></span>
            </div>
          </div>
          
          <div className="cart-actions">
            <Link to="/menu" className="continue-shopping">
              Continue Shopping
            </Link>
            <button 
              className="checkout-btn"
              onClick={async () => {
                try {
                  const response = await api.post('/api/orders/place', {
                    customerId: user?.id
                  });
                  if (response.data.success) {
                    alert('🎉 Order Success! Your order has been placed successfully and stored in database.');
                    window.location.reload();
                  }
                } catch (error) {
                  console.error('Order placement error:', error);
                  alert('Failed to place order: ' + (error.response?.data?.message || error.message));
                }
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;