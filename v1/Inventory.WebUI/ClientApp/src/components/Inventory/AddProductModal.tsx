import React, { useState, useRef, useCallback } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { apiService } from '../../services/api';
import './AddProductModal.css';

interface AddProductModalProps {
  show: boolean;
  onHide: () => void;
  onProductAdded: () => void;
}

interface ProductFormData {
  name: string;
  productId: string;
  buyingPrice: number;
  quantity: number;
  unit: string;
  thresholdValue: number;
  expiryDate: string;
  category: string;
  image?: File;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  show,
  onHide,
  onProductAdded
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    productId: '',
    buyingPrice: 0,
    quantity: 0,
    unit: '',
    thresholdValue: 10,
    expiryDate: '',
    category: '',
    image: undefined
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories predefined
  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Beauty & Personal Care',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Office Supplies',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['buyingPrice', 'quantity', 'thresholdValue'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleImageChange = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file);
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageChange(files[0]);
    }
  }, [handleImageChange]);

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      productId: '',
      buyingPrice: 0,
      quantity: 0,
      unit: '',
      thresholdValue: 10,
      expiryDate: '',
      category: '',
      image: undefined
    });
    setValidated(false);
    setError(null);
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        productId: formData.productId,
        price: formData.buyingPrice,
        quantity: formData.quantity,
        unit: formData.unit,
        minQuantity: formData.thresholdValue,
        expiryDate: formData.expiryDate || null,
        category: formData.category,
        isActive: true
      };

      // TODO: Handle image upload to server when API is ready
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

  const handleDiscard = () => {
    resetForm();
    onHide();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal show={show} onHide={handleDiscard} size="lg" centered className="add-product-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-plus me-2 text-primary"></i>
          New Product
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

          {/* Image Upload Section */}
          <div 
            className={`image-upload-container ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="upload-preview">
                <img src={imagePreview} alt="Preview" />
                <div className="file-info">
                  <div className="file-name">{uploadedImage?.name}</div>
                  <div className="file-size">{uploadedImage ? formatFileSize(uploadedImage.size) : ''}</div>
                </div>
                <button
                  type="button"
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt upload-icon"></i>
                <h5>Drop your image here, or browse</h5>
                <p>Supports: JPG, PNG, GIF</p>
                <button type="button" className="browse-button">
                  <i className="fas fa-folder-open me-1"></i>
                  Browse Files
                </button>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {/* Product Form - Vertical Layout */}
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label>Product ID</Form.Label>
            <Form.Control
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              placeholder="Enter unique product ID (e.g., PRD-001)"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a product ID.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select a category.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Buying Price</Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter initial quantity"
              min="0"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid quantity.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Unit</Form.Label>
            <Form.Control
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              placeholder="e.g., pieces, kg, liters, boxes"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a unit.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              placeholder="Select expiry date"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Threshold Value</Form.Label>
            <Form.Control
              type="number"
              name="thresholdValue"
              value={formData.thresholdValue}
              onChange={handleInputChange}
              placeholder="Enter minimum stock level"
              min="0"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid threshold value.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            type="button"
            className="btn-discard"
            onClick={handleDiscard} 
            disabled={loading}
          >
            <i className="fas fa-times me-1"></i>
            Discard
          </Button>
          <Button 
            type="submit" 
            className="btn-add"
            disabled={loading}
          >
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
