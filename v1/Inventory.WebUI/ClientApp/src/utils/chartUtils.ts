import { ChartOptions } from 'chart.js';

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderWidth?: number;
  borderColor?: string | string[];
  tension?: number;
  fill?: boolean;
}

export const CHART_COLORS = {
  CATEGORY: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'],
  STATUS: ['#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1'],
  TREND: {
    BORDER: '#36A2EB',
    BACKGROUND: 'rgba(54, 162, 235, 0.1)'
  }
} as const;

export const createChartOptions = (options?: Partial<ChartOptions>): ChartOptions => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0, 
  },
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
    },
    ...options?.plugins
  },
  ...options
});

export const createCategoryChartData = (data: Array<{ category: string; count: number }>): ChartData => ({
  labels: data.map(item => item.category),
  datasets: [{
    label: 'Products by Category',
    data: data.map(item => item.count),
    backgroundColor: CHART_COLORS.CATEGORY,
    borderWidth: 2,
    borderColor: '#fff'
  }]
});

export const createStatusChartData = (data: Array<{ status: string; count: number }>): ChartData => ({
  labels: data.map(item => item.status),
  datasets: [{
    label: 'Stock Status',
    data: data.map(item => item.count),
    backgroundColor: CHART_COLORS.STATUS,
    borderWidth: 2,
    borderColor: '#fff'
  }]
});

export const createTrendChartData = (data: Array<{ month: string; value: number }>): ChartData => ({
  labels: data.map(item => item.month),
  datasets: [{
    label: 'Stock Value Trend',
    data: data.map(item => item.value),
    borderColor: CHART_COLORS.TREND.BORDER,
    backgroundColor: CHART_COLORS.TREND.BACKGROUND,
    tension: 0.4,
    fill: true
  }]
});

export const formatCurrency = (value: number, locale: string = 'en-US', currency: string = 'USD'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

export const formatNumber = (value: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(value);
};
