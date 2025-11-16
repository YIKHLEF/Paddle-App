/**
 * Service API pour l'authentification
 * Gère login, register, logout, refresh token, et reset password
 */

import axios from '../axios.config';

/**
 * Données de réponse après login/register
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl?: string | null;
    skillLevel: string;
    subscriptionTier: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Données pour le register
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | 'PRO';
}

/**
 * Données pour le login
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Données pour le refresh token
 */
export interface RefreshTokenData {
  refreshToken: string;
}

/**
 * Données pour forgot password
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Données pour reset password
 */
export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Connexion d'un utilisateur
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Déconnexion d'un utilisateur
   */
  async logout(): Promise<void> {
    await axios.post('/auth/logout');
  },

  /**
   * Refresh du token d'accès
   */
  async refreshToken(data: RefreshTokenData): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/refresh', data);
    return response.data;
  },

  /**
   * Demande de réinitialisation de mot de passe
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{
    message: string;
  }> {
    const response = await axios.post<{ message: string }>(
      '/auth/forgot-password',
      data
    );
    return response.data;
  },

  /**
   * Réinitialisation du mot de passe
   */
  async resetPassword(data: ResetPasswordData): Promise<{
    message: string;
  }> {
    const response = await axios.post<{ message: string }>(
      '/auth/reset-password',
      data
    );
    return response.data;
  },

  /**
   * Vérification de l'email
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      `/auth/verify-email/${token}`
    );
    return response.data;
  },

  /**
   * Renvoi de l'email de vérification
   */
  async resendVerificationEmail(): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      '/auth/resend-verification'
    );
    return response.data;
  },

  /**
   * Connexion avec Google
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const response = await axios.post<{ success: boolean; data: AuthResponse }>(
      '/oauth/google',
      { idToken }
    );
    return response.data.data;
  },

  /**
   * Connexion avec Apple
   */
  async loginWithApple(
    identityToken: string,
    user?: { firstName: string; lastName: string }
  ): Promise<AuthResponse> {
    const response = await axios.post<{ success: boolean; data: AuthResponse }>(
      '/oauth/apple',
      { identityToken, user }
    );
    return response.data.data;
  },

  /**
   * Connexion avec Facebook
   */
  async loginWithFacebook(accessToken: string): Promise<AuthResponse> {
    const response = await axios.post<{ success: boolean; data: AuthResponse }>(
      '/oauth/facebook',
      { accessToken }
    );
    return response.data.data;
  },
};
