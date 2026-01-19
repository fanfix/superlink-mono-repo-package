import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";

export interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
  format?: (value: any) => string;
}

export interface TableRow {
  [key: string]: any;
}

export interface TableProps {
  /**
   * Array of column definitions
   */
  columns: TableColumn[];
  /**
   * Array of row data
   */
  rows: TableRow[];
  /**
   * Whether to show pagination
   */
  showPagination?: boolean;
  /**
   * Items per page
   */
  itemsPerPage?: number;
  /**
   * Table variant style
   */
  variant?: "clean" | "bordered" | "shadowed";
  /**
   * Pagination position
   */
  paginationPosition?: "left" | "center" | "right";
  /**
   * Custom styles
   */
  sx?: any;
  /**
   * Custom action buttons for each row
   */
  actions?: (row: TableRow) => any;
}

const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== 'tableVariant',
})<{ tableVariant?: string }>(({ tableVariant = "shadowed" }) => ({
  width: "100%",
  backgroundColor: "var(--table-background)",
  borderRadius: tableVariant === "clean" ? "0" : "var(--border-radius-md)",
  boxShadow: tableVariant === "clean" ? "none" : tableVariant === "bordered" ? "none" : "var(--shadow-sm)",
  overflowX: "auto",
  overflowY: "hidden",
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#CBD5E0',
    borderRadius: '9999px',
  },
}));

const StyledTable = styled(MuiTable)(({ theme }) => ({
  width: "100%",
  borderCollapse: "collapse",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "var(--table-background)",
}));

const StyledTableHeaderCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'tableVariant',
})<{ tableVariant?: string }>(({ tableVariant = "shadowed" }) => ({
  textAlign: "left",
  fontWeight: "var(--table-header-font-weight)",
  fontSize: "var(--table-header-font-size)",
  color: "var(--table-header-text-color)",
  borderBottom: tableVariant === "clean" ? "none" : `var(--table-border-width) solid var(--table-border-color)`,
  whiteSpace: "nowrap",
  "&:first-of-type": {
    paddingLeft: "var(--table-header-padding-horizontal)",
  },
  "&:last-of-type": {
    paddingRight: "var(--table-header-padding-horizontal)",
  },
}));

const StyledTableBody = styled(TableBody)(({ theme }) => ({
  backgroundColor: "var(--table-background)",
}));

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'tableVariant',
})<{ tableVariant?: string }>(({ tableVariant = "shadowed" }) => ({
  borderBottom: tableVariant === "clean" ? "none" : `var(--table-border-width) solid var(--table-border-color)`,
  cursor: "pointer",
  "&:last-child": {
    borderBottom: "none",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "var(--table-cell-padding-vertical) var(--table-cell-padding-horizontal)",
  fontSize: "var(--table-cell-font-size)",
  fontWeight: "var(--table-cell-font-weight)",
  color: "var(--table-cell-text-color)",
  whiteSpace: "nowrap",
  "&:first-of-type": {
    paddingLeft: "var(--table-cell-padding-horizontal)",
  },
  "&:last-of-type": {
    paddingRight: "var(--table-cell-padding-horizontal)",
  },
}));

const UserAvatar = styled("div")(({ theme }) => ({
  width: "var(--image-size-sm)",
  height: "var(--image-size-sm)",
  borderRadius: "var(--border-radius-full)",
  backgroundColor: "var(--avatar-background)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "inline-block",
  marginRight: "var(--avatar-margin-right)",
  verticalAlign: "middle",
  flexShrink: 0,
}));

const UserInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const UserName = styled("span")(({ theme }) => ({
  fontWeight: "var(--table-cell-font-weight)",
  color: "var(--table-cell-text-color)",
  fontSize: "var(--table-cell-font-size)",
}));

const StatusBadge = styled("span", {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status?: string }>(({ status }) => ({
  padding: "var(--status-badge-padding)",
  borderRadius: "var(--status-badge-border-radius)",
  fontSize: "var(--status-badge-font-size)",
  fontWeight: "var(--status-badge-font-weight)",
  color: "var(--status-badge-text-color)",
  backgroundColor: "transparent",
}));

const ActionButton = styled("button")(({ theme }) => ({
  background: "none",
  border: "none",
  padding: "var(--action-button-padding)",
  margin: "var(--action-button-margin)",
  borderRadius: "var(--action-button-border-radius)",
  cursor: "pointer",
  color: "var(--table-action-icon-color)",
  transition: "var(--transition-normal)",
  "&:hover": {
    backgroundColor: "var(--action-button-hover-background)",
    color: "var(--action-button-hover-color)",
  },
}));

const ActionsCell = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
}));

const PaginationContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== 'position',
})<{ position?: string }>(({ position = "center" }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: position === "left" ? "flex-start" : position === "right" ? "flex-end" : "center",
  gap: "var(--gap-medium)",
  padding: "var(--padding-xl) 0",
  backgroundColor: "var(--table-background)",
  marginTop: "var(--padding-xl)",
}));

const PaginationInfo = styled("span")(({ theme }) => ({
  fontSize: "var(--table-pagination-font-size)",
  fontWeight: "var(--table-pagination-font-weight)",
  color: "var(--table-pagination-text-color)",
}));

const PaginationControls = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "var(--gap-small)",
}));

