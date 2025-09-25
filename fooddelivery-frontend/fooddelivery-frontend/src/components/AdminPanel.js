import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = ({ menuItems, onAddItem, onUpdateItem, onDeleteItem, orders, onUpdateOrderStatus, onLogout }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [editingItem, setEditingItem] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Veg',
    image: '🍕'
  });

  const categories = ['Veg', 'Non-Veg', 'Beverages', 'Desserts', 'Snacks'];
  const foodIcons = ['🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍰', '🎂', '☕', '🍹', '🍛', '🍝'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      price: parseInt(formData.price)
    };

    if (editingItem) {
      onUpdateItem(editingItem.id, itemData);
    } else {
      onAddItem(itemData);
    }

    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Veg',
      image: '🍕'
    });
    setEditingItem(null);
    setShowItemForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image
    });
    setShowItemForm(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowItemForm(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Veg',
      image: '🍕'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'preparing': return '#3498db';
      case 'out_for_delivery': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <h1>⚙️ Admin Panel</h1>
            <p>Manage menu items and orders</p>
          </div>
          <div className="admin-header-right">
            <button className="menu-btn" onClick={() => navigate('/menu')}>
              🍕 View Menu
            </button>
            <button className="logout-btn" onClick={onLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            📋 Menu Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Order Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </nav>
      </header>

      {/* Menu Management Tab */}
      {activeTab === 'menu' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Menu Items ({menuItems.length})</h2>
            <button 
              className="add-item-btn"
              onClick={() => setShowItemForm(true)}
            >
              + Add New Item
            </button>
          </div>

          {showItemForm && (
            <div className="item-form-overlay">
              <div className="item-form">
                <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Food Icon</label>
                      <div className="icon-selector">
                        {foodIcons.map(icon => (
                          <button
                            key={icon}
                            type="button"
                            className={`icon-btn ${formData.image === icon ? 'selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, image: icon }))}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Category</label>
                      <select 
                        name="category" 
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter item name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter item description"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="menu-items-grid">
            {menuItems.map(item => (
              <div key={item.id} className="admin-menu-item">
                <div className="item-header">
                  <span className="item-icon">{item.image}</span>
                  <div className="item-actions">
                    <button className="edit-btn" onClick={() => handleEdit(item)}>✏️</button>
                    <button className="delete-btn" onClick={() => onDeleteItem(item.id)}>🗑️</button>
                  </div>
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-desc">{item.description}</p>
                  <div className="item-meta">
                    <span className="item-category">{item.category}</span>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Management Tab */}
      {activeTab === 'orders' && (
        <div className="tab-content">
          <h2>Order Management ({orders.length} orders)</h2>
          
          <div className="orders-kanban">
            <div className="kanban-column">
              <h3>Pending ({getOrdersByStatus('pending').length})</h3>
              {getOrdersByStatus('pending').map(order => (
                <OrderCard key={order.id} order={order} onUpdateStatus={onUpdateOrderStatus} />
              ))}
            </div>

            <div className="kanban-column">
              <h3>Preparing ({getOrdersByStatus('preparing').length})</h3>
              {getOrdersByStatus('preparing').map(order => (
                <OrderCard key={order.id} order={order} onUpdateStatus={onUpdateOrderStatus} />
              ))}
            </div>

            <div className="kanban-column">
              <h3>Out for Delivery ({getOrdersByStatus('out_for_delivery').length})</h3>
              {getOrdersByStatus('out_for_delivery').map(order => (
                <OrderCard key={order.id} order={order} onUpdateStatus={onUpdateOrderStatus} />
              ))}
            </div>

            <div className="kanban-column">
              <h3>Delivered ({getOrdersByStatus('delivered').length})</h3>
              {getOrdersByStatus('delivered').map(order => (
                <OrderCard key={order.id} order={order} onUpdateStatus={onUpdateOrderStatus} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="tab-content">
          <h2>Business Analytics</h2>
          
          <div className="analytics-grid">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <span className="stat-number">{orders.length}</span>
            </div>
            
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <span className="stat-number">
                ₹{orders.reduce((total, order) => total + order.totalAmount, 0)}
              </span>
            </div>
            
            <div className="stat-card">
              <h3>Pending Orders</h3>
              <span className="stat-number">{getOrdersByStatus('pending').length}</span>
            </div>
            
            <div className="stat-card">
              <h3>Menu Items</h3>
              <span className="stat-number">{menuItems.length}</span>
            </div>
          </div>

          <div className="recent-orders">
            <h3>Recent Orders</h3>
            <div className="orders-list">
              {orders.slice(-5).reverse().map(order => (
                <div key={order.id} className="recent-order-item">
                  <span>Order #{order.id}</span>
                  <span>{order.customerName}</span>
                  <span>₹{order.totalAmount}</span>
                  <span style={{ color: getStatusColor(order.status) }}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order, onUpdateStatus }) => {
  const statusFlow = {
    'pending': ['preparing', 'cancelled'],
    'preparing': ['out_for_delivery', 'cancelled'],
    'out_for_delivery': ['delivered'],
    'delivered': [],
    'cancelled': []
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <span className="order-id">Order #{order.id}</span>
        <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
      </div>
      
      <div className="order-customer">
        <strong>{order.customerName}</strong>
        <span className="order-amount">₹{order.totalAmount}</span>
      </div>

      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <span>{item.image} {item.name}</span>
            <span>×{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
        {order.status.replace('_', ' ').toUpperCase()}
      </div>

      <div className="order-actions">
        {statusFlow[order.status].map(nextStatus => (
          <button
            key={nextStatus}
            className="status-btn"
            onClick={() => onUpdateStatus(order.id, nextStatus)}
          >
            Mark as {nextStatus.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;