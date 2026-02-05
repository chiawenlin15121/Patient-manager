import api from '../api';

/**
 * 處理病患相關 API 請求的 Service
 * 採用 Repository Pattern 封裝資料存取
 */
const patientService = {
    /**
     * 取得病患列表 (包含分頁與搜尋)
     * @param {number} page - 頁碼 (從 1 開始)
     * @param {number} limit - 每頁筆數
     * @param {string} search - 搜尋關鍵字
     * @returns {Promise<Object>} 回傳分頁後的病患資料
     */
    getAllPatients: async (page = 1, limit = 5, search = '') => {
        const response = await api.get('/patients', {
            params: { page, limit, search }
        });
        return response.data;
    },

    /**
     * 取得病患總數
     * @returns {Promise<Object>} 回傳數量物件
     */
    getPatientCount: async () => {
        const response = await api.get('/patients/count');
        return response.data;
    },

    /**
     * 新增病患
     * @param {Object} patientData - 欲新增的病患資料
     * @returns {Promise<Object>} 回傳新增後的病患資料
     */
    createPatient: async (patientData) => {
        const response = await api.post('/patients', patientData);
        return response.data;
    }
};

export default patientService;
