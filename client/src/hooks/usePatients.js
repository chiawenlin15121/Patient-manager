import { useState, useEffect, useCallback } from 'react';
import patientService from '../services/patientService';

/**
 * Custom hook to manage patient data fetching and state.
 * separating the data fetching logic from the UI component.
 */
const usePatients = (initialPage = 1, initialLimit = 5) => {
    const [patients, setPatients] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await patientService.getAllPatients(page, limit);
            setPatients(data.data);
            setTotalCount(data.total);
        } catch (err) {
            console.error("Failed to fetch patient data", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    // Fetch when page or limit changes
    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    return {
        patients,
        totalCount,
        page,
        setPage,
        limit,
        setLimit,
        loading,
        error,
        refetch: fetchPatients
    };
};

export default usePatients;
