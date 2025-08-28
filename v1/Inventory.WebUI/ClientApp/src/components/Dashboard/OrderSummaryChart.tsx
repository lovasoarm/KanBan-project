import React from 'react';
import { Card } from 'react-bootstrap';
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
  Filler,
  ChartOptions
} from 'chart.js';
import { useOptimizedDashboard } from '../../hooks/useOptimizedDashboard';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface OrderSummaryChartProps {
  className?: string;
}

const OrderSummaryChart: React.FC<OrderSummaryChartProps> = ({ className = '' }) => {
  
  const { data: dashboardData, isLoading } = useOptimizedDashboard();


  const orderData = dashboardData?.charts?.orderSummary;
  
  const data = {
    labels: orderData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Ordered',
        data: orderData?.orderedData || [3200, 2800, 3500, 3100, 3400],
        borderColor: '#FF8C00', // Orange
        backgroundColor: 'rgba(255, 140, 0, 0.1)', 
        borderWidth: 3,
        fill: true, // Remplissage activé
        tension: 0.4, // Courbe lissée
        pointBackgroundColor: '#FF8C00',
        pointBorderColor: '#FF8C00',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Delivered',
        data: orderData?.deliveredData || [2900, 2500, 3200, 2800, 3100],
        borderColor: '#87CEEB', // Bleu clair
        backgroundColor: 'transparent', 
        borderWidth: 3,
        fill: false, // Pas de remplissage
        tension: 0.4, // Courbe lissée
        pointBackgroundColor: '#87CEEB',
        pointBorderColor: '#87CEEB',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'center' as const,
        labels: {
          usePointStyle: true, 
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: '500',
          },
          color: '#64748B',
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, i) => ({
              text: dataset.label || '',
              fillStyle: dataset.borderColor as string,
              strokeStyle: dataset.borderColor as string,
              pointStyle: 'circle',
              hidden: false,
              lineCap: 'butt' as const,
              lineDash: [],
              lineDashOffset: 0,
              lineJoin: 'miter' as const,
              lineWidth: 3,
              datasetIndex: i,
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 12,
            weight: '500',
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 4000,
        ticks: {
          stepSize: 1000,
          color: '#64748B',
          font: {
            size: 12,
            weight: '500',
          },
          callback: function(value) {
            return `${value}`;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  // État de chargement
  if (isLoading) {
    return (
      <Card className={`h-100 shadow-sm border-0 ${className}`}>
        <Card.Header className="bg-white border-bottom-0 pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 fw-semibold text-dark">Order Summary</h5>
            <div className="text-muted">
              <i className="fas fa-chart-line me-2"></i>
              <span className="small">Monthly Overview</span>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="pt-3">
          <div 
            style={{ height: '300px', width: '100%' }} 
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="text-muted small">Loading chart data...</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className={`h-100 shadow-sm border-0 ${className}`}>
      <Card.Header className="bg-white border-bottom-0 pb-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 fw-semibold text-dark">Order Summary</h5>
          <div className="text-muted">
            <i className="fas fa-chart-line me-2"></i>
            <span className="small">Monthly Overview</span>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="pt-3">
        <div style={{ height: '300px', width: '100%' }}>
          <Line data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummaryChart;
