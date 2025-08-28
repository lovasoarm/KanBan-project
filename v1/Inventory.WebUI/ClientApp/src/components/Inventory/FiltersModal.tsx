import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

interface ProductFilters {
  category?: string;
  availability?: string;
  priceRange?: { min?: number; max?: number };
  quantityRange?: { min?: number; max?: number };
}

interface FiltersModalProps {
  show: boolean;
  onHide: () => void;
  filters: ProductFilters;
  onFiltersApply: (filters: ProductFilters) => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  show,
  onHide,
  filters,
  onFiltersApply
}) => {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

  useEffect(() => {
    if (show) {
      setLocalFilters(filters);
    }
  }, [show, filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      // Handle nested properties like priceRange.min
      const [parent, child] = name.split('.');
      setLocalFilters(prev => ({
        ...prev,
        [parent]: {
          ...((prev as any)[parent] || {}),
          [child]: value ? parseFloat(value) : undefined
        }
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        [name]: value || undefined
      }));
    }
  };

  const handleApplyFilters = () => {
    // Clean up empty filters
    const cleanedFilters: ProductFilters = {};
    
    if (localFilters.category) {
      cleanedFilters.category = localFilters.category;
    }
    
    if (localFilters.availability) {
      cleanedFilters.availability = localFilters.availability;
    }
    
    if (localFilters.priceRange?.min || localFilters.priceRange?.max) {
      cleanedFilters.priceRange = {
        min: localFilters.priceRange.min,
        max: localFilters.priceRange.max
      };
    }
    
    if (localFilters.quantityRange?.min || localFilters.quantityRange?.max) {
      cleanedFilters.quantityRange = {
        min: localFilters.quantityRange.min,
        max: localFilters.quantityRange.max
      };
    }

    onFiltersApply(cleanedFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
  };

  const hasActiveFilters = () => {
    return localFilters.category ||
           localFilters.availability ||
           localFilters.priceRange?.min ||
           localFilters.priceRange?.max ||
           localFilters.quantityRange?.min ||
           localFilters.quantityRange?.max;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-filter me-2 text-primary"></i>
          Filter Products
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={localFilters.category || ''}
                  onChange={handleInputChange}
                  placeholder="Filter by category"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Availability</Form.Label>
                <Form.Select
                  name="availability"
                  value={localFilters.availability || ''}
                  onChange={handleInputChange}
                >
                  <option value="">All statuses</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Label className="mb-2">Price Range (₹)</Form.Label>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  name="priceRange.min"
                  value={localFilters.priceRange?.min || ''}
                  onChange={handleInputChange}
                  placeholder="Min price"
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  name="priceRange.max"
                  value={localFilters.priceRange?.max || ''}
                  onChange={handleInputChange}
                  placeholder="Max price"
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Label className="mb-2">Quantity Range</Form.Label>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  name="quantityRange.min"
                  value={localFilters.quantityRange?.min || ''}
                  onChange={handleInputChange}
                  placeholder="Min quantity"
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  name="quantityRange.max"
                  value={localFilters.quantityRange?.max || ''}
                  onChange={handleInputChange}
                  placeholder="Max quantity"
                  min="0"
                />
              </Form.Group>
            </Col>
          </Row>

          {hasActiveFilters() && (
            <div className="mb-3 p-3 bg-light rounded">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Active filters will be applied to your product search
              </small>
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button 
            variant="outline-secondary" 
            onClick={handleClearFilters}
            disabled={!hasActiveFilters()}
          >
            <i className="fas fa-times me-1"></i>
            Clear All
          </Button>
          
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyFilters}>
              <i className="fas fa-check me-1"></i>
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FiltersModal;
