import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ name, description, id, imageUrl, price }) => {
  const { token, quantities, increaseQty, decreaseQty } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleIncreaseQty = (id) => {
    if (!token) {
      navigate('/login');
      return;
    }
    increaseQty(id);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div className="featured-product-card d-flex flex-column justify-content-between">
        <Link to={`/food/${id}`}>
          <div
            className="featured-product-image"
            style={{
              backgroundImage: `url(${imageUrl})`,
            }}
          ></div>
        </Link>
        <div className="featured-product-details d-flex flex-column h-100 mt-3">
          <h5 className="mb-2">{name}</h5>
          <p className="mb-3 description-text">{description}</p>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <span className="text-muted fw-semibold">₹{price}</span>
            <div className="d-flex align-items-center justify-content-between gap-2">
              {quantities[id] > 0 ? (
                <div className="d-flex align-items-center gap-2">
                  <button onClick={() => decreaseQty(id)} className="btn btn-danger btn-sm">
                    <i className="bi bi-dash-circle"></i>
                  </button>
                  <span className="fw-bold">{quantities[id]}</span>
                  <button onClick={() => handleIncreaseQty(id)} className="btn btn-success btn-sm">
                    <i className="bi bi-plus-circle"></i>
                  </button>
                </div>
              ) : (
                <div>
                  <button onClick={() => handleIncreaseQty(id)} className="btn btn-success btn-sm">
                    <i className="bi bi-plus-circle"></i>
                  </button>
                </div>
              )}
              <Link to={`/food/${id}`} className="btn btn-sm btn-primary">
                View Food
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
