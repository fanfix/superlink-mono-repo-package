import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';

export interface DotGraphPoint {
  label: string;
  value: number;
  color?: string;
}

export interface DotGraphProps {
  data: DotGraphPoint[];
  /**
   * Minimum value for the Y axis
   */
  minValue?: number;
  /**
   * Maximum value for the Y axis
   */
  maxValue?: number;
  /**
   * Visual height of the graph area (not including axis labels)
   * @default 220
   */
  height?: number;
  /**
   * Number of segments/ticks for the Y axis
   * @default 5 (renders 6 labels including min/max)
   */
  yTickCount?: number;
  /**
   * Diameter of each plotted dot
   * @default 14
   */
  dotSize?: number;
  /**
   * Format function for Y axis labels
   */
  yLabelFormatter?: (value: number) => string;
  /**
   * Format function for X axis labels
   */
  xLabelFormatter?: (label: string) => string;
  /**
   * Toggle X axis label visibility
   * @default true
   */
  showXAxis?: boolean;
  /**
   * Toggle Y axis label visibility
   * @default true
   */
  showYAxis?: boolean;
  /**
   * Custom className for the root element
   */
  className?: string;
  /**
   * Grid line color
   */
  gridColor?: string;
  /**
   * Axis color (also renders the zero line)
   */
  axisColor?: string;
  /**
   * Background color for the plotting surface
   */
  backgroundColor?: string;
  /**
   * Width of the graph container
   * @default '100%'
   */
  width?: number | string;
  /**
   * Border radius for the plotting surface
   * @default 28px
   */
  borderRadius?: number | string;
  /**
   * Border color for the plotting surface
   * @default #ededed
   */
  borderColor?: string;
  /**
   * Border width for the plotting surface
   * @default 1
   */
  borderWidth?: number;
  /**
   * Custom styles for the root container
   */
  sx?: SxProps<Theme>;
  /**
   * Custom styles for the plotting surface
   */
  graphAreaSx?: SxProps<Theme>;
  /**
   * Displays the zero line when 0 falls within the value range
   * @default true
   */
  showZeroLine?: boolean;
  /**
   * Message to show when no data points exist
   */
  emptyMessage?: string;
}

const GraphLayout = styled('div')<{
  showYAxis: boolean;
  showXAxis: boolean;
  height: number;
}>(({ showYAxis, showXAxis, height }) => ({
  display: 'grid',
  gridTemplateColumns: showYAxis ? '64px 1fr' : '1fr',
  gridTemplateRows: `${height}px ${showXAxis ? '36px' : '0px'}`,
  columnGap: '16px',
  rowGap: showXAxis ? '16px' : '0px',
  width: '100%',
}));

const GraphArea = styled(Box)<{
  backgroundColor: string;
  borderRadius: number | string;
  borderColor: string;
  borderWidth: number;
}>(({ backgroundColor, borderRadius, borderColor, borderWidth }) => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius,
    backgroundColor,
    border: `${borderWidth}px solid ${borderColor}`,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
    overflow: 'hidden',
  }),
);

const YAxisLabels = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  fontSize: '12px',
  fontWeight: 600,
  color: '#7d7d7d',
  textTransform: 'uppercase',
}));

const XAxisLabels = styled('div')<{ centered?: boolean }>(({ centered }) => ({
  display: 'flex',
  justifyContent: centered ? 'center' : 'space-between',
  alignItems: 'center',
  fontSize: '12px',
  fontWeight: 600,
  color: '#8f8f8f',
  textTransform: 'uppercase',
}));

const GridLine = styled('span')<{ color: string }>(() => ({
  position: 'absolute',
  left: 0,
  right: 0,
}));

const Dot = styled('span')<{ size: number; color: string }>(
  ({ size, color }) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    border: '3px solid #ffffff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  }),
);

const EmptyState = styled('div')(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '14px',
  fontWeight: 600,
  color: '#a0a0a0',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}));

const formatDefaultLabel = (value: number) => {
  if (Math.abs(value) >= 1) {
    return value.toFixed(1).replace(/\.0$/, '');
  }
  if (Math.abs(value) >= 0.1) {
    return value.toFixed(2).replace(/0$/, '');
  }
  return value.toPrecision(2);
};

