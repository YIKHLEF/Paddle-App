/**
 * Tests pour le composant Card
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/common';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      surface: '#FFFFFF',
      border: '#E5E7EB',
      background: '#F8F9FA',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      base: 16,
      lg: 24,
    },
    borderRadius: {
      md: 8,
      lg: 12,
    },
    shadows: {
      sm: { shadowColor: '#000', shadowOpacity: 0.1 },
      md: { shadowColor: '#000', shadowOpacity: 0.2 },
    },
  }),
}));

describe('Card Component', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['elevated', 'outlined', 'filled'] as const;

    variants.forEach((variant) => {
      const { getByTestID } = render(
        <Card variant={variant} testID={`card-${variant}`}>
          <Text>{variant}</Text>
        </Card>
      );
      expect(() => getByTestID(`card-${variant}`)).not.toThrow();
    });
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Card onPress={onPressMock}>
        <Text>Clickable Card</Text>
      </Card>
    );

    fireEvent.press(getByText('Clickable Card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders CardHeader correctly', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <Text>Header</Text>
        </CardHeader>
      </Card>
    );
    expect(getByText('Header')).toBeTruthy();
  });

  it('renders CardContent correctly', () => {
    const { getByText } = render(
      <Card>
        <CardContent>
          <Text>Content</Text>
        </CardContent>
      </Card>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  it('renders CardFooter correctly', () => {
    const { getByText } = render(
      <Card>
        <CardFooter>
          <Text>Footer</Text>
        </CardFooter>
      </Card>
    );
    expect(getByText('Footer')).toBeTruthy();
  });

  it('renders complete card with all sections', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <Text>Header Section</Text>
        </CardHeader>
        <CardContent>
          <Text>Content Section</Text>
        </CardContent>
        <CardFooter>
          <Text>Footer Section</Text>
        </CardFooter>
      </Card>
    );

    expect(getByText('Header Section')).toBeTruthy();
    expect(getByText('Content Section')).toBeTruthy();
    expect(getByText('Footer Section')).toBeTruthy();
  });
});
