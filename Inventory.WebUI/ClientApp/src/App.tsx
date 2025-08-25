import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { InventoryProvider } from './contexts/InventoryContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <InventoryProvider>
      <Router>
        <div className="app">
          <Navigation />
          <Container fluid className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </InventoryProvider>
  );
};

export default App;
