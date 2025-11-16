/**
 * Hooks Redux typés
 * Utiliser ces hooks au lieu de useDispatch et useSelector standards
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hook useDispatch typé
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook useSelector typé
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hooks personnalisés pour accéder aux slices
 */

// Hook pour accéder à l'auth state
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

// Hook pour accéder à l'app state
export const useApp = () => {
  return useAppSelector((state) => state.app);
};

// Hook pour accéder à l'user state
export const useUser = () => {
  return useAppSelector((state) => state.user);
};

// Hook pour vérifier si l'utilisateur est authentifié
export const useIsAuthenticated = (): boolean => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

// Hook pour récupérer l'utilisateur courant
export const useCurrentUser = () => {
  return useAppSelector((state) => state.auth.user);
};

// Hook pour récupérer le token
export const useAccessToken = () => {
  return useAppSelector((state) => state.auth.accessToken);
};

// Hook pour les statistiques utilisateur
export const useUserStatistics = () => {
  return useAppSelector((state) => state.user.statistics);
};
