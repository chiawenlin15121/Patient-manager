import api from '../api';

/**
 * Service to handle patient-related API calls.
 * Follows the repository pattern to abstract data access.
 */
const patientService = {
    /**
     * Fetches the complete list of patients with pagination and search.
     * @param {number} page - The page number (1-indexed).
     * @param {number} limit - The number of items per page.
     * @param {string} search - The search query term.
     * @returns {Promise<Object>} The paginated patient data.
     */
    getAllPatients: async (page = 1, limit = 5, search = '') => {
        const response = await api.get('/patients', {
            params: { page, limit, search }
        });
        return response.data;
    },

    /**
     * Fetches the total count of patients.
     * @returns {Promise<Object>} The count object.
     */
    getPatientCount: async () => {
        const response = await api.get('/patients/count');
        return response.data;
    },

    /**
     * Creates a new patient.
     * @param {Object} patientData - The patient data to create.
     * @returns {Promise<Object>} The created patient.
     */
    createPatient: async (patientData) => {
        const response = await api.post('/patients', patientData);
        return response.data;
    }
};

export default patientService;
