import api from '../api';

/**
 * 處理醫囑相關 API 請求的 Service
 */
const orderService = {
    /**
     * 取得特定病患的醫囑 (包含搜尋功能)
     * @param {number} patientId - 病患 ID
     * @param {number} page - 頁碼
     * @param {number} limit - 每頁筆數
     * @param {string} search - 搜尋關鍵字
     * @returns {Promise<Object>} 回傳分頁後的醫囑資料
     */
    getOrders: async (patientId, page = 1, limit = 5, search = '') => {
        const response = await api.get(`/patients/${patientId}/orders`, {
            params: { page, limit, search }
        });
        return response.data;
    },

    /**
     * 新增醫囑
     * @param {Object} orderData - 醫囑資料
     * @returns {Promise<Object>} 回傳新增後的醫囑
     */
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    /**
     * 更新醫囑
     * @param {number} id - 醫囑 ID
     * @param {Object} orderData - 更新資料
     * @returns {Promise<Object>} 回傳更新後的醫囑
     */
    updateOrder: async (id, orderData) => {
        const response = await api.put(`/orders/${id}`, orderData);
        return response.data;
    }
};

export default orderService;
