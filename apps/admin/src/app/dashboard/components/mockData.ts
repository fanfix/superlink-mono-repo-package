export interface DailyRevenueData {
  date: string;
  value: number;
  tooltipValue: string;
  highlighted?: boolean;
}

export interface FinancialSummaryData {
  totalRevenue: number;
  filteredRevenue: number;
  dateRange: string;
}

export const financialSummaryData: FinancialSummaryData = {
  totalRevenue: 12719.87,
  filteredRevenue: 1719.67,
  dateRange: "09-29-2024 - 10-28-2024"
};

export const mockDailyRevenueData: DailyRevenueData[] = [
  { date: "Oct 1", value: 600, tooltipValue: "$60K" },
  { date: "Oct 2", value: 590, tooltipValue: "$59K" },
  { date: "Oct 3", value: 590, tooltipValue: "$59K" },
  { date: "Oct 4", value: 580, tooltipValue: "$58K" },
  { date: "Oct 5", value: 570, tooltipValue: "$57K" },
  { date: "Oct 6", value: 540, tooltipValue: "$54K" },
  { date: "Oct 7", value: 520, tooltipValue: "$52K" },
  { date: "Oct 8", value: 510, tooltipValue: "$51K" },
  { date: "Oct 9", value: 500, tooltipValue: "$50K" },
  { date: "Oct 10", value: 490, tooltipValue: "$49K" },
  { date: "Oct 11", value: 490, tooltipValue: "$49K" },
  { date: "Oct 12", value: 480, tooltipValue: "$48K" },
  { date: "Oct 13", value: 480, tooltipValue: "$48K" },
  { date: "Oct 14", value: 470, tooltipValue: "$47K" },
  { date: "Oct 15", value: 470, tooltipValue: "$47K" },
  // { date: "Oct 16", value: 460, tooltipValue: "$46K" },
  // { date: "Oct 17", value: 460, tooltipValue: "$46K" },
  // { date: "Oct 18", value: 450, tooltipValue: "$45K" },
  // { date: "Oct 19", value: 450, tooltipValue: "$45K" },
  // { date: "Oct 20", value: 440, tooltipValue: "$44K" },
  // { date: "Oct 21", value: 460, tooltipValue: "$25K", highlighted: true },
  // { date: "Oct 22", value: 440, tooltipValue: "$44K" },
  // { date: "Oct 23", value: 440, tooltipValue: "$44K" },
  // { date: "Oct 24", value: 430, tooltipValue: "$43K" },
  // { date: "Oct 25", value: 430, tooltipValue: "$43K" },
  // { date: "Oct 26", value: 420, tooltipValue: "$42K" },
  // { date: "Oct 27", value: 420, tooltipValue: "$42K" },
  // { date: "Oct 28", value: 410, tooltipValue: "$41K" },
  // { date: "Oct 29", value: 410, tooltipValue: "$41K" },
  // { date: "Oct 30", value: 400, tooltipValue: "$40K" },
  // { date: "Oct 31", value: 400, tooltipValue: "$40K" }
];

export const calculateTotalRevenue = (data: DailyRevenueData[]): number => {
  return data.reduce((sum, item) => sum + item.value, 0);
};

export const calculateFilteredRevenue = (
  data: DailyRevenueData[], 
  startDate?: Date, 
  endDate?: Date
): number => {
  if (!startDate || !endDate) {
    return calculateTotalRevenue(data);
  }
  
  // Filter data based on date range
  // For this mock data, we'll simulate filtering by reducing the total
  // In a real app, you'd filter based on actual dates
  const filteredData = data.filter(item => {
    // Simulate date filtering - you can enhance this based on your needs
    // For demo purposes, we'll return a subset of data
    return true; // For now, return all data
  });
  
  // For demo purposes, return a filtered amount that's different from total
  const total = calculateTotalRevenue(data);
  return total * 0.8; // Return 80% of total as filtered amount
};

