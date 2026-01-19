'use client';

export interface CsvColumn<T> {
  label: string;
  value: (row: T) => string | number | null | undefined;
}

const sanitizeForCsv = (input: string | number | null | undefined): string => {
  if (input === null || input === undefined) {
    return '""';
  }

  const rawString = String(input);
  const escaped = rawString.replace(/"/g, '""');
  return `"${escaped}"`;
};

/**
 * Export data rows to a CSV file and trigger a download in the browser.
 * Returns true if the export was triggered, false otherwise.
 */
export const exportToCsv = <T,>(
  filename: string,
  columns: CsvColumn<T>[],
  rows: T[] | null | undefined
): boolean => {
  if (typeof window === 'undefined') {
    console.warn('exportToCsv: window is not available in this environment.');
    return false;
  }

  if (!rows || rows.length === 0) {
    console.warn(`exportToCsv: No rows available to export for ${filename}`);
    return false;
  }

  if (!columns || columns.length === 0) {
    console.warn(`exportToCsv: No columns provided for ${filename}`);
    return false;
  }

  const headerRow = columns.map(column => sanitizeForCsv(column.label)).join(',');
  const dataRows = rows.map(row =>
    columns.map(column => sanitizeForCsv(column.value(row))).join(',')
  );

  const csvContent = [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return true;
};


