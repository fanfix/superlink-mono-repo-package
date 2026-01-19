'use client';

import React from 'react';
import LandingNavbar from '../../components/LandingNavbar';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNavbar />
      {children}
    </>
  );
}
