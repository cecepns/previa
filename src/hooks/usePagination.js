import { useCallback, useState } from 'react';

const LIMIT_OPTIONS = [10, 25, 50, 100];

export function usePagination(initialLimit = 10) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 1,
  });

  const resetPage = useCallback(() => setPage(1), []);

  const handleLimitChange = useCallback((newLimit) => {
    setLimit(Number(newLimit));
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const queryParams = { page, limit, search: search.trim() || undefined };

  return {
    page,
    setPage,
    limit,
    setLimit: handleLimitChange,
    search,
    setSearch: handleSearchChange,
    pagination,
    setPagination,
    resetPage,
    queryParams,
    limitOptions: LIMIT_OPTIONS,
  };
}
