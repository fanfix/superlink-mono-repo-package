'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';
import { styles } from './styles';

interface CountdownTimerProps {
  initialMinutes: string;
  initialSeconds: string;
}

export function CountdownTimer({ initialMinutes, initialSeconds }: CountdownTimerProps) {
  const [minutes, setMinutes] = useState(parseInt(initialMinutes) || 0);
  const [seconds, setSeconds] = useState(parseInt(initialSeconds) || 0);
  const totalSecondsRef = useRef((parseInt(initialMinutes) || 0) * 60 + (parseInt(initialSeconds) || 0));

  useEffect(() => {
    // Initialize with the provided values
    const mins = parseInt(initialMinutes) || 0;
    const secs = parseInt(initialSeconds) || 0;
    setMinutes(mins);
    setSeconds(secs);
    totalSecondsRef.current = mins * 60 + secs;
  }, [initialMinutes, initialSeconds]);

  useEffect(() => {
    if (totalSecondsRef.current <= 0) {
      return;
    }

    const interval = setInterval(() => {
      totalSecondsRef.current -= 1;
      
      if (totalSecondsRef.current <= 0) {
        setMinutes(0);
        setSeconds(0);
        return;
      }

      const newMinutes = Math.floor(totalSecondsRef.current / 60);
      const newSeconds = totalSecondsRef.current % 60;
      setMinutes(newMinutes);
      setSeconds(newSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [initialMinutes, initialSeconds]);

  // Format numbers to always show 2 digits
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  const minutesStr = formatTime(minutes);
  const secondsStr = formatTime(seconds);

  // Split into individual digits
  const digits = [
    minutesStr[0],
    minutesStr[1],
    ':',
    secondsStr[0],
    secondsStr[1],
  ];

  return (
    <Box sx={styles.countdownTimerContainer}>
      {digits.map((digit, index) => (
        <Box key={index} sx={styles.countdownDigitButton}>
          <Typography sx={styles.countdownDigitText}>{digit}</Typography>
        </Box>
      ))}
    </Box>
  );
}

