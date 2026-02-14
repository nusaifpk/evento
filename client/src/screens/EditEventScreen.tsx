import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';

const API_BASE_URL = '/api';

interface EventFormData {
  title: string;
  description: string;
  category: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  price: string;
  organizerName: string;
  images: string;
}

const CATEGORIES = [
  'Music',
  'Nightlife',
  'Tech',
  'Arts',
  'Food',
  'Sports',
  'Gaming',
  'Outdoors',
  'Workshop',
  'Cultural',
  'Other',
];

export const EditEventScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: 'Music',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    price: '0',
    organizerName: '',
    images: '',
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/admin/events/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      const result = await response.json();
      const event = result.data;

      // Parse dates
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      // Format dates and times
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'Music',
        address: event.address || '',
        city: event.city || '',
        latitude: event.location?.coordinates?.[1]?.toString() || '',
        longitude: event.location?.coordinates?.[0]?.toString() || '',
        startDate: formatDate(startDate),
        startTime: formatTime(startDate),
        endDate: formatDate(endDate),
        endTime: formatTime(endDate),
        price: event.price?.toString() || '0',
        organizerName: event.organizerName || '',
        images: event.images?.join(', ') || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load event');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.address || !formData.city) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.latitude || !formData.longitude) {
        throw new Error('Please provide latitude and longitude');
      }

      if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
        throw new Error('Please provide start and end date/time');
      }

      // Parse dates
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('Invalid date/time format');
      }

      if (endDateTime <= startDateTime) {
        throw new Error('End date/time must be after start date/time');
      }

      // Parse images (comma-separated URLs)
      const images = formData.images
        ? formData.images.split(',').map(url => url.trim()).filter(url => url)
        : [];
      
      if (images.length === 0) {
        images.push('https://via.placeholder.com/800x600');
      }

      // Prepare event data
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        address: formData.address,
        city: formData.city,
        location: {
          type: 'Point' as const,
          coordinates: [
            parseFloat(formData.longitude),
            parseFloat(formData.latitude),
          ],
        },
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        price: parseFloat(formData.price) || 0,
        organizerName: formData.organizerName.trim() || 'Event Organizer',
        images: images,
      };

      const response = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update event' }));
        throw new Error(errorData.error || 'Failed to update event');
      }

      const result = await response.json();
      
      // Navigate back to admin screen
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
      console.error('Error updating event:', err);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="bg-background-dark text-white font-display min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold">Edit Event</h1>
          <p className="text-sm text-gray-400 mt-1">Update event details</p>
        </div>
      </header>

      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 space-y-6 pb-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Event Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            placeholder="Enter event title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
            placeholder="Describe your event..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              City <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="e.g., Bangalore"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="Full address"
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Latitude <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="e.g., 12.9716"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Longitude <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="e.g., 77.5946"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Start Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Start Time <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              End Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              End Time <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Price & Organizer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="0 for free"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Organizer Name
            </label>
            <input
              type="text"
              name="organizerName"
              value={formData.organizerName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              placeholder="Event Organizer"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Image URLs (comma-separated)
          </label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
          <p className="text-xs text-gray-400 mt-1">Leave empty to use default placeholder</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex-1 px-6 py-3 bg-surface-dark hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

