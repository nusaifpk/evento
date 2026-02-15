import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Calendar, MapPin, DollarSign } from 'lucide-react';
import type { ApiEvent } from '../../types/event.types';

const API_BASE_URL = '/api';

export const ApprovedEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/admin/events`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const result = await response.json();
      setEvents(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleting) return;
    
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      setDeleting(id);
      const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove from list instantly
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to delete event');
      console.error('Error deleting event:', err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Approved Events</h1>
        <p className="text-gray-400">Manage all approved events</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No approved events</p>
          <button
            onClick={() => navigate('/admin/create')}
            className="mt-4 px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold"
          >
            Create First Event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-[#1f001f] border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-6">
                <img
                  src={event.images[0] || 'https://via.placeholder.com/200'}
                  alt={event.title}
                  className="w-32 h-32 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{event.category}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} />
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={16} />
                      <span>{event.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <DollarSign size={16} />
                      <span>₹{event.price === 0 ? 'Free' : event.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-xs">Organizer: {event.organizerName}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/admin/edit/${event._id}`)}
                      className="px-6 py-2.5 bg-white/5 hover:bg-primary/20 text-primary font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                      <Edit size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      disabled={deleting === event._id}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      {deleting === event._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


