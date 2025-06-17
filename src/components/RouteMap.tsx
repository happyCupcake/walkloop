// src/components/RouteMap.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';

interface RouteMapProps {
  startLocation: {
    latitude: number;
    longitude: number;
  };
  routes: any[];
  selectedRouteIndex?: number;
  onRouteSelect?: (index: number) => void;
}

export default function RouteMap({
  startLocation,
  routes,
  selectedRouteIndex,
  onRouteSelect
}: RouteMapProps) {
  const colors = ['#007AFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Start/End Marker */}
        <Marker
          coordinate={startLocation}
          title="Start/End Point"
          pinColor="green"
        />

        {/* Route Polylines */}
        {routes.map((route, index) => {
          if (!route?.geometry?.coordinates) return null;
          
          const isSelected = selectedRouteIndex === index;
          const color = colors[index % colors.length];
          
          return (
            <Polyline
              key={`route-${index}`}
              coordinates={route.geometry.coordinates.map(([lon, lat]: number[]) => ({
                latitude: lat,
                longitude: lon,
              }))}
              strokeColor={color}
              strokeWidth={isSelected ? 5 : 3}
              strokeOpacity={isSelected ? 1 : 0.7}
              onPress={() => onRouteSelect?.(index)}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});