'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';
import { styled } from '@mui/material/styles';
import { useTippingHistory, transactionDateFormat } from '../../../contexts/TippingHistoryContext';
import Loader from '../../../components/Loader';

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

  // NOTE: design-system Table types are not exported in this repo build.
  // This screen renders a grouped list, so we don't need Table types here.

  // Show loading state
  if (loading) {
    return (
      <Container>
        <Title>Tipping History</Title>
        <Loader fullScreen={false} />
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

