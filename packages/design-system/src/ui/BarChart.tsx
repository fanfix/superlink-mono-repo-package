"use client";

import { styled } from "@mui/material/styles";
import { useMemo, useRef, useEffect, useState } from "react";
import type { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts to avoid SSR issues - will be loaded client-side only

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  color?: string;
  // For combined charts
  barValue?: number;
  lineValue?: number;
}

export type ChartVariant = 'bar' | 'line' | 'pie' | 'wave' | 'combined';

export interface ChartProps {
  /**
   * Chart data points
   */
  data: ChartDataPoint[];
  /**
   * Chart variant - bar, line, or pie
   */
  variant?: ChartVariant;
  /**
   * Chart width
   */
  width?: number;
  /**
   * Chart height
   */
  height?: number;
  /**
   * Maximum value for Y-axis (only for bar and line charts)
   */
  maxValue?: number;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Callback when data point is clicked
   */
  onDataPointClick?: (dataPoint: ChartDataPoint) => void;
  /**
   * Show area fill under line chart
   */
  showArea?: boolean;
  /**
   * Line chart stroke width
   */
  strokeWidth?: number;
  /**
   * Wave chart color
   */
  waveColor?: string;
  /**
   * Wave chart area opacity
   */
  areaOpacity?: number;
  /**
   * Show data points on wave chart
   */
  showDataPoints?: boolean;
  /**
   * Show hover areas for tooltips (always enabled for wave charts)
   */
  showHoverAreas?: boolean;
  /**
   * Tooltip background color
   */
  tooltipBackgroundColor?: string;
  /**
   * Tooltip text color
   */
  tooltipTextColor?: string;
  /**
   * Tooltip border color
   */
  tooltipBorderColor?: string;
  /**
   * Show tooltip
   */
  showTooltip?: boolean;
  /**
   * Text orientation for X-axis labels
   */
  textOrientation?: 'horizontal' | 'vertical' | 'angled';
  /**
   * Custom angle for text rotation (only applies when textOrientation is 'angled')
   */
  textAngle?: number;
  /**
   * Spacing between chart and text labels (in pixels)
   */
  textSpacing?: number;
  /**
   * Bar color for combined charts
   */
  barColor?: string;
  /**
   * Line color for combined charts
   */
  lineColor?: string;
  /**
   * Highlighted bar color for combined charts
   */
  highlightedBarColor?: string;
  /**
   * Index of highlighted data point (for special highlighting)
   */
  highlightedIndex?: number;
  /**
   * Hover bar color (when mouse is over bar)
   */
  hoverBarColor?: string;
  /**
   * Hover line color (when mouse is over line point)
   */
  hoverLineColor?: string;
  /**
   * Enable horizontal scrolling for large datasets
   */
  enableHorizontalScroll?: boolean;
  /**
   * Minimum bar width (in pixels)
   */
  minBarWidth?: number;
  /**
   * Maximum bar width (in pixels)
   */
  maxBarWidth?: number;
  /**
   * Fixed spacing between bars (in pixels)
   */
  fixedBarSpacing?: number;
  /**
   * Enable intelligent auto-spacing based on text content
   */
  enableAutoSpacing?: boolean;
  /**
   * Minimum spacing multiplier for text overlap prevention
   */
  minSpacingMultiplier?: number;
}

const ChartContainer = styled("div")<{ enableScroll?: boolean; scrollWidth?: number }>(({ enableScroll, scrollWidth }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "visible", // important - allow labels to be fully visible
  ...(enableScroll && scrollWidth && {
    overflowX: "auto",
    overflowY: "hidden", // Prevent Y-axis scroll
    "&::-webkit-scrollbar": {
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#f1f1f1",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c1c1c1",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#a8a8a8",
      },
    },
  }),
}));

// Helper function to resolve CSS variable colors
const resolveColor = (color: string): string => {
  if (color.startsWith('var(--')) {
    // For CSS variables, return as-is (ApexCharts will handle them)
    return color;
  }
  return color;
};

