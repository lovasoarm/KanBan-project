import React from 'react';
import { Card } from 'react-bootstrap';
import { PurchaseOverview as PurchaseOverviewType } from '../../types/dashboard.types';

interface PurchaseOverviewProps {
  data?: PurchaseOverviewType;
}

const PurchaseOverview: React.FC<PurchaseOverviewProps> = ({ data }) => {
  if (!data) {
    return (
      <Card className="mb-3">
        <Card.Body className="text-center py-4">
          <div className="text-muted">Chargement...</div>
        </Card.Body>
      </Card>
    );
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <i className="fas fa-arrow-up text-success"></i>;
    if (change < 0) return <i className="fas fa-arrow-down text-danger"></i>;
    return <i className="fas fa-minus text-muted"></i>;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-danger';
    return 'text-muted';
  };

  return (
    <Card className="mb-3">
      <Card.Header>
        <Card.Title className="mb-0">
          <i className="fas fa-shopping-cart me-2"></i>
          Aperçu des Achats
        </Card.Title>
      </Card.Header>
      <Card.Body>
        {}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
          <div>
            <div className="text-muted small">Achats</div>
            <div className="h5 mb-0">€{data.purchase.value.toLocaleString()}</div>
          </div>
          <div className="text-end">
            <div className={`small ${getChangeColor(data.purchase.change)}`}>
              {getChangeIcon(data.purchase.change)}
              <span className="ms-1">{Math.abs(data.purchase.change)}%</span>
            </div>
          </div>
        </div>

        {}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
          <div>
            <div className="text-muted small">Annulations</div>
            <div className="h5 mb-0">€{data.cancel.value.toLocaleString()}</div>
          </div>
          <div className="text-end">
            <div className={`small ${getChangeColor(data.cancel.change)}`}>
              {getChangeIcon(data.cancel.change)}
              <span className="ms-1">{Math.abs(data.cancel.change)}%</span>
            </div>
          </div>
        </div>

        {}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted small">Retours</div>
            <div className="h5 mb-0">€{data.return.value.toLocaleString()}</div>
          </div>
          <div className="text-end">
            <div className={`small ${getChangeColor(data.return.change)}`}>
              {getChangeIcon(data.return.change)}
              <span className="ms-1">{Math.abs(data.return.change)}%</span>
            </div>
          </div>
        </div>

        {}
        <div className="mt-4 pt-3 border-top">
          <div className="text-center">
            <div className="small text-muted">Achats Nets</div>
            <div className="h4 text-primary mb-0">
              €{(data.purchase.value - data.cancel.value - data.return.value).toLocaleString()}
            </div>
          </div>
        </div>

        {}
        <div className="mt-3 d-grid gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="fas fa-plus me-1"></i>
            Nouvelle Commande
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <i className="fas fa-history me-1"></i>
            Voir l'Historique
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PurchaseOverview;
