import { useState, useEffect, useCallback } from 'react';
import patientService from '../services/patientService';
import useUrlPagination from './useUrlPagination';

/**
 * 管理病患資料獲取與狀態的 Custom Hook
 * 
 * 職責：
 * 1. 使用 useUrlPagination 管理 URL 狀態
 * 2. 負責呼叫 Service 獲取資料
 * 3. 處理 Loading 與 Error 狀態
 */
const usePatients = (initialPage = 1, initialLimit = 5) => {
    // 將 URL 狀態管理職責委派給 useUrlPagination
    const {
        page, setPage,
        limit, setLimit,
        searchQuery, setSearchQuery
    } = useUrlPagination(initialPage, initialLimit);

    const [patients, setPatients] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    // 當頁碼、分頁數量或搜尋關鍵字變更時，重新獲取資料
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