export const Chart = ({
  data,
  variant = 'bar',
  width = 1117,
  height = 378,
  maxValue,
  className,
  onDataPointClick,
  showArea = true,
  strokeWidth = 3,
  waveColor = 'var(--color-success-main)',
  areaOpacity = 0.3,
  showDataPoints = true,
  showHoverAreas = true,
  tooltipBackgroundColor,
  tooltipTextColor,
  tooltipBorderColor,
  showTooltip = true,
  textOrientation = 'horizontal',
  textAngle = -45,
  textSpacing = 15,
  barColor = '#E5E7EB',
  lineColor = '#10B981',
  highlightedBarColor = '#10B981',
  highlightedIndex,
  hoverBarColor = '#10B981',
  hoverLineColor = '#10B981',
  enableHorizontalScroll = false,
  minBarWidth = 20,
  maxBarWidth = 100,
  fixedBarSpacing = 8,
  enableAutoSpacing = true,
  minSpacingMultiplier = 1.0,
}: ChartProps) => {
  const chartRef = useRef<any>(null);

  const chartMaxValue = maxValue || (() => {
    if (variant === 'combined') {
      return Math.max(...data.map((d) => Math.max(d.barValue || d.value, d.lineValue || d.value))) || 600;
    }
    return Math.max(...data.map((d) => d.value)) || 600;
  })();

  // Calculate chart dimensions and spacing
  const chartDimensions = useMemo(() => {
  const padding = { 
    top: 20, 
    right: 20, 
    bottom: textOrientation === 'angled' ? Math.max(60, textSpacing + 20) : textOrientation === 'vertical' ? Math.max(40, textSpacing + 20) : Math.max(30, textSpacing + 15),
    left: 60,
  };
  
    const baseChartWidth = width - padding.left - padding.right;
    
    if (variant === 'bar' || variant === 'combined') {
      // Calculate optimal spacing - reduce gap between bars
      // For large datasets, use minimal spacing to keep bars visible
      let optimalSpacing = data.length > 60 
        ? Math.max(1, fixedBarSpacing * 0.1) // Very minimal spacing for large datasets
        : Math.max(4, fixedBarSpacing * 0.3); // Normal spacing for smaller datasets
      if (enableAutoSpacing && data.length > 0) {
        const avgTextWidth = data.reduce((sum, d) => {
          const textWidth = d.date.length * 6; // Approximate character width
          return sum + textWidth;
        }, 0) / data.length;
        optimalSpacing = data.length > 60
          ? Math.max(1, Math.min(optimalSpacing, avgTextWidth * minSpacingMultiplier * 0.1))
          : Math.max(4, Math.min(optimalSpacing, avgTextWidth * minSpacingMultiplier * 0.3));
      }

      const totalBarSpacing = optimalSpacing * (data.length - 1);
      const availableWidth = baseChartWidth - totalBarSpacing;
      // For large datasets, ensure minimum visible bar width (at least 2px)
      const calculatedBarWidth = data.length > 60 
        ? Math.max(2, Math.min(maxBarWidth, availableWidth / data.length))
        : Math.max(minBarWidth, Math.min(maxBarWidth, availableWidth / data.length));
      const optimalChartWidth = (calculatedBarWidth + optimalSpacing) * data.length - optimalSpacing;
      
      return {
        chartWidth: optimalChartWidth,
        barWidth: calculatedBarWidth,
        barSpacing: optimalSpacing,
        scrollWidth: enableHorizontalScroll ? Math.max(width, optimalChartWidth + padding.left + padding.right) : width,
        padding,
      };
    }
    
    return {
      chartWidth: baseChartWidth,
      barWidth: 0,
      barSpacing: 0,
      scrollWidth: width,
      padding,
    };
  }, [width, height, data.length, variant, textOrientation, textSpacing, fixedBarSpacing, enableAutoSpacing, minSpacingMultiplier, minBarWidth, maxBarWidth, enableHorizontalScroll]);

  // Build ApexCharts options based on variant
  const chartOptions = useMemo((): ApexOptions => {
    const baseOptions: ApexOptions = {
      chart: {
        type: variant === 'pie' ? 'pie' : variant === 'bar' ? 'bar' : variant === 'combined' ? 'bar' : 'line',
        width: chartDimensions.scrollWidth,
        height: height,
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          speed: 800,
        },
        offsetX: 0,
        offsetY: 0,
        sparkline: { enabled: false },
        fontFamily: 'var(--font-family-primary)',
        events: {
          dataPointSelection: (event, chartContext, config) => {
            if (onDataPointClick && config.dataPointIndex !== undefined) {
              const dataPoint = data[config.dataPointIndex];
              if (dataPoint) {
                onDataPointClick(dataPoint);
              }
            }
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: variant === 'pie',
        position: 'right',
        fontSize: '10px',
        fontFamily: 'var(--font-family-primary)',
        labels: {
          colors: '#374151',
        },
      },
      tooltip: {
        enabled: showTooltip,
        theme: 'dark',
        style: {
          fontSize: '12px',
          fontFamily: 'var(--font-family-primary)',
        },
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          if (!showTooltip) return '';
          
          const dataPoint = data[dataPointIndex];
          if (!dataPoint) return '';

          let valueText = '';
      if (variant === 'pie') {
        valueText = `${dataPoint.label || dataPoint.date}: ${dataPoint.value}%`;
          } else if (variant === 'combined') {
            const barVal = dataPoint.barValue || dataPoint.value;
            const lineVal = dataPoint.lineValue || dataPoint.value;
            valueText = `${dataPoint.date}<br/>${barVal}K views (bar)<br/>${lineVal}K views (line)`;
      } else {
            valueText = `${dataPoint.date}<br/>$${dataPoint.value}`;
          }

          const bgColor = tooltipBackgroundColor || '#374151';
          const textColor = tooltipTextColor || '#ffffff';
          const borderColor = tooltipBorderColor || '';

          return `
            <div style="
              background-color: ${bgColor};
              color: ${textColor};
              padding: 8px 12px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              ${borderColor ? `border: 1px solid ${borderColor};` : ''}
            ">
              ${valueText}
            </div>
          `;
        },
      },
    };

    // Pie chart specific options
    if (variant === 'pie') {
      const colors = data.map((d, i) => {
        const defaultColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
        return resolveColor(d.color || defaultColors[i % defaultColors.length]);
      });

      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'pie',
        },
        colors,
        labels: data.map(d => d.label || d.date),
        plotOptions: {
          pie: {
            expandOnClick: true,
            donut: {
              size: '0%',
            },
          },
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#ffffff'],
        },
      };
    }

    // Bar, Line, Wave, and Combined chart options
    const categories = data.map(d => d.date);
    const xAxisConfig: any = {
      categories,
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'var(--font-family-primary)',
          colors: 'var(--color-text-secondary)',
        },
        rotate: textOrientation === 'angled' ? textAngle : textOrientation === 'vertical' ? -90 : 0,
        rotateAlways: textOrientation !== 'horizontal',
        offsetY: textOrientation === 'vertical' || textOrientation === 'angled' ? Math.max(5, textSpacing - 10) : 0,
        maxHeight: undefined,
        trim: false,
        hideOverlappingLabels: false,
        formatter: (value: string) => {
          return String(value || '');
        },
        showDuplicates: true,
      },
      axisBorder: {
        show: true,
        color: 'var(--color-border-light)',
      },
      axisTicks: {
        show: false,
      },
    };

    const yAxisConfig: any = {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'var(--font-family-primary)',
          colors: 'var(--color-text-secondary)',
        },
        formatter: (value: number) => {
          if (!Number.isFinite(value)) return '0';
      if (Math.abs(value) >= 1000) {
            return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
      }
      if (Math.abs(value) >= 100) {
        return value.toFixed(0);
      }
      if (Math.abs(value) >= 10) {
        return value.toFixed(1).replace(/\.0$/, '');
      }
      if (Math.abs(value) >= 1) {
        return value.toFixed(2).replace(/\.00?$/, '');
      }
          return value.toPrecision(2);
        },
      },
      axisBorder: {
        show: true,
        color: 'var(--color-border-light)',
      },
      axisTicks: {
        show: false,
      },
      // Ensure grid lines at regular intervals with better distribution
      tickAmount: (() => {
        if (!chartMaxValue) return undefined;
        if (chartMaxValue <= 20) {
          // For small values (0-20), show 5 ticks: 0, 5, 10, 15, 20
          return 5;
        } else if (chartMaxValue <= 50) {
          // For medium values (0-50), show 6 ticks
          return 6;
        } else if (chartMaxValue <= 100) {
          // For values up to 100, show 5 ticks
          return 5;
        } else if (chartMaxValue <= 1000) {
          // For larger values, use intervals of 100
          return Math.ceil(chartMaxValue / 100);
        }
        // For very large values, let ApexCharts decide
        return undefined;
      })(),
    };

    const gridConfig: any = {
      show: true,
      borderColor: '#F3F4F6', // Very faint light gray for subtle grid lines
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
          style: {
            colors: '#F3F4F6', // Very faint grid lines
            opacity: 0.5,
          },
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 50, // more space for labels
        left: 0,
      },
    };

    // Bar chart
    if (variant === 'bar') {
      const barColors = data.map((d, i) => {
        if (i === highlightedIndex) {
          return resolveColor(highlightedBarColor);
        }
        return resolveColor(d.color || barColor);
      });

      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'bar',
        },
        colors: barColors,
        xaxis: {
          ...xAxisConfig,
          labels: {
            ...xAxisConfig.labels,
            offsetY: 8, // text gap fix
            formatter: (value: string) => {
              // Return full value - no truncation
              return String(value || '');
            },
          },
        },
        yaxis: {
          ...yAxisConfig,
          min: 0,
          max: chartMaxValue,
        },
        grid: {
          ...gridConfig,
          padding: {
            top: 0,
            right: 0,
            bottom: 50, // more space for labels
            left: 0,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: data.length > 60 ? "60%" : data.length > 30 ? "40%" : "28%", // Dynamic width based on data length
            borderRadius: 3,
            dataLabels: {
              position: 'top',
            },
            colors: {
              ranges: [],
              backgroundBarColors: [],
              backgroundBarOpacity: 0,
            },
          },
        },
        states: {
          hover: {
            filter: {
              type: 'darken',
            },
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'darken',
            },
          },
        },
      };
    }

    // Line chart
    if (variant === 'line') {
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'line',
        },
        colors: [resolveColor(lineColor)],
        stroke: {
          curve: 'smooth',
          width: strokeWidth,
          lineCap: 'round',
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.3,
            gradientToColors: [resolveColor(lineColor)],
            inverseColors: false,
            opacityFrom: showArea ? 0.3 : 0,
            opacityTo: showArea ? 0 : 0,
            stops: [0, 100],
          },
        },
        markers: {
          size: showDataPoints ? 4 : 0,
          strokeWidth: 2,
          strokeColors: [resolveColor(lineColor)],
          colors: ['#ffffff'],
          hover: {
            size: 6,
          },
        },
        xaxis: {
          ...xAxisConfig,
          labels: {
            ...xAxisConfig.labels,
            offsetY: 8, // text gap fix
            formatter: (value: string) => {
              // Return full value - no truncation
              return String(value || '');
            },
          },
        },
        yaxis: {
          ...yAxisConfig,
          max: chartMaxValue,
        },
        grid: {
          ...gridConfig,
          padding: {
            top: 0,
            right: 0,
            bottom: 50, // more space for labels
            left: 0,
          },
        },
      };
    }

    // Wave chart (same as line but with wave-specific styling)
    if (variant === 'wave') {
      const waveColorResolved = resolveColor(waveColor);
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'line',
        },
        colors: [waveColorResolved],
        stroke: {
          curve: 'smooth',
          width: strokeWidth,
          lineCap: 'round',
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: areaOpacity,
            gradientToColors: [waveColorResolved],
            inverseColors: false,
            opacityFrom: showArea ? areaOpacity : 0,
            opacityTo: showArea ? 0 : 0,
            stops: [0, 100],
          },
        },
        markers: {
          size: showDataPoints ? 4 : 0,
          strokeWidth: 2,
          strokeColors: [waveColorResolved],
          fillOpacity: 1,
          colors: ['#ffffff'],
          hover: {
            size: 6,
          },
        },
        xaxis: {
          ...xAxisConfig,
          labels: {
            ...xAxisConfig.labels,
            offsetY: 8, // text gap fix
            formatter: (value: string) => {
              // Return full value - no truncation
              return String(value || '');
            },
          },
        },
        yaxis: {
          ...yAxisConfig,
          max: chartMaxValue,
        },
        grid: {
          ...gridConfig,
          padding: {
            top: 0,
            right: 0,
            bottom: 50, // more space for labels
            left: 0,
          },
        },
      };
    }

    // Combined chart (bar + line)
    if (variant === 'combined') {
      const barColors = data.map((d, i) => {
        if (i === highlightedIndex) {
          return resolveColor(highlightedBarColor);
        }
        return resolveColor(d.color || barColor);
      });

      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'bar',
        },
        colors: barColors,
        xaxis: {
          ...xAxisConfig,
          labels: {
            ...xAxisConfig.labels,
            offsetY: 8, // text gap fix
            formatter: (value: string) => {
              // Return full value - no truncation
              return String(value || '');
            },
          },
        },
        yaxis: {
          ...yAxisConfig,
          max: chartMaxValue,
        },
        grid: {
          ...gridConfig,
          padding: {
            top: 0,
            right: 0,
            bottom: 50, // more space for labels
            left: 0,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "28%", // gap کم (perfect slim look)
            barHeight: "80%", // width/thickness کم
            borderRadius: 3,
          },
        },
        stroke: {
          width: [0, strokeWidth],
          curve: 'smooth',
        },
        fill: {
          type: 'solid',
          opacity: [1, 0],
        },
        markers: {
          size: showDataPoints ? 4 : 0,
          strokeWidth: 2,
          strokeColors: [resolveColor(lineColor)],
          fillOpacity: 1,
          colors: ['#ffffff'],
          hover: {
            size: 6,
          },
        },
        states: {
          hover: {
            filter: {
              type: 'darken',
            },
          },
        },
      };
    }

    return baseOptions;
  }, [
    variant,
    data,
    width,
    height,
    chartMaxValue,
    showArea,
    strokeWidth,
    waveColor,
    areaOpacity,
    showDataPoints,
    showTooltip,
    tooltipBackgroundColor,
    tooltipTextColor,
    tooltipBorderColor,
    textOrientation,
    textAngle,
    textSpacing,
    barColor,
    lineColor,
    highlightedBarColor,
    highlightedIndex,
    chartDimensions,
    onDataPointClick,
  ]);

  // Extract series data based on variant
  const chartSeries = useMemo(() => {
    if (variant === 'pie') {
      return data.map(d => d.value);
    } else if (variant === 'combined') {
      return [
        {
          name: 'Bar',
          type: 'column',
          data: data.map(d => d.barValue || d.value),
        },
        {
          name: 'Line',
          type: 'line',
          data: data.map(d => d.lineValue || d.value),
        },
      ];
    } else {
      return [{
        name: 'Value',
        data: data.map(d => d.value),
      }];
    }
  }, [variant, data]);

  const [isMounted, setIsMounted] = useState(false);
  const [ApexChartComponent, setApexChartComponent] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
      // Dynamically import only on client side
      import("react-apexcharts").then((module) => {
        setApexChartComponent(() => module.default);
      }).catch((err) => {
        console.error("Failed to load ApexCharts:", err);
      });
    }
  }, []);

  if (!isMounted || !ApexChartComponent) {
      return (
      <ChartContainer 
        className={`chart-container ${className || ""}`}
        enableScroll={enableHorizontalScroll}
        scrollWidth={chartDimensions.scrollWidth}
      >
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: height,
          color: 'var(--color-grey-light)',
          fontSize: '14px'
        }}>
          Loading chart...
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer 
      className={`chart-container ${className || ""}`}
      enableScroll={enableHorizontalScroll}
      scrollWidth={chartDimensions.scrollWidth}
    >
        <ApexChartComponent
          options={chartOptions}
          series={chartSeries as any}
          type={variant === 'pie' ? 'pie' : variant === 'bar' ? 'bar' : variant === 'combined' ? 'bar' : 'line'}
          width={chartDimensions.scrollWidth}
          height={height}
        />
    </ChartContainer>
  );
};

