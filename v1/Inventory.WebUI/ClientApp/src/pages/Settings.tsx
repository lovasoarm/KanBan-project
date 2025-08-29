import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge, Alert } from 'react-bootstrap';

interface SettingsState {
  notifications: {
    email: boolean;
    push: boolean;
    lowStock: boolean;
    newOrders: boolean;
  };
  inventory: {
    lowStockThreshold: number;
    autoReorder: boolean;
    reorderLevel: number;
  };
  general: {
    currency: string;
    timezone: string;
    language: string;
    theme: string;
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      push: false,
      lowStock: true,
      newOrders: true,
    },
    inventory: {
      lowStockThreshold: 10,
      autoReorder: false,
      reorderLevel: 50,
    },
    general: {
      currency: 'USD',
      timezone: 'UTC-5',
      language: 'en',
      theme: 'light',
    },
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleNotificationChange = (field: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field],
      },
    }));
  };

  const handleInventoryChange = (field: keyof typeof settings.inventory, value: any) => {
    setSettings(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [field]: value,
      },
    }));
  };

  const handleGeneralChange = (field: keyof typeof settings.general, value: string) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const systemLogs = [
    { timestamp: '2025-01-20 14:30', level: 'INFO', message: 'User logged in successfully' },
    { timestamp: '2025-01-20 14:25', level: 'WARNING', message: 'Low stock alert for Product SKU-001' },
    { timestamp: '2025-01-20 14:20', level: 'ERROR', message: 'Failed to sync inventory data' },
    { timestamp: '2025-01-20 14:15', level: 'INFO', message: 'Daily backup completed' },
  ];

  const getLogBadgeVariant = (level: string) => {
    switch (level) {
      case 'ERROR': return 'danger';
      case 'WARNING': return 'warning';
      case 'INFO': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="settings-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-cog me-2"></i>
          Settings
        </h1>
        <Button variant="primary" onClick={handleSaveSettings}>
          <i className="fas fa-save me-1"></i>
          Save Settings
        </Button>
      </div>

      {showAlert && (
        <Alert variant="success" dismissible onClose={() => setShowAlert(false)}>
          Settings saved successfully!
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-bell me-2"></i>
                Notification Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="email-notifications"
                      label="Email Notifications"
                      checked={settings.notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="push-notifications"
                      label="Push Notifications"
                      checked={settings.notifications.push}
                      onChange={() => handleNotificationChange('push')}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="low-stock-alerts"
                      label="Low Stock Alerts"
                      checked={settings.notifications.lowStock}
                      onChange={() => handleNotificationChange('lowStock')}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="new-order-alerts"
                      label="New Order Alerts"
                      checked={settings.notifications.newOrders}
                      onChange={() => handleNotificationChange('newOrders')}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-boxes me-2"></i>
                Inventory Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Low Stock Threshold</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.inventory.lowStockThreshold}
                      onChange={(e) => handleInventoryChange('lowStockThreshold', parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Auto-Reorder Level</Form.Label>
                    <Form.Control
                      type="number"
                      value={settings.inventory.reorderLevel}
                      onChange={(e) => handleInventoryChange('reorderLevel', parseInt(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>&nbsp;</Form.Label>
                    <div>
                      <Form.Check
                        type="switch"
                        id="auto-reorder"
                        label="Enable Auto-Reorder"
                        checked={settings.inventory.autoReorder}
                        onChange={() => handleInventoryChange('autoReorder', !settings.inventory.autoReorder)}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-globe me-2"></i>
                General Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Form.Select
                      value={settings.general.currency}
                      onChange={(e) => handleGeneralChange('currency', e.target.value)}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Timezone</Form.Label>
                    <Form.Select
                      value={settings.general.timezone}
                      onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                    >
                      <option value="UTC-5">UTC-5 (Eastern Time)</option>
                      <option value="UTC-8">UTC-8 (Pacific Time)</option>
                      <option value="UTC+0">UTC+0 (Greenwich Mean Time)</option>
                      <option value="UTC+1">UTC+1 (Central European Time)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Language</Form.Label>
                    <Form.Select
                      value={settings.general.language}
                      onChange={(e) => handleGeneralChange('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Theme</Form.Label>
                    <Form.Select
                      value={settings.general.theme}
                      onChange={(e) => handleGeneralChange('theme', e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-history me-2"></i>
                System Logs
              </h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Level</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {systemLogs.map((log, index) => (
                    <tr key={index}>
                      <td className="text-muted small">{log.timestamp.split(' ')[1]}</td>
                      <td>
                        <Badge bg={getLogBadgeVariant(log.level)} size="sm">
                          {log.level}
                        </Badge>
                      </td>
                      <td className="small">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;

