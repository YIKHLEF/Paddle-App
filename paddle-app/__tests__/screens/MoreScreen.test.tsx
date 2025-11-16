/**
 * Tests pour l'écran MoreScreen
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { MoreScreen } from '@/screens/settings';
import { logout } from '@/store/slices/authSlice';
import { setTheme, setLanguage, toggleNotifications } from '@/store/slices/appSlice';

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
      background: '#F8F9FA',
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

// Mock de la navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock des Redux hooks
const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock('@/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => mockSelector(selector),
}));

// Mock des slices Redux
jest.mock('@/store/slices/authSlice', () => ({
  logout: jest.fn(() => ({ type: 'auth/logout' })),
}));

jest.mock('@/store/slices/appSlice', () => ({
  setTheme: jest.fn((theme) => ({ type: 'app/setTheme', payload: theme })),
  setLanguage: jest.fn((language) => ({ type: 'app/setLanguage', payload: language })),
  toggleNotifications: jest.fn(() => ({ type: 'app/toggleNotifications' })),
}));

// Mock des composants communs
jest.mock('@/components/common', () => ({
  Card: ({ children, testID }: any) => <div data-testid={testID}>{children}</div>,
}));

// Mock de Alert
jest.spyOn(Alert, 'alert');

describe('MoreScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default state
    mockSelector.mockImplementation((selector) => {
      const state = {
        app: {
          theme: 'light',
          language: 'fr',
          notificationsEnabled: true,
        },
        auth: {
          user: {
            id: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            subscriptionTier: 'FREE',
          },
        },
      };
      return selector(state);
    });
  });

  describe('Rendering', () => {
    it('renders header correctly', () => {
      const { getByText } = render(<MoreScreen />);
      expect(getByText('Plus')).toBeTruthy();
    });

    it('renders all section titles', () => {
      const { getByText } = render(<MoreScreen />);

      expect(getByText('COMPTE')).toBeTruthy();
      expect(getByText('PRÉFÉRENCES')).toBeTruthy();
      expect(getByText('ACTIVITÉ')).toBeTruthy();
      expect(getByText('SUPPORT')).toBeTruthy();
      expect(getByText('LÉGAL')).toBeTruthy();
    });

    it('renders version text', () => {
      const { getByText } = render(<MoreScreen />);
      expect(getByText('Paddle App v1.0.0')).toBeTruthy();
    });

    it('renders all settings items', () => {
      const { getByText } = render(<MoreScreen />);

      // Account section
      expect(getByText('Mon profil')).toBeTruthy();
      expect(getByText('Abonnement')).toBeTruthy();

      // Preferences section
      expect(getByText('Notifications')).toBeTruthy();
      expect(getByText('Thème')).toBeTruthy();
      expect(getByText('Langue')).toBeTruthy();

      // Activity section
      expect(getByText('Historique')).toBeTruthy();
      expect(getByText('Favoris')).toBeTruthy();
      expect(getByText('Statistiques')).toBeTruthy();

      // Support section
      expect(getByText('Aide & FAQ')).toBeTruthy();
      expect(getByText('Nous contacter')).toBeTruthy();
      expect(getByText('Noter l\'application')).toBeTruthy();

      // Legal section
      expect(getByText('Conditions d\'utilisation')).toBeTruthy();
      expect(getByText('Politique de confidentialité')).toBeTruthy();
      expect(getByText('À propos')).toBeTruthy();
    });

    it('renders logout button', () => {
      const { getByText } = render(<MoreScreen />);
      expect(getByText('Se déconnecter')).toBeTruthy();
    });
  });

  describe('Subscription Display', () => {
    it('displays FREE subscription correctly', () => {
      const { getByText } = render(<MoreScreen />);
      expect(getByText('Gratuit')).toBeTruthy();
    });

    it('displays STANDARD subscription correctly', () => {
      mockSelector.mockImplementation((selector) => {
        const state = {
          app: { theme: 'light', language: 'fr', notificationsEnabled: true },
          auth: {
            user: {
              id: '1',
              firstName: 'Jean',
              lastName: 'Dupont',
              subscriptionTier: 'STANDARD',
            },
          },
        };
        return selector(state);
      });

      const { getByText } = render(<MoreScreen />);
      expect(getByText('Standard - 9.99€/mois')).toBeTruthy();
    });

    it('displays PREMIUM subscription correctly', () => {
      mockSelector.mockImplementation((selector) => {
        const state = {
          app: { theme: 'light', language: 'fr', notificationsEnabled: true },
          auth: {
            user: {
              id: '1',
              firstName: 'Jean',
              lastName: 'Dupont',
              subscriptionTier: 'PREMIUM',
            },
          },
        };
        return selector(state);
      });

      const { getByText } = render(<MoreScreen />);
      expect(getByText('Premium - 14.99€/mois')).toBeTruthy();
    });
  });

  describe('Theme Management', () => {
    it('displays current theme label (light)', () => {
      const { getByText } = render(<MoreScreen />);
      expect(getByText('Clair')).toBeTruthy();
    });

    it('displays current theme label (dark)', () => {
      mockSelector.mockImplementation((selector) => {
        const state = {
          app: { theme: 'dark', language: 'fr', notificationsEnabled: true },
          auth: { user: { subscriptionTier: 'FREE' } },
        };
        return selector(state);
      });

      const { getByText } = render(<MoreScreen />);
      expect(getByText('Sombre')).toBeTruthy();
    });

    it('displays current theme label (auto)', () => {
      mockSelector.mockImplementation((selector) => {
        const state = {
          app: { theme: 'auto', language: 'fr', notificationsEnabled: true },
          auth: { user: { subscriptionTier: 'FREE' } },
        };
        return selector(state);
      });

      const { getByText } = render(<MoreScreen />);
      expect(getByText('Automatique')).toBeTruthy();
    });

    it('shows alert when theme setting is pressed', () => {
      const { getByTestId } = render(<MoreScreen />);

      const themeItem = getByTestId('settings-theme');
      fireEvent.press(themeItem);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Thème',
        'Choisissez le thème de l\'application',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Clair' }),
          expect.objectContaining({ text: 'Sombre' }),
          expect.objectContaining({ text: 'Auto' }),
          expect.objectContaining({ text: 'Annuler' }),
        ])
      );
    });

    it('dispatches setTheme action when theme is selected', () => {
      const { getByTestId } = render(<MoreScreen />);

      const themeItem = getByTestId('settings-theme');
      fireEvent.press(themeItem);

      // Get the alert call and execute the "Clair" option
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const lightButton = buttons.find((b: any) => b.text === 'Clair');
      lightButton.onPress();

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'app/setTheme', payload: 'light' });
    });
  });

  describe('Language Management', () => {
    it('displays current language label (fr)', () => {
      const { getByText } = render(<MoreScreen />);
      expect(getByText('Français')).toBeTruthy();
    });

    it('displays current language label (en)', () => {
      mockSelector.mockImplementation((selector) => {
        const state = {
          app: { theme: 'light', language: 'en', notificationsEnabled: true },
          auth: { user: { subscriptionTier: 'FREE' } },
        };
        return selector(state);
      });

      const { getByText } = render(<MoreScreen />);
      expect(getByText('English')).toBeTruthy();
    });

    it('displays current language label (es)', () => {
      mockSelector.mockImplementation((selector) => {
        const state = {
          app: { theme: 'light', language: 'es', notificationsEnabled: true },
          auth: { user: { subscriptionTier: 'FREE' } },
        };
        return selector(state);
      });

      const { getByText } = render(<MoreScreen />);
      expect(getByText('Español')).toBeTruthy();
    });

    it('shows alert when language setting is pressed', () => {
      const { getByTestId } = render(<MoreScreen />);

      const languageItem = getByTestId('settings-language');
      fireEvent.press(languageItem);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Langue',
        'Choisissez la langue de l\'application',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Français' }),
          expect.objectContaining({ text: 'English' }),
          expect.objectContaining({ text: 'Español' }),
          expect.objectContaining({ text: 'Annuler' }),
        ])
      );
    });

    it('dispatches setLanguage action when language is selected', () => {
      const { getByTestId } = render(<MoreScreen />);

      const languageItem = getByTestId('settings-language');
      fireEvent.press(languageItem);

      // Get the alert call and execute the "English" option
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const englishButton = buttons.find((b: any) => b.text === 'English');
      englishButton.onPress();

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'app/setLanguage', payload: 'en' });
    });
  });

  describe('Notifications Toggle', () => {
    it('displays notifications switch with correct state (enabled)', () => {
      const { getByTestId } = render(<MoreScreen />);
      const notificationsSwitch = getByTestId('settings-notifications-switch');
      expect(notificationsSwitch.props.value).toBe(true);
    });

    it('displays notifications switch with correct state (disabled)', () => {
      mockSelector.mockImplementation((selector) => {
        const state = {
          app: { theme: 'light', language: 'fr', notificationsEnabled: false },
          auth: { user: { subscriptionTier: 'FREE' } },
        };
        return selector(state);
      });

      const { getByTestId } = render(<MoreScreen />);
      const notificationsSwitch = getByTestId('settings-notifications-switch');
      expect(notificationsSwitch.props.value).toBe(false);
    });

    it('dispatches toggleNotifications when switch is toggled', () => {
      const { getByTestId } = render(<MoreScreen />);

      const notificationsSwitch = getByTestId('settings-notifications-switch');
      fireEvent(notificationsSwitch, 'valueChange', false);

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'app/toggleNotifications' });
    });
  });

  describe('Navigation', () => {
    it('navigates to Profile when profile setting is pressed', () => {
      const { getByTestId } = render(<MoreScreen />);

      const profileItem = getByTestId('settings-profile');
      fireEvent.press(profileItem);

      expect(mockNavigate).toHaveBeenCalledWith('Profile');
    });
  });

  describe('Logout', () => {
    it('shows confirmation alert when logout button is pressed', () => {
      const { getByTestId } = render(<MoreScreen />);

      const logoutButton = getByTestId('settings-logout');
      fireEvent.press(logoutButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Déconnexion',
        'Êtes-vous sûr de vouloir vous déconnecter ?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Annuler' }),
          expect.objectContaining({ text: 'Déconnexion' }),
        ])
      );
    });

    it('dispatches logout action when confirmed', () => {
      const { getByTestId } = render(<MoreScreen />);

      const logoutButton = getByTestId('settings-logout');
      fireEvent.press(logoutButton);

      // Get the alert call and execute the "Déconnexion" option
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const confirmButton = buttons.find((b: any) => b.text === 'Déconnexion');
      confirmButton.onPress();

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
    });

    it('does not dispatch logout when cancelled', () => {
      const { getByTestId } = render(<MoreScreen />);

      mockDispatch.mockClear();

      const logoutButton = getByTestId('settings-logout');
      fireEvent.press(logoutButton);

      // Get the alert call and execute the "Annuler" option
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const cancelButton = buttons.find((b: any) => b.text === 'Annuler');

      // Cancel button should not have an onPress (only style: 'cancel')
      expect(cancelButton.onPress).toBeUndefined();
    });
  });
});
