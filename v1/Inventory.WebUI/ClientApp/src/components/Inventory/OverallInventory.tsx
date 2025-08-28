import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { InventoryMetrics } from '../../hooks/useInventory';
import './OverallInventory.css';

interface OverallInventoryProps {
  metrics: InventoryMetrics | null;
  loading?: boolean;
}

interface MetricCardProps {
  title: string;
  icon: string;
  iconColor: string;
  primaryValue: string | number;
  primaryLabel?: string;
  secondaryValue?: string | number;
  secondaryLabel?: string;
  footerText: string;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon,
  iconColor,
  primaryValue,
  primaryLabel,
  secondaryValue,
  secondaryLabel,
  footerText,
  loading
}) => {
  if (loading) {
    return (
      <Card className="metric-card h-100">
        <Card.Body className="d-flex flex-column">
          <div className="metric-header mb-3">
            <div className={`metric-icon ${iconColor}`}>
              <i className={`fas ${icon}`}></i>
            </div>
            <h6 className="metric-title">{title}</h6>
          </div>
          
          <div className="metric-content flex-grow-1">
            <div className="metric-values">
              <div className="primary-metric">
                <div className="loading-skeleton-value"></div>
                {primaryLabel && <div className="loading-skeleton-label"></div>}
              </div>
              
              {secondaryValue !== undefined && (
                <div className="secondary-metric">
                  <div className="loading-skeleton-value"></div>
                  {secondaryLabel && <div className="loading-skeleton-label"></div>}
                </div>
              )}
            </div>
          </div>
          
          <div className="metric-footer">
            <small className="text-muted">{footerText}</small>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="metric-card h-100">
      <Card.Body className="d-flex flex-column">
        <div className="metric-header mb-3">
          <div className={`metric-icon ${iconColor}`}>
            <i className={`fas ${icon}`}></i>
          </div>
          <h6 className="metric-title">{title}</h6>
        </div>
        
        <div className="metric-content flex-grow-1">
          <div className="metric-values">
            <div className="primary-metric">
              <div className="metric-value">{primaryValue}</div>
              {primaryLabel && <div className="metric-label">{primaryLabel}</div>}
            </div>
            
            {secondaryValue !== undefined && (
              <div className="secondary-metric">
                <div className="metric-value">{secondaryValue}</div>
                {secondaryLabel && <div className="metric-label">{secondaryLabel}</div>}
              </div>
            )}
          </div>
        </div>
        
        <div className="metric-footer">
          <small className="text-muted">{footerText}</small>
        </div>
      </Card.Body>
    </Card>
  );
};

const OverallInventory: React.FC<OverallInventoryProps> = ({ metrics, loading }) => {
  const formatCurrency = (value: number, unit: string = '₹') => {
    return `${unit}${value.toLocaleString()}`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <Row className="overall-inventory">
      {/* Categories */}
      <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
        <MetricCard
          title="Categories"
          icon="fa-tags"
          iconColor="bg-primary"
          primaryValue={metrics?.categories.value || 0}
          footerText={`Last ${metrics?.categories.lastDays || 30} days`}
          loading={loading}
        />
      </Col>

      {/* Total Products */}
      <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
        <MetricCard
          title="Total Products"
          icon="fa-cube"
          iconColor="bg-success"
          primaryValue={formatNumber(metrics?.totalProducts.value || 0)}
          primaryLabel={`Last ${metrics?.totalProducts.lastDays || 30} days`}
          secondaryValue={formatCurrency(metrics?.totalProducts.revenue || 0, metrics?.totalProducts.revenueUnit)}
          secondaryLabel="Revenue"
          footerText="Product inventory status"
          loading={loading}
        />
      </Col>

      {/* Top Selling */}
      <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
        <MetricCard
          title="Top Selling"
          icon="fa-chart-line"
          iconColor="bg-warning"
          primaryValue={formatNumber(metrics?.topSelling.value || 0)}
          primaryLabel={`Last ${metrics?.topSelling.lastDays || 7} days`}
          secondaryValue={formatCurrency(metrics?.topSelling.cost || 0, metrics?.topSelling.costUnit)}
          secondaryLabel="Cost"
          footerText="Best performing products"
          loading={loading}
        />
      </Col>

      {/* Low Stock */}
      <Col xl={3} lg={6} md={6} sm={12} className="mb-4">
        <MetricCard
          title="Low Stock"
          icon="fa-exclamation-triangle"
          iconColor="bg-danger"
          primaryValue={formatNumber(metrics?.lowStock.value || 0)}
          primaryLabel={`Last ${metrics?.lowStock.lastDays || 7} days`}
          secondaryValue={`${metrics?.lowStock.notInStock || 0} ${metrics?.lowStock.notInStockUnit || 'products'}`}
          secondaryLabel="Not in stock"
          footerText="Requires attention"
          loading={loading}
        />
      </Col>
    </Row>
  );
};

export default OverallInventory;
