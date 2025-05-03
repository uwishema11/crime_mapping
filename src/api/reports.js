import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const submitReport = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reports`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred while submitting the report' };
    }
};

export const getReports = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/reports`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred while fetching reports' };
    }
}; 