import React from 'react';
import { TopSellingProduct } from '../../types/dashboard.types';
import { getProductImage, getStockStatus } from '../../utils/productImageUtils';
import { Badge } from 'react-bootstrap';

interface TopSellingTableProps {
  products: TopSellingProduct[];
}

const TopSellingTable: React.FC<TopSellingTableProps> = ({ products }) => {
  const fallbackProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      soldQuantity: 245,
      remainingQuantity: 87,
      price: 79.99,
      category: "Electronics"
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      soldQuantity: 189,
      remainingQuantity: 43,
      price: 299.99,
      category: "Electronics"
    },
    {
      id: 3,
      name: "USB-C Charging Cable",
      soldQuantity: 456,
      remainingQuantity: 234,
      price: 19.99,
      category: "Electronics"
    },
    {
      id: 4,
      name: "Laptop Stand Adjustable",
      soldQuantity: 123,
      remainingQuantity: 67,
      price: 49.99,
      category: "Accessories"
    },
    {
      id: 5,
      name: "Wireless Mouse",
      soldQuantity: 234,
      remainingQuantity: 156,
      price: 29.99,
      category: "Electronics"
    }
  ];

  const displayProducts = products.length > 0 ? products : fallbackProducts;

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Sold</th>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.map((product) => {
            const stockStatus = getStockStatus(product.remainingQuantity);
            return (
              <tr key={product.id} className="table-row">
                <td className="product-cell">
                  <div className="product-info">
                    <img 
                      src={getProductImage(product.name)} 
                      alt={product.name} 
                      className="product-image"
                      style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                    <span className="product-name">{product.name}</span>
                  </div>
                </td>
                <td>
                  <span className="quantity-sold">
                    {product.soldQuantity}
                  </span>
                </td>
                <td>
                  <div className="stock-info">
                    <span className="quantity-remaining">
                      {product.remainingQuantity}
                    </span>
                    {product.remainingQuantity <= 15 && (
                      <Badge 
                        style={{ 
                          backgroundColor: stockStatus.backgroundColor,
                          color: stockStatus.color,
                          marginLeft: '8px',
                          fontSize: '10px'
                        }}
                      >
                        {stockStatus.label}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="price">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TopSellingTable;

