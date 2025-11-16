/**
 * Tests pour le composant Avatar et AvatarGroup
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Avatar, AvatarGroup } from '@/components/common';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#0066FF',
      surface: '#FFFFFF',
      textSecondary: '#7F8C8D',
      border: '#E5E7EB',
    },
    borderRadius: {
      sm: 4,
      md: 8,
      full: 9999,
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 20,
    },
    fontFamily: {
      semiBold: 'System',
    },
  }),
}));

describe('Avatar Component', () => {
  it('renders with initials when no URI is provided', () => {
    const { getByText } = render(<Avatar name="John Doe" size="md" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('renders different sizes correctly', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

    sizes.forEach((size) => {
      const { getByText } = render(<Avatar name="Test User" size={size} />);
      expect(getByText('TU')).toBeTruthy();
    });
  });

  it('renders with different variants', () => {
    const variants = ['circular', 'rounded', 'square'] as const;

    variants.forEach((variant) => {
      const { getByText } = render(<Avatar name="Test User" variant={variant} />);
      expect(getByText('TU')).toBeTruthy();
    });
  });

  it('renders with badge when badge prop is true', () => {
    const { getByTestID } = render(<Avatar name="Test User" badge />);
    expect(() => getByTestID('avatar-badge')).not.toThrow();
  });

  it('extracts correct initials from name', () => {
    const testCases = [
      { name: 'John Doe', expected: 'JD' },
      { name: 'Marie Martin', expected: 'MM' },
      { name: 'A', expected: 'A' },
      { name: 'Pierre Jean Claude', expected: 'PJ' },
    ];

    testCases.forEach(({ name, expected }) => {
      const { getByText } = render(<Avatar name={name} />);
      expect(getByText(expected)).toBeTruthy();
    });
  });
});

describe('AvatarGroup Component', () => {
  it('renders multiple avatars', () => {
    const avatars = [
      { id: '1', name: 'User One', uri: null },
      { id: '2', name: 'User Two', uri: null },
      { id: '3', name: 'User Three', uri: null },
    ];

    const { getByText } = render(<AvatarGroup avatars={avatars} />);

    expect(getByText('UO')).toBeTruthy();
    expect(getByText('UT')).toBeTruthy();
    expect(getByText('UT')).toBeTruthy();
  });

  it('limits displayed avatars based on max prop', () => {
    const avatars = [
      { id: '1', name: 'User One', uri: null },
      { id: '2', name: 'User Two', uri: null },
      { id: '3', name: 'User Three', uri: null },
      { id: '4', name: 'User Four', uri: null },
    ];

    const { getByText, queryByText } = render(
      <AvatarGroup avatars={avatars} max={2} />
    );

    expect(getByText('UO')).toBeTruthy();
    expect(getByText('UT')).toBeTruthy();
    expect(getByText('+2')).toBeTruthy(); // Remaining count
  });
});
