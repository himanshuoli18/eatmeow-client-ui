import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { StoreContext } from './StoreContext';
import { fetchFoodList } from '../services/FoodService';
import { decrementItemInCart, fetchCartContents, incrementItemInCart } from '../services/cartService';

export const StoreContextProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const increaseQty = useCallback(async (foodId) => {
    try {
      await incrementItemInCart(foodId, token);
      setQuantities((prev) => ({
        ...prev,
        [foodId]: (prev[foodId] || 0) + 1,
      }));
    } catch (error) {
      console.error('Failed to increase quantity:', error);
    }
  }, [token]);

  const decreaseQty = useCallback(async (foodId) => {
    try {
      await decrementItemInCart(foodId, token);
      setQuantities((prev) => ({
        ...prev,
        [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
      }));
    } catch (error) {
      console.error('Failed to decrease quantity:', error);
    }
  }, [token]);

  const removeFromCart = useCallback((foodId) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[foodId];
      return updated;
    });
  }, []);

  const loadCartData = useCallback(async (token) => {
    try {
      const items = await fetchCartContents(token);
      setQuantities(items || {});
    } catch (error) {
      console.error('Failed to load cart data:', error);
      setQuantities({});
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      try {
        const data = await fetchFoodList();
        if (isMounted) setFoodList(data);

        const storedToken = localStorage.getItem('token');
        if (storedToken && isMounted) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    }
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchCart() {
      if (token) {
        await loadCartData(token);
      }
      if (isMounted) setIsLoading(false);
    }
    fetchCart();
    return () => {
      isMounted = false;
    };
  }, [token, loadCartData]);

  const contextValue = useMemo(() => ({
    foodList,
    quantities,
    setQuantities,
    increaseQty,
    decreaseQty,
    removeFromCart,
    token,
    setToken,
    loadCartData,
    isLoading,
  }), [
    foodList,
    quantities,
    increaseQty,
    decreaseQty,
    removeFromCart,
    token,
    setToken,
    loadCartData,
    isLoading,
  ]);

  return (
    <StoreContext.Provider value={contextValue}>
      {!isLoading && children}
    </StoreContext.Provider>
  );
};
