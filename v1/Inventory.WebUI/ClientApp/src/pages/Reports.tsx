import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Reports as ReportsComponent } from '../components/Reports';

const Reports: React.FC = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <ReportsComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
