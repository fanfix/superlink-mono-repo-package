'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table } from '@superline/design-system';
import { useUsersApi } from '../../../hooks';
import { User } from '../../../api/types';

const columns = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'phoneNumber', label: 'Phone', minWidth: 120 },
  { id: 'role', label: 'Role', minWidth: 80 },
  { id: 'createdAt', label: 'Created', minWidth: 120 },
  { id: 'profileVisits', label: 'Profile Visits', minWidth: 100 },
];

const UsersTable = () => {
  const { fetchUsers, loading, error } = useUsersApi();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadUsers = useCallback(async () => {
    try {
      const result = await fetchUsers.execute({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        withDeleted: false,
      });
      if (result) {
        setUsers(result.usersForAdmin || []);
        setTotal(result.usersAggregateForAdmin || 0);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  }, [fetchUsers, page, rowsPerPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const rows = users.map((user) => ({
    id: user.id,
    name: user.name || 'N/A',
    email: user.email,
    phoneNumber: user.phoneNumber || 'N/A',
    role: user.isAdmin ? 'Admin' : 'User',
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    profileVisits: user.profileVisits || 0,
  }));

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  if (loading && users.length === 0) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
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

export default UsersTable;

