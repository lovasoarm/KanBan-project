import React from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { TableData } from '../../types/dashboard.types';

interface TablesSectionProps {
  data?: TableData;
}

const TablesSection: React.FC<TablesSectionProps> = ({ data }) => {
  if (!data) {
    return (
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body className="text-center py-4">
              <div className="text-muted">Chargement des données...</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  const getUrgencyBadge = (urgency: 'critical' | 'warning' | 'info') => {
    const variants = {
      critical: 'danger',
      warning: 'warning',
      info: 'info'
    };
    return <Badge bg={variants[urgency]}>{urgency.toUpperCase()}</Badge>;
  };

  return (
    <Row>
      {/* Top Selling Stock */}
      <Col xs={12} className="mb-4">
        <Card>
          <Card.Header>
            <Card.Title className="mb-0">
              <i className="fas fa-chart-line me-2"></i>
              Produits les plus vendus
            </Card.Title>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive striped hover className="mb-0">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Catégorie</th>
                  <th>Vendu</th>
                  <th>Restant</th>
                  <th>Prix</th>
                  <th>Valeur Restante</th>
                </tr>
              </thead>
              <tbody>
                {data.topSellingStock?.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="me-2"
                            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '4px' }}
                          />
                        )}
                        <div>
                          <div className="fw-bold">{product.name}</div>
                          <small className="text-muted">#{product.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="secondary">{product.category}</Badge>
                    </td>
                    <td>
                      <span className="badge bg-success">{product.soldQuantity.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`badge ${product.remainingQuantity < 10 ? 'bg-danger' : 'bg-info'}`}>
                        {product.remainingQuantity.toLocaleString()}
                      </span>
                    </td>
                    <td>€{product.price.toFixed(2)}</td>
                    <td className="fw-bold text-primary">
                      €{(product.price * product.remainingQuantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      {/* Low Quantity Stock */}
      <Col xs={12}>
        <Card>
          <Card.Header>
            <Card.Title className="mb-0">
              <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
              Stock Faible
            </Card.Title>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive striped hover className="mb-0">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Stock Actuel</th>
                  <th>Stock Min</th>
                  <th>Fournisseur</th>
                  <th>Dernier Réassort</th>
                  <th>Urgence</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.lowQuantityStock?.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div>
                        <div className="fw-bold">{product.name}</div>
                        <small className="text-muted">#{product.id}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${product.currentStock === 0 ? 'bg-danger' : product.currentStock <= product.minStock ? 'bg-warning' : 'bg-success'}`}>
                        {product.currentStock}
                      </span>
                    </td>
                    <td>{product.minStock}</td>
                    <td>
                      <div>
                        <div>{product.supplier}</div>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(product.lastRestock).toLocaleDateString()}
                      </small>
                    </td>
                    <td>{getUrgencyBadge(product.urgency)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-plus me-1"></i>
                        Réassortir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {(!data.lowQuantityStock || data.lowQuantityStock.length === 0) && (
              <div className="text-center py-4 text-muted">
                <i className="fas fa-check-circle fa-2x mb-2 text-success"></i>
                <div>Aucun produit en stock faible</div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TablesSection;
