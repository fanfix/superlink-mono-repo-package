'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table } from '@superline/design-system';
import { useBrandLeadsApi } from '../../../hooks';
import { BrandLead } from '../../../api/types';

const columns = [
  { id: 'creator', label: 'Creator', minWidth: 150 },
  { id: 'enquireEmail', label: 'Email', minWidth: 180 },
  { id: 'phoneNumber', label: 'Phone', minWidth: 120 },
  { id: 'createdAt', label: 'Created', minWidth: 120 },
];

const BrandKitLeadsTable = () => {
  const { fetchLeads } = useBrandLeadsApi();
  const [leads, setLeads] = useState<BrandLead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadLeads = useCallback(async () => {
    try {
      const result = await fetchLeads.execute({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
      if (result) {
        setLeads(result.brandLeads || []);
        setTotal(result.count || 0);
      }
    } catch (err) {
      console.error('Error loading brand leads:', err);
    }
  }, [fetchLeads, page, rowsPerPage]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const rows = leads.map((lead) => ({
    id: lead.id,
    creator: lead.creator?.name || 'N/A',
    enquireEmail: lead.enquireEmail || lead.creator?.email || 'N/A',
    phoneNumber: lead.creator?.phoneNumber || 'N/A',
    createdAt: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A',
  }));

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  if (fetchLeads.loading && leads.length === 0) {
    return <div>Loading brand leads...</div>;
  }

  if (fetchLeads.error) {
    return <div>Error loading brand leads: {fetchLeads.error.message}</div>;
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

export default BrandKitLeadsTable;

