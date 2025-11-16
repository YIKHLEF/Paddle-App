/**
 * Service de géolocalisation
 * Gestion de la localisation utilisateur et calculs de distance
 */

import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Linking, Alert } from 'react-native';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationWithAccuracy extends Location {
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export class GeolocationService {
  private static watchId: number | null = null;
  private static currentLocation: LocationWithAccuracy | null = null;

  /**
   * Demander la permission de localisation
   */
  static async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        // iOS: Demander la permission via Info.plist
        return new Promise((resolve) => {
          Geolocation.requestAuthorization(
            () => resolve(true),
            (error) => {
              console.error('iOS location permission denied:', error);
              resolve(false);
            }
          );
        });
      }

      // Android: Demander la permission runtime
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message: 'Paddle App a besoin d\'accéder à votre position pour trouver des terrains et joueurs près de vous.',
            buttonNeutral: 'Plus tard',
            buttonNegative: 'Refuser',
            buttonPositive: 'Autoriser',
          }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      return false;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  /**
   * Vérifier si la permission est accordée
   */
  static async checkPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted;
      }

      // iOS: Vérifier via getCurrentPosition (catch l'erreur si refusé)
      return new Promise((resolve) => {
        Geolocation.getCurrentPosition(
          () => resolve(true),
          (error) => {
            console.log('iOS permission check:', error);
            resolve(error.code !== 1); // PERMISSION_DENIED = 1
          },
          { timeout: 1000 }
        );
      });
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Obtenir la position actuelle
   */
  static async getCurrentPosition(
    options?: {
      timeout?: number;
      maximumAge?: number;
      enableHighAccuracy?: boolean;
    }
  ): Promise<LocationWithAccuracy | null> {
    try {
      // Vérifier la permission
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        const granted = await this.requestPermission();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            const location: LocationWithAccuracy = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
              timestamp: position.timestamp,
            };

            this.currentLocation = location;
            resolve(location);
          },
          (error) => {
            console.error('Error getting current position:', error);
            reject(error);
          },
          {
            enableHighAccuracy: options?.enableHighAccuracy ?? true,
            timeout: options?.timeout ?? 15000,
            maximumAge: options?.maximumAge ?? 10000,
          }
        );
      });
    } catch (error) {
      console.error('Error in getCurrentPosition:', error);
      return null;
    }
  }

  /**
   * Obtenir la dernière position connue
   */
  static getLastKnownPosition(): LocationWithAccuracy | null {
    return this.currentLocation;
  }

  /**
   * Surveiller la position en continu
   */
  static watchPosition(
    onSuccess: (location: LocationWithAccuracy) => void,
    onError?: (error: any) => void,
    options?: {
      enableHighAccuracy?: boolean;
      distanceFilter?: number;
      interval?: number;
    }
  ): number {
    // Arrêter le watch précédent s'il existe
    if (this.watchId !== null) {
      this.clearWatch();
    }

    this.watchId = Geolocation.watchPosition(
      (position) => {
        const location: LocationWithAccuracy = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        };

        this.currentLocation = location;
        onSuccess(location);
      },
      (error) => {
        console.error('Error watching position:', error);
        if (onError) {
          onError(error);
        }
      },
      {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        distanceFilter: options?.distanceFilter ?? 10, // mètres
        interval: options?.interval ?? 5000, // millisecondes (Android)
        fastestInterval: 2000, // Android
      }
    );

    return this.watchId;
  }

  /**
   * Arrêter la surveillance de position
   */
  static clearWatch(watchId?: number): void {
    const id = watchId ?? this.watchId;
    if (id !== null) {
      Geolocation.clearWatch(id);
      if (id === this.watchId) {
        this.watchId = null;
      }
    }
  }

  /**
   * Calculer la distance entre deux points (formule de Haversine)
   * @returns Distance en kilomètres
   */
  static calculateDistance(
    point1: Location,
    point2: Location
  ): number {
    const R = 6371; // Rayon de la Terre en km

    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);

    const lat1 = this.toRadians(point1.latitude);
    const lat2 = this.toRadians(point2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance en km
  }

  /**
   * Formater la distance pour l'affichage
   */
  static formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
  }

  /**
   * Vérifier si un point est dans un rayon donné
   */
  static isWithinRadius(
    center: Location,
    point: Location,
    radiusKm: number
  ): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radiusKm;
  }

  /**
   * Trier des lieux par distance
   */
  static sortByDistance<T extends { latitude: number; longitude: number }>(
    userLocation: Location,
    items: T[]
  ): T[] {
    return items.sort((a, b) => {
      const distanceA = this.calculateDistance(userLocation, {
        latitude: a.latitude,
        longitude: b.longitude,
      });
      const distanceB = this.calculateDistance(userLocation, {
        latitude: b.latitude,
        longitude: b.longitude,
      });
      return distanceA - distanceB;
    });
  }

  /**
   * Filtrer les lieux dans un rayon
   */
  static filterByRadius<T extends { latitude: number; longitude: number }>(
    userLocation: Location,
    items: T[],
    radiusKm: number
  ): T[] {
    return items.filter((item) =>
      this.isWithinRadius(
        userLocation,
        { latitude: item.latitude, longitude: item.longitude },
        radiusKm
      )
    );
  }

  /**
   * Obtenir le centre géographique d'un groupe de points
   */
  static getCenterPoint(locations: Location[]): Location {
    if (locations.length === 0) {
      return { latitude: 0, longitude: 0 };
    }

    const sum = locations.reduce(
      (acc, loc) => ({
        latitude: acc.latitude + loc.latitude,
        longitude: acc.longitude + loc.longitude,
      }),
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: sum.latitude / locations.length,
      longitude: sum.longitude / locations.length,
    };
  }

  /**
   * Calculer la région visible pour afficher tous les points sur une carte
   */
  static getRegionForCoordinates(
    locations: Location[],
    padding: number = 0.1
  ): {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } {
    if (locations.length === 0) {
      return {
        latitude: 48.8566, // Paris par défaut
        longitude: 2.3522,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    if (locations.length === 1) {
      return {
        latitude: locations[0].latitude,
        longitude: locations[0].longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    const lats = locations.map((loc) => loc.latitude);
    const lngs = locations.map((loc) => loc.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latitudeDelta = (maxLat - minLat) * (1 + padding);
    const longitudeDelta = (maxLng - minLng) * (1 + padding);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latitudeDelta, 0.01),
      longitudeDelta: Math.max(longitudeDelta, 0.01),
    };
  }

  /**
   * Ouvrir les paramètres de localisation
   */
  static async openLocationSettings(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Error opening settings:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'ouvrir les paramètres. Veuillez les ouvrir manuellement.'
      );
    }
  }

  /**
   * Convertir degrés en radians
   */
  private static toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Convertir radians en degrés
   */
  private static toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  /**
   * Géocoder une adresse (nécessite un service externe comme Google Maps API)
   * Placeholder pour l'implémentation future
   */
  static async geocodeAddress(address: string): Promise<Location | null> {
    // TODO: Implémenter avec Google Maps Geocoding API
    console.warn('Geocoding not implemented yet');
    return null;
  }

  /**
   * Géocoder inversé (coordonnées vers adresse)
   * Placeholder pour l'implémentation future
   */
  static async reverseGeocode(location: Location): Promise<string | null> {
    // TODO: Implémenter avec Google Maps Reverse Geocoding API
    console.warn('Reverse geocoding not implemented yet');
    return null;
  }
}
