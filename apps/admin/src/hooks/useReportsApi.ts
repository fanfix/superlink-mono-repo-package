/**
 * useReportsApi Hook
 * Provides access to reports API functions
 */

import { useApiCall } from './useApiCall';
import {
  getReports,
  getReport,
  GetReportsParams,
  GetReportParams,
} from '../api/services/reportsService';
import {
  ReportsResponse,
  ReportResponse,
} from '../api/types';

export const useReportsApi = () => {
  const fetchReports = useApiCall<ReportsResponse, [GetReportsParams]>(getReports);
  const fetchReport = useApiCall<ReportResponse['report'], [GetReportParams]>(getReport);

  return {
    fetchReports,
    fetchReport,
  };
};

export type {
  GetReportsParams,
  GetReportParams,
};