// Separate BarChart component
export const BarChart = ({
  data,
  width = 1117,
  height = 378,
  maxValue,
  className,
  onDataPointClick,
  showArea = true,
  strokeWidth = 3,
  waveColor = 'var(--color-success-main)',
  areaOpacity = 0.3,
  showDataPoints = true,
  showHoverAreas = true,
  tooltipBackgroundColor,
  tooltipTextColor,
  tooltipBorderColor,
  showTooltip = true,
  textOrientation = 'horizontal',
  textAngle = -45,
  textSpacing = 15,
  barColor = '#E5E7EB',
  lineColor = '#10B981',
  highlightedBarColor = '#10B981',
  highlightedIndex,
  hoverBarColor = '#10B981',
  hoverLineColor = '#10B981',
  enableHorizontalScroll = false,
  minBarWidth = 20,
  maxBarWidth = 100,
  fixedBarSpacing = 8,
  enableAutoSpacing = true,
  minSpacingMultiplier = 1.0,
}: ChartProps) => {
  return (
    <Chart
      data={data}
      variant="bar"
      width={width}
      height={height}
      maxValue={maxValue}
      className={className}
      onDataPointClick={onDataPointClick}
      showArea={showArea}
      strokeWidth={strokeWidth}
      waveColor={waveColor}
      areaOpacity={areaOpacity}
      showDataPoints={showDataPoints}
      showHoverAreas={showHoverAreas}
      tooltipBackgroundColor={tooltipBackgroundColor}
      tooltipTextColor={tooltipTextColor}
      tooltipBorderColor={tooltipBorderColor}
      showTooltip={showTooltip}
      textOrientation={textOrientation}
      textAngle={textAngle}
      textSpacing={textSpacing}
      barColor={barColor}
      lineColor={lineColor}
      highlightedBarColor={highlightedBarColor}
      highlightedIndex={highlightedIndex}
      hoverBarColor={hoverBarColor}
      hoverLineColor={hoverLineColor}
      enableHorizontalScroll={enableHorizontalScroll}
      minBarWidth={minBarWidth}
      maxBarWidth={maxBarWidth}
      fixedBarSpacing={fixedBarSpacing}
      enableAutoSpacing={enableAutoSpacing}
      minSpacingMultiplier={minSpacingMultiplier}
    />
  );
};

