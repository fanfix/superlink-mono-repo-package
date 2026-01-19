import React, { FC, useEffect, useState } from "react";
import { SxProps, Theme } from "@mui/material/styles";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps {
  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
  /**
   * Checkbox size preset
   * @default 'md'
   */
  size?: CheckboxSize;
  /**
   * Custom width (overrides size preset)
   */
  width?: string | number;
  /**
   * Custom height (overrides size preset)
   */
  height?: string | number;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Change handler
   */
  onChange?: (checked: boolean) => void;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Checkbox label
   */
  label?: string;
  /**
   * Whether the checkbox is indeterminate
   */
  indeterminate?: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({
  checked = false,
  disabled = false,
  size = "md",
  width,
  height,
  onClick,
  onChange,
  sx,
  className,
  label,
  indeterminate = false,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  // Get size dimensions
  const getSizeDimensions = (size: CheckboxSize) => {
    const sizeMap = {
      sm: "20px",
      md: "24px",
      lg: "28px",
    };
    return sizeMap[size];
  };

  // Tick icon component
  const TickIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M12.5686 2.98146C12.7326 3.14554 12.8247 3.36806 12.8247 3.60008C12.8247 3.8321 12.7326 4.05462 12.5686 4.21871L6.01014 10.7771C5.92347 10.8638 5.82057 10.9326 5.70732 10.9795C5.59407 11.0264 5.47268 11.0506 5.3501 11.0506C5.22751 11.0506 5.10613 11.0264 4.99288 10.9795C4.87963 10.9326 4.77673 10.8638 4.69006 10.7771L1.43156 7.51921C1.34798 7.43849 1.28133 7.34194 1.23547 7.23518C1.18961 7.12843 1.16547 7.01361 1.16446 6.89743C1.16345 6.78125 1.18559 6.66603 1.22959 6.5585C1.27358 6.45096 1.33855 6.35327 1.42071 6.27111C1.50287 6.18895 1.60056 6.12398 1.7081 6.07999C1.81563 6.03599 1.93085 6.01385 2.04703 6.01486C2.16321 6.01587 2.27803 6.04001 2.38478 6.08587C2.49154 6.13172 2.58809 6.19838 2.66881 6.28196L5.34981 8.96296L11.3307 2.98146C11.412 2.90014 11.5085 2.83564 11.6147 2.79163C11.7209 2.74763 11.8347 2.72498 11.9496 2.72498C12.0646 2.72498 12.1784 2.74763 12.2846 2.79163C12.3908 2.83564 12.4873 2.90014 12.5686 2.98146Z" 
        fill="#14171F"
      />
    </svg>
  );

  // Handle click
  const handleClick = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
    onClick?.();
  };

  // Base styles for the checkbox
  const checkboxSize = width || height || getSizeDimensions(size);
  const checkboxStyles: React.CSSProperties = {
    width: checkboxSize,
    height: checkboxSize,
    borderRadius: "8.5px",
    border: `1px solid var(--color-grey-light)`,
    backgroundColor: "var(--color-white)",
    opacity: disabled ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "var(--transition-normal)",
    position: "relative",
  };

  // Container styles for label support
  const containerStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
  };

  // Label styles
  const labelStyles: React.CSSProperties = {
    fontSize: "var(--font-size-sm)",
    color: disabled ? "var(--color-grey-light)" : "var(--color-black-secondary)",
    userSelect: "none",
  };

  const checkboxElement = (
    <div
      style={{
        ...checkboxStyles,
        ...(sx as React.CSSProperties),
      }}
      className={className}
      onClick={handleClick}
    >
      {(isChecked || indeterminate) && (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          width: "100%",
          height: "100%"
        }}>
          <TickIcon />
        </div>
      )}
    </div>
  );

  // If no label, return just the checkbox
  if (!label) {
    return checkboxElement;
  }

  // Return checkbox with label
  return (
    <div style={containerStyles} onClick={handleClick}>
      {checkboxElement}
      <span style={labelStyles}>{label}</span>
    </div>
  );
};
