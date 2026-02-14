import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Navigation, Star, ArrowRight, MapPin, MapPinOff } from 'lucide-react';
import {
  getNearbyEvents,
  formatDate,
  formatTime,
  formatPrice,
  calculateDistance,
  type ApiEvent,
} from '../services/api';

// Default location (Bangalore) - can be replaced with user's actual location
const DEFAULT_LAT = 12.9716;
const DEFAULT_LNG = 77.5946;

export const HomeScreen = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocation, setUseLocation] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });
  const [currentLocationName, setCurrentLocationName] = useState<string>('Default Location');

  useEffect(() => {
    // Try to get user's location only if location is enabled
    if (useLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setCurrentLocationName('Your Location');
        },
        () => {
          // Use default location if geolocation fails
          console.log('Geolocation failed, using default location');
          setUseLocation(false);
          setUserLocation({
            lat: DEFAULT_LAT,
            lng: DEFAULT_LNG,
          });
          setCurrentLocationName('Bangalore (Default)');
        }
      );
    } else {
      // Use default location when location is disabled
      setUserLocation({
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
      });
      setCurrentLocationName('Bangalore (Default)');
    }
  }, [useLocation]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNearbyEvents(userLocation.lat, userLocation.lng);
        setEvents(data);
      } catch (err) {
        setError('Failed to load events. Please try again.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userLocation.lat, userLocation.lng]);

  // Transform events for display
  const featuredEvents = events.slice(0, 2);
  const happeningEvents = events.slice(2, 4);
  const trendingEvents = events.slice(4, 6);

  const isEventLive = (event: ApiEvent): boolean => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return now >= start && now <= end;
  };

  const isEventEnding = (event: ApiEvent): boolean => {
    const now = new Date();
    const end = new Date(event.endDate);
    const hoursUntilEnd = (end.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilEnd > 0 && hoursUntilEnd <= 2;
  };

  if (loading) {
    return (
      <div className="bg-background-dark text-white font-display min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isApiConfigError = error.includes('VITE_API_URL') || error.includes('Backend API not configured');
    
    return (
      <div className="bg-background-dark text-white font-display min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-red-400">Connection Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            {isApiConfigError && (
              <div className="bg-surface-dark border border-primary/20 rounded-xl p-4 mb-4 text-left">
                <p className="text-sm text-gray-400 mb-2">
                  <strong className="text-primary">To fix this:</strong>
                </p>
                <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Deploy your backend (Express server) to Railway, Render, or similar</li>
                  <li>In Netlify dashboard, go to Site settings → Environment variables</li>
                  <li>Add <code className="bg-black/30 px-1 rounded">VITE_API_URL</code> with your backend URL</li>
                  <li>Redeploy your site</li>
                </ol>
              </div>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const toggleLocation = () => {
    setUseLocation(!useLocation);
    setLoading(true);
  };

  if (events.length === 0 && !loading) {
    return (
      <div className="bg-background-dark text-white font-display min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="mb-6">
            <MapPinOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No events found nearby</h2>
            <p className="text-gray-400 mb-1">
              We couldn't find any events within 20km of your location.
            </p>
            <p className="text-sm text-gray-500">
              Current location: {currentLocationName}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={toggleLocation}
              className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {useLocation ? (
                <>
                  <MapPinOff size={20} />
                  Switch to Default Location
                </>
              ) : (
                <>
                  <MapPin size={20} />
                  Use My Location
                </>
              )}
            </button>
            <button
              onClick={() => {
                setLoading(true);
                getNearbyEvents(userLocation.lat, userLocation.lng)
                  .then((data) => {
                    setEvents(data);
                    setError(null);
                  })
                  .catch((err) => {
                    setError('Failed to load events. Please try again.');
                    console.error('Error fetching events:', err);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
              className="px-6 py-3 bg-surface-dark hover:bg-white/5 rounded-xl text-white font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white font-display min-h-screen pb-24 relative overflow-y-auto">
        {/* Background Gradient Orb */}
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

        {/* Header */}
        <header className="px-6 pt-12 pb-4 flex justify-between items-center relative z-20">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-primary font-medium tracking-wide text-sm uppercase">
              Discovery
            </p>
            <button
              onClick={toggleLocation}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors group"
              title={useLocation ? 'Disable location' : 'Enable location'}
            >
              {useLocation ? (
                <MapPin className="w-4 h-4 text-primary" size={16} />
              ) : (
                <MapPinOff className="w-4 h-4 text-gray-400 group-hover:text-primary" size={16} />
              )}
            </button>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight">
            Events near<br />you today
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {currentLocationName}
          </p>
            </div>
        <div
          className="relative cursor-pointer"
          onClick={() => navigate('/profile')}
        >
            <div className="w-12 h-12 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
              alt="User"
              className="w-full h-full object-cover"
            />
            </div>
            <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background-dark"></span>
            </div>
        </header>

        {/* Hero Carousel */}
        <section className="mt-4 pl-6 relative z-10">
            <div className="flex overflow-x-auto no-scrollbar gap-5 pr-6 pb-8 snap-x snap-mandatory">
          {featuredEvents.map((event) => {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              event.location.coordinates[1],
              event.location.coordinates[0]
            );
            const isPopular = events.indexOf(event) < 3;

            return (
              <div
                key={event._id}
                onClick={() => navigate(`/event/${event._id}`)}
                className="min-w-[85%] h-[480px] snap-center relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl"
              >
                <img
                  src={event.images[0] || 'https://via.placeholder.com/400'}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
                        
                        <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 shadow-lg ${
                      isPopular ? 'bg-white/20' : 'bg-primary'
                    } backdrop-blur-md`}
                  >
                    {isPopular ? 'POPULAR' : 'SELLING FAST'}
                            </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 bg-[#221022]/65 backdrop-blur-xl border border-primary/10 rounded-2xl p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {event.title}
                      </h3>
                      <p className="text-white/70 text-sm">{event.category}</p>
                                </div>
                                <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
                      {formatPrice(event.price)}
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5 text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                                <Star size={12} /> 4.9
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <Clock className="text-primary text-sm" size={16} />
                    <span>{formatTime(event.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Navigation className="text-primary text-sm" size={16} />
                    <span>{distance.toFixed(1)} km away</span>
                            </div>
                        </div>
                    </div>
            );
          })}
            </div>
        </section>

        {/* Happening Now */}
        <section className="px-6 mb-8">
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold">Happening Now</h2>
          <button className="text-primary text-sm font-semibold hover:text-primary-dark transition-colors">
            See All
          </button>
            </div>
            <div className="grid gap-3">
          {happeningEvents.map((event) => {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              event.location.coordinates[1],
              event.location.coordinates[0]
            );
            const isLive = isEventLive(event);
            const isEnding = isEventEnding(event);

            return (
              <div
                key={event._id}
                className="bg-surface-dark border border-white/5 p-3 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                        <div className="relative w-16 h-16 shrink-0">
                  <img
                    src={event.images[0] || 'https://via.placeholder.com/200'}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {isLive && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                            )}
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-surface-dark ${
                      isLive ? 'bg-red-500' : isEnding ? 'bg-yellow-400' : 'bg-gray-500'
                    }`}
                  ></div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                    <h4 className="font-bold text-base leading-tight">
                      {event.title}
                    </h4>
                    {(isLive || isEnding) && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isLive
                            ? 'text-red-400 bg-red-500/10 border-red-500/20'
                            : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                        }`}
                      >
                        {isLive ? 'LIVE' : 'ENDING'}
                      </span>
                    )}
                            </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {event.address} • {distance.toFixed(1)}km
                  </p>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary">
                            <ArrowRight size={20} />
                        </button>
                    </div>
            );
          })}
            </div>
        </section>

        {/* Trending */}
        <section className="pl-6 pb-4">
            <h2 className="text-xl font-bold mb-4 pr-6">Trending this weekend</h2>
            <div className="flex overflow-x-auto no-scrollbar gap-4 pr-6 pb-4">
          {trendingEvents.map((event) => {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              event.location.coordinates[1],
              event.location.coordinates[0]
            );

            return (
              <div
                key={event._id}
                className="min-w-[260px] bg-surface-dark border border-white/5 rounded-2xl p-3 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                        <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3">
                  <img
                    src={event.images[0] || 'https://via.placeholder.com/500'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white">
                    {formatDate(event.startDate).toUpperCase()}
                            </div>
                        </div>
                <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{event.category}</p>
                        <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    {distance.toFixed(1)}km away
                            </div>
                  <span
                    className={`font-bold text-sm ${
                      event.price === 0 ? 'text-green-400' : 'text-primary'
                    }`}
                  >
                    {formatPrice(event.price)}
                  </span>
                        </div>
                    </div>
            );
          })}
            </div>
        </section>
    </div>
  );
};
