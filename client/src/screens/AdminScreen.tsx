import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, ArrowLeft, Calendar, MapPin, DollarSign } from 'lucide-react';
import type { ApiEvent } from '../types/event.types';

const API_BASE_URL = '/api';

export const AdminScreen = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/admin/events`);
      
      // Check if response is HTML (means Express middleware didn't catch it)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Server returned HTML instead of JSON. Please restart the dev server to load admin routes.');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      setEvents(result.data || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load events';
      setError(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete event');
      
      // Remove from list
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-dark text-white font-display min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white font-display min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Manage Events</p>
        </div>
        <button
          onClick={() => navigate('/admin/create')}
          className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          New Event
        </button>
      </header>

      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Events List */}
      <div className="px-6 space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No events found</p>
            <button
              onClick={() => navigate('/admin/create')}
              className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold"
            >
              Create First Event
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-surface-dark border border-white/5 rounded-2xl p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-4">
                <img
                  src={event.images[0] || 'https://via.placeholder.com/150'}
                  alt={event.title}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{event.category}</p>
                  
                  <div className="space-y-1 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{event.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} />
                      <span>₹{event.price === 0 ? 'Free' : event.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/admin/edit/${event._id}`)}
                    className="p-2 bg-white/5 hover:bg-primary/20 rounded-lg transition-colors"
                    title="Edit Event"
                  >
                    <Edit size={18} className="text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

