'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table } from '@superline/design-system';
import { useUsersApi } from '../../../hooks';
import { User } from '../../../api/types';

const columns = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'createdAt', label: 'Created', minWidth: 120 },
];

const AdminsTable = () => {
  const { fetchUsers, loading, error } = useUsersApi();
  const [admins, setAdmins] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadAdmins = useCallback(async () => {
    try {
      const result = await fetchUsers.execute({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        withDeleted: true,
        where: { isAdmin: true },
        orderBy: { createdAt: 'desc' },
      });
      if (result) {
        setAdmins(result.usersForAdmin || []);
        setTotal(result.usersAggregateForAdmin || 0);
      }
    } catch (err) {
      console.error('Error loading admins:', err);
    }
  }, [fetchUsers, page, rowsPerPage]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const rows = admins.map((admin) => ({
    id: admin.id,
    email: admin.email,
    createdAt: admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A',
  }));

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  if (loading && admins.length === 0) {
    return <div>Loading admins...</div>;
  }

  if (error) {
    return <div>Error loading admins: {error.message}</div>;
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

export default AdminsTable;

