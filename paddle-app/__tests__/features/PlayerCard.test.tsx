/**
 * Tests pour le composant PlayerCard
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PlayerCard, type PlayerCardData } from '@/components/features';

// Mock du hook useTheme
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#0066FF',
      text: '#2C3E50',
      textSecondary: '#7F8C8D',
      surface: '#FFFFFF',
      border: '#E5E7EB',
      success: '#10B981',
    },
    spacing: {
      sm: 8,
      md: 12,
      base: 16,
    },
    borderRadius: {
      md: 8,
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
  CardContent: ({ children }: any) => <div>{children}</div>,
  Avatar: ({ name }: any) => <div>{name}</div>,
  SkillBadge: ({ level }: any) => <div>{level}</div>,
  Button: ({ title, onPress }: any) => (
    <button onClick={onPress}>{title}</button>
  ),
}));

describe('PlayerCard Component', () => {
  const mockPlayer: PlayerCardData = {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    username: 'jeandupont',
    skillLevel: 'INTERMEDIATE',
    profilePicture: null,
    distance: '2.3 km',
    matchesPlayed: 45,
    winRate: 62,
    isOnline: true,
  };

  it('renders correctly with player data', () => {
    const { getByText } = render(<PlayerCard player={mockPlayer} />);

    expect(getByText('Jean Dupont')).toBeTruthy();
    expect(getByText('@jeandupont')).toBeTruthy();
  });

  it('displays player stats when provided', () => {
    const { getByText } = render(<PlayerCard player={mockPlayer} />);

    expect(getByText('2.3 km')).toBeTruthy();
    expect(getByText('45 matchs')).toBeTruthy();
    expect(getByText('62% victoires')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <PlayerCard player={mockPlayer} onPress={onPressMock} />
    );

    const card = getByTestId('player-card');
    fireEvent.click(card);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders message button when onMessagePress is provided', () => {
    const onMessagePressMock = jest.fn();
    const { getByText } = render(
      <PlayerCard player={mockPlayer} onMessagePress={onMessagePressMock} />
    );

    const messageButton = getByText('Message');
    expect(messageButton).toBeTruthy();
    fireEvent.click(messageButton);
    expect(onMessagePressMock).toHaveBeenCalledTimes(1);
  });

  it('renders invite button when onInvitePress is provided', () => {
    const onInvitePressMock = jest.fn();
    const { getByText } = render(
      <PlayerCard player={mockPlayer} onInvitePress={onInvitePressMock} />
    );

    const inviteButton = getByText('Inviter');
    expect(inviteButton).toBeTruthy();
    fireEvent.click(inviteButton);
    expect(onInvitePressMock).toHaveBeenCalledTimes(1);
  });

  it('renders compact variant correctly', () => {
    const { getByText } = render(
      <PlayerCard player={mockPlayer} variant="compact" />
    );

    expect(getByText('Jean Dupont')).toBeTruthy();
    // En mode compact, on n'affiche pas le username
  });

  it('does not display stats when not provided', () => {
    const minimalPlayer: PlayerCardData = {
      id: '2',
      firstName: 'Marie',
      lastName: 'Martin',
      username: 'mariemartin',
      skillLevel: 'BEGINNER',
    };

    const { queryByText } = render(<PlayerCard player={minimalPlayer} />);

    expect(queryByText(/km/)).toBeNull();
    expect(queryByText(/matchs/)).toBeNull();
    expect(queryByText(/victoires/)).toBeNull();
  });
});
