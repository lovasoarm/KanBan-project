import React from 'react';
import { Card } from 'react-bootstrap';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  trend?: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  subtitle 
}) => {
  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-success';
    if (trend.startsWith('-')) return 'text-danger';
    return 'text-muted';
  };

  return (
    <Card className={`stats-card border-${color} h-100`}>
      <Card.Body className="d-flex align-items-center">
        <div className={`stats-icon bg-${color} text-white rounded-circle me-3`}>
          <i className={icon}></i>
        </div>
        <div className="flex-grow-1">
          <h6 className="stats-title text-muted mb-1">{title}</h6>
          <h3 className="stats-value mb-1">{value}</h3>
          {trend && (
            <small className={`stats-trend ${getTrendColor(trend)}`}>
              <i className={`fas ${trend.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'} me-1`}></i>
              {trend}
            </small>
          )}
          {subtitle && (
            <small className="text-muted d-block">{subtitle}</small>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;
