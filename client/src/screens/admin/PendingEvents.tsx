import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import type { ApiEvent } from '../../types/event.types';

const API_BASE_URL = '/api';

export const PendingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/admin/events/pending`);

      if (!response.ok) {
        throw new Error('Failed to fetch pending events');
      }

      const result = await response.json();
      setEvents(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending events');
      console.error('Error fetching pending events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (processing) return;
    
    try {
      setProcessing(id);
      const response = await fetch(`${API_BASE_URL}/admin/events/${id}/approve`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to approve event');
      }

      // Remove from list instantly
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to approve event');
      console.error('Error approving event:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    if (processing) return;
    
    if (!confirm('Are you sure you want to reject this event?')) return;

    try {
      setProcessing(id);
      const response = await fetch(`${API_BASE_URL}/admin/events/${id}/reject`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to reject event');
      }

      // Remove from list instantly
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to reject event');
      console.error('Error rejecting event:', err);
    } finally {
      setProcessing(null);
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
        <h1 className="text-4xl font-extrabold mb-2">Pending Events</h1>
        <p className="text-gray-400">Review and approve community-submitted events</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-20">
          <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No pending events</p>
          <p className="text-gray-500 text-sm mt-2">All events have been reviewed</p>
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
                  <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                  
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
                      onClick={() => handleApprove(event._id)}
                      disabled={processing === event._id}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      {processing === event._id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(event._id)}
                      disabled={processing === event._id}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      <X size={18} />
                      {processing === event._id ? 'Rejecting...' : 'Reject'}
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

