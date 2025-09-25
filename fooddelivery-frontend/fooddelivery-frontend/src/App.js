import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Order";
import Payment from "./components/Payment";
import Header from "./components/Headers";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./api/client";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedCart = localStorage.getItem("cartItems");
    const savedMenu = localStorage.getItem("menuItems");
    const savedOrders = localStorage.getItem("orders");

    if (savedUser && savedUser !== "null") setUser(JSON.parse(savedUser));
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedMenu) setMenuItems(JSON.parse(savedMenu));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Load menus from backend
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const { data } = await api.get('/api/menus');
        const mapped = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          imageUrl: item.imageUrl,
          rating: 4.5,
        }));
        setMenuItems(mapped);
      } catch (e) {
        console.error('Failed to load menus', e);
      }
    };
    fetchMenus();
  }, []);

  // Load cart items from backend when user logs in
  useEffect(() => {
    const fetchCartItems = async () => {
      if (user && user.id) {
        try {
          const { data } = await api.get(`/api/cart/${user.id}`);
          const mappedCart = data.map(item => ({
            id: item.menu.id,
            name: item.menu.name,
            description: item.menu.description,
            price: item.menu.price,
            category: item.menu.category,
            quantity: item.quantity,
            cartItemId: item.id
          }));
          setCartItems(mappedCart);
        } catch (e) {
          console.error('Failed to load cart items', e);
        }
      }
    };
    fetchCartItems();
  }, [user]);

  // Auth functions
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setCartItems([]);
  };

  // Cart functions
  const addToCart = async (item) => {
    console.log('Add to cart called with item:', item);
    console.log('Current user:', user);
    
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    try {
      console.log('Sending cart request:', {
        customerId: user.id,
        menuId: item.id,
        quantity: 1
      });
      
      const response = await api.post('/api/cart/add', {
        customerId: user.id,
        menuId: item.id,
        quantity: 1
      });
      
      console.log('Cart response:', response.data);
      await refreshCart(); // Refresh cart from backend
      alert('Item added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to add item to cart: ' + (error.response?.data?.message || error.message));
    }
  };

  const refreshCart = async () => {
    if (user && user.id) {
      try {
        console.log('Refreshing cart for user:', user.id);
        const { data } = await api.get(`/api/cart/${user.id}`);
        console.log('Cart data received:', data);
        const mappedCart = data.map(item => ({
          id: item.menu.id,
          name: item.menu.name,
          description: item.menu.description,
          price: item.menu.price,
          category: item.menu.category,
          quantity: item.quantity,
          cartItemId: item.id
        }));
        console.log('Mapped cart:', mappedCart);
        setCartItems(mappedCart);
      } catch (e) {
        console.error('Failed to refresh cart:', e);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    if (!cartItem || !cartItem.cartItemId) return;
    
    try {
      await api.delete(`/api/cart/${cartItem.cartItemId}`);
      await refreshCart(); // Refresh cart from backend
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    const cartItem = cartItems.find(item => item.id === itemId);
    if (!cartItem || !cartItem.cartItemId) return;
    
    try {
      await api.put(`/api/cart/${cartItem.cartItemId}`, { quantity });
      await refreshCart(); // Refresh cart from backend
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      // Delete all cart items for the user
      for (const item of cartItems) {
        if (item.cartItemId) {
          await api.delete(`/api/cart/${item.cartItemId}`);
        }
      }
      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setCartItems([]); // Clear locally anyway
    }
  };

  // Orders
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      customerId: user?.id, // ✅ make sure orders belong to user
      id: Date.now(),
      orderDate: new Date().toISOString(),
      status: "confirmed",
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
  };

  // Helpers
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="App">
      {user && (
        <Header
          user={user}
          cartItemsCount={getTotalItems()}
          onLogout={logout}
        />
      )}

      <Routes>
        <Route
          path="/register"
          element={
            user ? <Navigate to="/menu" /> : <Register />
          }
        />

        <Route
          path="/login"
          element={
            user ? <Navigate to="/menu" /> : <Login onLogin={login} />
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute user={user}>
              <Menu menuItems={menuItems} onAddToCart={addToCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute user={user}>
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
                totalAmount={getCartTotal()}
                user={user}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute user={user}>
              {cartItems.length > 0 ? (
                <Checkout
                  cartItems={cartItems}
                  totalAmount={getCartTotal()}
                  user={user}
                />
              ) : (
                <Navigate to="/cart" />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute user={user}>
              <Payment
                onOrderPlaced={addOrder}
                user={user}
                cartItems={cartItems}
                totalAmount={getCartTotal()}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute user={user}>
              <Orders
                orders={orders.filter((order) => order.customerId === user.id)}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to={user ? (user.role === "ADMIN" ? "/admin" : "/menu") : "/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
