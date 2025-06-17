// src/services/routingService.ts
import { createRouteVariations } from '../utils/geoUtils';

import { OPENROUTE_API_KEY } from '@env';

const API_KEY = OPENROUTE_API_KEY;
const WALKING_SPEED_KMH = 5; // Average walking speed

export interface RouteInfo {
  geometry: {
    coordinates: number[][];
  };
  properties: {
    summary: {
      distance: number; // in meters
      duration: number; // in seconds
    };
  };
}

export async function getMultipleLoopRoutes(
  start: [number, number], // [lon, lat]
  durationMinutes: number
): Promise<RouteInfo[]> {
  const targetDistanceKm = (durationMinutes / 60) * WALKING_SPEED_KMH;
  const routeVariations = createRouteVariations(start[1], start[0], targetDistanceKm);
  
  const routes: RouteInfo[] = [];
  
  // Generate multiple route options
  for (const coordinates of routeVariations) {
    try {
      const route = await getRoute(coordinates);
      if (route) {
        routes.push(route);
      }
    } catch (error) {
      console.warn('Failed to generate route:', error);
    }
  }
  
  // If no routes generated, try a simple loop
  if (routes.length === 0) {
    const fallbackRoute = await getSimpleLoop(start, targetDistanceKm);
    if (fallbackRoute) {
      routes.push(fallbackRoute);
    }
  }
  
  return routes;
}

async function getRoute(coordinates: number[][]): Promise<RouteInfo | null> {
  try {
    const response = await fetch('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates,
        options: {
          avoid_features: ['highways'],
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0];
    }
    
    return null;
  } catch (error) {
    console.error('Route request failed:', error);
    return null;
  }
}

async function getSimpleLoop(
  start: [number, number],
  targetDistanceKm: number
): Promise<RouteInfo | null> {
  // Create a simple rectangular loop as fallback
  const offsetLat = (targetDistanceKm / 4) / 111; // Convert km to degrees (rough)
  const offsetLon = (targetDistanceKm / 4) / (111 * Math.cos(start[1] * Math.PI / 180));

  const coordinates = [
    start,
    [start[0] + offsetLon, start[1]],
    [start[0] + offsetLon, start[1] + offsetLat],
    [start[0], start[1] + offsetLat],
    start
  ];

  return await getRoute(coordinates);
}

export async function getLoopRoute(
  start: [number, number],
  distanceKm: number
): Promise<any[]> {
  const routes = await getMultipleLoopRoutes(start, (distanceKm / WALKING_SPEED_KMH) * 60);
  return routes;
}