export const filterDataByDateRange = (
  data: DailyRevenueData[], 
  startDate?: Date, 
  endDate?: Date
): DailyRevenueData[] => {
  if (!startDate || !endDate) {
    return data;
  }
  
  // For this mock data, we'll return a subset for demonstration
  // In a real app, you'd filter based on actual dates
  return data.slice(0, Math.floor(data.length * 0.7)); // Return 70% of data
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Agencies Data Interfaces
export interface AgencyData {
  id: string;
  agencyName: string;
  creators: number;
  creatorsWithSuperLocked: number;
  revenue: number;
  avatar?: string;
}

export interface AgencySummaryData {
  totalAgencies: number;
  agenciesWithSuperLocked: number;
  agenciesWithSuperLockedAndInstagram: number;
}

export const agencySummaryData: AgencySummaryData = {
  totalAgencies: 594,
  agenciesWithSuperLocked: 1200,
  agenciesWithSuperLockedAndInstagram: 920,
};

export const mockAgencyData: AgencyData[] = [
  { id: '1',  agencyName: 'Creative Studios',          creators: 123, creatorsWithSuperLocked: 96,  revenue: 1000, avatar: '/assets/default-avatar.svg' },
  { id: '2',  agencyName: 'Digital Media Co',           creators: 89,  creatorsWithSuperLocked: 67,  revenue: 850,  avatar: '/assets/default-avatar.svg' },
  { id: '3',  agencyName: 'Influence Agency',           creators: 156, creatorsWithSuperLocked: 134, revenue: 1200, avatar: '/assets/default-avatar.svg' },
  { id: '4',  agencyName: 'Brand Partners',             creators: 78,  creatorsWithSuperLocked: 45,  revenue: 650,  avatar: '/assets/default-avatar.svg' },
  { id: '5',  agencyName: 'Content Creators Inc',       creators: 201, creatorsWithSuperLocked: 178, revenue: 1500, avatar: '/assets/default-avatar.svg'},
  { id: '6',  agencyName: 'Social Media Pro',           creators: 92,  creatorsWithSuperLocked: 71,  revenue: 750,  avatar: '/assets/default-avatar.svg' },
  { id: '7',  agencyName: 'Marketing Masters',          creators: 134, creatorsWithSuperLocked: 98,  revenue: 1100, avatar: '/assets/default-avatar.svg' },
  { id: '8',  agencyName: 'Creative Collective',        creators: 167, creatorsWithSuperLocked: 142, revenue: 1350, avatar: '/assets/default-avatar.svg' },
  { id: '9',  agencyName: 'Digital Influencers',        creators: 145, creatorsWithSuperLocked: 119, revenue: 950,  avatar: '/assets/default-avatar.svg' },
  { id: '10', agencyName: 'Brand Builders',             creators: 98,  creatorsWithSuperLocked: 76,  revenue: 800,  avatar: '/assets/default-avatar.svg' },
  { id: '11', agencyName: 'Content Kings',              creators: 178, creatorsWithSuperLocked: 156, revenue: 1400, avatar: '/assets/default-avatar.svg' },
  { id: '12', agencyName: 'Social Stars',               creators: 112, creatorsWithSuperLocked: 89,  revenue: 900,  avatar: '/assets/default-avatar.svg' },
  { id: '13', agencyName: 'Influence Hub',              creators: 189, creatorsWithSuperLocked: 167, revenue: 1600, avatar: '/assets/default-avatar.svg' },
  { id: '14', agencyName: 'Creative Minds',             creators: 76,  creatorsWithSuperLocked: 54,  revenue: 600,  avatar: '/assets/default-avatar.svg' },
  { id: '15', agencyName: 'Digital Dreams',             creators: 198, creatorsWithSuperLocked: 175, revenue: 1700, avatar: '/assets/default-avatar.svg' },
];

// Views Data Interfaces
export interface ViewsData {
  date: string;
  barValue: number;
  lineValue: number;
  label?: string;
}

export interface ViewsSummaryData {
  totalViews: number;
  totalViewsWithSuperLocked: number;
}

export const viewsSummaryData: ViewsSummaryData = {
  totalViews: 594,
  totalViewsWithSuperLocked: 1200,
};

export const mockViewsData: ViewsData[] = [
  { date: "Oct 1", barValue: 450, lineValue: 400 },
  { date: "Oct 2", barValue: 420, lineValue: 420 },
  { date: "Oct 3", barValue: 280, lineValue: 380 },
  { date: "Oct 4", barValue: 580, lineValue: 520 },
  { date: "Oct 5", barValue: 550, lineValue: 500 },
  { date: "Oct 6", barValue: 480, lineValue: 450 },
  { date: "Oct 7", barValue: 520, lineValue: 480 },
  { date: "Oct 8", barValue: 490, lineValue: 460 },
  { date: "Oct 9", barValue: 460, lineValue: 440 },
  { date: "Oct 10", barValue: 290, lineValue: 400 },
  { date: "Oct 11", barValue: 480, lineValue: 450 },
  { date: "Oct 12", barValue: 570, lineValue: 520 },
  { date: "Oct 13", barValue: 560, lineValue: 510 },
  // { date: "Oct 14", barValue: 500, lineValue: 470 },
  // { date: "Oct 15", barValue: 470, lineValue: 440 },
  // { date: "Oct 16", barValue: 450, lineValue: 420 },
  // { date: "Oct 17", barValue: 430, lineValue: 400 },
  // { date: "Oct 18", barValue: 280, lineValue: 380 },
  // { date: "Oct 19", barValue: 290, lineValue: 360 },
  // { date: "Oct 20", barValue: 420, lineValue: 400 },
  // { date: "Oct 21", barValue: 25000, lineValue: 500, label: "25K views" },
  // { date: "Oct 22", barValue: 480, lineValue: 460 },
  // { date: "Oct 23", barValue: 500, lineValue: 480 },
  // { date: "Oct 24", barValue: 520, lineValue: 500 },
  // { date: "Oct 25", barValue: 540, lineValue: 520 },
  // { date: "Oct 26", barValue: 560, lineValue: 540 },
  // { date: "Oct 27", barValue: 580, lineValue: 560 },
  // { date: "Oct 28", barValue: 600, lineValue: 580 },
  // { date: "Oct 29", barValue: 620, lineValue: 600 },
  // { date: "Oct 30", barValue: 640, lineValue: 620 },
  // { date: "Oct 31", barValue: 660, lineValue: 640 },
];