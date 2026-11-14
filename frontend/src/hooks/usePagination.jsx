import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const usePagination = (endpoint, queryParams, resetDependency) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setData([]);
        setPage(1);
        setHasMore(true);
    }, [resetDependency]);

    useEffect(() => {
        if (!hasMore) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get(endpoint, {
                    params: { ...queryParams, page, limit: 20 }
                });

                const newItems = response.data.data;
                
                setData(prev => page === 1 ? newItems : [...prev, ...newItems]);
                setHasMore(response.data.pagination.hasMore);

            } catch (err) {
                console.error("Pagination error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, resetDependency]); 

    const loadNextPage = useCallback(() => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    return { data, loading, hasMore, loadNextPage };
};