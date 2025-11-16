/**
 * Composant MapView spécialisé pour l'affichage des terrains
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Region, LatLng } from 'react-native-maps';
import { MapView, MapMarker } from './MapView';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeolocationService } from '@/services/geolocation.service';

export interface Court {
  id: string;
  name: string;
  clubName: string;
  latitude: number;
  longitude: number;
  type: 'INDOOR' | 'OUTDOOR';
  surface: string;
  pricePerHour: number;
  courtsAvailable?: number;
  totalCourts?: number;
  rating?: number;
}

interface CourtMapViewProps {
  courts: Court[];
  onCourtPress?: (court: Court) => void;
  showRadius?: boolean;
  radiusKm?: number;
  autoFitMarkers?: boolean;
  style?: any;
}

export const CourtMapView: React.FC<CourtMapViewProps> = ({
  courts,
  onCourtPress,
  showRadius = false,
  radiusKm = 10,
  autoFitMarkers = true,
  style,
}) => {
  const { location } = useGeolocation({ watchPosition: false });
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  /**
   * Convertir les terrains en marqueurs
   */
  useEffect(() => {
    const mapMarkers: MapMarker[] = courts.map((court) => ({
      id: court.id,
      coordinate: {
        latitude: court.latitude,
        longitude: court.longitude,
      },
      title: court.name,
      description: `${court.clubName} - ${court.pricePerHour}€/h`,
      type: 'court',
      color: court.type === 'INDOOR' ? '#0066FF' : '#00D084',
    }));

    setMarkers(mapMarkers);
  }, [courts]);

  /**
   * Calculer la région initiale
   */
  useEffect(() => {
    if (autoFitMarkers && courts.length > 0) {
      const locations = courts.map((court) => ({
        latitude: court.latitude,
        longitude: court.longitude,
      }));

      const calculatedRegion = GeolocationService.getRegionForCoordinates(locations);
      setRegion(calculatedRegion);
    } else if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  }, [courts, location, autoFitMarkers]);

  /**
   * Gérer le clic sur un marqueur
   */
  const handleMarkerPress = useCallback(
    (marker: MapMarker) => {
      const court = courts.find((c) => c.id === marker.id);
      if (court && onCourtPress) {
        onCourtPress(court);
      }
    },
    [courts, onCourtPress]
  );

  return (
    <View style={[styles.container, style]}>
      <MapView
        initialRegion={region}
        markers={markers}
        onMarkerPress={handleMarkerPress}
        showUserLocation={true}
        showRadius={showRadius}
        radiusKm={radiusKm}
        radiusCenter={
          location
            ? { latitude: location.latitude, longitude: location.longitude }
            : undefined
        }
        style={styles.map}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
