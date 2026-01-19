'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table } from '@superline/design-system';
import { useSubscriptionsApi } from '../../../hooks';
import { Subscription } from '../../../api/types';

const columns = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'agency.email', label: 'Agency Email', minWidth: 180 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100 },
  { id: 'discountedPrice', label: 'Discounted Price', minWidth: 130 },
  { id: 'createdAt', label: 'Created', minWidth: 120 },
  { id: 'expiresAt', label: 'Expires', minWidth: 120 },
  { id: 'deletedAt', label: 'Deleted', minWidth: 120 },
];

const SubscriptionsTable = () => {
  const { fetchSubscriptions, loading, error } = useSubscriptionsApi();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadSubscriptions = useCallback(async () => {
    try {
      const result = await fetchSubscriptions.execute({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
      if (result) {
        setSubscriptions(result.subscriptions || []);
        setTotal(result.count || 0);
      }
    } catch (err) {
      console.error('Error loading subscriptions:', err);
    }
  }, [fetchSubscriptions, page, rowsPerPage]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const rows = subscriptions.map((subscription) => ({
    id: subscription.id,
    'agency.email': subscription.agency?.email || 'N/A',
    status: subscription.status || 'N/A',
    price: subscription.price ? `$${subscription.price.toFixed(2)}` : 'N/A',
    discountedPrice: subscription.discountedPrice ? `$${subscription.discountedPrice.toFixed(2)}` : 'N/A',
    createdAt: subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString() : 'N/A',
    expiresAt: subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : 'N/A',
    deletedAt: subscription.deletedAt ? new Date(subscription.deletedAt).toLocaleDateString() : 'N/A',
  }));

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  if (loading && subscriptions.length === 0) {
    return <div>Loading subscriptions...</div>;
  }

  if (error) {
    return <div>Error loading subscriptions: {error.message}</div>;
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

export default SubscriptionsTable;

