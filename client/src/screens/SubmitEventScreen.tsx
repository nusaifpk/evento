import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MapPin } from 'lucide-react';
import { LocationPickerModal } from '../components/LocationPickerModal';

const API_BASE_URL = '/api';

interface EventFormData {
  title: string;
  description: string;
  category: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  price: string;
  imageUrl: string;
  organizerName: string;
  ticketLink: string;
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

export const SubmitEventScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: 'Music',
    address: '',
    city: '',
    latitude: null,
    longitude: null,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    price: '0',
    imageUrl: '',
    organizerName: '',
    ticketLink: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.address || !formData.city) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.latitude === null || formData.longitude === null) {
        throw new Error('Please select event location on map.');
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

      // Prepare event data
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        address: formData.address,
        city: formData.city,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        price: parseFloat(formData.price) || 0,
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/800x600',
        organizerName: formData.organizerName.trim() || 'Community Member',
        ticketLink: formData.ticketLink,
      };

      const response = await fetch(`${API_BASE_URL}/events/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to submit event' }));
        throw new Error(errorData.error || errorData.messages?.[0] || 'Failed to submit event');
      }

      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          category: 'Music',
          address: '',
          city: '',
          latitude: null,
          longitude: null,
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          price: '0',
          imageUrl: '',
          organizerName: '',
          ticketLink: '',
        });
        setSuccess(false);
        navigate('/home');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit event');
      console.error('Error submitting event:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-background-dark text-white font-display min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-primary" size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Event Submitted!</h2>
          <p className="text-gray-400 text-lg mb-6">
            Your event has been submitted for admin approval. You'll be redirected shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white font-display min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-10 border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold">Submit Event</h1>
          <p className="text-sm text-gray-400 mt-1">Share your event with the community</p>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            placeholder="e.g., Summer Music Festival"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all resize-none"
            placeholder="Tell us about your event..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold mb-2">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            placeholder="Street address"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            placeholder="e.g., Bangalore"
          />
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-semibold mb-2">Event Location *</label>
          <button
            type="button"
            onClick={() => setIsLocationPickerOpen(true)}
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white hover:border-[#f425f4]/50 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="text-[#f425f4]" size={20} />
            <span>Select Location on Map</span>
          </button>
          {formData.latitude !== null && formData.longitude !== null && (
            <div className="mt-3 p-3 bg-[#f425f4]/10 border border-[#f425f4]/20 rounded-xl">
              <p className="text-sm text-gray-300">
                Selected: <span className="text-[#f425f4] font-mono">Lat: {formData.latitude.toFixed(6)} | Lng: {formData.longitude.toFixed(6)}</span>
              </p>
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Start Time *</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">End Time *</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold mb-2">Price (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            placeholder="0 for free events"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold mb-2">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Organizer Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Organizer Name</label>
          <input
            type="text"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            placeholder="Your name or organization"
          />
        </div>

        {/* Ticket Link */}
        <div>
          <label className="block text-sm font-semibold mb-2">Ticket Link (Optional)</label>
          <input
            type="url"
            name="ticketLink"
            value={formData.ticketLink}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f425f4] focus:border-transparent transition-all"
            placeholder="https://tickets.example.com"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#f425f4] hover:bg-[#f425f4]/90 text-white font-bold rounded-xl shadow-lg shadow-[#f425f4]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Submitting...' : 'Submit Event'}
        </button>
      </form>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onConfirm={(lat, lng) => {
          setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
        }}
        initialLat={formData.latitude}
        initialLng={formData.longitude}
      />
    </div>
  );
};


