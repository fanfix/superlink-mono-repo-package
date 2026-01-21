'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table } from '@superline/design-system';
import { useReportsApi } from '../../../hooks';
import { Report } from '../../../api/types';

const columns = [
  { id: 'isBullying', label: 'Bullying', minWidth: 100 },
  { id: 'isSpam', label: 'Spam', minWidth: 100 },
  { id: 'isHarassment', label: 'Harassment', minWidth: 100 },
  { id: 'isHateSpeech', label: 'Hate Speech', minWidth: 100 },
  { id: 'isOther', label: 'Other', minWidth: 100 },
  { id: 'createdAt', label: 'Created', minWidth: 120 },
];

const ReportsTable = () => {
  const { fetchReports } = useReportsApi();
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadReports = useCallback(async () => {
    try {
      const result = await fetchReports.execute({
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        withDeleted: false,
      });
      if (result) {
        setReports(result.reports || []);
        setTotal(result.reportsAggregate || 0);
      }
    } catch (err) {
      console.error('Error loading reports:', err);
    }
  }, [fetchReports, page, rowsPerPage]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const rows = reports.map((report) => ({
    id: report.id,
    isBullying: report.isBullying ? 'Yes' : 'No',
    isSpam: report.isSpam ? 'Yes' : 'No',
    isHarassment: report.isHarassment ? 'Yes' : 'No',
    isHateSpeech: report.isHateSpeech ? 'Yes' : 'No',
    isOther: report.isOther ? 'Yes' : 'No',
    createdAt: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A',
  }));

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  if (fetchReports.loading && reports.length === 0) {
    return <div>Loading reports...</div>;
  }

  if (fetchReports.error) {
    return <div>Error loading reports: {fetchReports.error.message}</div>;
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

export default ReportsTable;

