'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table } from '@superline/design-system';
import { useAgenciesApi } from '../../../hooks';
import { Agency } from '../../../api/types';

const columns = [
  { id: 'name', label: 'Agency Name', minWidth: 160 },
  { id: 'email', label: 'Email', minWidth: 160 },
  { id: 'phoneNumber', label: 'Phone', minWidth: 130 },
  { id: 'totalRevenue', label: 'Revenue', minWidth: 120 },
  { id: 'createdAt', label: 'Created', minWidth: 120 },
];

const AgenciesTable = () => {
  const { fetchAgencies, loading, error } = useAgenciesApi();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadAgencies = useCallback(async () => {
    try {
      const result = await fetchAgencies.execute({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        withDeleted: false,
      });
      if (result) {
        setAgencies(result.agencies || []);
        setTotal(result.count || 0);
      }
    } catch (err) {
      console.error('Error loading agencies:', err);
    }
  }, [fetchAgencies, page, rowsPerPage]);

  useEffect(() => {
    loadAgencies();
  }, [loadAgencies]);

  const rows = agencies.map((agency) => ({
    id: agency.id,
    name: agency.name || 'N/A',
    email: agency.email || 'N/A',
    phoneNumber: agency.phoneNumber || 'N/A',
    totalRevenue: agency.totalRevenue ? `$${agency.totalRevenue.toFixed(2)}` : '$0.00',
    createdAt: agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : 'N/A',
  }));

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  if (loading && agencies.length === 0) {
    return <div>Loading agencies...</div>;
  }

  if (error) {
    return <div>Error loading agencies: {error.message}</div>;
  }

  return (
    <Table
      columns={columns}
      rows={rows}
      showPagination={true}
      page={page}
      rowsPerPage={rowsPerPage}
      totalRows={total}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default AgenciesTable;

