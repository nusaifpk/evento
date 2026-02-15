import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Edit, Bookmark, Bell, Calendar, Clock, Users } from 'lucide-react';
import { getUserPreferences, updateUserInterests } from '../utils/userManager';
import { generateAnonymousProfile, getUserStats, getSavedEvents, getPastEvents, getUserEvents, saveEvent, unsaveEvent } from '../utils/profileUtils';
import type { ApiEvent } from '../services/api';

const INTERESTS = [
  { id: 'music', name: 'Music', color: 'bg-purple-500' },
  { id: 'nightlife', name: 'Nightlife', color: 'bg-blue-500' },
  { id: 'tech', name: 'Tech', color: 'bg-green-500' },
  { id: 'arts', name: 'Arts', color: 'bg-pink-500' },
  { id: 'food', name: 'Foodie', color: 'bg-orange-500' },
  { id: 'sports', name: 'Sports', color: 'bg-red-500' },
  { id: 'gaming', name: 'Gaming', color: 'bg-indigo-500' },
  { id: 'outdoors', name: 'Outdoors', color: 'bg-teal-500' },
];

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'saved' | 'past'>('saved');
  const [userStats, setUserStats] = useState<any>(null);
  const [savedEventDetails, setSavedEventDetails] = useState<ApiEvent[]>([]);
  const [pastEventDetails, setPastEventDetails] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [anonymousProfile, setAnonymousProfile] = useState<any>(null);

  useEffect(() => {
    const preferences = getUserPreferences();
    setUserPreferences(preferences);
    
    const stats = getUserStats();
    setUserStats(stats);
    
    const profile = generateAnonymousProfile();
    setAnonymousProfile(profile);
    
    // Load event details (mock for now, would fetch from API)
    loadEventDetails();
    
    setLoading(false);
  }, []);

  const loadEventDetails = async () => {
    // This would normally fetch from API using event IDs
    // For now, we'll use mock data
    const mockEvents: ApiEvent[] = [
      {
        _id: '1',
        title: 'Neon Garden Party',
        description: 'Electronic music festival with multiple stages',
        category: 'Music',
        address: 'The Warehouse, Brooklyn',
        city: 'New York',
        price: 35,
        images: ['https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=200&auto=format&fit=crop'],
        organizerName: 'Bass Collective',
        startDate: '2024-10-14T20:00:00',
        endDate: '2024-10-14T23:59:59',
        location: { type: 'Point', coordinates: [-74.0060, 40.7128] },
        createdAt: '2024-10-01T00:00:00',
      },
      {
        _id: '2',
        title: 'Tech Networking Meetup',
        description: 'Connect with fellow developers and entrepreneurs',
        category: 'Tech',
        address: 'Innovation Hub, Tech Park',
        city: 'San Francisco',
        price: 0,
        images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500&auto=format&fit=crop'],
        organizerName: 'Tech Community',
        startDate: '2024-09-20T18:00:00',
        endDate: '2024-09-20T21:00:00',
        location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
        createdAt: '2024-10-01T00:00:00',
      }
    ];

    setSavedEventDetails(mockEvents.slice(0, 1));
    setPastEventDetails(mockEvents.slice(1, 2));
  };

  const handleEditVibe = () => {
    navigate('/interests');
  };

  const toggleSaveEvent = (eventId: string) => {
    if (getSavedEvents().includes(eventId)) {
      unsaveEvent(eventId);
    } else {
      saveEvent(eventId);
    }
    // Refresh the stats
    setUserStats(getUserStats());
  };

  const getUserInterestDisplay = () => {
    if (!userPreferences || !userPreferences.interests) {
      return [];
    }
    
    return userPreferences.interests.map((interestId: string) => {
      const interest = INTERESTS.find(i => i.id === interestId);
      return interest || { id: interestId, name: interestId, color: 'bg-gray-500' };
    });
  };

  const formatEventDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  const getDisplayEvents = () => {
    return activeTab === 'saved' ? savedEventDetails : pastEventDetails;
  };

  if (loading || !anonymousProfile || !userStats) {
    return (
      <div className="bg-background-dark text-white font-display min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col pb-24">
      <header className="flex justify-between items-center px-6 pt-12 pb-4 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Profile</h1>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-primary">
          <Settings size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-6">
        <section className="flex flex-col items-center mb-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/30 blur-[60px] rounded-full pointer-events-none"></div>
          <div className="relative group cursor-pointer mb-4">
            <div className="w-28 h-28 rounded-full border-4 border-surface-dark overflow-hidden shadow-xl shadow-primary/20 relative">
              <img src={anonymousProfile.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-background-dark">
              <Edit size={16} />
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-1">{anonymousProfile.name} {anonymousProfile.number}</h2>
          <p className="text-sm text-slate-400 mb-4 text-center max-w-[260px]">{anonymousProfile.bio}</p>
          
          <div className="flex items-center gap-8 mt-2">
            <div className="text-center">
              <span className="block text-xl font-bold text-primary">{userStats.eventsCount}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Events</span>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center">
              <span className="block text-xl font-bold text-white">{userStats.followersCount}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Followers</span>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center">
              <span className="block text-xl font-bold text-white">{userStats.followingCount}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Following</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-lg">Your Vibe</h3>
            <button onClick={handleEditVibe} className="text-xs font-bold text-primary uppercase tracking-wide">Edit</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {getUserInterestDisplay().map((interest) => (
              <span key={interest.id} className="px-4 py-2 rounded-full bg-surface-dark border border-white/5 text-sm font-medium shadow-sm flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${interest.color}`}></span>
                {interest.name}
              </span>
            ))}
            {getUserInterestDisplay().length === 0 && (
              <span className="text-sm text-slate-400">No interests selected yet</span>
            )}
          </div>
        </section>

        <section className="mb-8">
          <div className="p-1 bg-surface-dark rounded-xl flex mb-6 relative">
            <button 
              onClick={() => setActiveTab('saved')} 
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${
                activeTab === 'saved' ? 'bg-primary shadow-sm text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Saved Events ({userStats.savedEventsCount})
            </button>
            <button 
              onClick={() => setActiveTab('past')} 
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'past' ? 'bg-primary shadow-sm text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Events ({userStats.pastEventsCount})
            </button>
          </div>
          
          <div className="space-y-4">
            {getDisplayEvents().length > 0 ? (
              getDisplayEvents().map((event) => (
                <div key={event._id} className="group flex items-center p-3 rounded-2xl bg-surface-dark border border-transparent hover:border-primary/30 transition-all shadow-sm">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden mr-4">
                    <img src={event.images[0]} alt="Thumb" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">
                      {formatEventDate(event.startDate)}
                    </div>
                    <h4 className="font-bold text-white truncate">{event.title}</h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{event.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{event.category}</span>
                      <span className="text-xs text-primary font-bold">
                        {event.price === 0 ? 'FREE' : `$${event.price}`}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSaveEvent(event._id)} 
                    className={`p-2 transition-colors ${
                      getSavedEvents().includes(event._id) ? 'text-primary fill-primary' : 'text-primary'
                    }`}
                  >
                    <Bookmark size={20} fill={getSavedEvents().includes(event._id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'saved' ? <Bookmark size={24} className="text-slate-400" /> : <Calendar size={24} className="text-slate-400" />}
                </div>
                <p className="text-slate-400 text-sm">
                  {activeTab === 'saved' ? 'No saved events yet' : 'No past events yet'}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {activeTab === 'saved' ? 'Save events to see them here' : 'Events you attended will appear here'}
                </p>
              </div>
            )}
          </div>
        </section>
        
        <section>
          <h3 className="font-bold text-lg mb-4 pl-1">Preferences</h3>
          <div className="bg-surface-dark rounded-2xl p-2 space-y-1">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Alerts</h4>
                  <p className="text-xs text-slate-400">Notifications</p>
                </div>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
