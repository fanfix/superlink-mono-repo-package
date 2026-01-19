import React, { FC } from "react";
import { styled } from "@mui/material/styles";

type ToggleSize = "sm" | "md";

const sizeMap: Record<ToggleSize, { width: number; height: number; knob: number }> = {
  sm: { width: 36, height: 20, knob: 16 },
  md: { width: 44, height: 24, knob: 20 },
};

interface ToggleTrackProps {
  checked: boolean;
  disabled?: boolean;
  size: ToggleSize;
  activeColor: string;
  inactiveColor: string;
}

const ToggleTrack = styled("button")<ToggleTrackProps>(({ checked, disabled, size, activeColor, inactiveColor }) => {
  const { width, height, knob } = sizeMap[size];
  return {
    width,
    height,
    borderRadius: height / 2,
    padding: 2,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: checked ? "flex-end" : "flex-start",
    backgroundColor: checked ? activeColor : inactiveColor,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "background-color 0.2s ease, opacity 0.2s ease",
  };
});

interface ToggleKnobProps {
  size: ToggleSize;
  checked: boolean;
}

const ToggleKnob = styled("span")<ToggleKnobProps>(({ size, checked }) => {
  const { knob } = sizeMap[size];
  return {
    width: knob,
    height: knob,
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.25)",
    transform: `translateX(${checked ? 0 : 0}px)`,
    transition: "transform 0.2s ease",
  };
});

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: ToggleSize;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
  "aria-label"?: string;
}

export const Toggle: FC<ToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  activeColor = "#22C55E",
  inactiveColor = "#E5E7EB",
  className,
  ...props
}) => {
  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <ToggleTrack
      type="button"
      role="switch"
      aria-checked={checked}
      checked={checked}
      disabled={disabled}
      size={size}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      onClick={handleClick}
      className={className}
      {...props}
    >
      <ToggleKnob size={size} checked={checked} />
    </ToggleTrack>
  );
};

export default Toggle;

