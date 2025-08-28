import React from 'react';
import { Card } from 'react-bootstrap';

const Reports: React.FC = () => {
  return (
    <div className="reports-container">
      <h2>Reports</h2>
      <Card>
        <Card.Body>
          <Card.Title>Inventory Reports</Card.Title>
          <Card.Text>
            This section will contain various inventory reports and analytics.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Reports;
