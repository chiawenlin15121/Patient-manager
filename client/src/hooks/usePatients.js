import { useState, useEffect, useCallback } from 'react';
import patientService from '../services/patientService';

/**
 * Custom hook to manage patient data fetching and state.
 * separating the data fetching logic from the UI component.
 */
const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Using Promise.all for parallel fetching as in the original component
            const [patientsData, countData] = await Promise.all([
                patientService.getAllPatients(),
                patientService.getPatientCount()
            ]);

            setPatients(patientsData);
            setTotalCount(countData.count);
        } catch (err) {
            console.error("Failed to fetch patient data", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    return {
        patients,
        totalCount,
        loading,
        error,
        refetch: fetchPatients
    };
};

export default usePatients;
