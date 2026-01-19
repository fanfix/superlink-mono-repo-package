'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Typography, Table, type TableColumn, type TableRow } from '@superline/design-system';
import { styled } from '@mui/material/styles';
import { useTippingHistory, transactionDateFormat } from '../../../contexts/TippingHistoryContext';

const Container = styled(Box)({
  maxWidth: 'var(--width-settings-container)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  padding: '0',
});

const Title = styled(Typography)({
  fontSize: 'var(--font-size-h3)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-gray-900)',
  marginBottom: 'var(--padding-3xl)',
  lineHeight: 'var(--line-height-snug)',
  letterSpacing: '-0.01em',
});

const EmptyState = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: '0',
  marginTop: '0',
});

const EmptyStateText = styled(Typography)({
  fontSize: 'var(--font-size-base)',
  color: 'var(--color-gray-500)',
  fontWeight: 'var(--font-weight-semibold)',
  lineHeight: 'var(--line-height-normal)',
});

export default function TippingHistory() {
  const { tippingGroups, loading, refreshTippingHistory } = useTippingHistory();

  // Fetch data when component mounts
  React.useEffect(() => {
    refreshTippingHistory();
  }, [refreshTippingHistory]);

  // Flatten all transactions for table display
  const allTransactions = tippingGroups.flatMap((group) =>
    group.transactions.map((txn) => ({
      id: `${group.timestamp}-${txn.createdAt}`,
      fanName: txn.sender?.name || 'Deleted user',
      amount: txn.amount,
      date: txn.createdAt,
      groupDate: group.timestamp,
    }))
  );

  const columns: TableColumn[] = [
    {
      id: 'fanName',
      label: 'Fan Name',
      minWidth: 150,
      align: 'left',
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 120,
      align: 'right',
      format: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      id: 'date',
      label: 'Date',
      minWidth: 120,
      align: 'left',
      format: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
  ];

  const rows: TableRow[] = allTransactions.map((tip) => ({
    fanName: tip.fanName,
    amount: tip.amount,
    date: tip.date,
  }));

  // Show loading state
  if (loading) {
    return (
      <Container>
        <Title>Tipping History</Title>
        <EmptyState>
          <EmptyStateText>Loading...</EmptyStateText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Tipping History</Title>
      
      {allTransactions.length === 0 ? (
        <EmptyState>
          <EmptyStateText>No Tips Received</EmptyStateText>
        </EmptyState>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--padding-2xl)' }}>
          {tippingGroups.map((group, groupIndex) => (
            <Box key={group.timestamp}>
              <Typography
                sx={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--padding-md)',
                }}
              >
                {transactionDateFormat(group.timestamp)}
              </Typography>
              {group.transactions.map((txn, txnIndex) => (
                <Typography
                  key={`${group.timestamp}-${txnIndex}`}
                  sx={{
                    fontSize: 'var(--font-size-md)',
                    color: 'var(--color-gray-700)',
                    marginTop: 'var(--padding-xs)',
                  }}
                >
                  ${txn.amount} tip received from {txn.sender?.name || 'Deleted user'}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}

