'use client';

import { Box } from '@mui/material';
import { Typography } from '@superline/design-system';

export type OnboardingStepKey =
  | 'personal-info'
  | 'create-account'
  | 'social-links'
  | 'upload-content'
  | 'stripe-connect';

export interface OnboardingStepConfig {
  id: OnboardingStepKey;
  label: string;
}

interface OnboardingStepperProps {
  steps: OnboardingStepConfig[];
  activeStepId: OnboardingStepKey;
}

// Style variables
const stepperContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.50,
  mb: 4,
  flexWrap: 'wrap',
};

const stepItemContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.50,
};

const circleStyles = {
  width: 'var(--height-onboarding-stepper-circle)',
  height: 'var(--height-onboarding-stepper-circle)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const checkMarkStyles = {
  width: 'var(--height-onboarding-stepper-check-width)',
  height: 'var(--height-onboarding-stepper-check)',
  transform: 'rotate(-45deg)',
  transformOrigin: 'center',
  mb: 0.2,
};

const stepLabelStyles = {
  fontSize: 'var(--font-size-onboarding-xs)',
};

const separatorStyles = {
  fontSize: 'var(--font-size-onboarding-xs)',
  color: 'var(--color-onboarding-border-separator)',
  mx: 0.5,
};

const OnboardingStepper = ({ steps, activeStepId }: OnboardingStepperProps) => {
  const activeIndex = steps.findIndex((step) => step.id === activeStepId);

  return (
    <Box sx={stepperContainerStyles}>
      {steps.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const status: 'completed' | 'current' | 'upcoming' = isCompleted
          ? 'completed'
          : isActive
          ? 'current'
          : 'upcoming';

        const circleBorderColor =
          status === 'completed' ? 'var(--color-onboarding-text-dark)' : status === 'current' ? 'var(--color-onboarding-text-dark)' : 'var(--color-onboarding-border-separator-light)';
        const circleBgColor = status === 'completed' ? 'var(--color-onboarding-text-dark)' : 'var(--color-white)';
        const checkColor =
          status === 'completed'
            ? 'var(--color-white)'
            : status === 'current'
            ? 'var(--color-onboarding-text-dark)'
            : 'var(--color-onboarding-border-separator-lighter)';

        const labelColor =
          status === 'current'
            ? 'var(--color-onboarding-text-dark)'
            : status === 'completed'
            ? 'var(--color-onboarding-border-separator-dark)'
            : 'var(--color-onboarding-border-separator-lighter)';

        return (
          <Box key={step.id} sx={stepItemContainerStyles}>
            {/* Custom circle + check to match Figma */}
            <Box
              sx={{
                ...circleStyles,
                border: `2px solid ${circleBorderColor}`,
                backgroundColor: circleBgColor,
              }}
            >
              <Box
                component="span"
                sx={{
                  ...checkMarkStyles,
                  borderBottom: `2px solid ${checkColor}`,
                  borderLeft: `2px solid ${checkColor}`,
                }}
              />
            </Box>

            <Typography
              sx={{
                ...stepLabelStyles,
                fontWeight: status === 'current' ? 700 : 500,
                color: labelColor,
              }}
            >
              {step.label}
            </Typography>

            {index < steps.length - 1 && (
              <Typography component="span" sx={separatorStyles}>
                -
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default OnboardingStepper;


