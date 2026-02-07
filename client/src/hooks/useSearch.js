import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

/**
 * 封裝搜尋邏輯的 Custom Hook
 * 結合了本地狀態管理、防抖動 (Debounce) 與外部狀態同步
 * 
 * @param {string} externalQuery - 外部的搜尋狀態 (如 URL 參數或上層 State)
 * @param {Function} onSearchChange - 當搜尋關鍵字確認變更時的回呼函數
 * @param {number} delay - 防抖動延遲時間 (預設 500ms)
 * @returns {Array} [searchTerm, setSearchTerm] - 本地搜尋關鍵字狀態與更新函數
 */
const useSearch = (externalQuery = '', onSearchChange, delay = 500) => {
    const [searchTerm, setSearchTerm] = useState(externalQuery);
    const debouncedSearchTerm = useDebounce(searchTerm, delay);

    // 當外部搜尋狀態改變時 (例如網址變更)，同步更新本地狀態
    useEffect(() => {
        setSearchTerm(externalQuery);
    }, [externalQuery]);

    // 當防抖動後的搜尋關鍵字改變，且與目前外部狀態不同時，觸發更新回調
    useEffect(() => {
        if (debouncedSearchTerm !== externalQuery) {
            onSearchChange(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, externalQuery, onSearchChange]);

    return [searchTerm, setSearchTerm];
};

export default useSearch;
