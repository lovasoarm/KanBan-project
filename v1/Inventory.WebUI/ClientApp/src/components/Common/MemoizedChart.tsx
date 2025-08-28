import React, { memo } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';

interface MemoizedBarChartProps {
  data: ChartData<'bar', number[], string>;
  options: ChartOptions<'bar'>;
}

interface MemoizedLineChartProps {
  data: ChartData<'line', number[], string>;
  options: ChartOptions<'line'>;
}

interface MemoizedDoughnutChartProps {
  data: ChartData<'doughnut', number[], string>;
  options: ChartOptions<'doughnut'>;
}


const chartPropsAreEqual = (
  prevProps: MemoizedBarChartProps | MemoizedLineChartProps | MemoizedDoughnutChartProps, 
  nextProps: MemoizedBarChartProps | MemoizedLineChartProps | MemoizedDoughnutChartProps
) => {
  // Comparaison plus profonde des données
  const prevDataStr = JSON.stringify(prevProps.data);
  const nextDataStr = JSON.stringify(nextProps.data);
  
  if (prevDataStr !== nextDataStr) {
    console.log('Chart data changed, triggering rerender');
    return false;
  }

  // Comparaison des options (référentielle pour la performance)
  if (prevProps.options !== nextProps.options) {
    console.log('Chart options changed, triggering rerender');
    return false;
  }
  
  return true;
};

// Fonction spécialisée pour les graphiques en ligne
const lineChartPropsAreEqual = (
  prevProps: MemoizedLineChartProps, 
  nextProps: MemoizedLineChartProps
) => {
  // Comparaison des labels
  const prevLabels = prevProps.data.labels;
  const nextLabels = nextProps.data.labels;
  
  if (prevLabels?.length !== nextLabels?.length) {
    return false;
  }
  
  if (prevLabels && nextLabels && prevLabels.some((label, index) => label !== nextLabels[index])) {
    return false;
  }
  
  // Comparaison des datasets
  const prevDatasets = prevProps.data.datasets;
  const nextDatasets = nextProps.data.datasets;
  
  if (prevDatasets.length !== nextDatasets.length) {
    return false;
  }
  
  for (let i = 0; i < prevDatasets.length; i++) {
    const prevDataset = prevDatasets[i];
    const nextDataset = nextDatasets[i];
    
    if (prevDataset.data.length !== nextDataset.data.length) {
      return false;
    }
    
    if (prevDataset.data.some((value, index) => value !== nextDataset.data[index])) {
      return false;
    }
  }
  
  // Comparaison des options
  if (prevProps.options !== nextProps.options) {
    return false;
  }
  
  return true;
};

export const MemoizedBarChart = memo<MemoizedBarChartProps>(({ data, options }) => {
  return <Bar data={data} options={options} />;
}, chartPropsAreEqual);

export const MemoizedLineChart = memo<MemoizedLineChartProps>(({ data, options }) => {
  console.log('MemoizedLineChart rendering with data:', data.labels, 'datasets length:', data.datasets.length);
  return <Line data={data} options={options} redraw />;
}, (prevProps, nextProps) => {
  // Comparaison simplifiée pour forcer le re-rendu lors des changements
  const prevLabelsStr = JSON.stringify(prevProps.data.labels);
  const nextLabelsStr = JSON.stringify(nextProps.data.labels);
  const prevDatasetsStr = JSON.stringify(prevProps.data.datasets.map(d => ({ label: d.label, data: d.data })));
  const nextDatasetsStr = JSON.stringify(nextProps.data.datasets.map(d => ({ label: d.label, data: d.data })));
  
  const areEqual = prevLabelsStr === nextLabelsStr && prevDatasetsStr === nextDatasetsStr && prevProps.options === nextProps.options;
  
  if (!areEqual) {
    console.log('LineChart will rerender - Labels changed:', prevLabelsStr !== nextLabelsStr);
    console.log('LineChart will rerender - Datasets changed:', prevDatasetsStr !== nextDatasetsStr);
    console.log('LineChart will rerender - Options changed:', prevProps.options !== nextProps.options);
  }
  
  return areEqual;
});

export const MemoizedDoughnutChart = memo<MemoizedDoughnutChartProps>(({ data, options }) => {
  return <Doughnut data={data} options={options} />;
}, chartPropsAreEqual);

MemoizedBarChart.displayName = 'MemoizedBarChart';
MemoizedLineChart.displayName = 'MemoizedLineChart';
MemoizedDoughnutChart.displayName = 'MemoizedDoughnutChart';