const PaginationButton = styled("button", {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'isArrow',
})<{ active?: boolean; isArrow?: boolean }>(
  ({ active = false, isArrow = false }) => ({
    padding: "var(--padding-sm) var(--padding-md)",
    border: isArrow ? `var(--table-border-width) solid var(--table-border-color)` : "none",
    backgroundColor: isArrow
      ? "var(--table-background)"
      : active
      ? "var(--table-background)"
      : "transparent",
    color: active
      ? "var(--color-text-primary)"
      : "var(--color-text-secondary)",
    borderRadius: isArrow ? "var(--border-radius-full)" : "var(--border-radius-sm)",
    cursor: "pointer",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-normal)",
    transition: "var(--transition-normal)",
    minWidth: isArrow ? "var(--width-pagination-sm)" : "auto",
    height: isArrow ? "var(--height-pagination-sm)" : "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:disabled": {
      opacity: "var(--disabled-opacity)",
      cursor: "not-allowed",
      backgroundColor: isArrow ? "var(--table-background)" : "transparent",
      color: "var(--disabled-color)",
    },
  })
);

export const Table = ({
  columns,
  rows,
  showPagination = true,
  itemsPerPage = 10,
  variant = "shadowed",
  paginationPosition = "center",
  actions,
  sx,
  ...props
}: TableProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, rows.length);
  const currentRows = rows.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const renderCell = (row: TableRow, column: TableColumn) => {
    const value = row[column.id];

    if (column.id === "name") {
      return (
        <UserInfo>
          <UserAvatar 
            style={{ 
              backgroundImage: row.avatar 
                ? `url(${row.avatar})` 
                : `url(/assets/default-avatar.svg)`,
              backgroundColor: row.avatar ? "transparent" : "#E2E8F0"
            }} 
          />
          <UserName>{value}</UserName>
        </UserInfo>
      );
    }

    if (column.id === "status") {
      return <StatusBadge status={value.toLowerCase()}>{value}</StatusBadge>;
    }

    if (column.id === "assignedTo") {
      return (
        <UserAvatar 
          style={{ 
            backgroundImage: row.assignedAvatar 
              ? `url(${row.assignedAvatar})` 
              : `url(/assets/default-avatar.svg)`,
            backgroundColor: row.assignedAvatar ? "transparent" : "#E2E8F0"
          }} 
        />
      );
    }

    if (column.format) {
      return column.format(value);
    }

    return value;
  };

  const defaultActions = (row: TableRow) => (
    <ActionsCell>
      <ActionButton title="Export">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <polyline points="9,15 12,12 15,15" />
        </svg>
      </ActionButton>
      <ActionButton title="View">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </ActionButton>
      <ActionButton title="Delete">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="3,6 5,6 21,6" />
          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </ActionButton>
    </ActionsCell>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        minHeight: 0,
        flex: 1,
        ...sx,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          backgroundColor: "var(--table-background)",
          borderRadius: variant === "clean" ? "0" : "var(--border-radius-md)",
          boxShadow: variant === "clean" ? "none" : variant === "bordered" ? "none" : "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        <StyledTableContainer tableVariant={variant}>
          <StyledTable>
            <StyledTableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableHeaderCell
                    key={column.id}
                    tableVariant={variant}
                    style={{
                      minWidth: column.minWidth,
                      textAlign: column.align || "left",
                    }}
                  >
                    {column.label}
                  </StyledTableHeaderCell>
                ))}
                {actions && (
                  <StyledTableHeaderCell tableVariant={variant} style={{ textAlign: "right" }}>
                  
                  </StyledTableHeaderCell>
                )}
              </TableRow>
            </StyledTableHead>
            <StyledTableBody>
              {currentRows.map((row, index) => (
                <StyledTableRow key={index} tableVariant={variant} sx={{ cursor: "pointer" }}>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      style={{ textAlign: column.align || "left" }}
                    >
                      {renderCell(row, column)}
                    </StyledTableCell>
                  ))}
                  {actions && (
                    <StyledTableCell style={{ textAlign: "right" }}>
                      {actions(row)}
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              ))}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
      </Paper>
      {showPagination && (
        <PaginationContainer position={paginationPosition}>
          <PaginationInfo>
            Page -{currentPage} | Total Item -{rows.length} | Showing{' '}
            {startIndex + 1}-{Math.min(endIndex, rows.length)} out of {rows.length}
          </PaginationInfo>
          <PaginationControls>
            <PaginationButton
              isArrow={true}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </PaginationButton>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 3) {
                page = i + 1;
              } else if (currentPage <= 2) {
                page = i + 1;
              } else if (currentPage >= totalPages - 1) {
                page = totalPages - 2 + i;
              } else {
                page = currentPage - 1 + i;
              }
              return (
                <PaginationButton
                  key={page}
                  active={page === currentPage}
                  isArrow={false}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationButton>
              );
            })}
            {totalPages > 3 && currentPage < totalPages - 1 && (
              <>
                <span
                  style={{
                    color: 'var(--ui-colors-ellipsis)',
                    padding: 'var(--ui-spacing-ellipsis-padding)',
                  }}
                >
                  ...
                </span>
                <PaginationButton
                  isArrow={false}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </PaginationButton>
              </>
            )}
            <PaginationButton
              isArrow={true}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </PaginationButton>
          </PaginationControls>
        </PaginationContainer>
      )}
    </div>
  );
};
