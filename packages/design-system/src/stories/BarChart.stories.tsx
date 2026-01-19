/**
 * Chart Component Stories
 * 
 * This component now uses ApexCharts (react-apexcharts) for rendering.
 * All chart variants (bar, line, pie, wave, combined) are supported with
 * the same API and functionality as before.
 */
import { Chart, BarChart as BarChartComponent } from "../ui/BarChart";

const meta = {
  title: "Components/Charts/BarChart",
  component: Chart,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['bar', 'line', 'pie', 'wave', 'combined'],
    },
    width: {
      control: "number",
    },
    height: {
      control: "number",
    },
    maxValue: {
      control: "number",
    },
    showArea: {
      control: "boolean",
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 10 },
    },
    waveColor: {
      control: { type: 'color' },
    },
    areaOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    showDataPoints: {
      control: { type: 'boolean' },
    },
    showHoverAreas: {
      control: { type: 'boolean' },
    },
    showTooltip: {
      control: { type: 'boolean' },
    },
    tooltipBackgroundColor: {
      control: { type: 'color' },
    },
    tooltipTextColor: {
      control: { type: 'color' },
    },
    tooltipBorderColor: {
      control: { type: 'color' },
    },
    textOrientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'angled'],
    },
    textAngle: {
      control: { type: 'range', min: -90, max: 90, step: 5 },
    },
    textSpacing: {
      control: { type: 'range', min: 5, max: 100, step: 5 },
    },
    barColor: {
      control: { type: 'color' },
    },
    lineColor: {
      control: { type: 'color' },
    },
    highlightedBarColor: {
      control: { type: 'color' },
    },
    highlightedIndex: {
      control: { type: 'number', min: -1, max: 30 },
    },
    hoverBarColor: {
      control: { type: 'color' },
    },
    hoverLineColor: {
      control: { type: 'color' },
    },
    fixedBarSpacing: {
      control: { type: 'range', min: 2, max: 50, step: 2 },
    },
    enableHorizontalScroll: {
      control: { type: 'boolean' },
    },
    minBarWidth: {
      control: { type: 'range', min: 10, max: 200, step: 5 },
    },
    maxBarWidth: {
      control: { type: 'range', min: 20, max: 300, step: 5 },
    },
    enableAutoSpacing: {
      control: { type: 'boolean' },
    },
    minSpacingMultiplier: {
      control: { type: 'range', min: 1.0, max: 3.0, step: 0.1 },
    },
  },
};

export default meta;

// Generate October data similar to the image provided
const generateOctoberData = () => {
  return [
    { date: "Oct 24", value: 434, label: "$434" },
    { date: "Oct 25", value: 380, label: "$380" },
    { date: "Oct 26", value: 420, label: "$420" },
    { date: "Oct 27", value: 434, label: "$434" },
    { date: "Oct 28", value: 180, label: "$180" },
    { date: "Oct 29", value: 520, label: "$520" },
    { date: "Oct 30", value: 580, label: "$580" },
  ];
};

// Generate full October dataset (Oct 1-31) matching the Figma design
const generateFullOctoberData = () => {
  const data = [];
  // Generate realistic values that match the Figma design pattern
  const baseValues = [
    580, 560, 540, 520, 500, 480, 460, 440, 420, 400,
    380, 360, 340, 320, 300, 280, 260, 240, 220, 200,
    180, 160, 140, 120, 100, 80, 60, 40, 20, 10, 5
  ];
  
  for (let day = 1; day <= 31; day++) {
    const value = baseValues[day - 1] || Math.floor(Math.random() * 100) + 20;
    data.push({
      date: `Oct ${day}`,
      value: value,
      label: `$${value}K`,
    });
  }
  return data;
};

