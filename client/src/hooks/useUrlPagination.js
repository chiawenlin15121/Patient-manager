import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * 管理 URL 分頁與搜尋參數的 Custom Hook
 * 
 * 職責：
 * 1. 同步 URL 查詢參數 (page, limit, q)
 * 2. 提供改變這些狀態的方法
 * 3. 處理狀態變更時的連帶邏輯 (例如：搜尋關鍵字改變時重置頁碼)
 * 
 * @param {number} initialPage 預設頁碼
 * @param {number} initialLimit 預設每頁顯示筆數
 * @returns {Object} 包含當前狀態與更新函數的物件
 */
const useUrlPagination = (initialPage = 1, initialLimit = 5) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 從 URL 讀取狀態，若無則使用預設值
    const page = parseInt(searchParams.get('page') || initialPage);
    const limit = parseInt(searchParams.get('limit') || initialLimit);
    const searchQuery = searchParams.get('q') || '';

    // 更新頁碼
    const setPage = useCallback((newPage) => {
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams);
            newParams.set('page', newPage);
            return newParams;
        });
    }, [setSearchParams]);

    // 更新每頁筆數
    const setLimit = useCallback((newLimit) => {
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams);
            newParams.set('limit', newLimit);
            return newParams;
        });
    }, [setSearchParams]);

    // 更新搜尋關鍵字
    const setSearchQuery = useCallback((newQuery) => {
        setSearchParams((prevParams) => {
            const currentQ = prevParams.get('q') || '';
            if (currentQ === newQuery) return prevParams;

            const newParams = new URLSearchParams(prevParams);
            if (newQuery) {
                newParams.set('q', newQuery);
            } else {
                newParams.delete('q');
            }
            // 搜尋條件改變時，強制重置回第一頁
            newParams.set('page', 1);
            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    return {
        page,
        setPage,
        limit,
        setLimit,
        searchQuery,
        setSearchQuery
    };
};

export default useUrlPagination;
