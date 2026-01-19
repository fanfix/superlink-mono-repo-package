import * as React from 'react';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ErrorIcon } from '../assets/icons';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  /**
   * The variant of the text field
   * @default 'standard'
   */
  variant?: 'standard' | 'filled' | 'outlined';
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * Whether the field has an error state
   */
  error?: boolean;
  /**
   * The placeholder text for the input
   */
  placeholder?: string;
  /**
   * The label for the input
   */
  label?: string;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * The type of input (text, email, password, etc.)
   */
  type?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  width: 'var(--width-full)',
  backgroundColor: 'var(--color-background-primary)',

  /** ─────────────── STANDARD VARIANT ─────────────── **/
  '&.MuiTextField-root .MuiInput-root': {
    height: 'var(--height-sm)',
    backgroundColor: 'var(--color-background-primary)',
    borderRadius: 10,
    '&:before': {
      borderBottom: `1px solid var(--color-white-secondary)`,
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: `1px solid var(--color-white-secondary)`,
    },
    '&:after': {
      borderBottom: `1px solid var(--color-white-secondary)`,
    },
    '&.Mui-focused:after': {
      borderBottom: `1px solid var(--color-white-secondary)`,
    },
    '&.Mui-error:after': {
      borderBottom: `1px solid var(--color-error-main)`,
    },
  },
  '&.MuiTextField-root .MuiInput-input': {
    paddingBottom: '12px',
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-grey-main)',
    height: 'var(--height-sm)',
    '&::placeholder': {
      color: 'var(--color-grey-main)',
      opacity: 1,
    },
  },
  '&.MuiTextField-root .MuiFormHelperText-root': {
    marginTop: '4px',
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-grey-main)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&.Mui-error': {
      color: 'var(--color-error-main)',
    },
  },
  '&.MuiTextField-root .MuiInputLabel-root': {
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-grey-main)',
    paddingBottom: '12px',
    '&.Mui-focused': {
      color: 'var(--color-grey-main)',
    },
    '&.Mui-error': {
      color: 'var(--color-error-main)',
    },
  },

  /** ─────────────── OUTLINED VARIANT ─────────────── **/
  '&.MuiTextField-root .MuiOutlinedInput-root': {
    width: { xs: '100%', sm: 'var(--textfield-outlined-width)' },
    minHeight: 'var(--textfield-outlined-height)',
    backgroundColor: 'var(--textfield-background)',
    borderRadius: 'var(--textfield-outlined-border-radius)',

    '& fieldset': {
      borderColor: 'var(--textfield-outlined-border-color)',
      borderWidth: 'var(--textfield-border-width)',
    },
    '&:hover fieldset': {
      borderColor: 'var(--textfield-outlined-border-color)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--textfield-outlined-border-color)',
    },
    '&.Mui-error fieldset': {
      borderColor: 'var(--textfield-border-color-error)',
    },
    '&.Mui-disabled fieldset': {
      borderColor: 'var(--textfield-border-color-disabled)',
    },
  },
  '&.MuiTextField-root .MuiOutlinedInput-input': {
    padding: 'var(--textfield-outlined-padding)',
    fontSize: 'var(--textfield-outlined-font-size)',
    fontWeight: 'var(--textfield-outlined-font-weight)',
    color: 'var(--textfield-outlined-color)',
    '&::placeholder': {
      color: 'var(--textfield-outlined-color)',
      opacity: 1,
    },
  },
}));

export const TextField: React.FC<TextFieldProps> = ({
  variant = 'standard',
  helperText,
  error = false,
  placeholder,
  label,
  disabled = false,
  type = 'text',
  sx,
  ...props
}) => {
  const formattedHelperText = error && helperText ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <ErrorIcon size={18} color="var(--color-error-primary)" />
      <span>{helperText}</span>
    </Box>
  ) : helperText;

  return (
    <StyledTextField
      variant={variant}
      fullWidth
      placeholder={placeholder}
      label={label}
      helperText={formattedHelperText}
      error={error}
      disabled={disabled}
      type={type}
      sx={sx}
      InputLabelProps={{ shrink: true }}
      FormHelperTextProps={{
        component: 'div',
        sx: {
          display: 'flex',
          alignItems: 'center',
          margin: 0,
          marginTop: '4px',
        }
      }}
      {...props}
    />
  );
};
