import axios from "axios";

const API_URL='https://eatmeow-api.onrender.com/api/foods'

export const fetchFoodList = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data
    } catch (error) {
        console.error('Failed to fetch food list:', error);
        throw error
    }
}

export const fetchFoodDetails = async (id) => {
    try {
        const response =  await axios.get(API_URL+"/"+id)
        return response.data
    } catch (error) {
        console.error('Failed to fetch food details:', error);
        throw error
    }
}
