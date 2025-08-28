import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import {
  ReportsResponse,
  ReportsState,
  UseReportsResult,
  ApiResponse,
  ApiError,
  ReportsFilters
} from '../types/reports';

export const useReports = (filters?: ReportsFilters): UseReportsResult => {
  const [state, setState] = useState<ReportsState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchReportsData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response: ApiResponse<ReportsResponse> = await apiService.getReportsData();
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch reports data');
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError.message || 'Une erreur est survenue lors du chargement des rapports'
      }));
      console.error('Error fetching reports data:', error);
    }
  }, [filters]);

  const refetch = useCallback(async () => {
    await fetchReportsData();
  }, [fetchReportsData]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
    lastUpdated: state.lastUpdated
  };
};

export default useReports;
