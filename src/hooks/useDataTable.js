import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { getRequest, getErrorMessage } from '@/utils/request';

export default function useDataTable({ endpoint, deps = [] }) {
  const {
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    pagination,
    setPagination,
    queryParams,
    limitOptions,
  } = usePagination();

  const debouncedSearch = useDebounce(search, 300);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRequest(endpoint, {
        ...queryParams,
        search: debouncedSearch.trim() || undefined,
      });
      setData(result.data || []);
      setPagination(result.pagination || { page: 1, limit, total: 0, totalPages: 1 });
    } catch (err) {
      setError(getErrorMessage(err));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, endpoint, ...deps]);

  return {
    data,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    pagination,
    limitOptions,
    refetch: fetchData,
  };
}