// Generate October data for combined charts (matching the image pattern)
const generateCombinedOctoberData = () => {
  return [
    { date: "Oct 1", barValue: 450, lineValue: 400 },
    { date: "Oct 2", barValue: 480, lineValue: 380 },
    { date: "Oct 3", barValue: 520, lineValue: 350 },
    { date: "Oct 4", barValue: 580, lineValue: 270 },
    { date: "Oct 5", barValue: 600, lineValue: 250 },
    { date: "Oct 6", barValue: 550, lineValue: 300 },
    { date: "Oct 7", barValue: 520, lineValue: 420 },
    { date: "Oct 8", barValue: 500, lineValue: 410 },
    { date: "Oct 9", barValue: 480, lineValue: 380 },
    { date: "Oct 10", barValue: 460, lineValue: 350 },
    { date: "Oct 11", barValue: 440, lineValue: 320 },
    { date: "Oct 12", barValue: 420, lineValue: 280 },
    { date: "Oct 13", barValue: 400, lineValue: 210 },
    { date: "Oct 14", barValue: 380, lineValue: 200 },
    { date: "Oct 15", barValue: 400, lineValue: 250 },
    { date: "Oct 16", barValue: 420, lineValue: 370 },
    { date: "Oct 17", barValue: 440, lineValue: 350 },
    { date: "Oct 18", barValue: 460, lineValue: 300 },
    { date: "Oct 19", barValue: 480, lineValue: 160 },
    { date: "Oct 20", barValue: 500, lineValue: 200 },
    { date: "Oct 21", barValue: 520, lineValue: 400 }, // Highlighted day
    { date: "Oct 22", barValue: 500, lineValue: 350 },
    { date: "Oct 23", barValue: 480, lineValue: 300 },
    { date: "Oct 24", barValue: 460, lineValue: 250 },
    { date: "Oct 25", barValue: 440, lineValue: 280 },
    { date: "Oct 26", barValue: 460, lineValue: 320 },
    { date: "Oct 27", barValue: 480, lineValue: 350 },
    { date: "Oct 28", barValue: 500, lineValue: 380 },
    { date: "Oct 29", barValue: 520, lineValue: 400 },
    { date: "Oct 30", barValue: 540, lineValue: 420 },
    { date: "Oct 31", barValue: 560, lineValue: 450 },
  ];
};

// Generate large dataset for scrolling demonstration
const generateLargeDataset = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [];
  
  for (let year = 2020; year <= 2024; year++) {
    for (let month = 0; month < 12; month++) {
      data.push({
        date: `${months[month]} ${year}`,
        value: Math.floor(Math.random() * 500) + 100,
        barValue: Math.floor(Math.random() * 500) + 100,
        lineValue: Math.floor(Math.random() * 400) + 50,
      });
    }
  }
  
  return data;
};

// Generate dataset with varying text lengths for auto-spacing testing
const generateVariableLengthData = () => {
  return [
    { date: "Q1", value: 120, label: "$120K" },
    { date: "Quarter 2", value: 180, label: "$180K" },
    { date: "Q3 2024", value: 150, label: "$150K" },
    { date: "Fourth Quarter", value: 220, label: "$220K" },
    { date: "Q5", value: 190, label: "$190K" },
    { date: "Sixth Quarter", value: 250, label: "$250K" },
  ];
};

// Generate dataset with very long labels
const generateLongLabelData = () => {
  return [
    { date: "January 2024", value: 120, label: "$120K" },
    { date: "February 2024", value: 180, label: "$180K" },
    { date: "March 2024", value: 150, label: "$150K" },
    { date: "April 2024", value: 220, label: "$220K" },
    { date: "May 2024", value: 190, label: "$190K" },
    { date: "June 2024", value: 250, label: "$250K" },
    { date: "July 2024", value: 210, label: "$210K" },
    { date: "August 2024", value: 280, label: "$280K" },
  ];
};

// Generate dataset with short labels
const generateShortLabelData = () => {
  return [
    { date: "A", value: 120, label: "$120K" },
    { date: "B", value: 180, label: "$180K" },
    { date: "C", value: 150, label: "$150K" },
    { date: "D", value: 220, label: "$220K" },
    { date: "E", value: 190, label: "$190K" },
    { date: "F", value: 250, label: "$250K" },
    { date: "G", value: 210, label: "$210K" },
    { date: "H", value: 280, label: "$280K" },
  ];
};

// Pie chart data
const generatePieData = () => {
  return [
    { date: "Desktop", value: 45, label: "Desktop", color: "#10B981" },
    { date: "Mobile", value: 35, label: "Mobile", color: "#3B82F6" },
    { date: "Tablet", value: 20, label: "Tablet", color: "#8B5CF6" },
  ];
};

// Sales data for different chart types
const salesData = [
  { date: "Q1", value: 120, label: "$120K" },
  { date: "Q2", value: 180, label: "$180K" },
  { date: "Q3", value: 150, label: "$150K" },
  { date: "Q4", value: 220, label: "$220K" },
];

// Bar Chart Stories
export const BarChart = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    enableAutoSpacing: true,
    minSpacingMultiplier: 1.0,
    minBarWidth: 20,
    maxBarWidth: 60,
  },
};

