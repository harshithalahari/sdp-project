import React from 'react';
import { Link } from 'react-router-dom';
import './Orders.css';

const Orders = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#3498db';
      case 'preparing': return '#f39c12';
      case 'out_for_delivery': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Order Confirmed';
      case 'preparing': return 'Preparing Food';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <div className="no-orders-icon">📋</div>
          <h2>No orders yet</h2>
          <p>Your order history will appear here</p>
          <Link to="/menu" className="order-now-btn">
            🍽️ Order Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>📋 Order History</h1>
          <p>You have {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <span className="order-date">
                    {new Date(order.orderDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusText(order.status)}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-image">{item.image}</span>
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">× {item.quantity}</span>
                    </div>
                    <span className="item-price">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total: ₹{order.totalAmount}</span>
                  <span>Delivery: ₹40</span>
                  <span className="grand-total">
                    Grand Total: ₹{order.totalAmount + 40}
                  </span>
                </div>

                {/* ✅ Show "Reorder" button only if delivered */}
                {order.status === 'delivered' && (
                  <button className="reorder-btn">Reorder</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
