export interface ApiEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  address: string;
  city: string;
  startDate: string;
  endDate: string;
  price: number;
  images: string[];
  organizerName: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  price?: string;
  date: string;
  time?: string;
  location: string;
  distance?: string;
  tags: string[];
  isPopular?: boolean;
  isLive?: boolean;
  isSellingFast?: boolean;
  attendees?: number;
}

export interface Interest {
  id: string;
  name: string;
  subtext: string;
  icon: string;
  color?: string;
}
