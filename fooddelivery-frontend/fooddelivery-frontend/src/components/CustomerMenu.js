import React, { useState } from 'react';
import './CustomerMenu.css';

const CustomerMenu = ({ cart, onAddToCart, onRemoveFromCart, onUpdateCartQuantity, onPlaceOrder, onClearCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', address: '', phone: '' });

  const categories = ['All', 'Veg', 'Non-Veg', 'Beverages', 'Desserts', 'Snacks'];

  const menuItems = [
    { id: 1, name: 'Margherita Pizza', description: 'Classic cheese pizza', price: 299, category: 'Veg', image: '🍕' },
    { id: 2, name: 'Chicken Burger', description: 'Juicy chicken patty', price: 189, category: 'Non-Veg', image: '🍔' },
    { id: 3, name: 'Veg Pasta', description: 'Creamy pasta with vegetables', price: 199, category: 'Veg', image: '🍝' },
    { id: 4, name: 'Chicken Biryani', description: 'Aromatic rice with chicken', price: 299, category: 'Non-Veg', image: '🍛' },
    { id: 5, name: 'Cold Coffee', description: 'Chilled coffee with ice cream', price: 99, category: 'Beverages', image: '☕' },
    { id: 6, name: 'Chocolate Brownie', description: 'Warm brownie with ice cream', price: 149, category: 'Desserts', image: '🍫' },
    { id: 7, name: 'French Fries', description: 'Crispy golden fries', price: 99, category: 'Snacks', image: '🍟' },
    { id: 8, name: 'Mojito', description: 'Refreshing mint lemonade', price: 129, category: 'Beverages', image: '🍹' }
  ];

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
      alert('Please fill all customer details');
      return;
    }

    const order = onPlaceOrder({
      items: [...cart],
      total: getTotalPrice(),
      customerInfo: { ...customerInfo },
      userId: 1 // In real app, this would be from logged in user
    });

    alert(`Order placed successfully! Order ID: ${order.id}`);
    setShowCheckout(false);
    setCustomerInfo({ name: '', address: '', phone: '' });
  };

  return (
    <div className="customer-menu">
      <div className="container">
        <div className="menu-header">
          <h1>🍕 Our Delicious Menu</h1>
          <div className="cart-summary">
            <button onClick={handleCheckout} className="checkout-btn">
              🛒 Checkout ({cart.length}) - ₹{getTotalPrice()}
            </button>
          </div>
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

        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-item">
              <div className="item-image">{item.image}</div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-meta">
                  <span className="item-price">₹{item.price}</span>
                  <span className="item-category">{item.category}</span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="modal-overlay">
            <div className="checkout-modal">
              <h3>Checkout</h3>
              
              <div className="order-summary">
                <h4>Order Summary</h4>
                {cart.map(item => (
                  <div key={item.id} className="order-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="order-total">
                  <strong>Total: ₹{getTotalPrice()}</strong>
                </div>
              </div>

              <div className="customer-details">
                <h4>Customer Details</h4>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Delivery Address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowCheckout(false)} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handlePlaceOrder} className="place-order-btn">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerMenu;