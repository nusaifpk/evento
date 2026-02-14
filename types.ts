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
