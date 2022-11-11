/**
 * api interface using to catch api error
 */
export interface APIErr {
  code: number,
  message: string,
  cause:string | Error
}

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

// Interface for full address and location values
export interface FullLocation {
  query: string[];
  features: [
    {
      geometry: {
        coordinates: string[];
      };
      context: [
        {
          text: string;
        },
        {},
        { text: string },
        {},
        {},
        { text: string }
      ];
      place_name: string;
    }
  ];
}

// Interface for geolocation
export interface Pos {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export interface GameModes {
  mode: {
	modeNames: string
  }
}
