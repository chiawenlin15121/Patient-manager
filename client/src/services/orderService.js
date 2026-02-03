import api from '../api';

/**
 * Service to handle order-related API calls.
 */
const orderService = {
    /**
     * Fetches orders for a specific patient.
     * @param {number} patientId - The ID of the patient.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<Object>} The paginated orders data.
     */
    getOrders: async (patientId, page = 1, limit = 5) => {
        const response = await api.get(`/patients/${patientId}/orders`, {
            params: { page, limit }
        });
        return response.data;
    },

    /**
     * Creates a new order.
     * @param {Object} orderData - The order data.
     * @returns {Promise<Object>} The created order.
     */
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    /**
     * Updates an order.
     * @param {number} id - The order ID.
     * @param {Object} orderData - The data to update.
     * @returns {Promise<Object>} The updated order.
     */
    updateOrder: async (id, orderData) => {
        const response = await api.put(`/orders/${id}`, orderData);
        return response.data;
    }
};

export default orderService;