// Separate LineChart component
export const LineChart = ({
  data,
  width = 1117,
  height = 378,
  maxValue,
  className,
  onDataPointClick,
  showArea = true,
  strokeWidth = 3,
  waveColor = 'var(--color-success-main)',
  areaOpacity = 0.3,
  showDataPoints = true,
  showHoverAreas = true,
  tooltipBackgroundColor,
  tooltipTextColor,
  tooltipBorderColor,
  showTooltip = true,
  textOrientation = 'horizontal',
  textAngle = -45,
  textSpacing = 15,
  barColor = '#E5E7EB',
  lineColor = '#10B981',
  highlightedBarColor = '#10B981',
  highlightedIndex,
  hoverBarColor = '#10B981',
  hoverLineColor = '#10B981',
  enableHorizontalScroll = false,
  minBarWidth = 20,
  maxBarWidth = 100,
  fixedBarSpacing = 8,
  enableAutoSpacing = true,
  minSpacingMultiplier = 1.0,
}: ChartProps) => {
  return (
    <Chart
      data={data}
      variant="line"
      width={width}
      height={height}
      maxValue={maxValue}
      className={className}
      onDataPointClick={onDataPointClick}
      showArea={showArea}
      strokeWidth={strokeWidth}
      waveColor={waveColor}
      areaOpacity={areaOpacity}
      showDataPoints={showDataPoints}
      showHoverAreas={showHoverAreas}
      tooltipBackgroundColor={tooltipBackgroundColor}
      tooltipTextColor={tooltipTextColor}
      tooltipBorderColor={tooltipBorderColor}
      showTooltip={showTooltip}
      textOrientation={textOrientation}
      textAngle={textAngle}
      textSpacing={textSpacing}
      barColor={barColor}
      lineColor={lineColor}
      highlightedBarColor={highlightedBarColor}
      highlightedIndex={highlightedIndex}
      hoverBarColor={hoverBarColor}
      hoverLineColor={hoverLineColor}
      enableHorizontalScroll={enableHorizontalScroll}
      minBarWidth={minBarWidth}
      maxBarWidth={maxBarWidth}
      fixedBarSpacing={fixedBarSpacing}
      enableAutoSpacing={enableAutoSpacing}
      minSpacingMultiplier={minSpacingMultiplier}
    />
  );
};

