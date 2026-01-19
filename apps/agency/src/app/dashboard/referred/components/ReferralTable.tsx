 'use client';

import React, { useState, useMemo } from 'react';
import { Table, TextField } from '@superline/design-system';
import { Box, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface ReferralTableRow {
  name: string;
  revenue: string;
  totalCreators: number;
  superlockedCreators: number;
  email: string;
  status: string;
  avatar?: string;
}

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--padding-lg)',
}));

const TableScrollContainer = styled(Box)(() => ({
  width: '100%',
  overflowX: 'auto',
  paddingBottom: 'var(--padding-sm)',
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#CBD5E0',
    borderRadius: '9999px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#F7FAFC',
  },
}));

const SearchContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
}));

const SearchField = styled(TextField)(() => ({
  width: '300px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    height: '40px',
    '& fieldset': {
      borderColor: '#E2E8F0',
    },
    '&:hover fieldset': {
      borderColor: '#CBD5E0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#CBD5E0',
    },
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '14px',
    padding: '8px 12px',
    '&::placeholder': {
      color: '#A0AEC0',
    },
  },
}));

interface ReferralTableProps {
  rows?: ReferralTableRow[];
  onSearch?: (query: string) => void;
}

export const ReferralTable: React.FC<ReferralTableProps> = ({ rows = [], onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter table data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return rows;

    const query = searchQuery.toLowerCase();
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.revenue.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query)
    );
  }, [rows, searchQuery]);

  // Table columns configuration
  const columns = [
    { id: 'name', label: 'Name', minWidth: 180 },
    { id: 'revenue', label: 'Revenue', minWidth: 120 },
    { id: 'totalCreators', label: 'Total Creators', minWidth: 120, align: 'left' as const },
    {
      id: 'superlockedCreators',
      label: 'SuperLocked Creators',
      minWidth: 160,
      align: 'left' as const,
    },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 180 },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <Container>
      {/* Search Bar */}
      <SearchContainer>
        <SearchField
          id="referral-table-search-input"
          placeholder="Search"
          value={searchQuery}
          variant="outlined"
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: <SearchIcon sx={{ color: '#A0AEC0', fontSize: '20px' }} />,
          }}
        />
      </SearchContainer>

      {/* Table from Design System */}
      <TableScrollContainer>
        <Table
          columns={columns}
          rows={filteredData}
          showPagination={true}
          itemsPerPage={6}
          paginationPosition="right"
        />
      </TableScrollContainer>
    </Container>
  );
};

export default ReferralTable;
