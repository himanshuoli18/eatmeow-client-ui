import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import moment from 'moment';

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'preparing':
        return 'status-badge status-preparing';
      case 'out for delivery':
        return 'status-badge status-out-for-delivery';
      case 'delivered':
        return 'status-badge status-delivered';
      default:
        return 'status-badge';
    }
  };
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Orders</h3>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchOrders}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>
      {loading ? (
        <div className="text-center py-5">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 text-muted">You haven’t placed any orders yet.</div>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-bold">Order #{order.id}</span>
              <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {order.orderedItems.map((item, idx) => (
                  <div key={idx} className="col-md-4 d-flex">
                    <img
                      src={item.imageUrl || '/placeholder.png'}
                      alt={item.name}
                      className="me-3 rounded"
                      style={{ width: 64, height: 64, objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-semibold">{item.name}</div>
                      <div className="text-muted small">
                        ₹{item.price} × {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <div className="text-muted small">
                  Ordered on {moment(order.createdAt).format('MMMM Do YYYY, h:mm A')}
                </div>
                <div className="fw-bold">Total: ₹{order.amount}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
