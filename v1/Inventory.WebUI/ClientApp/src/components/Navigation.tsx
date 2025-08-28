import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <i className="fas fa-boxes me-2"></i>
          Inventory Dashboard
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              className={location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}
            >
              <i className="fas fa-tachometer-alt me-1"></i>
              Dashboard
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/products"
              className={location.pathname === '/products' ? 'active' : ''}
            >
              <i className="fas fa-box me-1"></i>
              Products
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/analytics"
              className={location.pathname === '/analytics' ? 'active' : ''}
            >
              <i className="fas fa-chart-bar me-1"></i>
              Analytics
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/reports"
              className={location.pathname === '/reports' ? 'active' : ''}
            >
              <i className="fas fa-file-alt me-1"></i>
              Reports
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/settings"
              className={location.pathname === '/settings' ? 'active' : ''}
            >
              <i className="fas fa-cog me-1"></i>
              Settings
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link href="#notifications">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </Nav.Link>
            <Nav.Link href="#profile">
              <i className="fas fa-user-circle"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
