// src/utils/geoUtils.ts

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Generate waypoints in different directions for route variety
 */
export function generateWaypoints(
  centerLat: number,
  centerLon: number,
  radiusKm: number,
  numWaypoints: number = 2
): Array<[number, number]> {
  const waypoints: Array<[number, number]> = [];
  
  // Convert km to approximate degrees (rough approximation)
  const latOffset = radiusKm / 111; // 1 degree lat ≈ 111 km
  const lonOffset = radiusKm / (111 * Math.cos(toRadians(centerLat))); // Adjust for latitude
  
  // Generate waypoints in different directions
  const directions = [
    { lat: latOffset, lon: 0 }, // North
    { lat: 0, lon: lonOffset }, // East
    { lat: -latOffset, lon: 0 }, // South
    { lat: 0, lon: -lonOffset }, // West
    { lat: latOffset * 0.7, lon: lonOffset * 0.7 }, // Northeast
    { lat: -latOffset * 0.7, lon: lonOffset * 0.7 }, // Southeast
    { lat: -latOffset * 0.7, lon: -lonOffset * 0.7 }, // Southwest
    { lat: latOffset * 0.7, lon: -lonOffset * 0.7 }, // Northwest
  ];
  
  for (let i = 0; i < Math.min(numWaypoints, directions.length); i++) {
    const direction = directions[i];
    waypoints.push([
      centerLon + direction.lon,
      centerLat + direction.lat
    ]);
  }
  
  return waypoints;
}

/**
 * Create multiple route variations with different waypoint patterns
 */
export function createRouteVariations(
  startLat: number,
  startLon: number,
  targetDistanceKm: number
): Array<Array<[number, number]>> {
  const routeVariations: Array<Array<[number, number]>> = [];
  const start: [number, number] = [startLon, startLat];
  
  // Route 1: Simple square loop
  const squareRadius = targetDistanceKm / 4;
  const squareWaypoints = generateWaypoints(startLat, startLon, squareRadius, 4);
  routeVariations.push([start, ...squareWaypoints.slice(0, 4), start]);
  
  // Route 2: Triangle loop
  const triangleRadius = targetDistanceKm / 3;
  const triangleWaypoints = generateWaypoints(startLat, startLon, triangleRadius, 3);
  routeVariations.push([start, ...triangleWaypoints.slice(0, 3), start]);
  
  // Route 3: Figure-eight style
  const figure8Radius = targetDistanceKm / 6;
  const figure8Waypoints = generateWaypoints(startLat, startLon, figure8Radius, 6);
  routeVariations.push([start, ...figure8Waypoints, start]);
  
  return routeVariations;
}