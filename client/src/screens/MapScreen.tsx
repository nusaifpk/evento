import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Music, MapPin, LocateFixed, Monitor, Settings, Flame, Palette, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getAllEvents, type ApiEvent, formatPrice } from '../services/api';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icon creator for event images
const createEventIcon = (imageUrl: string, eventId: string) => {
  return L.divIcon({
    className: 'custom-event-marker',
    html: `
      <div class="event-marker-container">
        <div class="event-marker-pulse"></div>
        <div class="event-marker-image-wrapper">
          <img src="${imageUrl}" alt="Event" class="event-marker-image" />
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};

// Component to handle map view updates
const MapViewUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const MapScreen = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]); // Bangalore default
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events instead of nearby events
        const fetchedEvents = await getAllEvents();
        setEvents(fetchedEvents);
        
        if (fetchedEvents.length > 0) {
          setSelectedEvent(fetchedEvents[0]);
          // Set map center to first event location if available
          const firstEvent = fetchedEvents[0];
          if (firstEvent.location?.coordinates && firstEvent.location.coordinates.length === 2) {
            const [lng, lat] = firstEvent.location.coordinates;
            setMapCenter([lat, lng]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events for map:', err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get user location
  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  };

  return (
    <div className="bg-background-dark text-white font-display h-screen w-full relative overflow-hidden">
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        {!loading && (
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            zoomControl={false}
          >
            {/* Dark theme tile layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            <MapViewUpdater center={mapCenter} zoom={mapZoom} />
            
            {/* Event Markers */}
            {events.map((event) => {
              if (!event.location?.coordinates || event.location.coordinates.length !== 2) {
                return null;
              }
              
              const [lng, lat] = event.location.coordinates;
              const eventIcon = createEventIcon(
                event.images[0] || 'https://via.placeholder.com/400',
                event._id
              );
              
              return (
                <Marker
                  key={event._id}
                  position={[lat, lng]}
                  icon={eventIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedEvent(event);
                    },
                  }}
                >
                  <Popup>
                    <div className="text-black p-2">
                      <h3 className="font-bold text-sm mb-1">{event.title}</h3>
                      <p className="text-xs text-gray-600">{event.address}</p>
                      <p className="text-xs text-primary font-semibold mt-1">
                        {formatPrice(event.price, event.city)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* UI Layer */}
      <div className="relative z-20 w-full h-full flex flex-col pointer-events-none">
        {/* Top Search */}
        <div className="pt-14 px-4 pb-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-12 bg-surface-dark/60 backdrop-blur-lg border border-white/10 rounded-full flex items-center px-4 shadow-xl cursor-pointer" onClick={() => navigate('/search')}>
              <Search className="text-gray-400 mr-2" size={20} />
              <input className="bg-transparent border-none text-white placeholder-gray-400 text-sm w-full focus:ring-0 cursor-pointer" placeholder="Search events nearby..." type="text" readOnly />
              <button className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition">
                <Settings className="text-gray-400" size={16} />
              </button>
            </div>
            <button className="h-12 w-12 rounded-full bg-surface-dark/60 backdrop-blur-lg border border-white/10 flex items-center justify-center shadow-xl">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="User" className="w-8 h-8 rounded-full object-cover border border-white/20" />
            </button>
          </div>

          {/* Chips */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full shadow-[0_0_15px_rgba(244,37,244,0.4)] whitespace-nowrap text-sm font-semibold">
              <Flame size={16} />
              Trending
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark/60 backdrop-blur-md border border-white/10 text-gray-300 rounded-full whitespace-nowrap text-sm font-medium">
              <Music className="text-primary" size={16} />
              Music
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark/60 backdrop-blur-md border border-white/10 text-gray-300 rounded-full whitespace-nowrap text-sm font-medium">
              <Palette className="text-blue-400" size={16} />
              Art
            </button>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Bottom Floating Card */}
        <div className="px-4 pb-24 flex flex-col items-end gap-4 pointer-events-auto bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <button 
            onClick={handleLocateUser}
            className="h-12 w-12 rounded-full bg-surface-dark/80 backdrop-blur-xl border border-white/10 text-white shadow-lg flex items-center justify-center hover:bg-surface-dark transition-colors active:scale-90 pointer-events-auto"
          >
            <LocateFixed className="text-primary" size={20} />
          </button>

          {selectedEvent ? (
            <div 
              className="relative w-full bg-surface-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl flex gap-3 transition-transform duration-300 transform cursor-pointer pointer-events-auto" 
              onClick={() => navigate(`/event/${selectedEvent._id}`)}
            >
              <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 to-transparent rounded-2xl -z-10 blur-sm"></div>
              <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
                <img src={selectedEvent.images[0] || 'https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=400&auto=format&fit=crop'} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Live
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-1">{selectedEvent.title}</h3>
                    <div className="flex items-center gap-0.5 text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                      <Star size={12} /> 4.9
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <MapPin size={10} className="mr-1" />
                    {selectedEvent.address}
                  </p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div className="text-white font-bold text-base">
                    {formatPrice(selectedEvent.price, selectedEvent.city)} <span className="text-xs text-gray-500 font-normal">/ person</span>
                  </div>
                  <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow-[0_0_10px_rgba(244,37,244,0.3)]">
                    Get Tickets
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full bg-surface-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center pointer-events-auto">
              <p className="text-gray-400">No events found nearby</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles for Event Markers */}
      <style>{`
        .custom-event-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .event-marker-container {
          position: relative;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .event-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(244, 37, 244, 0.4);
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .event-marker-image-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid white;
          box-shadow: 0 0 15px rgba(244, 37, 244, 0.6), 0 0 30px rgba(244, 37, 244, 0.3);
          z-index: 1;
        }
        
        .event-marker-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
        
        .leaflet-container {
          background-color: #121212;
        }
        
        .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};
