import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFoodDetails } from '../../services/FoodService';
import { toast } from 'react-toastify';
import {StoreContext} from '../../context/StoreContext'

const FoodDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const {increaseQty}  = useContext(StoreContext)
  const navigate = useNavigate()
  const addToCart = () => {
    increaseQty(data.id)
    navigate('/cart')
  }
  useEffect(() => {
    const loadFoodDetails = async () => {
      try {
        const foodData = await fetchFoodDetails(id);
        setData(foodData);
      } catch {
        toast.error('Error fetching food details.');
      }
    };
    loadFoodDetails();
  }, [id]);

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 my-5">
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6">
            <img
              className="rounded card-img-top mb-5 mb-md-0"
              src={data.imageUrl}
              alt={data.name || 'Food'}
            />
          </div>
          <div className="col-md-6">
            <div className="fs-5 mb-1">
              Category:{' '}
              <span className="badge text-bg-warning">
                {data.category}
              </span>
            </div>
            <h1 className="display-5 fw-bolder">{data.name}</h1>
            <div className="fs-5 mb-2">
              <span>&#8377;{data.price}</span>
            </div>
            <p className="lead mb-5">{data.description}</p>
            <div className="d-flex">
              <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={addToCart}>
                <i className="bi-cart-fill me-1"></i>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodDetails;
