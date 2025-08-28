import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { apiService } from '../../services/api';

interface AddProductModalProps {
  show: boolean;
  onHide: () => void;
  onProductAdded: () => void;
}

interface ProductFormData {
  name: string;
  buyingPrice: number;
  quantity: number;
  thresholdValue: number;
  expiryDate: string;
  category: string;
  supplier: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  show,
  onHide,
  onProductAdded
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    buyingPrice: 0,
    quantity: 0,
    thresholdValue: 10,
    expiryDate: '',
    category: '',
    supplier: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'buyingPrice' || name === 'quantity' || name === 'thresholdValue'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      buyingPrice: 0,
      quantity: 0,
      thresholdValue: 10,
      expiryDate: '',
      category: '',
      supplier: ''
    });
    setValidated(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const productData = {
        name: formData.name,
        price: formData.buyingPrice,
        quantity: formData.quantity,
        minQuantity: formData.thresholdValue,
        expiryDate: formData.expiryDate || null,
        category: formData.category,
        supplier: formData.supplier,
        isActive: true
      };

      await apiService.createProduct(productData);
      
      onProductAdded();
      resetForm();
      onHide();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add product';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-plus me-2 text-primary"></i>
          Add New Product
        </Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a product name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a category.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Buying Price (₹) *</Form.Label>
                <Form.Control
                  type="number"
                  name="buyingPrice"
                  value={formData.buyingPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid buying price.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Initial Quantity *</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid quantity.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Threshold Value (packets) *</Form.Label>
                <Form.Control
                  type="number"
                  name="thresholdValue"
                  value={formData.thresholdValue}
                  onChange={handleInputChange}
                  placeholder="10"
                  min="0"
                  required
                />
                <Form.Text className="text-muted">
                  Alert when quantity falls below this value
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Please provide a valid threshold value.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
                <Form.Text className="text-muted">
                  Leave blank if product doesn't expire
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Supplier</Form.Label>
                <Form.Control
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="Enter supplier name"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-1"></i>
                Adding...
              </>
            ) : (
              <>
                <i className="fas fa-plus me-1"></i>
                Add Product
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