// Separate PieChart component
export const PieChart = ({
  data,
  width = 1117,
  height = 378,
  maxValue,
  className,
  onDataPointClick,
  showArea = true,
  strokeWidth = 3,
  waveColor = 'var(--color-success-main)',
  areaOpacity = 0.3,
  showDataPoints = true,
  showHoverAreas = true,
  tooltipBackgroundColor,
  tooltipTextColor,
  tooltipBorderColor,
  showTooltip = true,
  textOrientation = 'horizontal',
  textAngle = -45,
  textSpacing = 15,
  barColor = '#E5E7EB',
  lineColor = '#10B981',
  highlightedBarColor = '#10B981',
  highlightedIndex,
  hoverBarColor = '#10B981',
  hoverLineColor = '#10B981',
  enableHorizontalScroll = false,
  minBarWidth = 20,
  maxBarWidth = 100,
  fixedBarSpacing = 8,
  enableAutoSpacing = true,
  minSpacingMultiplier = 1.0,
}: ChartProps) => {
  return (
    <Chart
      data={data}
      variant="pie"
      width={width}
      height={height}
      maxValue={maxValue}
      className={className}
      onDataPointClick={onDataPointClick}
      showArea={showArea}
      strokeWidth={strokeWidth}
      waveColor={waveColor}
      areaOpacity={areaOpacity}
      showDataPoints={showDataPoints}
      showHoverAreas={showHoverAreas}
      tooltipBackgroundColor={tooltipBackgroundColor}
      tooltipTextColor={tooltipTextColor}
      tooltipBorderColor={tooltipBorderColor}
      showTooltip={showTooltip}
      textOrientation={textOrientation}
      textAngle={textAngle}
      textSpacing={textSpacing}
      barColor={barColor}
      lineColor={lineColor}
      highlightedBarColor={highlightedBarColor}
      highlightedIndex={highlightedIndex}
      hoverBarColor={hoverBarColor}
      hoverLineColor={hoverLineColor}
      enableHorizontalScroll={enableHorizontalScroll}
      minBarWidth={minBarWidth}
      maxBarWidth={maxBarWidth}
      fixedBarSpacing={fixedBarSpacing}
      enableAutoSpacing={enableAutoSpacing}
      minSpacingMultiplier={minSpacingMultiplier}
    />
  );
};

