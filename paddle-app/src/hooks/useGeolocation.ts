/**
 * Hook pour la géolocalisation
 * Simplifie l'utilisation du GeolocationService dans les composants
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GeolocationService,
  Location,
  LocationWithAccuracy,
} from '@/services/geolocation.service';
import { useAppDispatch } from '@/store/hooks';

export const useGeolocation = (options?: {
  watchPosition?: boolean;
  enableHighAccuracy?: boolean;
  distanceFilter?: number;
}) => {
  const [location, setLocation] = useState<LocationWithAccuracy | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);

  /**
   * Vérifier la permission au montage
   */
  useEffect(() => {
    checkPermission();
  }, []);

  /**
   * Surveiller la position si demandé
   */
  useEffect(() => {
    if (options?.watchPosition && hasPermission) {
      startWatchingPosition();
    }

    return () => {
      if (watchIdRef.current !== null) {
        GeolocationService.clearWatch(watchIdRef.current);
      }
    };
  }, [options?.watchPosition, hasPermission]);

  /**
   * Vérifier si la permission est accordée
   */
  const checkPermission = useCallback(async () => {
    try {
      const granted = await GeolocationService.checkPermission();
      setHasPermission(granted);
      return granted;
    } catch (err) {
      console.error('Error checking permission:', err);
      return false;
    }
  }, []);

  /**
   * Demander la permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const granted = await GeolocationService.requestPermission();
      setHasPermission(granted);

      if (!granted) {
        setError('Permission de localisation refusée');
      }

      return granted;
    } catch (err: any) {
      console.error('Error requesting permission:', err);
      setError(err.message || 'Erreur lors de la demande de permission');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtenir la position actuelle
   */
  const getCurrentPosition = useCallback(async (): Promise<LocationWithAccuracy | null> => {
    setLoading(true);
    setError(null);

    try {
      const position = await GeolocationService.getCurrentPosition({
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: 15000,
        maximumAge: 10000,
      });

      if (position) {
        setLocation(position);
      } else {
        setError('Impossible d\'obtenir la position');
      }

      return position;
    } catch (err: any) {
      console.error('Error getting current position:', err);

      // Messages d'erreur personnalisés
      if (err.code === 1) {
        setError('Permission de localisation refusée');
      } else if (err.code === 2) {
        setError('Position indisponible');
      } else if (err.code === 3) {
        setError('Délai d\'attente dépassé');
      } else {
        setError(err.message || 'Erreur de localisation');
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [options?.enableHighAccuracy]);

  /**
   * Commencer à surveiller la position
   */
  const startWatchingPosition = useCallback(() => {
    if (!hasPermission) {
      console.warn('No location permission');
      return;
    }

    watchIdRef.current = GeolocationService.watchPosition(
      (position) => {
        setLocation(position);
        setError(null);
      },
      (err) => {
        console.error('Watch position error:', err);
        setError('Erreur de suivi de position');
      },
      {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        distanceFilter: options?.distanceFilter ?? 10,
      }
    );
  }, [hasPermission, options?.enableHighAccuracy, options?.distanceFilter]);

  /**
   * Arrêter de surveiller la position
   */
  const stopWatchingPosition = useCallback(() => {
    if (watchIdRef.current !== null) {
      GeolocationService.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  /**
   * Calculer la distance entre la position actuelle et un point
   */
  const getDistanceTo = useCallback(
    (targetLocation: Location): number | null => {
      if (!location) return null;
      return GeolocationService.calculateDistance(location, targetLocation);
    },
    [location]
  );

  /**
   * Formater la distance pour l'affichage
   */
  const formatDistance = useCallback(
    (targetLocation: Location): string | null => {
      const distance = getDistanceTo(targetLocation);
      if (distance === null) return null;
      return GeolocationService.formatDistance(distance);
    },
    [getDistanceTo]
  );

  /**
   * Vérifier si un point est dans un rayon
   */
  const isWithinRadius = useCallback(
    (targetLocation: Location, radiusKm: number): boolean => {
      if (!location) return false;
      return GeolocationService.isWithinRadius(location, targetLocation, radiusKm);
    },
    [location]
  );

  /**
   * Trier une liste de lieux par distance
   */
  const sortByDistance = useCallback(
    <T extends { latitude: number; longitude: number }>(items: T[]): T[] => {
      if (!location) return items;
      return GeolocationService.sortByDistance(location, items);
    },
    [location]
  );

  /**
   * Filtrer une liste de lieux dans un rayon
   */
  const filterByRadius = useCallback(
    <T extends { latitude: number; longitude: number }>(
      items: T[],
      radiusKm: number
    ): T[] => {
      if (!location) return items;
      return GeolocationService.filterByRadius(location, items, radiusKm);
    },
    [location]
  );

  /**
   * Ouvrir les paramètres de localisation
   */
  const openSettings = useCallback(async () => {
    await GeolocationService.openLocationSettings();
  }, []);

  /**
   * Rafraîchir la position
   */
  const refresh = useCallback(async () => {
    return await getCurrentPosition();
  }, [getCurrentPosition]);

  return {
    // État
    location,
    hasPermission,
    loading,
    error,
    isReady: hasPermission && location !== null,

    // Méthodes de permission
    checkPermission,
    requestPermission,
    openSettings,

    // Méthodes de position
    getCurrentPosition,
    refresh,
    startWatchingPosition,
    stopWatchingPosition,

    // Utilitaires de distance
    getDistanceTo,
    formatDistance,
    isWithinRadius,
    sortByDistance,
    filterByRadius,
  };
};
