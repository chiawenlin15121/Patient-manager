import { useState, useEffect, useCallback } from 'react';
import orderService from '../services/orderService';

const useOrders = (patientId, initialPage = 1, initialLimit = 5) => {
    const [orders, setOrders] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        if (!patientId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getOrders(patientId, page, limit);
            setOrders(data.data);
            setTotalCount(data.total);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [patientId, page, limit]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        totalCount,
        page,
        setPage,
        limit,
        setLimit,
        loading,
        error,
        refetch: fetchOrders
    };
};

export default useOrders;