export const BarChartSmall = {
  args: {
    variant: 'bar',
    data: salesData,
    width: 600,
    height: 300,
    maxValue: 250,
    textOrientation: 'horizontal',
  },
};

export const BarChartVerticalText = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'vertical',
  },
};

export const BarChartAngledText = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'angled',
    textAngle: -45,
  },
};

export const BarChartCustomAngle = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'angled',
    textAngle: -30,
  },
};

export const BarChartTightSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
  },
};

export const BarChartAngledTight = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'angled',
    textAngle: -45,
  },
};

export const BarChartVerticalTight = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'vertical',
  },
};

export const BarChartMinimalSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    textSpacing: 5,
  },
};

export const BarChartMediumSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    textSpacing: 30,
  },
};

export const BarChartLargeSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    textSpacing: 60,
  },
};

export const BarChartAngledWithSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'angled',
    textAngle: -45,
    textSpacing: 25,
  },
};

export const BarChartVerticalWithSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'vertical',
    textSpacing: 20,
  },
};

export const BarChartMaximumSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    textSpacing: 100,
  },
};

export const BarChartAngledMaximumSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'angled',
    textAngle: -45,
    textSpacing: 80,
  },
};

export const BarChartTextAlignmentTest = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'angled',
    textAngle: -45,
    textSpacing: 20,
  },
};

export const BarChartTextAlignmentTest30 = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'angled',
    textAngle: -30,
    textSpacing: 20,
  },
};

export const BarChartTextAlignmentTest60 = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'angled',
    textAngle: -60,
    textSpacing: 20,
  },
};

// Line Chart Stories
export const LineChart = {
  args: {
    variant: 'line',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    showArea: true,
    strokeWidth: 3,
  },
};

export const LineChartNoArea = {
  args: {
    variant: 'line',
    data: generateOctoberData(),
    width: 800,
    height: 400,
    maxValue: 600,
    showArea: false,
    strokeWidth: 2,
  },
};

export const LineChartThick = {
  args: {
    variant: 'line',
    data: salesData,
    width: 600,
    height: 300,
    maxValue: 250,
    showArea: true,
    strokeWidth: 5,
  },
};

// Pie Chart Stories
export const PieChart = {
  args: {
    variant: 'pie',
    data: generatePieData(),
    width: 500,
    height: 400,
  },
};

export const PieChartLarge = {
  args: {
    variant: 'pie',
    data: [
      { date: "Chrome", value: 65, label: "Chrome", color: "#10B981" },
      { date: "Firefox", value: 20, label: "Firefox", color: "#3B82F6" },
      { date: "Safari", value: 10, label: "Safari", color: "#8B5CF6" },
      { date: "Edge", value: 5, label: "Edge", color: "#F59E0B" },
    ],
    width: 600,
    height: 500,
  },
};

// Interactive Stories
export const InteractiveBarChart = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    onDataPointClick: (dataPoint: any) => console.log("Data point clicked:", dataPoint),
  },
};

export const InteractiveLineChart = {
  args: {
    variant: 'line',
    data: generateOctoberData(),
    width: 800,
    height: 400,
    maxValue: 600,
    showArea: true,
    onDataPointClick: (dataPoint: any) => console.log("Line point clicked:", dataPoint),
  },
};

export const InteractivePieChart = {
  args: {
    variant: 'pie',
    data: generatePieData(),
    width: 500,
    height: 400,
    onDataPointClick: (dataPoint: any) => console.log("Pie slice clicked:", dataPoint),
  },
};

// Wave Chart Stories
export const WaveChartStory = {
  args:{
    variant:'wave',
    data:generateOctoberData(),
    width:1117,
    height:378,
    maxValue:600,
    waveColor:'#10B981',
    areaOpacity:0.3,
    showArea:true,
    strokeWidth:3,
    showDataPoints:false
  },
};

export const WaveChartSmall = {
  args: {
    variant: 'wave',
    data: salesData,
    width: 600,
    height: 300,
    maxValue: 250,
    waveColor: 'var(--color-blue)',
    areaOpacity: 0.4,
    showArea: true,
    strokeWidth: 2,
  },
};

export const WaveChartPurple = {
  args: {
    variant: 'wave',
    data: generateOctoberData(),
    width: 800,
    height: 400,
    maxValue: 600,
    waveColor: 'var(--color-info-main)',
    areaOpacity: 0.25,
    showArea: true,
    strokeWidth: 4,
  },
};

