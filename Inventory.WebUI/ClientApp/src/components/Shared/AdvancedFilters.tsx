import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  FormControl, 
  InputGroup, 
  Form, 
  Button, 
  Badge, 
  Collapse,
  Dropdown
} from 'react-bootstrap';

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'range' | 'date' | 'boolean';
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FilterValues {
  [key: string]: any;
}

interface AdvancedFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterConfig[];
  filterValues: FilterValues;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  resultCount: number;
  isLoading?: boolean;
  placeholder?: string;
  showResultCount?: boolean;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  searchValue,
  onSearchChange,
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
  resultCount,
  isLoading = false,
  placeholder = "Search products, suppliers, categories...",
  showResultCount = true
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getActiveFiltersCount = () => {
    return Object.values(filterValues).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== '';
    }).length;
  };

  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.key];

    switch (filter.type) {
      case 'text':
        return (
          <FormControl
            type="text"
            placeholder={filter.placeholder}
            value={value || ''}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            disabled={isLoading}
          />
        );

      case 'select':
        return (
          <Form.Select
            value={value || ''}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            disabled={isLoading}
          >
            <option value="">All {filter.label}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {option.count && `(${option.count})`}
              </option>
            ))}
          </Form.Select>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
              {selectedValues.length === 0 
                ? `Select ${filter.label}` 
                : `${selectedValues.length} selected`}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              <div className="p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filter.options?.map(option => (
                  <Form.Check
                    key={option.value}
                    type="checkbox"
                    label={`${option.label} ${option.count ? `(${option.count})` : ''}`}
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onFilterChange(filter.key, [...selectedValues, option.value]);
                      } else {
                        onFilterChange(filter.key, selectedValues.filter(v => v !== option.value));
                      }
                    }}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </Dropdown.Menu>
          </Dropdown>
        );

      case 'range':
        const rangeValue = value || { min: '', max: '' };
        return (
          <Row>
            <Col xs={6}>
              <FormControl
                type="number"
                placeholder={`Min ${filter.label}`}
                value={rangeValue.min}
                min={filter.min}
                max={filter.max}
                onChange={(e) => onFilterChange(filter.key, { ...rangeValue, min: e.target.value })}
                disabled={isLoading}
              />
            </Col>
            <Col xs={6}>
              <FormControl
                type="number"
                placeholder={`Max ${filter.label}`}
                value={rangeValue.max}
                min={filter.min}
                max={filter.max}
                onChange={(e) => onFilterChange(filter.key, { ...rangeValue, max: e.target.value })}
                disabled={isLoading}
              />
            </Col>
          </Row>
        );

      case 'date':
        const dateRange = value || { start: '', end: '' };
        return (
          <Row>
            <Col xs={6}>
              <FormControl
                type="date"
                value={dateRange.start}
                onChange={(e) => onFilterChange(filter.key, { ...dateRange, start: e.target.value })}
                disabled={isLoading}
              />
            </Col>
            <Col xs={6}>
              <FormControl
                type="date"
                value={dateRange.end}
                onChange={(e) => onFilterChange(filter.key, { ...dateRange, end: e.target.value })}
                disabled={isLoading}
              />
            </Col>
          </Row>
        );

      case 'boolean':
        return (
          <div className="d-flex gap-2">
            <Button
              variant={value === true ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => onFilterChange(filter.key, value === true ? null : true)}
              disabled={isLoading}
            >
              Yes
            </Button>
            <Button
              variant={value === false ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => onFilterChange(filter.key, value === false ? null : false)}
              disabled={isLoading}
            >
              No
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-4">
      <Card.Body>
        {/* Search Bar and Quick Actions */}
        <Row className="mb-3">
          <Col lg={8}>
            <InputGroup>
              <InputGroup.Text>
                <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-search'}`}></i>
              </InputGroup.Text>
              <FormControl
                type="text"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={isLoading}
              />
              {searchValue && (
                <Button 
                  variant="outline-secondary"
                  onClick={() => onSearchChange('')}
                  disabled={isLoading}
                >
                  <i className="fas fa-times"></i>
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col lg={4} className="d-flex justify-content-end align-items-center gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              disabled={isLoading}
              className="d-flex align-items-center gap-2"
            >
              <i className="fas fa-filter"></i>
              Filters
              {activeFiltersCount > 0 && (
                <Badge bg="primary" className="ms-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            
            {(searchValue || activeFiltersCount > 0) && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onClearFilters}
                disabled={isLoading}
                title="Clear all filters"
              >
                <i className="fas fa-times"></i>
              </Button>
            )}
          </Col>
        </Row>

        {/* Results Count */}
        {showResultCount && (
          <Row className="mb-2">
            <Col>
              <small className="text-muted">
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-1"></i>
                    Searching...
                  </>
                ) : (
                  <>
                    {resultCount.toLocaleString()} results found
                    {(searchValue || activeFiltersCount > 0) && (
                      <span className="ms-1">
                        {searchValue && `for "${searchValue}"`}
                        {activeFiltersCount > 0 && ` with ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''}`}
                      </span>
                    )}
                  </>
                )}
              </small>
            </Col>
          </Row>
        )}

        {/* Advanced Filters */}
        <Collapse in={showAdvancedFilters}>
          <div>
            <hr className="my-3" />
            <Row>
              {filters.map(filter => (
                <Col key={filter.key} lg={4} md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-semibold">
                      {filter.label}
                    </Form.Label>
                    {renderFilter(filter)}
                  </Form.Group>
                </Col>
              ))}
            </Row>
            
            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <Row className="mt-3">
                <Col>
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <small className="text-muted me-2">Active filters:</small>
                    {Object.entries(filterValues).map(([key, value]) => {
                      if (!value || (Array.isArray(value) && value.length === 0)) return null;
                      
                      const filter = filters.find(f => f.key === key);
                      if (!filter) return null;
                      
                      let displayValue = '';
                      if (Array.isArray(value)) {
                        displayValue = `${value.length} selected`;
                      } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
                        displayValue = `${value.min || 'Min'} - ${value.max || 'Max'}`;
                      } else if (typeof value === 'object' && value.start !== undefined && value.end !== undefined) {
                        displayValue = `${value.start || 'Start'} - ${value.end || 'End'}`;
                      } else if (typeof value === 'boolean') {
                        displayValue = value ? 'Yes' : 'No';
                      } else {
                        displayValue = String(value);
                      }
                      
                      return (
                        <Badge
                          key={key}
                          bg="primary"
                          className="d-flex align-items-center gap-1"
                        >
                          <span>{filter.label}: {displayValue}</span>
                          <button
                            className="btn-close btn-close-white"
                            style={{ fontSize: '0.6rem' }}
                            onClick={() => onFilterChange(key, filter.type === 'multiselect' ? [] : null)}
                            disabled={isLoading}
                          ></button>
                        </Badge>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default AdvancedFilters;
