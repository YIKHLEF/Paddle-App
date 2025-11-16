/**
 * Tests pour le composant ErrorMessage
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorMessage } from '@/components/common';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      error: '#FF3B30',
      background: '#F8F9FA',
      text: '#2C3E50',
      textSecondary: '#7F8C8D',
    },
    spacing: {
      base: 16,
      lg: 24,
    },
  }),
}));

describe('ErrorMessage Component', () => {
  it('renders error message text', () => {
    const { getByText } = render(<ErrorMessage message="An error occurred" />);
    expect(getByText('An error occurred')).toBeTruthy();
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetryMock = jest.fn();
    const { getByText } = render(
      <ErrorMessage message="Error" onRetry={onRetryMock} />
    );
    expect(getByText('Réessayer')).toBeTruthy();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetryMock = jest.fn();
    const { getByText } = render(
      <ErrorMessage message="Error" onRetry={onRetryMock} />
    );

    fireEvent.press(getByText('Réessayer'));
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when onRetry is not provided', () => {
    const { queryByText } = render(<ErrorMessage message="Error" />);
    expect(queryByText('Réessayer')).toBeNull();
  });

  it('renders fullscreen when fullscreen prop is true', () => {
    const { getByTestID } = render(<ErrorMessage message="Error" fullscreen />);
    expect(() => getByTestID('error-container')).not.toThrow();
  });
});
