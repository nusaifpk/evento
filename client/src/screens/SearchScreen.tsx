import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, Music, Palette, ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { getAllEvents, type ApiEvent, formatPrice } from '../services/api';

const VIBES = [
  { id: 'music', name: 'Music', icon: Music, image: 'https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=400&auto=format&fit=crop' },
  { id: 'arts', name: 'Arts', icon: Palette, image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&auto=format&fit=crop' },
  { id: 'nightlife', name: 'Nightlife', icon: Music, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop' },
  { id: 'tech', name: 'Tech', icon: Music, image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500&auto=format&fit=crop' },
  { id: 'food', name: 'Food', icon: Music, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop' },
  { id: 'sports', name: 'Sports', icon: Music, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop' },
];

const DATE_OPTIONS = [
  { id: 'today', label: 'Today', days: 0 },
  { id: 'tomorrow', label: 'Tomorrow', days: 1 },
  { id: 'weekend', label: 'This Weekend', days: 2 },
  { id: 'week', label: 'This Week', days: 7 },
  { id: 'month', label: 'This Month', days: 30 },
];

export const SearchScreen = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('today');
    const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
    const [radius, setRadius] = useState(25);
    const [searchResults, setSearchResults] = useState<ApiEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [allEvents, setAllEvents] = useState<ApiEvent[]>([]);

    useEffect(() => {
        // Load all events on component mount
        const loadEvents = async () => {
            try {
                const events = await getAllEvents();
                setAllEvents(events);
            } catch (error) {
                console.error('Error loading events:', error);
            }
        };
        loadEvents();
    }, []);

    const toggleVibe = (vibeId: string) => {
        setSelectedVibes(prev => 
            prev.includes(vibeId) 
                ? prev.filter(id => id !== vibeId)
                : [...prev, vibeId]
        );
    };

    const filterEvents = () => {
        setLoading(true);
        setSearchPerformed(true);

        setTimeout(() => {
            let filtered = [...allEvents];

            // Filter by search query
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(event => 
                    event.title.toLowerCase().includes(query) ||
                    event.description.toLowerCase().includes(query) ||
                    event.address.toLowerCase().includes(query) ||
                    event.category.toLowerCase().includes(query) ||
                    event.organizerName.toLowerCase().includes(query)
                );
            }

            // Filter by date
            if (selectedDate !== 'all') {
                const dateOption = DATE_OPTIONS.find(d => d.id === selectedDate);
                if (dateOption) {
                    const now = new Date();
                    const targetDate = new Date(now.getTime() + (dateOption.days * 24 * 60 * 60 * 1000));
                    
                    filtered = filtered.filter(event => {
                        const eventDate = new Date(event.startDate);
                        if (selectedDate === 'weekend') {
                            // Filter for this weekend (Saturday & Sunday)
                            const dayOfWeek = eventDate.getDay();
                            const weekFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
                            return eventDate >= now && eventDate <= weekFromNow && (dayOfWeek === 6 || dayOfWeek === 0);
                        } else {
                            // Filter for specific day
                            return eventDate.toDateString() === targetDate.toDateString();
                        }
                    });
                }
            }

            // Filter by vibes/categories
            if (selectedVibes.length > 0) {
                filtered = filtered.filter(event => 
                    selectedVibes.includes(event.category.toLowerCase())
                );
            }

            // Note: Radius filtering would require user location and geospatial queries
            // For now, we'll skip radius filtering as it needs GPS coordinates

            setSearchResults(filtered);
            setLoading(false);
        }, 500); // Simulate API delay
    };

    const handleSearch = () => {
        filterEvents();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(date);
    };

    const getEventCount = () => {
        if (!searchPerformed) return allEvents.length;
        return searchResults.length;
    };

    return (
        <div className="bg-background-dark text-white font-display min-h-screen flex flex-col">
            {/* Header */}
            <div className="px-6 pt-12 pb-4 bg-background-dark/95 backdrop-blur-md z-50 sticky top-0 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <X className="text-gray-400" size={20} />
                    </button>
                </div>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="text-primary" size={20} />
                    </div>
                    <input 
                        className="block w-full pl-12 pr-4 py-3.5 border-none rounded-2xl bg-surface-dark text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 shadow-sm transition-all" 
                        placeholder="Artists, venues, or vibes..." 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Date */}
                <section className="mt-6 px-6">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-lg font-bold">When?</h2>
                        <button className="text-sm text-primary font-medium">Select dates</button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {DATE_OPTIONS.map((option) => (
                            <button 
                                key={option.id}
                                onClick={() => setSelectedDate(option.id)}
                                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-medium transition-all ${
                                    selectedDate === option.id 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25 border border-primary' 
                                        : 'bg-surface-dark border border-white/10 text-gray-300'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Vibe Grid */}
                <section className="mt-8 px-6">
                    <h2 className="text-lg font-bold mb-4">What's the vibe?</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {VIBES.map((vibe) => {
                            const isSelected = selectedVibes.includes(vibe.id);
                            return (
                                <button 
                                    key={vibe.id}
                                    onClick={() => toggleVibe(vibe.id)}
                                    className={`relative h-24 rounded-2xl overflow-hidden group transition-all ${
                                        isSelected 
                                            ? 'border-2 border-primary' 
                                            : 'border border-transparent dark:border-white/10 bg-surface-dark'
                                    }`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br z-10 ${
                                        isSelected ? 'from-primary/40 to-black/80' : 'from-black/20 to-black/80'
                                    }`}></div>
                                    <img src={vibe.image} className={`absolute inset-0 w-full h-full object-cover ${isSelected ? '' : 'opacity-60'}`} alt={vibe.name} />
                                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                                        <vibe.icon className={isSelected ? 'text-primary' : 'text-gray-300'} size={18} />
                                        <span className={`font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>{vibe.name}</span>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 z-10 bg-primary w-2 h-2 rounded-full shadow-[0_0_8px_#f425f4]"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Search Results */}
                {searchPerformed && (
                    <section className="mt-8 px-6">
                        <h2 className="text-lg font-bold mb-4">
                            {loading ? 'Searching...' : `Results (${getEventCount()})`}
                        </h2>
                        
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : getEventCount() === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Oops, not found any events</h3>
                                <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(searchPerformed ? searchResults : allEvents).map((event) => (
                                    <div 
                                        key={event._id}
                                        onClick={() => navigate(`/event/${event._id}`)}
                                        className="bg-surface-dark border border-white/10 rounded-2xl p-4 flex gap-4 cursor-pointer hover:border-primary/30 transition-all"
                                    >
                                        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                                            <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white mb-1 truncate">{event.title}</h3>
                                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{event.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {formatDate(event.startDate)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {event.city}
                                                </span>
                                                <span className="font-bold text-primary">
                                                    {formatPrice(event.price, event.city)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Radius */}
                <section className="mt-8 px-6">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">How far?</h2>
                    </div>
                    <div className="bg-surface-dark p-6 rounded-3xl border border-white/5 shadow-sm">
                        <div className="relative w-full h-8 flex items-center">
                            <input 
                                className="z-20 w-full" 
                                type="range" 
                                min="5" 
                                max="50" 
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                            />
                            <div 
                                className="absolute h-1 bg-primary rounded-l-full left-0 z-10 pointer-events-none top-[14px] transition-all"
                                style={{ width: `${((radius - 5) / 45) * 100}%` }}
                            ></div>
                            {/* Centered radius value */}
                            <div 
                                className="absolute -top-8 bg-primary text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg shadow-primary/30 transition-all"
                                style={{ left: `${((radius - 5) / 45) * 100}%`, transform: 'translateX(-50%)' }}
                            >
                                {radius} km
                            </div>
                        </div>
                         <div className="flex justify-between mt-2 text-xs font-medium text-gray-400">
                            <span>5km</span>
                            <span>50km</span>
                        </div>
                    </div>
                </section>

                {/* Search Button */}
                <div className="px-6 mt-8">
                    <button 
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Show Events</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
