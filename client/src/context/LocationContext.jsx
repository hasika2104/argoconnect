import React, { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const saved = localStorage.getItem('argo_user_location');
    return saved ? JSON.parse(saved) : {
      state: 'Andhra Pradesh',
      district: 'Guntur',
      city: 'Tenali',
      lat: 16.243,
      lng: 80.640,
      radiusKm: 50
    };
  });

  const [geoLocating, setGeoLocating] = useState(false);

  const updateLocation = (newLoc) => {
    const updated = { ...selectedLocation, ...newLoc };
    setSelectedLocation(updated);
    localStorage.setItem('argo_user_location', JSON.stringify(updated));
  };

  const detectCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setGeoLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateLocation({ lat, lng });
          setGeoLocating(false);
        },
        (error) => {
          console.warn('[LocationContext] Geolocation error:', error.message);
          setGeoLocating(false);
        }
      );
    }
  };

  return (
    <LocationContext.Provider value={{
      selectedLocation,
      updateLocation,
      detectCurrentLocation,
      geoLocating
    }}>
      {children}
    </LocationContext.Provider>
  );
};
