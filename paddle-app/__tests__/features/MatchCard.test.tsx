/**
 * Tests pour le composant MatchCard
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MatchCard, type MatchCardData } from '@/components/features';

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
  SkillBadge: ({ level }: any) => <div>{level}</div>,
  AvatarGroup: ({ avatars }: any) => <div>{avatars.length} avatars</div>,
  Button: ({ title, onPress, disabled }: any) => (
    <button onClick={onPress} disabled={disabled}>{title}</button>
  ),
}));

describe('MatchCard Component', () => {
  const mockMatch: MatchCardData = {
    id: '1',
    title: 'Match amical - Doubles',
    type: 'FRIENDLY',
    format: 'DOUBLES',
    skillLevel: 'INTERMEDIATE',
    date: '2025-11-17',
    time: '14:00',
    court: 'Padel Center Paris',
    organizer: 'Jean Dupont',
    participants: [
      { id: '1', name: 'Jean Dupont', avatar: null },
      { id: '2', name: 'Marie Martin', avatar: null },
    ],
    maxPlayers: 4,
    distance: '2.1 km',
    price: 12.5,
  };

  it('renders correctly with match data', () => {
    const { getByText } = render(<MatchCard match={mockMatch} />);

    expect(getByText('Match amical - Doubles')).toBeTruthy();
    expect(getByText('2025-11-17 · 14:00')).toBeTruthy();
    expect(getByText('Padel Center Paris')).toBeTruthy();
  });

  it('displays match type label correctly', () => {
    const { getByText } = render(<MatchCard match={mockMatch} />);
    expect(getByText('Amical')).toBeTruthy();
  });

  it('displays participant count correctly', () => {
    const { getByText } = render(<MatchCard match={mockMatch} />);
    expect(getByText('2/4')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <MatchCard match={mockMatch} onPress={onPressMock} />
    );

    const card = getByTestId('match-card');
    fireEvent.click(card);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders join button when match is not full', () => {
    const onJoinPressMock = jest.fn();
    const { getByText } = render(
      <MatchCard match={mockMatch} onJoinPress={onJoinPressMock} />
    );

    const joinButton = getByText(/Rejoindre/);
    expect(joinButton).toBeTruthy();
    fireEvent.click(joinButton);
    expect(onJoinPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders leave button when user is joined', () => {
    const onLeavePressMock = jest.fn();
    const { getByText } = render(
      <MatchCard
        match={mockMatch}
        isJoined={true}
        onLeavePress={onLeavePressMock}
      />
    );

    const leaveButton = getByText('Quitter le match');
    expect(leaveButton).toBeTruthy();
    fireEvent.click(leaveButton);
    expect(onLeavePressMock).toHaveBeenCalledTimes(1);
  });

  it('disables join button when match is full', () => {
    const fullMatch: MatchCardData = {
      ...mockMatch,
      participants: [
        { id: '1', name: 'Player 1', avatar: null },
        { id: '2', name: 'Player 2', avatar: null },
        { id: '3', name: 'Player 3', avatar: null },
        { id: '4', name: 'Player 4', avatar: null },
      ],
    };

    const { getByText } = render(
      <MatchCard match={fullMatch} onJoinPress={() => {}} />
    );

    const button = getByText('Complet');
    expect(button).toBeTruthy();
    expect(button).toHaveProperty('disabled', true);
  });

  it('displays price when provided', () => {
    const { getByText } = render(<MatchCard match={mockMatch} />);
    expect(getByText('12.5€ par personne')).toBeTruthy();
  });

  it('renders compact variant correctly', () => {
    const { getByText } = render(
      <MatchCard match={mockMatch} variant="compact" />
    );

    expect(getByText('Match amical - Doubles')).toBeTruthy();
    expect(getByText('2025-11-17 · 14:00')).toBeTruthy();
  });

  it('displays different match type labels correctly', () => {
    const matchTypes = [
      { type: 'RANKED' as const, label: 'Classé' },
      { type: 'TRAINING' as const, label: 'Entraînement' },
      { type: 'TOURNAMENT' as const, label: 'Tournoi' },
    ];

    matchTypes.forEach(({ type, label }) => {
      const { getByText } = render(
        <MatchCard match={{ ...mockMatch, type }} />
      );
      expect(getByText(label)).toBeTruthy();
    });
  });
});
