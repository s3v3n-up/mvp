// Location interface
export interface Location {
  lng: number;
  lat: number;
}

// Modes interface for all sport game modes
export interface Modes {
  value: string;
  name: string;
}

// Sports interface for all sports
export interface SportsOptions {
  value: string;
  name: string;
}

// Address interface for the geolocation, pointOfInterest is the nearest landmark
export interface Address {
  fullAddress: string;
  pointOfInterest: string;
  city: string;
  country: string;
}
