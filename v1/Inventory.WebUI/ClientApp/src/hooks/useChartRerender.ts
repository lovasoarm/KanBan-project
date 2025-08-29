import { useState, useCallback, useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

export const useChartRerender = () => {
  const [rerenderKey, setRerenderKey] = useState(0);
  const chartRef = useRef<Chart | null>(null);

  const forceRerender = useCallback(() => {
    setRerenderKey(prevKey => prevKey + 1);
  }, []);

  const destroyChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, []);

  const resetChart = useCallback(() => {
    destroyChart();
    forceRerender();
  }, [destroyChart, forceRerender]);

  const setChartRef = useCallback((chart: Chart | null) => {
    chartRef.current = chart;
  }, []);

  useEffect(() => {
    return () => {
      destroyChart();
    };
  }, [destroyChart]);

  return {
    rerenderKey,
    chartRef: chartRef.current,
    forceRerender,
    destroyChart,
    resetChart,
    setChartRef
  };
};

export default useChartRerender;

