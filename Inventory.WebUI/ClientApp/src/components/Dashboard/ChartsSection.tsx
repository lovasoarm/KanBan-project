import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartData } from '../../types/dashboard.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsSectionProps {
  data?: ChartData;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ data }) => {
  if (!data) {
    return (
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body className="text-center py-4">
              <div className="text-muted">Chargement des graphiques...</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  const salesPurchaseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Ventes vs Achats',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const salesPurchaseData = {
    labels: data.salesAndPurchase.labels,
    datasets: [
      {
        label: 'Ventes',
        data: data.salesAndPurchase.salesData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Achats',
        data: data.salesAndPurchase.purchaseData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const orderSummaryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Résumé des Commandes',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const orderSummaryData = {
    labels: data.orderSummary.labels,
    datasets: [
      {
        label: 'Commandé',
        data: data.orderSummary.orderedData,
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
      },
      {
        label: 'Livré',
        data: data.orderSummary.deliveredData,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
    ],
  };

  // Données pour le graphique en secteurs (exemple)
  const categoryData = {
    labels: ['Électronique', 'Vêtements', 'Maison', 'Autres'],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      },
    ],
  };

  const categoryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Répartition par Catégorie',
      },
    },
  };

  return (
    <Row>
      <Col lg={6} className="mb-3">
        <Card>
          <Card.Body>
            <Line options={salesPurchaseOptions} data={salesPurchaseData} />
          </Card.Body>
        </Card>
      </Col>
      
      <Col lg={6} className="mb-3">
        <Card>
          <Card.Body>
            <Bar options={orderSummaryOptions} data={orderSummaryData} />
          </Card.Body>
        </Card>
      </Col>
      
      <Col lg={6} className="mb-3">
        <Card>
          <Card.Body>
            <Doughnut options={categoryOptions} data={categoryData} />
          </Card.Body>
        </Card>
      </Col>
      
      <Col lg={6} className="mb-3">
        <Card>
          <Card.Header>
            <Card.Title className="mb-0">Métriques Récentes</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="row text-center">
              <div className="col-6 mb-3">
                <div className="h4 mb-0 text-primary">€{data.salesAndPurchase.salesData.reduce((a, b) => a + b, 0).toLocaleString()}</div>
                <small className="text-muted">Ventes Totales</small>
              </div>
              <div className="col-6 mb-3">
                <div className="h4 mb-0 text-success">€{data.salesAndPurchase.purchaseData.reduce((a, b) => a + b, 0).toLocaleString()}</div>
                <small className="text-muted">Achats Totaux</small>
              </div>
              <div className="col-6">
                <div className="h4 mb-0 text-info">{data.orderSummary.orderedData.reduce((a, b) => a + b, 0)}</div>
                <small className="text-muted">Commandes</small>
              </div>
              <div className="col-6">
                <div className="h4 mb-0 text-warning">{data.orderSummary.deliveredData.reduce((a, b) => a + b, 0)}</div>
                <small className="text-muted">Livrées</small>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ChartsSection;
