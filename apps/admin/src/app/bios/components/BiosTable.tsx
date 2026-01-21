'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table } from '@superline/design-system';
import { useBiosApi } from '../../../hooks';
import { Bio } from '../../../api/types';

const columns = [
  { id: 'pageName', label: 'Page Name', minWidth: 150 },
  { id: 'username', label: 'Username', minWidth: 120 },
  { id: 'perMessageCost', label: 'Price', minWidth: 100 },
  { id: 'profileVisits', label: 'Visits', minWidth: 100 },
  { id: 'verificationStatus', label: 'Status', minWidth: 100 },
  { id: 'createdAt', label: 'Created', minWidth: 120 },
];

const BiosTable = () => {
  const { fetchBios } = useBiosApi();
  const [bios, setBios] = useState<Bio[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadBios = useCallback(async () => {
    try {
      const result = await fetchBios.execute({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        withDeleted: false,
      });
      if (result) {
        setBios(result.findAllBiosForAdmin || []);
        setTotal(result.biosAdminAggregate || 0);
      }
    } catch (err) {
      console.error('Error loading bios:', err);
    }
  }, [fetchBios, page, rowsPerPage]);

  useEffect(() => {
    loadBios();
  }, [loadBios]);

  const rows = bios.map((bio) => ({
    id: bio.id,
    pageName: bio.pageName || 'N/A',
    username: bio.username || 'N/A',
    perMessageCost: bio.perMessageCost ? `$${bio.perMessageCost.toFixed(2)}` : 'N/A',
    profileVisits: bio.profileVisits || 0,
    verificationStatus: bio.verificationStatus || 'Pending',
    createdAt: bio.createdAt ? new Date(bio.createdAt).toLocaleDateString() : 'N/A',
  }));

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  if (fetchBios.loading && bios.length === 0) {
    return <div>Loading bios...</div>;
  }

  if (fetchBios.error) {
    return <div>Error loading bios: {fetchBios.error.message}</div>;
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

export default BiosTable;

