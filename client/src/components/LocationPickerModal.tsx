import React, { useState, useEffect } from 'react';
import { X, MapPin, Search, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lat: number, lng: number) => void;
  initialLat?: number | null;
  initialLng?: number | null;
}

// Component to track map center on move/zoom
const MapCenterTracker = ({ onCenterChange }: { onCenterChange: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onCenterChange(center.lat, center.lng);
    },
    zoomend: () => {
      const center = map.getCenter();
      onCenterChange(center.lat, center.lng);
    },
  });

  return null;
};

// Component to update map view when center changes
const MapViewUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Fixed center target icon component
const CenterTargetIcon = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-[#f425f4] bg-[#f425f4]/10 animate-pulse"></div>
        {/* Inner dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#f425f4] rounded-full shadow-lg shadow-[#f425f4]/50"></div>
        {/* Crosshair lines */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-[#f425f4]/30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-0.5 bg-[#f425f4]/30"></div>
      </div>
    </div>
  );
};

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialLat,
  initialLng,
}) => {
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default to India
  const [mapZoom, setMapZoom] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: number; lon: number }>>([]);

  // Get user's current location on mount
  useEffect(() => {
    if (isOpen) {
      if (initialLat !== null && initialLat !== undefined && initialLng !== null && initialLng !== undefined) {
        // Use provided initial coordinates
        const newCenter: [number, number] = [initialLat, initialLng];
        setMapCenter(newCenter);
        setSelectedLat(initialLat);
        setSelectedLng(initialLng);
        setMapZoom(13);
      } else {
        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const newCenter: [number, number] = [latitude, longitude];
              setMapCenter(newCenter);
              setSelectedLat(latitude);
              setSelectedLng(longitude);
              setMapZoom(13);
            },
            () => {
              // Geolocation failed, use default (India)
              const defaultCenter: [number, number] = [20.5937, 78.9629];
              setMapCenter(defaultCenter);
              setSelectedLat(defaultCenter[0]);
              setSelectedLng(defaultCenter[1]);
            }
          );
        } else {
          // Geolocation not available, use default
          const defaultCenter: [number, number] = [20.5937, 78.9629];
          setMapCenter(defaultCenter);
          setSelectedLat(defaultCenter[0]);
          setSelectedLng(defaultCenter[1]);
        }
      }
    } else {
      // Reset when modal closes
      setSelectedLat(null);
      setSelectedLng(null);
      setSearchQuery('');
      setSearchResults([]);
      setSearchError(null);
    }
  }, [isOpen, initialLat, initialLng]);

  const handleCenterChange = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchError('Please enter a location to search');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      // Use Nominatim (OpenStreetMap geocoding service) - free, no API key needed
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
        {
          headers: {
            'User-Agent': 'Evento App' // Required by Nominatim
          }
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (data.length === 0) {
        setSearchError('No locations found. Try a different search term.');
        return;
      }

      setSearchResults(data);

      // Auto-select first result and center map
      if (data.length > 0) {
        const firstResult = data[0];
        const lat = parseFloat(firstResult.lat);
        const lng = parseFloat(firstResult.lon);
        const newCenter: [number, number] = [lat, lng];
        setMapCenter(newCenter);
        setSelectedLat(lat);
        setSelectedLng(lng);
        setMapZoom(15);
      }
    } catch (err) {
      setSearchError('Failed to search location. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: { lat: string; lon: string; display_name: string }) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const newCenter: [number, number] = [lat, lng];
    setMapCenter(newCenter);
    setSelectedLat(lat);
    setSelectedLng(lng);
    setMapZoom(15);
    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  const handleConfirm = () => {
    if (selectedLat !== null && selectedLng !== null) {
      onConfirm(selectedLat, selectedLng);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background-dark rounded-2xl overflow-hidden w-full h-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl border border-white/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-surface-dark/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary" size={24} />
              <h2 className="text-xl font-bold text-white">Select Event Location</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchError(null);
                  setSearchResults([]);
                }}
                placeholder="Search for a location (e.g., Bangalore, India)"
                className="w-full pl-12 pr-12 py-3 bg-background-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {isSearching ? (
                  <Loader2 className="text-[#f425f4] animate-spin" size={20} />
                ) : (
                  <Search className="text-[#f425f4] hover:text-[#f425f4]/80" size={20} />
                )}
              </button>
            </div>
            
            {/* Search Error */}
            {searchError && (
              <p className="mt-2 text-sm text-red-400">{searchError}</p>
            )}
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-background-dark border border-white/10 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                  >
                    <p className="text-white text-sm font-medium">{result.display_name}</p>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapViewUpdater center={mapCenter} zoom={mapZoom} />
            <MapCenterTracker onCenterChange={handleCenterChange} />
          </MapContainer>
          <CenterTargetIcon />
        </div>

        {/* Footer with coordinates and confirm button */}
        <div className="px-6 py-4 border-t border-white/5 bg-surface-dark/50 flex items-center justify-between gap-4">
          <div className="flex-1">
            {selectedLat !== null && selectedLng !== null ? (
              <div className="text-sm">
                <p className="text-gray-400 mb-1">Selected Location:</p>
                <p className="text-white font-mono">
                  Lat: <span className="text-primary">{selectedLat.toFixed(6)}</span> |{' '}
                  Lng: <span className="text-primary">{selectedLng.toFixed(6)}</span>
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Move the map to select a location</p>
            )}
          </div>
          <button
            onClick={handleConfirm}
            disabled={selectedLat === null || selectedLng === null}
            className="px-6 py-3 bg-[#f425f4] hover:bg-[#f425f4]/90 text-white font-bold rounded-xl shadow-lg shadow-[#f425f4]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

