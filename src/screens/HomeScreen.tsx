// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { getUserLocation } from '../services/locationService';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);

  const validateDuration = (value: string): boolean => {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && num <= 180; // Max 3 hours
  };

  const handleGenerateRoutes = async () => {
    if (!validateDuration(duration)) {
      Alert.alert(
        'Invalid Duration',
        'Please enter a duration between 1 and 180 minutes.'
      );
      return;
    }

    try {
      setLoading(true);
      const location = await getUserLocation();
      
      navigation.navigate('Routes', {
        start: location,
        duration: parseInt(duration),
      });
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please make sure location services are enabled.'
      );
    } finally {
      setLoading(false);
    }
  };

  const presetDurations = [15, 30, 45, 60];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Walking Route Generator</Text>
        <Text style={styles.subtitle}>
          Generate loop routes that start and end at your current location
        </Text>

        <View style={styles.durationSection}>
          <Text style={styles.label}>Walk Duration (minutes)</Text>
          
          {/* Preset Duration Buttons */}
          <View style={styles.presetsContainer}>
            {presetDurations.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetButton,
                  duration === preset.toString() && styles.activePresetButton
                ]}
                onPress={() => setDuration(preset.toString())}
              >
                <Text style={[
                  styles.presetButtonText,
                  duration === preset.toString() && styles.activePresetButtonText
                ]}>
                  {preset}min
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Duration Input */}
          <TextInput
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="Enter custom duration"
            style={styles.textInput}
            maxLength={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.generateButton, loading && styles.disabledButton]}
          onPress={handleGenerateRoutes}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.generateButtonText}>
              Generate Walking Routes
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • We'll use your current location as the starting point{'\n'}
            • Multiple route options will be generated{'\n'}
            • All routes loop back to where you started{'\n'}
            • Routes are optimized for walking paths
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  durationSection: {
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  presetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    alignItems: 'center',
  },
  activePresetButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  presetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activePresetButtonText: {
    color: 'white',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  generateButton: {
    backgroundColor: '#34C759',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  infoSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});