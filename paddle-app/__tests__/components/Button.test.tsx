/**
 * Tests pour le composant Button
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/common';
import { mockTheme } from '../helpers/theme-mock';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockTheme,
}));

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Disabled Button" onPress={onPressMock} disabled />
    );

    fireEvent.press(getByText('Disabled Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders loading state correctly', () => {
    const { getByTestId } = render(
      <Button title="Loading" onPress={() => {}} loading />
    );

    expect(getByTestId('button-loading-indicator')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;

    variants.forEach((variant) => {
      const { getByText } = render(
        <Button title={`${variant} button`} onPress={() => {}} variant={variant} />
      );
      expect(getByText(`${variant} button`)).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      const { getByText } = render(
        <Button title={`${size} button`} onPress={() => {}} size={size} />
      );
      expect(getByText(`${size} button`)).toBeTruthy();
    });
  });

  it('renders with icon', () => {
    const { getByTestId } = render(
      <Button title="Icon Button" onPress={() => {}} icon="check" />
    );

    // Icon devrait être rendu
    expect(() => getByTestId('button-icon')).not.toThrow();
  });

  it('renders full width button', () => {
    const { getByTestId } = render(
      <Button title="Full Width" onPress={() => {}} fullWidth />
    );

    const button = getByTestId('button-container');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: '100%' })
      ])
    );
  });

  it('applies custom style', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <Button title="Custom Style" onPress={() => {}} style={customStyle} />
    );

    const button = getByTestId('button-container');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });
});
