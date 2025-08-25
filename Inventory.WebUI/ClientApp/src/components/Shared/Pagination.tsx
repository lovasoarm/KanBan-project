import React from 'react';
import { Pagination as BSPagination, FormControl, InputGroup, Button, Dropdown } from 'react-bootstrap';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  showQuickJump?: boolean;
  showItemsPerPage?: boolean;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showQuickJump = true,
  showItemsPerPage = true,
  disabled = false
}) => {
  const [jumpToPage, setJumpToPage] = React.useState<string>('');

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpToPage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <BSPagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => onPageChange(i)}
            disabled={disabled}
          >
            {i}
          </BSPagination.Item>
        );
      }
    } else {
      // Show first page
      items.push(
        <BSPagination.Item
          key={1}
          active={1 === currentPage}
          onClick={() => onPageChange(1)}
          disabled={disabled}
        >
          1
        </BSPagination.Item>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(<BSPagination.Ellipsis key="start-ellipsis" disabled={disabled} />);
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <BSPagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => onPageChange(i)}
            disabled={disabled}
          >
            {i}
          </BSPagination.Item>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(<BSPagination.Ellipsis key="end-ellipsis" disabled={disabled} />);
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <BSPagination.Item
            key={totalPages}
            active={totalPages === currentPage}
            onClick={() => onPageChange(totalPages)}
            disabled={disabled}
          >
            {totalPages}
          </BSPagination.Item>
        );
      }
    }

    return items;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-3">
      {/* Items info and per page selector */}
      <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
        <div className="pagination-info text-muted">
          Showing {totalItems > 0 ? startItem : 0} to {endItem} of {totalItems.toLocaleString()} entries
        </div>

        {showItemsPerPage && (
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              size="sm"
              disabled={disabled}
              className="d-flex align-items-center gap-2"
            >
              <span>{itemsPerPage} per page</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {[10, 25, 50, 100].map(size => (
                <Dropdown.Item
                  key={size}
                  active={size === itemsPerPage}
                  onClick={() => onItemsPerPageChange(size)}
                >
                  {size} per page
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      {/* Pagination controls */}
      <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
        {showQuickJump && totalPages > 10 && (
          <InputGroup size="sm" style={{ width: '150px' }}>
            <FormControl
              type="number"
              placeholder="Go to page"
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyPress={handleKeyPress}
              min="1"
              max={totalPages}
              disabled={disabled}
            />
            <Button
              variant="outline-secondary"
              onClick={handleJumpToPage}
              disabled={disabled || !jumpToPage}
            >
              <i className="fas fa-arrow-right"></i>
            </Button>
          </InputGroup>
        )}

        <BSPagination className="mb-0">
          <BSPagination.First
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || disabled}
          />
          <BSPagination.Prev
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || disabled}
          />
          
          {renderPaginationItems()}
          
          <BSPagination.Next
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || disabled}
          />
          <BSPagination.Last
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || disabled}
          />
        </BSPagination>
      </div>
    </div>
  );
};

export default Pagination;
