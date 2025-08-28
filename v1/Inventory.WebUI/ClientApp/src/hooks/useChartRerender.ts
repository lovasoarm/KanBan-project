import { useState, useCallback, useRef, useEffect } from 'react';
import { Chart } from 'chart.js';

/**
 * Hook personnalisé pour gérer le re-rendu des graphiques
 * Fournit un mécanisme robuste pour forcer la mise à jour des graphiques Chart.js
 */
export const useChartRerender = () => {
  const [rerenderKey, setRerenderKey] = useState(0);
  const chartRef = useRef<Chart | null>(null);

  // Force un nouveau rendu en incrémentant la clé
  const forceRerender = useCallback(() => {
    setRerenderKey(prevKey => prevKey + 1);
  }, []);

  // Détruit le graphique actuel si il existe
  const destroyChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, []);

  // Combine destruction + re-rendu pour un reset complet
  const resetChart = useCallback(() => {
    destroyChart();
    forceRerender();
  }, [destroyChart, forceRerender]);

  // Met à jour la référence du graphique
  const setChartRef = useCallback((chart: Chart | null) => {
    chartRef.current = chart;
  }, []);

  // Nettoyage automatique lors du démontage du composant
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
