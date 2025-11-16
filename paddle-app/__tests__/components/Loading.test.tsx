/**
 * Tests pour le composant Loading
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from '@/components/common';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#0066FF',
      background: '#F8F9FA',
      text: '#2C3E50',
    },
    spacing: {
      base: 16,
    },
  }),
}));

describe('Loading Component', () => {
  it('renders loading indicator', () => {
    const { getByTestId } = render(<Loading />);
    expect(() => getByTestId('loading-indicator')).not.toThrow();
  });

  it('renders with text when provided', () => {
    const { getByText } = render(<Loading text="Loading..." />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders fullscreen when fullscreen prop is true', () => {
    const { getByTestId } = render(<Loading fullscreen />);
    expect(() => getByTestId('loading-container')).not.toThrow();
  });

  it('renders inline loading without fullscreen overlay', () => {
    const { getByTestId } = render(<Loading fullscreen={false} />);
    expect(() => getByTestId('loading-container')).not.toThrow();
  });
});
