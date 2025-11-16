/**
 * Tests pour les composants Badge, SkillBadge et SubscriptionBadge
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge, SkillBadge, SubscriptionBadge } from '@/components/common';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#0066FF',
      secondary: '#00D084',
      success: '#10B981',
      error: '#FF3B30',
      warning: '#FF9500',
      info: '#3B82F6',
      skillBeginner: '#10B981',
      skillIntermediate: '#3B82F6',
      skillAdvanced: '#8B5CF6',
      skillExpert: '#F59E0B',
      skillPro: '#EF4444',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
    },
    borderRadius: {
      full: 9999,
    },
    fontFamily: {
      semiBold: 'System',
    },
  }),
}));

describe('Badge Component', () => {
  it('renders correctly with label', () => {
    const { getByText } = render(<Badge label="Test Badge" />);
    expect(getByText('Test Badge')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'success', 'error', 'warning', 'info'] as const;

    variants.forEach((variant) => {
      const { getByText } = render(<Badge label={variant} variant={variant} />);
      expect(getByText(variant)).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      const { getByText } = render(<Badge label={size} size={size} />);
      expect(getByText(size)).toBeTruthy();
    });
  });

  it('renders with icon', () => {
    const { getByText } = render(<Badge label="With Icon" icon="check" />);
    expect(getByText('With Icon')).toBeTruthy();
  });
});

describe('SkillBadge Component', () => {
  it('renders with BEGINNER level', () => {
    const { getByText } = render(<SkillBadge level="BEGINNER" />);
    expect(getByText('Débutant')).toBeTruthy();
  });

  it('renders with INTERMEDIATE level', () => {
    const { getByText } = render(<SkillBadge level="INTERMEDIATE" />);
    expect(getByText('Intermédiaire')).toBeTruthy();
  });

  it('renders with ADVANCED level', () => {
    const { getByText } = render(<SkillBadge level="ADVANCED" />);
    expect(getByText('Avancé')).toBeTruthy();
  });

  it('renders with EXPERT level', () => {
    const { getByText } = render(<SkillBadge level="EXPERT" />);
    expect(getByText('Expert')).toBeTruthy();
  });

  it('renders with PRO level', () => {
    const { getByText } = render(<SkillBadge level="PRO" />);
    expect(getByText('Pro')).toBeTruthy();
  });
});

describe('SubscriptionBadge Component', () => {
  it('renders with FREE tier', () => {
    const { getByText } = render(<SubscriptionBadge tier="FREE" />);
    expect(getByText('Gratuit')).toBeTruthy();
  });

  it('renders with STANDARD tier', () => {
    const { getByText } = render(<SubscriptionBadge tier="STANDARD" />);
    expect(getByText('Standard')).toBeTruthy();
  });

  it('renders with PREMIUM tier', () => {
    const { getByText } = render(<SubscriptionBadge tier="PREMIUM" />);
    expect(getByText('Premium')).toBeTruthy();
  });
});
