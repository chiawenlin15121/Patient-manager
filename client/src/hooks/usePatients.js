import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import patientService from '../services/patientService';

/**
 * Custom hook to manage patient data fetching and state.
 * separating the data fetching logic from the UI component.
 */
const usePatients = (initialPage = 1, initialLimit = 5) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [patients, setPatients] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const page = parseInt(searchParams.get('page') || initialPage);
    const limit = parseInt(searchParams.get('limit') || initialLimit);
    const searchQuery = searchParams.get('q') || '';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const setPage = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage);
        setSearchParams(newParams);
    };

    const setLimit = (newLimit) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('limit', newLimit);
        setSearchParams(newParams);
    };

    const setSearchQuery = (newQuery) => {
        const currentQ = searchParams.get('q') || '';
        if (currentQ === newQuery) return;

        const newParams = new URLSearchParams(searchParams);
        if (newQuery) {
            newParams.set('q', newQuery);
        } else {
            newParams.delete('q');
        }
        newParams.set('page', 1);
        setSearchParams(newParams, { replace: true });
    };


    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await patientService.getAllPatients(page, limit, searchQuery);
            setPatients(data.data);
            setTotalCount(data.total);
        } catch (err) {
            console.error("Failed to fetch patient data", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, searchQuery]);

    // Fetch when page, limit, or search query changes
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
        searchQuery,
        setSearchQuery,
        loading,
        error,
        refetch: fetchPatients
    };
};

export default usePatients;
