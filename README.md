# 🥾 WalkLoop – Find New Walking Routes Every Day

**WalkLoop** is a mobile app that generates walking loops based on your current location and desired duration. Perfect for people who want a 30-minute (or customizable) walk but are tired of the same old route. Start and end at the same spot, explore different paths every day.

---

## 🚀 Features

- 🔍 **Location Input**: Use GPS or enter a custom address
- ⏱️ **Duration-Based Routes**: Choose your walk time (e.g. 30 minutes)
- ♻️ **Looped Paths**: Always start and end at the same location
- 🔄 **Route Variety**: Get different route options each time
- 🗺️ **Map View**: Visualize and follow the route using an interactive map

---

## 📐 How It Works

1. **Estimate Distance**: Based on average walking speed (default: 5 km/h), we estimate the loop distance.
   - Example: 30 mins = 2.5 km
2. **Generate Waypoints**: We generate candidate routes by choosing waypoints in different directions (e.g., north, northeast, east).
3. **Build the Loop**: Using OpenRouteService, we create a full path that starts and ends at the original location.
4. **Select & Walk**: The app shows multiple options. Pick one and go!

---

## 🧰 Tech Stack

### Frontend
- **React Native** (Expo)
- **React Navigation** for screen transitions
- **MapView** (via `react-native-maps` or similar)

### Backend / Services
- **OpenRouteService API** – for route calculation
- **OpenStreetMap** – for map data
- (Optional) **Google Maps SDK** – for geocoding or UI polish

---
