// src/screens/RoutesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import RouteMap from '../components/RouteMap';
import { getMultipleLoopRoutes, RouteInfo } from '../services/routingService';

interface RoutesScreenProps {
  route: {
    params: {
      start: {
        latitude: number;
        longitude: number;
      };
      duration: number;
    };
  };
  navigation: any;
}

export default function RoutesScreen({ route, navigation }: RoutesScreenProps) {
  const { start, duration } = route.params;
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const generatedRoutes = await getMultipleLoopRoutes(
        [start.longitude, start.latitude],
        duration
      );
      
      if (generatedRoutes.length === 0) {
        setError('No routes could be generated for this location and duration.');
      } else {
        setRoutes(generatedRoutes);
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to generate routes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    return `${minutes}min`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Generating walking routes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRoutes}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <RouteMap
          startLocation={start}
          routes={routes}
          selectedRouteIndex={selectedRoute}
          onRouteSelect={setSelectedRoute}
        />
      </View>

      {/* Route Options */}
      <View style={styles.routeOptionsContainer}>
        <Text style={styles.routeOptionsTitle}>Route Options</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {routes.map((route, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.routeOption,
                selectedRoute === index && styles.selectedRouteOption
              ]}
              onPress={() => setSelectedRoute(index)}
            >
              <Text style={[
                styles.routeOptionTitle,
                selectedRoute === index && styles.selectedRouteOptionText
              ]}>
                Route {index + 1}
              </Text>
              <Text style={[
                styles.routeOptionDistance,
                selectedRoute === index && styles.selectedRouteOptionText
              ]}>
                {formatDistance(route.properties.summary.distance)}
              </Text>
              <Text style={[
                styles.routeOptionDuration,
                selectedRoute === index && styles.selectedRouteOptionText
              ]}>
                {formatDuration(route.properties.summary.duration)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Start Walk Button */}
        <TouchableOpacity
          style={styles.startWalkButton}
          onPress={() => {
            // Here you could navigate to a walking tracking screen
            // or start turn-by-turn navigation
            console.log('Starting walk with route:', selectedRoute);
          }}
        >
          <Text style={styles.startWalkButtonText}>Start Walk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  routeOptionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  routeOptionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  routeOption: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedRouteOption: {
    backgroundColor: '#007AFF',
  },
  routeOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  routeOptionDistance: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  routeOptionDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selectedRouteOptionText: {
    color: 'white',
  },
  startWalkButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  startWalkButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});