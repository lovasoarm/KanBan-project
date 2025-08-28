import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';
import { Chart as ChartJS } from 'chart.js';

interface RobustChartProps {
  data: ChartData<'line', number[], string>;
  options: ChartOptions<'line'>;
  redrawTrigger?: string | number;
}

/**
 * Composant graphique robuste qui garantit un re-rendu correct
 * Utilise plusieurs mécanismes pour s'assurer que le graphique se met à jour
 */
const RobustChart: React.FC<RobustChartProps> = ({ 
  data, 
  options, 
  redrawTrigger 
}) => {
  const chartRef = useRef<ChartJS<'line'> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  // Fonction pour détruire le graphique existant
  const destroyChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
    setIsChartReady(false);
  }, []);

  // Fonction pour forcer la mise à jour du graphique
  const updateChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.data = data;
      chartRef.current.options = options;
      chartRef.current.update('none'); // Mise à jour sans animation pour être plus rapide
    }
  }, [data, options]);

  // Fonction pour recréer complètement le graphique
  const recreateChart = useCallback(() => {
    destroyChart();
    // Petit délai pour laisser le temps au DOM de se nettoyer
    setTimeout(() => {
      setIsChartReady(true);
    }, 10);
  }, [destroyChart]);

  // Effet pour gérer les changements de trigger de re-rendu
  useEffect(() => {
    if (redrawTrigger !== undefined) {
      console.log('Chart redraw triggered by:', redrawTrigger);
      recreateChart();
    }
  }, [redrawTrigger, recreateChart]);

  // Effet pour gérer les changements de données
  useEffect(() => {
    if (isChartReady && chartRef.current) {
      updateChart();
    }
  }, [data, options, isChartReady, updateChart]);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      destroyChart();
    };
  }, [destroyChart]);

  // Callback pour obtenir la référence du graphique
  const getChartRef = useCallback((chart: ChartJS<'line'> | null) => {
    chartRef.current = chart;
  }, []);

  // Gestion des erreurs de rendu
  const handleChartError = useCallback((error: Error) => {
    console.error('Chart rendering error:', error);
    // Tenter une recréation en cas d'erreur
    recreateChart();
  }, [recreateChart]);

  if (!isChartReady && redrawTrigger !== undefined) {
    return (
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <div style={{ color: '#666' }}>Updating chart...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Line 
        ref={getChartRef}
        data={data} 
        options={options}
        onError={handleChartError}
        redraw
      />
    </div>
  );
};

export default RobustChart;
