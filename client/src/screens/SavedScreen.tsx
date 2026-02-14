import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Bookmark } from 'lucide-react';
import { getNearbyEvents, type ApiEvent, formatDate, formatTime, formatPrice } from '../services/api';

export const SavedScreen = () => {
    const navigate = useNavigate();
    const [savedEvents, setSavedEvents] = useState<ApiEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSavedEvents = async () => {
            try {
                // For now, fetch nearby events and mark them as saved
                // In a real app, you'd have a dedicated API endpoint for saved events
                const events = await getNearbyEvents(12.9716, 77.5946); // Bangalore coordinates
                setSavedEvents(events.slice(0, 3)); // Show first 3 events as "saved"
                setLoading(false);
            } catch (err) {
                console.error('Error fetching saved events:', err);
                setError('Failed to load saved events');
                setLoading(false);
            }
        };

        fetchSavedEvents();
    }, []);

    return (
        <div className="bg-background-dark text-white font-display min-h-screen flex flex-col">
            <header className="px-6 pb-4 pt-12 flex justify-between items-end z-20 bg-background-dark/95 backdrop-blur-md sticky top-0">
                <div>
                    <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Your Collection</h2>
                    <h1 className="text-3xl font-extrabold tracking-tight">Saved Events</h1>
                </div>
                <button className="p-2 rounded-full bg-surface-dark/50 hover:bg-surface-dark transition-colors">
                    <Search className="text-white" size={20} />
                </button>
            </header>

            <div className="px-6 py-2 flex gap-3 overflow-x-auto no-scrollbar w-full mb-2">
                 <button className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold whitespace-nowrap shadow-[0_4px_14px_rgba(244,37,244,0.4)]">All Saved</button>
                 <button className="px-4 py-2 rounded-full bg-surface-dark text-neutral-400 text-xs font-bold whitespace-nowrap hover:text-white transition-colors">This Week</button>
            </div>

            <main className="flex-1 overflow-y-auto px-5 pb-32 pt-2 space-y-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : savedEvents.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No saved events yet</p>
                    </div>
                ) : (
                    savedEvents.map((event) => (
                        <div key={event._id} className="group relative bg-surface-dark/40 rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 cursor-pointer" onClick={() => navigate(`/event/${event._id}`)}>
                            <div className="h-48 w-full relative">
                                <img src={event.images[0] || 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=500&auto=format&fit=crop'} alt={event.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
                                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 text-center min-w-[3.5rem]">
                                    <span className="block text-xs font-bold text-primary uppercase">{formatDate(event.startDate).split(' ')[0]}</span>
                                    <span className="block text-lg font-extrabold text-white leading-none">{formatDate(event.startDate).split(' ')[1]}</span>
                                </div>
                            </div>
                            <div className="p-4 -mt-12 relative z-10">
                                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{event.title}</h3>
                                <div className="flex items-center text-neutral-400 text-sm mb-4">
                                    <MapPin className="mr-1 text-primary" size={16} />
                                    {event.address}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-neutral-400">Remind me</span>
                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                            <input type="checkbox" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-neutral-700 appearance-none cursor-pointer" />
                                            <label className="toggle-label block overflow-hidden h-5 rounded-full bg-neutral-700 cursor-pointer"></label>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">{formatPrice(event.price, event.city)}</div>
                                    <button className="p-2 text-primary"><Bookmark size={20} /></button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};