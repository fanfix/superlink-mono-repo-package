import { FC } from "react";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export interface LoaderProps extends Omit<CircularProgressProps, 'color'> {
  /**
   * Size of the loader
   * @default 40
   */
  size?: number;
  /**
   * Color of the loader
   * @default 'black'
   */
  color?: 'black' | 'white' | 'primary' | 'secondary' | 'inherit';
  /**
   * Whether to show the loader
   * @default true
   */
  visible?: boolean;
  /**
   * Custom thickness of the loader circle
   * @default 4
   */
  thickness?: number;
  /**
   * Container styles
   */
  containerSx?: SxProps<Theme>;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
}

export const Loader: FC<LoaderProps> = ({
  size = 40,
  color = 'black',
  visible = true,
  thickness = 4,
  containerSx,
  sx,
  ...props
}) => {
  if (!visible) {
    return null;
  }

  const getColorValue = () => {
    switch (color) {
      case 'black':
        return '#000000';
      case 'white':
        return '#FFFFFF';
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'inherit':
        return 'inherit';
      default:
        return '#000000';
    }
  };

  const colorValue = getColorValue();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...containerSx,
      }}
    >
      <CircularProgress
        size={size}
        thickness={thickness}
        sx={{
          color: typeof colorValue === 'string' && !['primary', 'secondary', 'inherit'].includes(colorValue)
            ? colorValue
            : undefined,
          ...sx,
        }}
        color={typeof colorValue === 'string' && ['primary', 'secondary', 'inherit'].includes(colorValue)
          ? (colorValue as 'primary' | 'secondary' | 'inherit')
          : undefined}
        {...props}
      />
    </Box>
  );
};

