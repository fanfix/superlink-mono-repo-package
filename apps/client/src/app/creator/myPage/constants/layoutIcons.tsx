import React from 'react';

export interface LayoutIconProps {
  size?: number;
  className?: string;
}

/** List layout icon (80x80 design) - displays as grid on mobile */
export const ListLayoutIcon: React.FC<LayoutIconProps> = ({ size = 80, className }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="79" height="79" rx="3.5" fill="white" />
    <rect opacity="0.2" x="8.66667" y="20.6667" width="12.6667" height="12.6667" rx="1.33333" fill="black" stroke="black" strokeWidth="1.33333" />
    <g opacity="0.1">
      <mask id="list-path-3-inside-1" fill="white">
        <rect x="25" y="23" width="47" height="3" rx="1" />
      </mask>
      <rect x="25" y="23" width="47" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#list-path-3-inside-1)" />
    </g>
    <g opacity="0.1">
      <mask id="list-path-4-inside-2" fill="white">
        <rect x="25" y="28" width="30" height="3" rx="1" />
      </mask>
      <rect x="25" y="28" width="30" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#list-path-4-inside-2)" />
    </g>
    <rect opacity="0.2" x="8.66667" y="38.6667" width="12.6667" height="12.6667" rx="1.33333" fill="black" stroke="black" strokeWidth="1.33333" />
    <g opacity="0.1">
      <mask id="list-path-6-inside-3" fill="white">
        <rect x="25" y="41" width="47" height="3" rx="1" />
      </mask>
      <rect x="25" y="41" width="47" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#list-path-6-inside-3)" />
    </g>
    <g opacity="0.1">
      <mask id="list-path-7-inside-4" fill="white">
        <rect x="25" y="46" width="42" height="3" rx="1" />
      </mask>
      <rect x="25" y="46" width="42" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#list-path-7-inside-4)" />
    </g>
    <rect opacity="0.2" x="8.66667" y="56.6667" width="12.6667" height="12.6667" rx="1.33333" fill="black" stroke="black" strokeWidth="1.33333" />
    <g opacity="0.1">
      <mask id="list-path-9-inside-5" fill="white">
        <rect x="25" y="59" width="47" height="3" rx="1" />
      </mask>
      <rect x="25" y="59" width="47" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#list-path-9-inside-5)" />
    </g>
    <g opacity="0.1">
      <mask id="list-path-10-inside-6" fill="white">
        <rect x="25" y="64" width="24" height="3" rx="1" />
      </mask>
      <rect x="25" y="64" width="24" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#list-path-10-inside-6)" />
    </g>
    <g opacity="0.1">
      <mask id="list-path-11-inside-7" fill="white">
        <rect x="8" y="10" width="40" height="6" rx="1" />
      </mask>
      <rect x="8" y="10" width="40" height="6" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#list-path-11-inside-7)" />
    </g>
    <rect x="0.5" y="0.5" width="79" height="79" rx="3.5" stroke="#CCCCCC" />
  </svg>
);

