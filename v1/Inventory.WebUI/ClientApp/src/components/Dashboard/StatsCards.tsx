import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface StatsData {
  salesOverview: {
    value: number;
    change: number;
  };
  revenue: {
    value: number;
    change: number;
  };
  profit: {
    value: number;
    change: number;
  };
  cost: {
    value: number;
    change: number;
  };
  quantityInHand: {
    value: number;
    change: number;
  };
  toBeReceived: {
    value: number;
    change: number;
  };
}

interface StatsCardsProps {
  data?: StatsData;
}

interface StatCardProps {
  icon: string;
  iconColor: string;
  title: string;
  value: string;
  change: number;
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  iconColor, 
  title, 
  value, 
  change, 
  prefix = '', 
  suffix = '' 
}) => {
  const isPositive = change >= 0;
  const changeIcon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
  const changeColor = isPositive ? 'text-success' : 'text-danger';

  return (
    <Card className="stat-card h-100">
      <Card.Body className="d-flex align-items-center">
        <div className={`stat-icon ${iconColor}`}>
          <i className={`fas ${icon}`}></i>
        </div>
        
        <div className="stat-content flex-grow-1">
          <div className="stat-header">
            <h6 className="stat-title">{title}</h6>
            <div className={`stat-change ${changeColor}`}>
              <i className={`fas ${changeIcon} me-1`}></i>
              <span>{Math.abs(change)}%</span>
            </div>
          </div>
          
          <div className="stat-value">
            <span className="prefix">{prefix}</span>
            <span className="value">{value}</span>
            <span className="suffix">{suffix}</span>
          </div>
          
          <div className="stat-subtitle">
            vs last month
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  // Default data si pas de données disponibles
  const defaultData: StatsData = {
    salesOverview: { value: 125000, change: 12.5 },
    revenue: { value: 89500, change: 8.3 },
    profit: { value: 23000, change: -2.1 },
    cost: { value: 66500, change: 5.7 },
    quantityInHand: { value: 12890, change: 15.2 },
    toBeReceived: { value: 2340, change: 22.1 }
  };

  const stats = data || defaultData;

  const cardConfigs = [
    {
      icon: 'fa-chart-line',
      iconColor: 'bg-primary',
      title: 'Sales Overview',
      value: formatCurrency(stats.salesOverview.value),
      change: stats.salesOverview.change
    },
    {
      icon: 'fa-dollar-sign',
      iconColor: 'bg-success',
      title: 'Revenue',
      value: formatCurrency(stats.revenue.value),
      change: stats.revenue.change
    },
    {
      icon: 'fa-coins',
      iconColor: 'bg-warning',
      title: 'Profit',
      value: formatCurrency(stats.profit.value),
      change: stats.profit.change
    },
    {
      icon: 'fa-receipt',
      iconColor: 'bg-danger',
      title: 'Cost',
      value: formatCurrency(stats.cost.value),
      change: stats.cost.change
    },
    {
      icon: 'fa-boxes',
      iconColor: 'bg-info',
      title: 'Quantity in Hand',
      value: formatNumber(stats.quantityInHand.value),
      change: stats.quantityInHand.change,
      suffix: ' units'
    },
    {
      icon: 'fa-truck-loading',
      iconColor: 'bg-secondary',
      title: 'To be Received',
      value: formatNumber(stats.toBeReceived.value),
      change: stats.toBeReceived.change,
      suffix: ' units'
    }
  ];

  return (
    <Row className="stats-cards">
      {cardConfigs.map((config, index) => (
        <Col key={index} xl={2} lg={4} md={6} className="mb-4">
          <StatCard {...config} />
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