export const InteractiveWaveChart = {
  args: {
    variant: 'wave',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    waveColor: 'var(--color-success-main)',
    areaOpacity: 0.3,
    showArea: true,
    strokeWidth: 3,
    onDataPointClick: (dataPoint: any) => console.log("Wave point clicked:", dataPoint),
  },
};

export const WaveChartNoPoints = {
  args: {
    variant: 'wave',
    data: generateOctoberData(),
    width: 800,
    height: 400,
    maxValue: 600,
    waveColor: 'var(--color-success-main)',
    areaOpacity: 0.3,
    showArea: true,
    strokeWidth: 4,
    showDataPoints: false,
  },
};

export const WaveChartSmooth = {
  args: {
    variant: 'wave',
    data: generateOctoberData(),
    width: 900,
    height: 350,
    maxValue: 600,
    waveColor: 'var(--color-blue)',
    areaOpacity: 0.25,
    showArea: true,
    strokeWidth: 3,
    showDataPoints: false,
  },
};

// Tooltip Customization Stories
export const CustomTooltipDark = {
  args: {
    variant: 'wave',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    waveColor: '#10B981',
    areaOpacity: 0.3,
    showArea: true,
    strokeWidth: 3,
    showDataPoints: false,
    showTooltip: true,
    tooltipBackgroundColor: '#374151',
    tooltipTextColor: '#ffffff',
    tooltipBorderColor: '#6b7280',
  },
};

export const CustomTooltipLight = {
  args: {
    variant: 'wave',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    waveColor: '#3B82F6',
    areaOpacity: 0.3,
    showArea: true,
    strokeWidth: 3,
    showDataPoints: false,
    showTooltip: true,
    tooltipBackgroundColor: '#ffffff',
    tooltipTextColor: '#374151',
    tooltipBorderColor: '#e5e7eb',
  },
};

export const CustomTooltipGreen = {
  args: {
    variant: 'wave',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    waveColor: '#10B981',
    areaOpacity: 0.3,
    showArea: true,
    strokeWidth: 3,
    showDataPoints: false,
    showTooltip: true,
    tooltipBackgroundColor: '#10B981',
    tooltipTextColor: '#ffffff',
    tooltipBorderColor: '#059669',
  },
};

export const NoTooltip = {
  args: {
    variant: 'wave',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    waveColor: '#10B981',
    areaOpacity: 0.3,
    showArea: true,
    strokeWidth: 3,
    showDataPoints: false,
    showTooltip: false,
  },
};

export const WaveWithHoverAreas = {
  args: {
    variant: 'wave',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    waveColor: '#10B981',
    areaOpacity: 0.3,
    showArea: true,
    strokeWidth: 3,
    showDataPoints: false,
    showHoverAreas: true,
    showTooltip: true,
    tooltipBackgroundColor: '#374151',
    tooltipTextColor: '#ffffff',
    tooltipBorderColor: '#6b7280',
  },
};

// Combined Chart Stories
export const CombinedChart = {
  args: {
    variant: 'combined',
    data: generateCombinedOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    showArea: false,
    strokeWidth: 3,
    barColor: "#E5E7EB",
    lineColor: "#10B981",
    highlightedBarColor: "#10B981",
    highlightedIndex: 20, // Oct 21
    hoverBarColor: "#10B981",
    hoverLineColor: "#10B981",
    showTooltip: true,
    tooltipBackgroundColor: "#374151",
    tooltipTextColor: "#ffffff",
  },
};

export const CombinedChartBlue = {
  args: {
    variant: 'combined',
    data: generateCombinedOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    showArea: false,
    strokeWidth: 3,
    barColor: "#E5E7EB",
    lineColor: "#3B82F6",
    highlightedBarColor: "#3B82F6",
    highlightedIndex: 20,
    hoverBarColor: "#3B82F6",
    hoverLineColor: "#3B82F6",
    showTooltip: true,
    tooltipBackgroundColor: "#1E40AF",
    tooltipTextColor: "#ffffff",
  },
};

export const CombinedChartNoHighlight = {
  args: {
    variant: 'combined',
    data: generateCombinedOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    showArea: false,
    strokeWidth: 3,
    barColor: "#E5E7EB",
    lineColor: "#10B981",
    highlightedBarColor: "#10B981",
    highlightedIndex: -1, // No highlight
    hoverBarColor: "#10B981",
    hoverLineColor: "#10B981",
    showTooltip: true,
  },
};

