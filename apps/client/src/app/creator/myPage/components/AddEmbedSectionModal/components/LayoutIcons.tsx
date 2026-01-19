import React from 'react';

interface IconProps {
  size?: number;
}

export const ListIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* White rectangle with rounded corners */}
    <rect x="8" y="6" width="32" height="36" rx="3" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1"/>
    
    {/* Top grey bar (header) */}
    <rect x="12" y="10" width="24" height="3" rx="1" fill="#9CA3AF"/>
    
    {/* First row - grey square + grey bar */}
    <rect x="12" y="18" width="6" height="6" rx="1" fill="#9CA3AF"/>
    <rect x="20" y="20.5" width="16" height="3" rx="1" fill="#9CA3AF"/>
    
    {/* Second row - grey square + grey bar */}
    <rect x="12" y="28" width="6" height="6" rx="1" fill="#9CA3AF"/>
    <rect x="20" y="30.5" width="16" height="3" rx="1" fill="#9CA3AF"/>
    
    {/* Third row - grey square + grey bar */}
    <rect x="12" y="38" width="6" height="6" rx="1" fill="#9CA3AF"/>
    <rect x="20" y="40.5" width="16" height="3" rx="1" fill="#9CA3AF"/>
  </svg>
);

export const RowIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* White rectangle with rounded corners */}
    <rect x="8" y="6" width="32" height="36" rx="3" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1"/>
    
    {/* Top grey bar (header) */}
    <rect x="12" y="10" width="24" height="3" rx="1" fill="#9CA3AF"/>
    
    {/* First column - small square + bar */}
    <rect x="12" y="18" width="6" height="6" rx="1" fill="#9CA3AF"/>
    <rect x="12" y="26" width="6" height="2" rx="1" fill="#9CA3AF"/>
    
    {/* Second column - larger square + bar */}
    <rect x="20" y="18" width="10" height="6" rx="1" fill="#9CA3AF"/>
    <rect x="20" y="26" width="10" height="2" rx="1" fill="#9CA3AF"/>
    
    {/* Third column - small square + bar */}
    <rect x="32" y="18" width="6" height="6" rx="1" fill="#9CA3AF"/>
    <rect x="32" y="26" width="6" height="2" rx="1" fill="#9CA3AF"/>
  </svg>
);