export const DotGraph = ({
  data,
  minValue,
  maxValue,
  height = 220,
  yTickCount = 5,
  dotSize = 14,
  yLabelFormatter = formatDefaultLabel,
  xLabelFormatter = (label) => label,
  showXAxis = true,
  showYAxis = true,
  className,
  gridColor = 'rgba(0,0,0,0.06)',
  axisColor = 'rgba(0,0,0,0.18)',
  backgroundColor = '#ffffff',
  width = '100%',
  borderRadius = 28,
  borderColor = '#ededed',
  borderWidth = 1,
  sx,
  graphAreaSx,
  showZeroLine = true,
  emptyMessage = 'No data to display',
}: DotGraphProps) => {
  const hasData = data && data.length > 0;
  const values = hasData ? data.map((point) => point.value) : [0];

  let computedMin = minValue ?? Math.min(...values);
  let computedMax = maxValue ?? Math.max(...values);

  if (computedMax === computedMin) {
    const pad = computedMax === 0 ? 1 : Math.abs(computedMax) * 0.5;
    computedMax += pad;
    computedMin -= pad;
  }

  const range = computedMax - computedMin || 1;
  const yLabels = Array.from({ length: yTickCount + 1 }, (_, index) => {
    const value = computedMax - (range * index) / yTickCount;
    return {
      value,
      label: yLabelFormatter(value),
    };
  });

  const zeroPosition =
    showZeroLine && computedMin <= 0 && computedMax >= 0
      ? 100 - ((0 - computedMin) / range) * 100
      : null;

  const baseContainerSx: SxProps<Theme> = {
    fontFamily: 'var(--font-family-primary, "Inter", "Helvetica Neue", Arial, sans-serif)',
    width,
  };

  const resolvedContainerSx: SxProps<Theme> = sx
    ? Array.isArray(sx)
      ? [baseContainerSx, ...sx]
      : [baseContainerSx, sx]
    : baseContainerSx;

  return (
    <Box
      className={className}
      sx={resolvedContainerSx}
    >
      <GraphLayout showYAxis={showYAxis} showXAxis={showXAxis} height={height}>
        {showYAxis ? (
          <YAxisLabels>
            {yLabels.map((label) => (
              <span key={`y-label-${label.value}`}>{label.label}</span>
            ))}
          </YAxisLabels>
        ) : null}

        <GraphArea
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          borderColor={borderColor}
          borderWidth={borderWidth}
          sx={graphAreaSx}
        >
          {yLabels.map((_, index) => (
            <GridLine
              key={`grid-${index}`}
              color={gridColor}
              style={{
                top: `${(index / yTickCount) * 100}%`,
                borderTop: `1px solid ${gridColor}`,
              }}
            />
          ))}

          {zeroPosition !== null && (
            <GridLine
              color={axisColor}
              style={{
                top: `${zeroPosition}%`,
                borderTop: `1px solid ${axisColor}`,
              }}
            />
          )}

          {hasData ? (
            data.map((point, index) => {
              const ratio = (point.value - computedMin) / range;
              // Use inner vertical range (5%–95%) so dots are never clipped by overflow
              const innerTop = 5;
              const innerBottom = 95;
              const yPercent = innerBottom - (innerBottom - innerTop) * ratio;
              const clampedY = Math.max(innerTop, Math.min(innerBottom, yPercent));
              const leftPercent =
                data.length === 1 ? 50 : (index / (data.length - 1 || 1)) * 100;

              return (
                <Dot
                  key={`dot-${point.label}-${index}`}
                  size={dotSize}
                  color={point.color || '#4560FF'}
                  style={{
                    top: `calc(${clampedY}% - ${dotSize / 2}px)`,
                    left: `calc(${leftPercent}% - ${dotSize / 2}px)`,
                  }}
                />
              );
            })
          ) : (
            <EmptyState>{emptyMessage}</EmptyState>
          )}
        </GraphArea>

        {showYAxis ? <div /> : null}

        {showXAxis ? (
          <XAxisLabels centered={data.length <= 1}>
            {data.length > 0
              ? data.map((point) => (
                  <span key={`x-label-${point.label}`}>{xLabelFormatter(point.label)}</span>
                ))
              : null}
          </XAxisLabels>
        ) : null}
      </GraphLayout>
    </Box>
  );
};