// Separate WaveChart component
export const WaveChart = ({
  data,
  width = 1117,
  height = 378,
  maxValue,
  className,
  onDataPointClick,
  showArea = true,
  strokeWidth = 3,
  waveColor = 'var(--color-success-main)',
  areaOpacity = 0.3,
  showDataPoints = true,
  showHoverAreas = true,
  tooltipBackgroundColor,
  tooltipTextColor,
  tooltipBorderColor,
  showTooltip = true,
  textOrientation = 'horizontal',
  textAngle = -45,
  textSpacing = 15,
  barColor = '#E5E7EB',
  lineColor = '#10B981',
  highlightedBarColor = '#10B981',
  highlightedIndex,
  hoverBarColor = '#10B981',
  hoverLineColor = '#10B981',
  enableHorizontalScroll = false,
  minBarWidth = 20,
  maxBarWidth = 100,
  fixedBarSpacing = 8,
  enableAutoSpacing = true,
  minSpacingMultiplier = 1.0,
}: ChartProps) => {
  return (
    <Chart
      data={data}
      variant="wave"
      width={width}
      height={height}
      maxValue={maxValue}
      className={className}
      onDataPointClick={onDataPointClick}
      showArea={showArea}
      strokeWidth={strokeWidth}
      waveColor={waveColor}
      areaOpacity={areaOpacity}
      showDataPoints={showDataPoints}
      showHoverAreas={showHoverAreas}
      tooltipBackgroundColor={tooltipBackgroundColor}
      tooltipTextColor={tooltipTextColor}
      tooltipBorderColor={tooltipBorderColor}
      showTooltip={showTooltip}
      textOrientation={textOrientation}
      textAngle={textAngle}
      textSpacing={textSpacing}
      barColor={barColor}
      lineColor={lineColor}
      highlightedBarColor={highlightedBarColor}
      highlightedIndex={highlightedIndex}
      hoverBarColor={hoverBarColor}
      hoverLineColor={hoverLineColor}
      enableHorizontalScroll={enableHorizontalScroll}
      minBarWidth={minBarWidth}
      maxBarWidth={maxBarWidth}
      fixedBarSpacing={fixedBarSpacing}
      enableAutoSpacing={enableAutoSpacing}
      minSpacingMultiplier={minSpacingMultiplier}
    />
  );
};

