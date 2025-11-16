/**
 * Tests pour le composant Avatar et AvatarGroup
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Avatar, AvatarGroup } from '@/components/common';
import { mockTheme } from '../helpers/theme-mock';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockTheme,
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
    const { getByTestId } = render(<Avatar name="Test User" badge />);
    expect(() => getByTestId('avatar-badge')).not.toThrow();
  });

  it('extracts correct initials from name', () => {
    const testCases = [
      { name: 'John Doe', expected: 'JD' },
      { name: 'Marie Martin', expected: 'MM' },
      { name: 'A', expected: 'A' },
      { name: 'Pierre Jean Claude', expected: 'PC' },
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

    const { getByText, getAllByText } = render(<AvatarGroup avatars={avatars} />);

    expect(getByText('UO')).toBeTruthy();
    const utElements = getAllByText('UT');
    expect(utElements).toHaveLength(2);
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
