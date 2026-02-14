import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Heart,
  CalendarDays,
  MapPin,
  Ticket,
  ArrowRight,
} from 'lucide-react';
import {
  getEventById,
  formatDate,
  formatTime,
  formatPrice,
  type ApiEvent,
} from '../services/api';

export const EventDetailsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError('Event ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        setError('Failed to load event. Please try again.');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background-dark text-white font-display min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-background-dark text-white font-display min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-red-400 mb-4">{error || 'Event not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary rounded-lg text-white font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col relative">
      {/* Hero Image */}
      <div className="relative w-full h-[45vh] flex-shrink-0">
        <img
          src={event.images[0] || 'https://via.placeholder.com/1000'}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-background-dark"></div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 px-5 pt-12 pb-4 flex justify-between items-center z-20">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform hover:bg-white/10">
              <Share2 size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform hover:bg-white/10">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative -mt-16 px-5 pb-32 z-10 overflow-y-auto no-scrollbar">
        <div className="mb-6">
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              18+
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-[1.1] tracking-tight mb-2">
            {event.title}
          </h1>
          <div className="flex items-center text-gray-400 text-sm">
            <Ticket className="mr-1" size={16} />
            <span>Event Details</span>
          </div>
        </div>

        {/* Host */}
        <div className="flex items-center justify-between mb-8 p-1">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background-dark flex items-center justify-center">
                <span className="text-primary font-bold text-sm">
                  {event.organizerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background-dark rounded-full"></div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                Hosted by
              </p>
              <p className="text-sm font-bold text-white">{event.organizerName}</p>
            </div>
          </div>
          <button className="px-4 py-1.5 rounded-full bg-surface-dark border border-white/10 text-xs font-semibold text-white hover:bg-white/5 transition-colors">
            Follow
          </button>
        </div>

        {/* Details Grid */}
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center text-primary flex-shrink-0">
              <CalendarDays size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-0.5">
                {formatDate(event.startDate)}
              </h3>
              <p className="text-sm text-gray-400">
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </p>
              <p className="text-xs text-primary mt-1">Add to calendar</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center text-primary flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-0.5">{event.address}</h3>
              <p className="text-sm text-gray-400">{event.city}</p>
              <div className="mt-3 rounded-xl overflow-hidden h-24 relative border border-white/5 group cursor-pointer bg-neutral-900">
                <div className="absolute inset-0 bg-neutral-800 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                    Get Directions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-2">About Event</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
        </div>

        {event.images.length > 1 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Gallery</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {event.images.slice(1, 4).map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`Event ${i + 2}`}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-dark/90 backdrop-blur-xl border-t border-white/5 px-5 pt-4 pb-8 z-30">
        <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-background-dark to-transparent pointer-events-none"></div>
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-medium">
              Total Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">
                {formatPrice(event.price)}
              </span>
              <span className="text-xs text-gray-500">/ person</span>
            </div>
          </div>
          <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(244,37,244,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            Book Tickets
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
