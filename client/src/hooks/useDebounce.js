import { useState, useEffect } from 'react';

/**
 * 處理數值防抖動的 Custom Hook
 * 
 * @param {any} value - 需要防抖動的值
 * @param {number} delay - 延遲時間 (毫秒)
 * @returns {any} - 防抖動後的數值
 */
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // 設定計時器，在延遲時間後更新 debouncedValue
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 若在延遲時間內 value 改變，清除上一次的計時器
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;
