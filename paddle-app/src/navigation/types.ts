/**
 * Types pour React Navigation
 * Définit les paramètres de chaque écran
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';

// ==================== Auth Stack ====================

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

// ==================== Main Tab ====================

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Matches: undefined;
  Profile: undefined;
  More: undefined;
};

export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

// ==================== Home Stack ====================

export type HomeStackParamList = {
  HomeScreen: undefined;
  MatchDetails: { matchId: string };
  PlayerProfile: { userId: string };
  CourtDetails: { courtId: string };
};

export type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

// ==================== Search Stack ====================

export type SearchStackParamList = {
  SearchMain: undefined;
  SearchPlayers: undefined;
  SearchCourts: undefined;
  SearchResults: { query: string; filters?: any };
  PlayerProfile: { userId: string };
  CourtDetails: { courtId: string };
};

export type SearchStackNavigationProp = NativeStackNavigationProp<SearchStackParamList>;

// ==================== Booking Stack ====================

export type BookingStackParamList = {
  BookingList: undefined;
  BookingCreate: { courtId?: string };
  BookingDetails: { bookingId: string };
  BookingConfirmation: { bookingId: string };
};

export type BookingStackNavigationProp = NativeStackNavigationProp<BookingStackParamList>;

// ==================== Matches Stack ====================

export type MatchesStackParamList = {
  MatchesList: undefined;
  MatchDetails: { matchId: string };
  CreateMatch: undefined;
  MatchInvite: { matchId: string };
};

export type MatchesStackNavigationProp = NativeStackNavigationProp<MatchesStackParamList>;

// ==================== Profile Stack ====================

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Statistics: undefined;
  Settings: undefined;
  Subscription: undefined;
  Notifications: undefined;
};

export type ProfileStackNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

// ==================== Root Stack ====================

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  // Modals
  MatchDetails: { matchId: string };
  PlayerProfile: { userId: string };
  CourtDetails: { courtId: string };
  BookingConfirmation: { bookingId: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ==================== Combined Types ====================

export type CombinedNavigationProp = CompositeNavigationProp<
  RootStackNavigationProp,
  CompositeNavigationProp<MainTabNavigationProp, HomeStackNavigationProp>
>;

// Helper pour déclarer la navigation dans les composants
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