export const CombinedChartInteractive = {
  args: {
    variant: 'combined',
    data: generateCombinedOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    showArea: false,
    strokeWidth: 3,
    barColor: "#E5E7EB",
    lineColor: "#10B981",
    highlightedBarColor: "#10B981",
    highlightedIndex: 20,
    hoverBarColor: "#10B981",
    hoverLineColor: "#10B981",
    showTooltip: true,
    onDataPointClick: (dataPoint: any) => console.log("Data point clicked:", dataPoint),
  },
};

// Enhanced Bar Chart Stories with Fixed Spacing
export const BarChartFixedSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    fixedBarSpacing: 8,
    minBarWidth: 30,
    maxBarWidth: 80,
  },
};

export const BarChartEnhancedTightSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    fixedBarSpacing: 4,
    minBarWidth: 20,
    maxBarWidth: 60,
  },
};

export const BarChartWideSpacing = {
  args: {
    variant: 'bar',
    data: generateOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    fixedBarSpacing: 16,
    minBarWidth: 40,
    maxBarWidth: 100,
  },
};

// Horizontal Scrolling Stories
export const BarChartWithScroll = {
  args: {
    variant: 'bar',
    data: generateLargeDataset(),
    width: 800,
    height: 400,
    maxValue: 600,
    textOrientation: 'horizontal',
    enableHorizontalScroll: true,
    fixedBarSpacing: 8,
    minBarWidth: 25,
    maxBarWidth: 50,
  },
};

export const CombinedChartWithScroll = {
  args: {
    variant: 'combined',
    data: generateLargeDataset(),
    width: 800,
    height: 400,
    maxValue: 600,
    showArea: false,
    strokeWidth: 3,
    barColor: "#E5E7EB",
    lineColor: "#10B981",
    highlightedBarColor: "#10B981",
    enableHorizontalScroll: true,
    fixedBarSpacing: 8,
    minBarWidth: 25,
    maxBarWidth: 50,
    showTooltip: true,
  },
};

export const BarChartScrollAngled = {
  args: {
    variant: 'bar',
    data: generateLargeDataset(),
    width: 800,
    height: 400,
    maxValue: 600,
    textOrientation: 'angled',
    textAngle: -45,
    enableHorizontalScroll: true,
    fixedBarSpacing: 8,
    minBarWidth: 25,
    maxBarWidth: 50,
  },
};

export const BarChartScrollVertical = {
  args: {
    variant: 'bar',
    data: generateLargeDataset(),
    width: 800,
    height: 400,
    maxValue: 600,
    textOrientation: 'vertical',
    enableHorizontalScroll: true,
    fixedBarSpacing: 8,
    minBarWidth: 25,
    maxBarWidth: 50,
  },
};

// Enhanced Combined Chart with Fixed Spacing
export const CombinedChartFixedSpacing = {
  args: {
    variant: 'combined',
    data: generateCombinedOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    showArea: false,
    strokeWidth: 3,
    barColor: "#E5E7EB",
    lineColor: "#10B981",
    highlightedBarColor: "#10B981",
    highlightedIndex: 20,
    hoverBarColor: "#10B981",
    hoverLineColor: "#10B981",
    showTooltip: true,
    fixedBarSpacing: 8,
    minBarWidth: 30,
    maxBarWidth: 80,
  },
};

export const CombinedChartTightSpacing = {
  args: {
    variant: 'combined',
    data: generateCombinedOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    showArea: false,
    strokeWidth: 3,
    barColor: "#E5E7EB",
    lineColor: "#10B981",
    highlightedBarColor: "#10B981",
    highlightedIndex: 20,
    hoverBarColor: "#10B981",
    hoverLineColor: "#10B981",
    showTooltip: true,
    fixedBarSpacing: 4,
    minBarWidth: 20,
    maxBarWidth: 60,
  },
};

// Auto-Spacing Stories
export const BarChartAutoSpacing = {
  args: {
    variant: 'bar',
    data: generateVariableLengthData(),
    width: 1117,
    height: 378,
    maxValue: 300,
    textOrientation: 'horizontal',
    enableAutoSpacing: true,
    minSpacingMultiplier: 1.2,
    minBarWidth: 30,
    maxBarWidth: 80,
  },
};

export const BarChartAutoSpacingAngled = {
  args: {
    variant: 'bar',
    data: generateVariableLengthData(),
    width: 1117,
    height: 378,
    maxValue: 300,
    textOrientation: 'angled',
    textAngle: -45,
    enableAutoSpacing: true,
    minSpacingMultiplier: 1.5,
    minBarWidth: 30,
    maxBarWidth: 80,
  },
};

