/**
 * Composant MapView avec react-native-maps
 * Affiche une carte interactive avec des marqueurs
 */

import React, { useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import RNMapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  Region,
  LatLng,
  MarkerPressEvent,
} from 'react-native-maps';
import { useTheme } from '@/hooks/useTheme';

export interface MapMarker {
  id: string;
  coordinate: LatLng;
  title: string;
  description?: string;
  type?: 'court' | 'player' | 'club' | 'match';
  icon?: any;
  color?: string;
}

interface MapViewProps {
  initialRegion?: Region;
  markers?: MapMarker[];
  onMarkerPress?: (marker: MapMarker) => void;
  onMapPress?: (coordinate: LatLng) => void;
  onRegionChange?: (region: Region) => void;
  showUserLocation?: boolean;
  showRadius?: boolean;
  radiusKm?: number;
  radiusCenter?: LatLng;
  followUserLocation?: boolean;
  style?: any;
}

export const MapView: React.FC<MapViewProps> = ({
  initialRegion,
  markers = [],
  onMarkerPress,
  onMapPress,
  onRegionChange,
  showUserLocation = true,
  showRadius = false,
  radiusKm = 5,
  radiusCenter,
  followUserLocation = false,
  style,
}) => {
  const theme = useTheme();
  const mapRef = useRef<RNMapView>(null);

  /**
   * Animer vers une région
   */
  const animateToRegion = useCallback((region: Region) => {
    mapRef.current?.animateToRegion(region, 500);
  }, []);

  /**
   * Animer vers une coordonnée
   */
  const animateToCoordinate = useCallback((coordinate: LatLng) => {
    mapRef.current?.animateCamera(
      {
        center: coordinate,
        zoom: 14,
      },
      { duration: 500 }
    );
  }, []);

  /**
   * Ajuster la vue pour afficher tous les marqueurs
   */
  const fitToMarkers = useCallback(() => {
    if (markers.length === 0) return;

    mapRef.current?.fitToCoordinates(
      markers.map((m) => m.coordinate),
      {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      }
    );
  }, [markers]);

  /**
   * Gérer le clic sur un marqueur
   */
  const handleMarkerPress = useCallback(
    (event: MarkerPressEvent, marker: MapMarker) => {
      event.stopPropagation();
      onMarkerPress?.(marker);
    },
    [onMarkerPress]
  );

  /**
   * Obtenir la couleur du marqueur selon le type
   */
  const getMarkerColor = (marker: MapMarker): string => {
    if (marker.color) return marker.color;

    switch (marker.type) {
      case 'court':
        return theme.colors.primary;
      case 'player':
        return theme.colors.secondary;
      case 'club':
        return theme.colors.accent;
      case 'match':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };

  /**
   * Obtenir l'icône du marqueur selon le type
   */
  const getMarkerIcon = (marker: MapMarker) => {
    if (marker.icon) return marker.icon;
    // Retourner l'icône par défaut ou personnalisée selon le type
    return undefined;
  };

  const defaultRegion: Region = initialRegion || {
    latitude: 48.8566, // Paris par défaut
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={[styles.container, style]}>
      <RNMapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={defaultRegion}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={true}
        followsUserLocation={followUserLocation}
        onPress={(event) => onMapPress?.(event.nativeEvent.coordinate)}
        onRegionChangeComplete={onRegionChange}
        loadingEnabled
        loadingIndicatorColor={theme.colors.primary}
        loadingBackgroundColor={theme.colors.background}
      >
        {/* Rayon de recherche */}
        {showRadius && radiusCenter && (
          <Circle
            center={radiusCenter}
            radius={radiusKm * 1000} // Convertir km en mètres
            strokeColor={`${theme.colors.primary}40`} // 25% opacité
            fillColor={`${theme.colors.primary}10`} // 6% opacité
            strokeWidth={2}
          />
        )}

        {/* Marqueurs */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={getMarkerColor(marker)}
            image={getMarkerIcon(marker)}
            onPress={(event) => handleMarkerPress(event, marker)}
          />
        ))}
      </RNMapView>
    </View>
  );
};

// Exposer les méthodes du ref pour usage externe
export type MapViewRef = {
  animateToRegion: (region: Region) => void;
  animateToCoordinate: (coordinate: LatLng) => void;
  fitToMarkers: () => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
