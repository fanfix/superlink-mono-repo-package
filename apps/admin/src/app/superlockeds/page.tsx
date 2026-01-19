'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Table } from '@superline/design-system';
import { DashboardLayout } from '../../components/Layout';
import { defaultAdminSidebarItems } from '../../components/Sidebar';
import { useSuperlockedApi } from '../../hooks';

const ContentArea = styled(Box)(() => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  minHeight: 'calc(100vh - 200px)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '100%',
}));

const columns = [
  { id: 'id', label: 'User ID', minWidth: 150 },
  { id: 'data', label: 'Data', minWidth: 200 },
];

export default function SuperlockedsPage() {
  const { fetchUsers, loading, error } = useSuperlockedApi();
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadUsers = useCallback(async () => {
    try {
      const result = await fetchUsers.execute({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
      if (result) {
        setUsers(result || []);
      }
    } catch (err) {
      console.error('Error loading users with unlock content:', err);
    }
  }, [fetchUsers, page, rowsPerPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSidebarItemClick = (item: any) => {
    console.log('Clicked sidebar item:', item.id);
  };

  const rows = users.map((user, index) => ({
    id: user.id || `user-${index}`,
    data: JSON.stringify(user),
  }));

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <DashboardLayout
      sidebarItems={defaultAdminSidebarItems}
      onSidebarItemClick={handleSidebarItemClick}
    >
      <ContentArea>
        <h1>Superlockeds Management</h1>
        <p>Manage superlocked content and features. Control access to premium content.</p>
        
        <Box sx={{ marginTop: '24px' }}>
          {loading && users.length === 0 ? (
            <div>Loading users with unlock content...</div>
          ) : error ? (
            <div>Error loading users: {error.message}</div>
          ) : (
            <Table
              columns={columns}
              rows={rows}
              showPagination={true}
              page={page}
              rowsPerPage={rowsPerPage}
              totalRows={users.length}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Box>
      </ContentArea>
    </DashboardLayout>
  );
}