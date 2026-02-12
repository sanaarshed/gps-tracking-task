import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  AppState,
  Alert,
  Linking,
} from 'react-native';
import MapView, {
  Polyline,
  Marker,
  Region,
  AnimatedRegion,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistanceInMeters } from '../utils/haversine';

type Coordinate = {
  latitude: number;
  longitude: number;
};

const GPSTrackingScreen = () => {
  const [tracking, setTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null,
  );
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const watchId = useRef<number | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const markerCoordinate = useRef<AnimatedRegion | null>(null);
  const appState = useRef(AppState.currentState);
  const userInteracting = useRef(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  // start tracking location
  const startTracking = useCallback(async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      handlePermissionDenied();
      setError('Location permission denied.');
      return;
    }

    setError(null);
    setTracking(true);

    watchId.current = Geolocation?.watchPosition(
      position => {
        const { latitude, longitude } = position?.coords || {};
        const newCoordinate = { latitude, longitude };

        setCurrentLocation(newCoordinate);

        // smoothly animate marker to a new position
        if (
          !markerCoordinate.current &&
          typeof latitude === 'number' &&
          typeof longitude === 'number'
        ) {
          markerCoordinate.current = new AnimatedRegion({
            latitude,
            longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          });
        }

        setRouteCoordinates(prev => {
          if (prev.length === 0) return [newCoordinate];
          const lastCoordinate = prev[prev.length - 1];
          const distance = getDistanceInMeters(lastCoordinate, newCoordinate);
          if (distance < 1) return prev;
          return [...prev, newCoordinate];
        });

        // animate marker smoothly and optionally move camera (if not interacting)
        try {
          if (markerCoordinate.current) {
            markerCoordinate.current
              .timing({ latitude, longitude, duration: 800 })
              .start();
          }
        } catch {}

        if (!userInteracting.current) {
          try {
            mapRef?.current?.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          } catch {}
        }
      },
      err => {
        if (err && (err as any).code === 2)
          setError('Location services disabled.');
        else setError(err.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 4000,
        fastestInterval: 3000,
      },
    );
  }, []);

  const handlePermissionDenied = () => {
    Alert.alert('Allow Location', 'Open Settings to allow location services', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  };
  const openLocationEnabler = () => {
    Alert.alert(
      'Enable Location',
      'Open Settings to enable location services',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ],
    );
  };

  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      Geolocation?.clearWatch(watchId.current as number);
      watchId.current = null;
    }
    setTracking(false);
  }, []);

  const resetRoute = () => setRouteCoordinates([]);

  useEffect(() => {
    const subscription = AppState?.addEventListener('change', nextState => {
      if (appState?.current.match(/active/) && nextState.match(/background/))
        stopTracking();
      appState.current = nextState;
    });

    return () => {
      subscription.remove();
      stopTracking();
    };
  }, [stopTracking]);

  useEffect(() => {
    Geolocation?.getCurrentPosition(
      position => {
        const { latitude, longitude } = position?.coords || {};
        setCurrentLocation({ latitude, longitude });
        //animation
        if (
          !markerCoordinate.current &&
          typeof latitude === 'number' &&
          typeof longitude === 'number'
        ) {
          markerCoordinate.current = new AnimatedRegion({
            latitude,
            longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          });
        }
      },
      err => {
        if (err && (err as any)?.code === 2) openLocationEnabler();
        else setError(err.message);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  const initialRegion: Region = {
    latitude: currentLocation?.latitude || 37.78825,
    longitude: currentLocation?.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        onMapReady={() => {
          console.log('MapView onMapReady');
        }}
        onMapLoaded={() => {
          console.log('MapView onMapLoaded');
        }}
        onPanDrag={() => {
          userInteracting.current = true;
        }}
        onRegionChangeComplete={() => {
          userInteracting.current = false;
        }}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
      >
        {markerCoordinate.current ? (
          <Marker.Animated coordinate={markerCoordinate.current as any} />
        ) : (
          currentLocation && <Marker coordinate={currentLocation} />
        )}

        {routeCoordinates?.length > 10 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="#a7f000"
          />
        )}
      </MapView>

      <View style={styles.controls}>
        <Button
          title="Start Tracking"
          onPress={startTracking}
          disabled={tracking}
        />
        <Button
          title="Stop Tracking"
          onPress={stopTracking}
          disabled={!tracking}
        />
        <Button title="Reset Route" onPress={resetRoute} />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default GPSTrackingScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controls: {
    padding: 10,
    backgroundColor: '#fff',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#fee',
  },
  errorText: {
    color: 'red',
  },
});