/** Row layout icon (80x80 design) - displays as slider on mobile */
export const RowLayoutIcon: React.FC<LayoutIconProps> = ({ size = 80, className }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#row-clip0)">
      <rect width="80" height="80" rx="4" fill="white" />
      <rect opacity="0.2" x="8.66667" y="27.6667" width="22.6667" height="22.6667" rx="1.33333" fill="black" stroke="black" strokeWidth="1.33333" />
      <g opacity="0.1">
        <mask id="row-path-4-inside-1" fill="white">
          <rect x="8" y="53" width="24" height="3" rx="1" />
        </mask>
        <rect x="8" y="53" width="24" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#row-path-4-inside-1)" />
      </g>
      <g opacity="0.1">
        <mask id="row-path-5-inside-2" fill="white">
          <rect x="8" y="58" width="18" height="3" rx="1" />
        </mask>
        <rect x="8" y="58" width="18" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#row-path-5-inside-2)" />
      </g>
      <g opacity="0.1">
        <mask id="row-path-6-inside-3" fill="white">
          <rect x="36" y="53" width="24" height="3" rx="1" />
        </mask>
        <rect x="36" y="53" width="24" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#row-path-6-inside-3)" />
      </g>
      <g opacity="0.1">
        <mask id="row-path-7-inside-4" fill="white">
          <rect x="36" y="58" width="12" height="3" rx="1" />
        </mask>
        <rect x="36" y="58" width="12" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#row-path-7-inside-4)" />
      </g>
      <g opacity="0.1">
        <mask id="row-path-8-inside-5" fill="white">
          <rect x="64" y="53" width="24" height="3" rx="1" />
        </mask>
        <rect x="64" y="53" width="24" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#row-path-8-inside-5)" />
      </g>
      <g opacity="0.1">
        <mask id="row-path-9-inside-6" fill="white">
          <rect x="64" y="58" width="18" height="3" rx="1" />
        </mask>
        <rect x="64" y="58" width="18" height="3" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#row-path-9-inside-6)" />
      </g>
      <rect opacity="0.2" x="36.6667" y="27.6667" width="22.6667" height="22.6667" rx="1.33333" fill="black" stroke="black" strokeWidth="1.33333" />
      <rect opacity="0.2" x="64.6667" y="27.6667" width="22.6667" height="22.6667" rx="1.33333" fill="black" stroke="black" strokeWidth="1.33333" />
      <g opacity="0.1">
        <mask id="row-path-12-inside-7" fill="white">
          <rect x="8" y="17" width="40" height="6" rx="1" />
        </mask>
        <rect x="8" y="17" width="40" height="6" rx="1" fill="black" stroke="black" strokeWidth="2.66667" mask="url(#row-path-12-inside-7)" />
      </g>
    </g>
    <rect x="0.5" y="0.5" width="79" height="79" rx="3.5" stroke="#CCCCCC" />
    <defs>
      <clipPath id="row-clip0">
        <rect width="80" height="80" rx="4" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/** Parallel Row layout icon (80x80 design) */
export const ParallelRowLayoutIcon: React.FC<LayoutIconProps> = ({ size = 80, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="0.5" y="0.5" width="79" height="79" rx="3.5" fill="white" />
    <rect x="0.5" y="0.5" width="79" height="79" rx="3.5" stroke="#CCCCCC" />
    <rect opacity="0.2" x="7.51667" y="28.1666" width="28.9667" height="15.9667" rx="1.03333" fill="black" stroke="black" strokeWidth="1.03333" />
    <rect opacity="0.2" x="9.51667" y="31.1666" width="10.9667" height="9.96667" rx="1.03333" fill="black" stroke="black" strokeWidth="1.03333" />
    <g opacity="0.1">
      <mask id="parallel-path-4-inside-1" fill="white">
        <rect x="23" y="31.6499" width="12" height="2" rx="0.775" />
      </mask>
      <rect x="23" y="31.6499" width="12" height="2" rx="0.775" fill="black" stroke="black" strokeWidth="2" mask="url(#parallel-path-4-inside-1)" />
    </g>
    <g opacity="0.1">
      <mask id="parallel-path-5-inside-2" fill="white">
        <rect x="23" y="35.6499" width="10" height="2" rx="0.775" />
      </mask>
      <rect x="23" y="35.6499" width="10" height="2" rx="0.775" fill="black" stroke="black" strokeWidth="2" mask="url(#parallel-path-5-inside-2)" />
    </g>
    <rect opacity="0.2" x="43.5167" y="28.1666" width="28.9667" height="15.9667" rx="1.03333" fill="black" stroke="black" strokeWidth="1.03333" />
    <rect opacity="0.2" x="45.5167" y="31.1666" width="10.9667" height="9.96667" rx="1.03333" fill="black" stroke="black" strokeWidth="1.03333" />
    <g opacity="0.1">
      <mask id="parallel-path-8-inside-3" fill="white">
        <rect x="59" y="31.6499" width="12" height="2" rx="0.775" />
      </mask>
      <rect x="59" y="31.6499" width="12" height="2" rx="0.775" fill="black" stroke="black" strokeWidth="2" mask="url(#parallel-path-8-inside-3)" />
    </g>
    <g opacity="0.1">
      <mask id="parallel-path-9-inside-4" fill="white">
        <rect x="59" y="35.6499" width="10" height="2" rx="0.775" />
      </mask>
      <rect x="59" y="35.6499" width="10" height="2" rx="0.775" fill="black" stroke="black" strokeWidth="2" mask="url(#parallel-path-9-inside-4)" />
    </g>
    <rect opacity="0.2" x="7.51667" y="49.1666" width="28.9667" height="15.9667" rx="1.03333" fill="black" stroke="black" strokeWidth="1.03333" />
    <rect opacity="0.2" x="9.51667" y="52.1666" width="10.9667" height="9.96667" rx="1.03333" fill="black" stroke="black" strokeWidth="1.03333" />
    <g opacity="0.1">
      <mask id="parallel-path-12-inside-5" fill="white">
        <rect x="23" y="52.6499" width="12" height="2" rx="0.775" />
      </mask>
      <rect x="23" y="52.6499" width="12" height="2" rx="0.775" fill="black" stroke="black" strokeWidth="2" mask="url(#parallel-path-12-inside-5)" />
    </g>
    <g opacity="0.1">
      <mask id="parallel-path-13-inside-6" fill="white">
        <rect x="23" y="56.6499" width="10" height="2" rx="0.775" />
      </mask>
      <rect x="23" y="56.6499" width="10" height="2" rx="0.775" fill="black" stroke="black" strokeWidth="2" mask="url(#parallel-path-13-inside-6)" />
    </g>
    <rect opacity="0.2" x="43.5167" y="49.1666" width="28.9667" height="15.9667" rx="1.03333" fill="black" stroke="black" strokeWidth="1.03333" />
    <rect opacity="0.2" x="45.5167" y="52.1666" width="10.9667" height="9.96667" rx="1.03333" fill="black" stroke="black" strokeWidth="1.03333" />
    <g opacity="0.1">
      <mask id="parallel-path-16-inside-7" fill="white">
        <rect x="59" y="52.6499" width="12" height="2" rx="0.775" />
      </mask>
      <rect x="59" y="52.6499" width="12" height="2" rx="0.775" fill="black" stroke="black" strokeWidth="2" mask="url(#parallel-path-16-inside-7)" />
    </g>
    <g opacity="0.1">
      <mask id="parallel-path-17-inside-8" fill="white">
        <rect x="59" y="56.6499" width="10" height="2" rx="0.775" />
      </mask>
      <rect x="59" y="56.6499" width="10" height="2" rx="0.775" fill="black" stroke="black" strokeWidth="2" mask="url(#parallel-path-17-inside-8)" />
    </g>
    <g opacity="0.1">
      <mask id="parallel-path-18-inside-9" fill="white">
        <rect x="7" y="15" width="31" height="4.65" rx="0.775" />
      </mask>
      <rect x="7" y="15" width="31" height="4.65" rx="0.775" fill="black" stroke="black" strokeWidth="2.06667" mask="url(#parallel-path-18-inside-9)" />
    </g>
  </svg>
);
