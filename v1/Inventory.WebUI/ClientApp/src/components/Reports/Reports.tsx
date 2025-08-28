import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';
import './Reports.css';
import '../Dashboard/Dashboard.css';
import { 
  ReportsResponse, 
  MetricCardData, 
  FormattedBestCategory, 
  FormattedBestProduct
} from '../../types/reports';
import { useReports } from '../../hooks/useReports';
import { formatINR, formatNumber, formatChartAxisValue } from '../../utils/formatters';
import { MemoizedLineChart } from '../Common/MemoizedChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Types importés depuis types/reports.ts

const Reports: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [chartKey, setChartKey] = useState(0);
  
  // Utilisation du hook personnalisé pour gérer les données
  const { data: reportsData, loading, error, refetch } = useReports();

  // Fonction pour obtenir le mois actuel en format abrégé (Jan, Feb, etc.)
  const getCurrentMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date().getMonth()];
  };

  // Prepare overview metrics
  const overviewMetrics: MetricCardData[] = reportsData ? [
    { value: formatINR(reportsData.overview.totalProfit), label: 'Total Profit' },
    { value: formatINR(reportsData.overview.revenue), label: 'Revenue' },
    { value: formatNumber(reportsData.overview.sales), label: 'Sales' }
  ] : [
    { value: '₹0', label: 'Total Profit' },
    { value: '₹0', label: 'Revenue' },
    { value: '0', label: 'Sales' }
  ];

  const secondRowMetrics: MetricCardData[] = reportsData ? [
    { value: formatINR(reportsData.overview.netPurchaseValue), label: 'Net Purchase Value' },
    { value: formatINR(reportsData.overview.netSalesValue), label: 'Net Sales Value' },
    { value: formatINR(reportsData.overview.momProfit), label: 'MoM Profit' },
    { value: formatINR(reportsData.overview.yoyProfit), label: 'YoY Profit' }
  ] : [
    { value: '₹0', label: 'Net Purchase Value' },
    { value: '₹0', label: 'Net Sales Value' },
    { value: '₹0', label: 'MoM Profit' },
    { value: '₹0', label: 'YoY Profit' }
  ];

  const bestCategories: FormattedBestCategory[] = reportsData?.bestCategories?.map(cat => ({
    category: cat.category,
    turnover: formatINR(cat.turnOver),
    increaseBy: cat.increaseBy
  })) || [];

  const bestProducts: FormattedBestProduct[] = reportsData?.bestProducts?.map(prod => ({
    product: prod.product,
    productId: prod.productId,
    category: prod.category,
    remainingQuantity: prod.remainingQuantity,
    turnover: formatINR(prod.turnOver),
    increaseBy: prod.increaseBy
  })) || [];

  // Prepare chart data based on API response
  const chartData = reportsData?.chartData || null;
  
  // Debug: Log chart data to see what we're receiving
  React.useEffect(() => {
    if (chartData) {
      console.log('Chart Data received:', chartData);
      console.log('Weekly data:', chartData.weekly);
      if (chartData.weekly) {
        console.log('Weekly labels:', chartData.weekly.labels);
        console.log('Weekly revenue:', chartData.weekly.revenue);
        console.log('Weekly profit:', chartData.weekly.profit);
      }
    }
  }, [chartData]);
  

  // Fonction pour obtenir les données selon la période sélectionnée avec useMemo pour optimisation
  const getCurrentPeriodData = useMemo(() => {
    console.log('getCurrentPeriodData - chartData:', chartData);
    console.log('getCurrentPeriodData - chartPeriod:', chartPeriod);
    
    // Définir les données par défaut pour chaque période
    const getDefaultData = (period: 'weekly' | 'monthly') => {
      if (period === 'monthly') {
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          revenue: [120000, 190000, 300000, 250000, 220000, 350000],
          profit: [80000, 120000, 180000, 150000, 140000, 200000]
        };
      } else {
        return {
          labels: ['W1', 'W2', 'W3', 'W4'],
          revenue: [85000, 120000, 95000, 140000],
          profit: [55000, 80000, 62000, 92000]
        };
      }
    };
    
    // Si pas de données API, utiliser des données par défaut
    if (!chartData) {
      console.log('No chartData from API, using default data for:', chartPeriod);
      return getDefaultData(chartPeriod);
    }
    
    // Vérifier si les données de la période demandée existent et sont valides
    const periodData = chartData[chartPeriod];
    
    if (periodData && periodData.labels && periodData.labels.length > 0 && 
        periodData.revenue && periodData.revenue.length > 0 && 
        periodData.profit && periodData.profit.length > 0) {
      console.log('Using API data for period:', chartPeriod);
      return periodData;
    }
    
    // Fallback: retourner les données par défaut si les données API sont incomplètes
    console.log('API data incomplete for period:', chartPeriod, ', using default data');
    return getDefaultData(chartPeriod);
  }, [chartData, chartPeriod]);

  // Gestionnaire de changement de période avec callback mémorisé
  const handlePeriodChange = useCallback((period: 'weekly' | 'monthly') => {
    console.log('Changing chart period to:', period);
    setChartPeriod(period);
    // Incrémente la clé pour forcer le re-rendu du graphique
    setChartKey(prevKey => prevKey + 1);
  }, []);
  
  // Force re-render when period changes
  useEffect(() => {
    console.log('Chart period changed to:', chartPeriod);
    console.log('Current data:', getCurrentPeriodData);
    // La clé chartKey s'occupe déjà du re-rendu, pas besoin de destroy manuel
  }, [chartPeriod, getCurrentPeriodData]);
  
  // Données du graphique optimisées avec useMemo
  const chartDisplayData = useMemo(() => ({
    labels: getCurrentPeriodData.labels,
    datasets: getCurrentPeriodData.labels.length > 0 ? [
      {
        label: 'Revenue',
        data: getCurrentPeriodData.revenue,
        borderColor: '#2979FF',
        backgroundColor: 'rgba(41, 121, 255, 0.1)',
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#2979FF',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: false,
        cubicInterpolationMode: 'monotone' as const
      },
      {
        label: 'Profit',
        data: getCurrentPeriodData.profit,
        borderColor: '#FBC02D',
        backgroundColor: 'rgba(251, 192, 45, 0.2)',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#FBC02D',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
        cubicInterpolationMode: 'monotone' as const
      }
    ] : []
  }), [getCurrentPeriodData]);

  // Options du graphique optimisées avec useMemo
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    redraw: true, // Force le redessin
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        grid: {
          color: '#F3F4F6',
          borderDash: [3, 3]
        },
        border: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500'
          },
          callback: function(value: any) {
            return formatChartAxisValue(value);
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function() {
            return '';
          },
          label: function(context: TooltipItem<'line'>) {
            const value = context.parsed.y;
            const formattedValue = new Intl.NumberFormat('en-IN').format(value);
            const currentMonth = getCurrentMonth();
            const period = chartPeriod === 'weekly' ? 'Week' : 'Month';
            return `This ${period} ${formattedValue} ${currentMonth}`;
          }
        }
      }
    },
    elements: {
      point: {
        hoverBorderWidth: 3
      }
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart' as const
    },
    transitions: {
      active: {
        animation: {
          duration: 200
        }
      }
    }
  }), [chartPeriod]);

  // Affichage conditionnel pour le chargement et les erreurs
  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des rapports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container">
        <div className="error-state">
          <h3>Erreur lors du chargement</h3>
          <p>{error}</p>
          <button onClick={refetch} className="retry-button">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">

      {/* Top Row - Overview and Best Selling Category side by side */}
      <div className="reports-top-row">
        {/* Overview Section */}
        <div className="overview-section">
          <h2 className="section-title mb-3">Overview</h2>
          
          {/* First Row - 3 columns */}
          <div className="overview-cards">
            {overviewMetrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Second Row - 4 columns */}
          <div className="overview-metrics">
            {secondRowMetrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Selling Category */}
        <div className="best-selling-section">
          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">Best Selling Category</h3>
              <a href="#" className="see-all">See All</a>
            </div>
            <div className="table-body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Turn Over</th>
                    <th>Increase By</th>
                  </tr>
                </thead>
                <tbody>
                  {bestCategories.map((category, index) => (
                    <tr key={index}>
                      <td>{category.category}</td>
                      <td className="price">{category.turnover}</td>
                      <td>
                        <span className="increase-badge">{category.increaseBy}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Profit & Revenue Chart */}
      <div className="reports-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Profit & Revenue</h3>
            <div className="period-toggle">
              <button 
                className={`toggle-btn ${chartPeriod === 'weekly' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('weekly')}
              >
                <i className="fas fa-calendar-week"></i>
                Weekly
              </button>
              <button 
                className={`toggle-btn ${chartPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => handlePeriodChange('monthly')}
              >
                <i className="fas fa-calendar-alt"></i>
                Monthly
              </button>
            </div>
          </div>
          <div className="chart-body">
            <div style={{ height: '240px', flexGrow: 1 }}>
              {getCurrentPeriodData.labels.length > 0 ? (
                <Line 
                  key={`${chartPeriod}-${chartKey}`}
                  data={chartDisplayData}
                  options={chartOptions}
                  redraw
                />
              ) : (
                <div className="no-data-message">
                  <p>Aucune donnée disponible pour le moment</p>
                </div>
              )}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color revenue-color"></div>
                <span>Revenue</span>
              </div>
              <div className="legend-item">
                <div className="legend-color profit-color"></div>
                <span>Profit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Product */}
      <div className="reports-section">
        <div className="table-card">
          <div className="table-header">
            <h3 className="table-title">Best Selling Product</h3>
            <a href="#" className="see-all">See All</a>
          </div>
          <div className="table-body">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Product ID</th>
                  <th>Category</th>
                  <th>Remaining Quantity</th>
                  <th>Turn Over</th>
                  <th>Increase By</th>
                </tr>
              </thead>
              <tbody>
                {bestProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="product-name">{product.product}</td>
                    <td>{product.productId}</td>
                    <td>{product.category}</td>
                    <td>
                      <span className="quantity-remaining">{product.remainingQuantity}</span>
                    </td>
                    <td className="price">{product.turnover}</td>
                    <td>
                      <span className="increase-badge">{product.increaseBy}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
