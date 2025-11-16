/**
 * Tests pour le composant ErrorMessage
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorMessage } from '@/components/common';
import { mockTheme } from '../helpers/theme-mock';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockTheme,
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
    const { getByTestId } = render(<ErrorMessage message="Error" fullscreen />);
    expect(() => getByTestId('error-container')).not.toThrow();
  });
});
