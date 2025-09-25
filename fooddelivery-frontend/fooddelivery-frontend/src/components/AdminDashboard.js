import React, { useState, useEffect } from 'react';
import api from '../api/client';
import './AdminPanel.css';

const AdminDashboard = () => {
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newMenu, setNewMenu] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });
  const [editingMenu, setEditingMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    fetchMenus();
    fetchOrders();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await api.get('/api/menus');
      setMenus(response.data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setNewMenu({ name: '', description: '', price: '', category: '', imageUrl: '' });
    setShowModal(true);
  };

  const openEditModal = (menu) => {
    setModalMode('edit');
    setEditingMenu(menu);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMenu(null);
    setNewMenu({ name: '', description: '', price: '', category: '', imageUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalMode === 'add') {
        await api.post('/api/menus', {
          ...newMenu,
          price: parseFloat(newMenu.price)
        });
        alert('Menu item added successfully!');
      } else {
        await api.put(`/api/menus/${editingMenu.id}`, {
          ...editingMenu,
          price: parseFloat(editingMenu.price)
        });
        alert('Menu item updated successfully!');
      }
      closeModal();
      fetchMenus();
    } catch (error) {
      console.error('Failed to save menu:', error);
      alert('Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await api.delete(`/api/menus/${id}`);
        fetchMenus();
        alert('Menu item deleted successfully!');
      } catch (error) {
        console.error('Failed to delete menu:', error);
        alert('Failed to delete menu item');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}`, { status });
      fetchOrders();
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="add-btn" onClick={openAddModal}>
          + Add New Product
        </button>
      </div>
      
      <div className="admin-section">
        <h2>Products ({menus.length})</h2>
        
        <div className="menu-list">
          {menus.map(menu => (
            <div key={menu.id} className="menu-card">
              <div className="menu-info">
                <h3>{menu.name}</h3>
                <p className="description">{menu.description}</p>
                <p className="price">${menu.price}</p>
                <span className="category">{menu.category}</span>
              </div>
              <div className="menu-actions">
                <button className="edit-btn" onClick={() => openEditModal(menu)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteMenu(menu.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h2>Order Management</h2>
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-item">
              <h3>Order #{order.id}</h3>
              <p>Customer ID: {order.customerId}</p>
              <p>Total: ${order.total}</p>
              <p>Status: {order.status}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <select 
                value={order.status} 
                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
              >
                <option value="PLACED">Placed</option>
                <option value="PREPARING">Preparing</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={modalMode === 'add' ? newMenu.name : editingMenu?.name || ''}
                  onChange={(e) => modalMode === 'add' 
                    ? setNewMenu({...newMenu, name: e.target.value})
                    : setEditingMenu({...editingMenu, name: e.target.value})
                  }
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={modalMode === 'add' ? newMenu.description : editingMenu?.description || ''}
                  onChange={(e) => modalMode === 'add' 
                    ? setNewMenu({...newMenu, description: e.target.value})
                    : setEditingMenu({...editingMenu, description: e.target.value})
                  }
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={modalMode === 'add' ? newMenu.imageUrl || '' : editingMenu?.imageUrl || ''}
                  onChange={(e) => modalMode === 'add' 
                    ? setNewMenu({...newMenu, imageUrl: e.target.value})
                    : setEditingMenu({...editingMenu, imageUrl: e.target.value})
                  }
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={modalMode === 'add' ? newMenu.price : editingMenu?.price || ''}
                    onChange={(e) => modalMode === 'add' 
                      ? setNewMenu({...newMenu, price: e.target.value})
                      : setEditingMenu({...editingMenu, price: e.target.value})
                    }
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={modalMode === 'add' ? newMenu.category : editingMenu?.category || ''}
                    onChange={(e) => modalMode === 'add' 
                      ? setNewMenu({...newMenu, category: e.target.value})
                      : setEditingMenu({...editingMenu, category: e.target.value})
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Salads">Salads</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : (modalMode === 'add' ? 'Add Product' : 'Update Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;