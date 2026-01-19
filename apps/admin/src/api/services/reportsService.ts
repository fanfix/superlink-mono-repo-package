/**
 * Reports Service for Admin Panel
 * Handles all reports-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  REPORTS_QUERY,
  REPORT_QUERY,
} from '../queries';
import {
  ReportsResponse,
  ReportResponse,
  Report,
} from '../types';

/**
 * Get Reports
 */
export interface GetReportsParams {
  limit?: number;
  offset?: number;
  where?: Record<string, any>;
  orderBy?: Record<string, any>;
  withDeleted?: boolean;
}

export const getReports = async (
  params: GetReportsParams
): Promise<ReportsResponse> => {
  const response = await executeGraphQL<ReportsResponse>({
    operationName: 'Reports',
    query: REPORTS_QUERY,
    variables: params,
  });

  return response.data;
};

/**
 * Get Report by ID
 */
export interface GetReportParams {
  reportId: string;
  withDeleted?: boolean;
}

export const getReport = async (
  params: GetReportParams
): Promise<ReportResponse['report']> => {
  const response = await executeGraphQL<ReportResponse>({
    operationName: 'Report',
    query: REPORT_QUERY,
    variables: params,
  });

  return response.data.report;
};

export default {
  getReports,
  getReport,
};

