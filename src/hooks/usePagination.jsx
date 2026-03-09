import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const usePagination = (endpoint, queryParams, resetDependency) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    // 1. Reset everything if the URL changes (e.g., clicking a new Genre)
    useEffect(() => {
        setData([]);
        setPage(1);
        setHasMore(true);
    }, [resetDependency]);

    // 2. Fetch the data whenever the page number changes
    useEffect(() => {
        if (!hasMore) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get(endpoint, {
                    params: { ...queryParams, page, limit: 20 }
                });

                const newItems = response.data.data;
                
                // THE MAGIC: If it's page 1, replace data. If page 2+, append it!
                setData(prev => page === 1 ? newItems : [...prev, ...newItems]);
                setHasMore(response.data.pagination.hasMore);

            } catch (err) {
                console.error("Pagination error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, resetDependency]); 

    // 3. The trigger function we will call when the user scrolls down
    const loadNextPage = useCallback(() => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    return { data, loading, hasMore, loadNextPage };
};