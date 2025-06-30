import axios from "axios";

const API_URL = "https://eatmeow-api-production.up.railway.app/api/cart";

// Helper to generate Authorization header
const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * Increments the quantity of a food item in the user's cart.
 */
export const incrementItemInCart = async (foodId, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { foodId },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to increment item (ID: ${foodId}) in cart:`, error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Decrements the quantity of a food item in the user's cart.
 */
export const decrementItemInCart = async (foodId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/remove`,
      { foodId },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to decrement item (ID: ${foodId}) in cart:`, error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Retrieves the current contents of the user's cart.
 */
export const fetchCartContents = async (token) => {
  try {
    const response = await axios.get(API_URL, getAuthHeader(token));
    return response.data.items || {};
  } catch (error) {
    console.error("Failed to fetch cart contents:", error?.response?.data || error.message);
    return {};
  }
};
