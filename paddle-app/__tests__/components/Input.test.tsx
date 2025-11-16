/**
 * Tests pour le composant Input
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '@/components/common';
import { mockTheme } from '../helpers/theme-mock';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockTheme,
}));

describe('Input Component', () => {
  it('renders correctly with label', () => {
    const { getByText } = render(
      <Input label="Email" value="" onChangeText={() => {}} />
    );
    expect(getByText('Email')).toBeTruthy();
  });

  it('renders required asterisk when required prop is true', () => {
    const { getByText } = render(
      <Input label="Email" value="" onChangeText={() => {}} required />
    );
    expect(getByText('*')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input
        label="Email"
        value=""
        onChangeText={onChangeTextMock}
        placeholder="Enter email"
      />
    );

    const input = getByPlaceholderText('Enter email');
    fireEvent.changeText(input, 'test@example.com');
    expect(onChangeTextMock).toHaveBeenCalledWith('test@example.com');
  });

  it('displays error message when provided', () => {
    const { getByText } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        error="Invalid email"
      />
    );
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('displays hint message when provided', () => {
    const { getByText } = render(
      <Input
        label="Password"
        value=""
        onChangeText={() => {}}
        hint="Min. 8 characters"
      />
    );
    expect(getByText('Min. 8 characters')).toBeTruthy();
  });

  it('renders password toggle button when secureTextEntry is true', () => {
    const { getByTestId } = render(
      <Input
        label="Password"
        value=""
        onChangeText={() => {}}
        secureTextEntry
      />
    );
    expect(getByTestId('password-toggle-button')).toBeTruthy();
  });

  it('toggles password visibility when toggle button is pressed', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <Input
        label="Password"
        value="password123"
        onChangeText={() => {}}
        secureTextEntry
        placeholder="Enter password"
      />
    );

    const input = getByPlaceholderText('Enter password');
    const toggleButton = getByTestId('password-toggle-button');

    // Initially secure
    expect(input.props.secureTextEntry).toBe(true);

    // Toggle to show password
    fireEvent.press(toggleButton);
    expect(input.props.secureTextEntry).toBe(false);

    // Toggle back to hide password
    fireEvent.press(toggleButton);
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('renders with left icon', () => {
    const { getByTestId } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        leftIcon="email"
      />
    );
    expect(getByTestId('input-left-icon')).toBeTruthy();
  });

  it('renders with right icon (not password toggle)', () => {
    const { getByTestId } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        rightIcon="check"
      />
    );
    expect(getByTestId('input-right-icon')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByPlaceholderText } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        placeholder="Enter email"
        disabled
      />
    );

    const input = getByPlaceholderText('Enter email');
    expect(input.props.editable).toBe(false);
  });

  it('calls onFocus and onBlur callbacks', () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        placeholder="Enter email"
        onFocus={onFocusMock}
        onBlur={onBlurMock}
      />
    );

    const input = getByPlaceholderText('Enter email');

    fireEvent(input, 'focus');
    expect(onFocusMock).toHaveBeenCalled();

    fireEvent(input, 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });
});