export const BarChartAutoSpacingVertical = {
  args: {
    variant: 'bar',
    data: generateVariableLengthData(),
    width: 1117,
    height: 378,
    maxValue: 300,
    textOrientation: 'vertical',
    enableAutoSpacing: true,
    minSpacingMultiplier: 1.3,
    minBarWidth: 30,
    maxBarWidth: 80,
  },
};

export const BarChartLongLabels = {
  args: {
    variant: 'bar',
    data: generateLongLabelData(),
    width: 1117,
    height: 378,
    maxValue: 300,
    textOrientation: 'horizontal',
    enableAutoSpacing: true,
    minSpacingMultiplier: 1.2,
    minBarWidth: 30,
    maxBarWidth: 80,
  },
};

export const BarChartShortLabels = {
  args: {
    variant: 'bar',
    data: generateShortLabelData(),
    width: 1117,
    height: 378,
    maxValue: 300,
    textOrientation: 'horizontal',
    enableAutoSpacing: true,
    minSpacingMultiplier: 1.2,
    minBarWidth: 30,
    maxBarWidth: 80,
  },
};

export const BarChartAutoSpacingWithScroll = {
  args: {
    variant: 'bar',
    data: generateLongLabelData(),
    width: 800,
    height: 400,
    maxValue: 300,
    textOrientation: 'horizontal',
    enableAutoSpacing: true,
    enableHorizontalScroll: true,
    minSpacingMultiplier: 1.2,
    minBarWidth: 25,
    maxBarWidth: 60,
  },
};

export const CombinedChartAutoSpacing = {
  args: {
    variant: 'combined',
    data: generateVariableLengthData().map(item => ({
      ...item,
      barValue: item.value,
      lineValue: item.value * 0.8,
    })),
    width: 1117,
    height: 378,
    maxValue: 300,
    showArea: false,
    strokeWidth: 3,
    barColor: "#E5E7EB",
    lineColor: "#10B981",
    highlightedBarColor: "#10B981",
    hoverBarColor: "#10B981",
    hoverLineColor: "#10B981",
    showTooltip: true,
    enableAutoSpacing: true,
    minSpacingMultiplier: 1.2,
    minBarWidth: 30,
    maxBarWidth: 80,
  },
};

export const BarChartAutoSpacingComparison = {
  args: {
    variant: 'bar',
    data: generateVariableLengthData(),
    width: 1117,
    height: 378,
    maxValue: 300,
    textOrientation: 'horizontal',
    enableAutoSpacing: false,
    fixedBarSpacing: 8,
    minBarWidth: 30,
    maxBarWidth: 80,
  },
};

// Figma Design Showcase - Exact match to the provided design
export const BarChartFigmaDesign = {
  args: {
    variant: 'bar',
    data: generateFullOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    enableAutoSpacing: true,
    minSpacingMultiplier: 1.0,
    minBarWidth: 15,
    maxBarWidth: 50,
    highlightedIndex: 20, // Highlight Oct 21 like in the Figma design
    highlightedBarColor: '#10B981',
    showTooltip: true,
    barColor: '#E5E7EB', // Light gray bars like in Figma
  },
};

// Test the full October dataset that matches the Figma design exactly
export const BarChartFullOctober = {
  args: {
    variant: 'bar',
    data: generateFullOctoberData(),
    width: 1117,
    height: 378,
    maxValue: 600,
    textOrientation: 'horizontal',
    enableAutoSpacing: true,
    minSpacingMultiplier: 1.0,
    minBarWidth: 15,
    maxBarWidth: 50,
    highlightedIndex: 20, // Highlight Oct 21 like in the Figma design
    highlightedBarColor: '#10B981',
    showTooltip: true,
  },
};

export const BarChartFullOctoberWithScroll = {
  args: {
    variant: 'bar',
    data: generateFullOctoberData(),
    width: 800,
    height: 400,
    maxValue: 600,
    textOrientation: 'horizontal',
    enableAutoSpacing: true,
    enableHorizontalScroll: true,
    minSpacingMultiplier: 1.0,
    minBarWidth: 12,
    maxBarWidth: 35,
    highlightedIndex: 20, // Highlight Oct 21
    highlightedBarColor: '#10B981',
    showTooltip: true,
  },
};

// Backward compatibility - keep old BarChart stories
export const Default = BarChart;
export const SmallChart = BarChartSmall;
export const Interactive = InteractiveBarChart;
