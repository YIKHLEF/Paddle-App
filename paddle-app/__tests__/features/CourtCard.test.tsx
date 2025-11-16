/**
 * Tests pour le composant CourtCard
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CourtCard, type CourtCardData } from '@/components/features';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#0066FF',
      secondary: '#00D084',
      warning: '#FF9500',
      info: '#3B82F6',
      success: '#10B981',
      error: '#FF3B30',
      text: '#2C3E50',
      textSecondary: '#7F8C8D',
      surface: '#FFFFFF',
      border: '#E5E7EB',
    },
    spacing: {
      sm: 8,
      md: 12,
      base: 16,
    },
    borderRadius: {
      md: 8,
      lg: 12,
    },
    fontFamily: {
      semiBold: 'System',
    },
  }),
}));

// Mock des composants communs
jest.mock('@/components/common', () => ({
  Card: ({ children, onPress, testID }: any) => (
    <div data-testid={testID} onClick={onPress}>{children}</div>
  ),
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardFooter: ({ children }: any) => <div>{children}</div>,
  Badge: ({ label }: any) => <div>{label}</div>,
  Button: ({ title, onPress, disabled }: any) => (
    <button onClick={onPress} disabled={disabled}>{title}</button>
  ),
}));

describe('CourtCard Component', () => {
  const mockCourt: CourtCardData = {
    id: '1',
    name: 'Padel Center Paris',
    clubName: 'Club Sportif Paris',
    type: 'INDOOR',
    surface: 'ARTIFICIAL_GRASS',
    pricePerHour: 25,
    distance: '1.2 km',
    rating: 4.5,
    reviewsCount: 124,
    courtsAvailable: 3,
    totalCourts: 6,
    hasLighting: true,
    hasParking: true,
    hasShower: false,
  };

  it('renders correctly with court data', () => {
    const { getByText } = render(<CourtCard court={mockCourt} />);

    expect(getByText('Padel Center Paris')).toBeTruthy();
    expect(getByText('Club Sportif Paris')).toBeTruthy();
    expect(getByText('25€')).toBeTruthy();
  });

  it('displays rating and reviews count', () => {
    const { getByText } = render(<CourtCard court={mockCourt} />);

    expect(getByText('4.5')).toBeTruthy();
    expect(getByText('(124 avis)')).toBeTruthy();
  });

  it('displays distance when provided', () => {
    const { getByText } = render(<CourtCard court={mockCourt} />);
    expect(getByText('1.2 km')).toBeTruthy();
  });

  it('displays court type correctly', () => {
    const { getByText } = render(<CourtCard court={mockCourt} />);
    expect(getByText('Intérieur')).toBeTruthy();
  });

  it('displays surface type correctly', () => {
    const { getByText } = render(<CourtCard court={mockCourt} />);
    expect(getByText('Gazon synthétique')).toBeTruthy();
  });

  it('displays availability status correctly', () => {
    const { getByText } = render(<CourtCard court={mockCourt} />);

    expect(getByText('Disponible')).toBeTruthy();
    expect(getByText('3/6 terrains disponibles')).toBeTruthy();
  });

  it('shows unavailable status when no courts available', () => {
    const unavailableCourt = { ...mockCourt, courtsAvailable: 0 };
    const { getByText } = render(<CourtCard court={unavailableCourt} />);

    expect(getByText('Complet')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <CourtCard court={mockCourt} onPress={onPressMock} />
    );

    const card = getByTestId('court-card');
    fireEvent.click(card);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders book button when onBookPress is provided', () => {
    const onBookPressMock = jest.fn();
    const { getByText } = render(
      <CourtCard court={mockCourt} onBookPress={onBookPressMock} />
    );

    const bookButton = getByText('Réserver');
    expect(bookButton).toBeTruthy();
    fireEvent.click(bookButton);
    expect(onBookPressMock).toHaveBeenCalledTimes(1);
  });

  it('disables book button when court is unavailable', () => {
    const unavailableCourt = { ...mockCourt, courtsAvailable: 0 };
    const { getByText } = render(
      <CourtCard court={unavailableCourt} onBookPress={() => {}} />
    );

    const button = getByText('Indisponible');
    expect(button).toBeTruthy();
    expect(button).toHaveProperty('disabled', true);
  });

  it('renders compact variant correctly', () => {
    const { getByText } = render(
      <CourtCard court={mockCourt} variant="compact" />
    );

    expect(getByText('Padel Center Paris')).toBeTruthy();
    expect(getByText('1.2 km')).toBeTruthy();
    expect(getByText('25€/h')).toBeTruthy();
  });

  it('displays different surface types correctly', () => {
    const surfaceTypes = [
      { surface: 'CONCRETE' as const, label: 'Béton' },
      { surface: 'GLASS' as const, label: 'Verre' },
    ];

    surfaceTypes.forEach(({ surface, label }) => {
      const { getByText } = render(
        <CourtCard court={{ ...mockCourt, surface }} />
      );
      expect(getByText(label)).toBeTruthy();
    });
  });

  it('displays outdoor type correctly', () => {
    const outdoorCourt = { ...mockCourt, type: 'OUTDOOR' as const };
    const { getByText } = render(<CourtCard court={outdoorCourt} />);
    expect(getByText('Extérieur')).toBeTruthy();
  });
});
