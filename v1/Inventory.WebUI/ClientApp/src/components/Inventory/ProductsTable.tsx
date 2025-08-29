import React from 'react';
import { Table, Badge, Button, Pagination } from 'react-bootstrap';
import { Product } from '../../hooks/useInventory';
import './ProductsTable.css';

interface ProductsTableProps {
  products: Product[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  loading,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'N/A') return dateString;
    return dateString;
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'In Stock':
        return <Badge bg="success">In Stock</Badge>;
      case 'Low Stock':
        return <Badge bg="warning" text="dark">Low Stock</Badge>;
      case 'Out of Stock':
        return <Badge bg="danger">Out of Stock</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const LoadingRow = () => (
    <tr>
      <td><div className="loading-skeleton"></div></td>
      <td><div className="loading-skeleton"></div></td>
      <td><div className="loading-skeleton"></div></td>
      <td><div className="loading-skeleton"></div></td>
      <td><div className="loading-skeleton"></div></td>
      <td><div className="loading-skeleton"></div></td>
    </tr>
  );

  const EmptyState = () => (
    <tr>
      <td colSpan={6} className="text-center py-4">
        <div className="empty-state">
          <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No products found</h5>
          <p className="text-muted">Try adjusting your search or filters</p>
        </div>
      </td>
    </tr>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
    );

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => onPageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    );

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button
          variant="outline-secondary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <i className="fas fa-chevron-left me-1"></i>
          Previous
        </Button>

        <div className="page-info">
          <span className="text-muted">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <Button
          variant="outline-secondary"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <i className="fas fa-chevron-right ms-1"></i>
        </Button>
      </div>
    );
  };

  return (
    <div className="products-table-container">
      {}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Buying Price</th>
              <th>Quantity</th>
              <th>Threshold Value</th>
              <th>Expiry Date</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }, (_, index) => (
                <tr key={index}>
                  <td><div className="loading-skeleton"></div></td>
                  <td><div className="loading-skeleton"></div></td>
                  <td><div className="loading-skeleton"></div></td>
                  <td><div className="loading-skeleton"></div></td>
                  <td><div className="loading-skeleton"></div></td>
                  <td><div className="loading-skeleton"></div></td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <div className="empty-state">
                    <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No products found</h5>
                    <p className="text-muted">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="table-row">
                  <td>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <small className="text-muted" style={{fontSize: '12px', color: 'var(--text-secondary)'}}>{product.category}</small>
                    </div>
                  </td>
                  <td>
                    <span className="price">
                      {formatCurrency(product.buyingPrice)}
                    </span>
                  </td>
                  <td>
                    <span className="quantity-remaining">
                      {product.quantity.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className="threshold-value">
                      {product.thresholdValue} packets
                    </span>
                  </td>
                  <td>
                    <span className="expiry-date">
                      {formatDate(product.expiryDate)}
                    </span>
                  </td>
                  <td>
                    {getAvailabilityBadge(product.availability)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {}
      {!loading && products.length > 0 && renderPagination()}
    </div>
  );
};

export default ProductsTable;

