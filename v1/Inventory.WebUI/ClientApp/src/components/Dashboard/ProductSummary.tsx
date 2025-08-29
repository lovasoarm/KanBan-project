import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { ProductSummary as ProductSummaryType } from '../../types/dashboard.types';

interface ProductSummaryProps {
  data?: ProductSummaryType;
}

const ProductSummary: React.FC<ProductSummaryProps> = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <Card.Body className="text-center py-4">
          <div className="text-muted">Chargement...</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">
          <i className="fas fa-box me-2"></i>
          Résumé Produits
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Row className="text-center">
          <Col xs={6} className="mb-3">
            <div className="border-end">
              <div className="h4 mb-0 text-primary">{data.numberOfSuppliers}</div>
              <small className="text-muted">Fournisseurs</small>
            </div>
          </Col>
          <Col xs={6} className="mb-3">
            <div>
              <div className="h4 mb-0 text-info">{data.numberOfCategories}</div>
              <small className="text-muted">Catégories</small>
            </div>
          </Col>
        </Row>
        
        <Row className="text-center mb-3">
          <Col xs={12}>
            <div className="py-2 border-top border-bottom">
              <div className="h3 mb-0 text-success">{data.totalProducts.toLocaleString()}</div>
              <small className="text-muted">Total Produits</small>
            </div>
          </Col>
        </Row>
        
        <Row className="text-center">
          <Col xs={6}>
            <div className="border-end">
              <div className="h5 mb-0 text-warning">{data.activeProducts.toLocaleString()}</div>
              <small className="text-muted">Actifs</small>
            </div>
          </Col>
          <Col xs={6}>
            <div>
              <div className="h5 mb-0 text-secondary">{(data.totalProducts - data.activeProducts).toLocaleString()}</div>
              <small className="text-muted">Inactifs</small>
            </div>
          </Col>
        </Row>

        {}
        <div className="mt-4 pt-3 border-top text-center">
          <div className="small text-muted">Prix Moyen</div>
          <div className="h4 text-primary mb-0">€{data.averagePrice.toFixed(2)}</div>
        </div>

        {}
        <div className="mt-4 pt-3 border-top">
          <div className="row text-center small">
            <div className="col-4">
              <div className="text-success fw-bold">{Math.round((data.activeProducts / data.totalProducts) * 100)}%</div>
              <div className="text-muted">Taux Actifs</div>
            </div>
            <div className="col-4">
              <div className="text-info fw-bold">{Math.round(data.totalProducts / data.numberOfCategories)}</div>
              <div className="text-muted">Par Catégorie</div>
            </div>
            <div className="col-4">
              <div className="text-warning fw-bold">{Math.round(data.totalProducts / data.numberOfSuppliers)}</div>
              <div className="text-muted">Par Fournisseur</div>
            </div>
          </div>
        </div>

        {}
        <div className="mt-3 d-grid gap-2">
          <button className="btn btn-outline-success btn-sm">
            <i className="fas fa-plus me-1"></i>
            Ajouter Produit
          </button>
          <button className="btn btn-outline-info btn-sm">
            <i className="fas fa-list me-1"></i>
            Voir Tous les Produits
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductSummary;
