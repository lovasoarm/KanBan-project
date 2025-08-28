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
  // Comparaison des données
  if (JSON.stringify(prevProps.data) !== JSON.stringify(nextProps.data)) {
    return false;
  }

  if (prevProps.options !== nextProps.options) {
    return false;
  }
  
  return true;
};

export const MemoizedBarChart = memo<MemoizedBarChartProps>(({ data, options }) => {
  return <Bar data={data} options={options} />;
}, chartPropsAreEqual);

export const MemoizedLineChart = memo<MemoizedLineChartProps>(({ data, options }) => {
  return <Line data={data} options={options} />;
}, chartPropsAreEqual);

export const MemoizedDoughnutChart = memo<MemoizedDoughnutChartProps>(({ data, options }) => {
  return <Doughnut data={data} options={options} />;
}, chartPropsAreEqual);

MemoizedBarChart.displayName = 'MemoizedBarChart';
MemoizedLineChart.displayName = 'MemoizedLineChart';
MemoizedDoughnutChart.displayName = 'MemoizedDoughnutChart';
