import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | undefined;
  variant?: string;
  centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size, 
  variant = 'primary',
  centered = true 
}) => {
  return (
    <div className={`loading-spinner ${centered ? 'text-center' : ''}`}>
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" variant={variant} size={size} />
        {message && <div className="mt-3 text-muted">{message}</div>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