// Separate CombinedChart component
export const CombinedChart = ({
  data,
  width = 1117,
  height = 378,
  maxValue,
  className,
  onDataPointClick,
  showArea = true,
  strokeWidth = 3,
  waveColor = 'var(--color-success-main)',
  areaOpacity = 0.3,
  showDataPoints = true,
  showHoverAreas = true,
  tooltipBackgroundColor,
  tooltipTextColor,
  tooltipBorderColor,
  showTooltip = true,
  textOrientation = 'horizontal',
  textAngle = -45,
  textSpacing = 15,
  barColor = '#E5E7EB',
  lineColor = '#10B981',
  highlightedBarColor = '#10B981',
  highlightedIndex,
  hoverBarColor = '#10B981',
  hoverLineColor = '#10B981',
  enableHorizontalScroll = false,
  minBarWidth = 20,
  maxBarWidth = 100,
  fixedBarSpacing = 8,
  enableAutoSpacing = true,
  minSpacingMultiplier = 1.0,
}: ChartProps) => {
  return (
    <Chart
      data={data}
      variant="combined"
      width={width}
      height={height}
      maxValue={maxValue}
      className={className}
      onDataPointClick={onDataPointClick}
      showArea={showArea}
      strokeWidth={strokeWidth}
      waveColor={waveColor}
      areaOpacity={areaOpacity}
      showDataPoints={showDataPoints}
      showHoverAreas={showHoverAreas}
      tooltipBackgroundColor={tooltipBackgroundColor}
      tooltipTextColor={tooltipTextColor}
      tooltipBorderColor={tooltipBorderColor}
      showTooltip={showTooltip}
      textOrientation={textOrientation}
      textAngle={textAngle}
      textSpacing={textSpacing}
      barColor={barColor}
      lineColor={lineColor}
      highlightedBarColor={highlightedBarColor}
      highlightedIndex={highlightedIndex}
      hoverBarColor={hoverBarColor}
      hoverLineColor={hoverLineColor}
      enableHorizontalScroll={enableHorizontalScroll}
      minBarWidth={minBarWidth}
      maxBarWidth={maxBarWidth}
      fixedBarSpacing={fixedBarSpacing}
      enableAutoSpacing={enableAutoSpacing}
      minSpacingMultiplier={minSpacingMultiplier}
    />
  );
};
