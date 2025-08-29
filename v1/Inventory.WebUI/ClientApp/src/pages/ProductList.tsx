import React from 'react';
import { Row, Col, Card, Table, Badge, Form, InputGroup, Button } from 'react-bootstrap';

const ProductList: React.FC = () => {
  return (
    <div className="product-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-box me-2"></i>
          Products
        </h1>
        <Button variant="primary">
          <i className="fas fa-plus me-1"></i>
          Add Product
        </Button>
      </div>

      <Row className="mb-4">
        <Col lg={6}>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Search products..."
            />
            <Button variant="outline-secondary">
              <i className="fas fa-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col lg={6} className="d-flex justify-content-end">
          <Form.Select style={{ width: 'auto' }} className="me-2">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
          </Form.Select>
          <Form.Select style={{ width: 'auto' }}>
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </Form.Select>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>LAPTOP-001</code></td>
                <td>Dell XPS Laptop</td>
                <td>Electronics</td>
                <td>25</td>
                <td>$1,299.99</td>
                <td><Badge bg="success">Available</Badge></td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-1">
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button size="sm" variant="outline-danger">
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
              <tr>
                <td><code>PHONE-002</code></td>
                <td>iPhone 15 Pro</td>
                <td>Electronics</td>
                <td>3</td>
                <td>$999.99</td>
                <td><Badge bg="warning">Low Stock</Badge></td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-1">
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button size="sm" variant="outline-danger">
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductList;
