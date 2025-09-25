import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'HOME',
    defaultAddress: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8082/api/addresses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        addressType: 'HOME',
        defaultAddress: false
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Manage Addresses 🏠</h2>
      
      <button 
        onClick={() => setShowForm(!showForm)}
        style={styles.addButton}
      >
        {showForm ? 'Cancel' : 'Add New Address'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Address Line 2"
              value={formData.addressLine2}
              onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.formRow}>
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <input
              type="text"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Landmark"
              value={formData.landmark}
              onChange={(e) => setFormData({...formData, landmark: e.target.value})}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            Save Address
          </button>
        </form>
      )}

      <div style={styles.addressesList}>
        {addresses.map(address => (
          <div key={address.id} style={styles.addressCard}>
            <h4>{address.addressType} {address.defaultAddress && '(Default)'}</h4>
            <p>{address.addressLine1}</p>
            <p>{address.addressLine2}</p>
            <p>{address.city}, {address.state} - {address.pincode}</p>
            <p>Landmark: {address.landmark}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  },
  addButton: {
    background: '#48bb78',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '2rem'
  },
  form: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem'
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem'
  },
  submitButton: {
    background: '#ff6b4a',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%'
  },
  addressesList: {
    display: 'grid',
    gap: '1rem'
  },
  addressCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '2px solid #e2e8f0'
  }
};

export default AddressManager;