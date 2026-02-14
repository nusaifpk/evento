export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    interests: string[];
    location: {
      lat: number;
      lng: number;
      city: string;
    };
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  interests: string[];
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  notifications: boolean;
}
