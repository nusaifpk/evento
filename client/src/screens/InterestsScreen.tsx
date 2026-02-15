import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Beer, Terminal, Palette, Utensils, Circle, Gamepad2, Mountain, Check, ArrowRight } from 'lucide-react';
import { getUserPreferences, saveUserPreferences, updateUserInterests } from '../utils/userManager';

const INTERESTS = [
  { id: 'music', name: 'Music', sub: 'Concerts & Gigs', icon: Music },
  { id: 'nightlife', name: 'Nightlife', sub: 'Clubs & Parties', icon: Beer },
  { id: 'tech', name: 'Tech', sub: 'Hackathons & Talks', icon: Terminal },
  { id: 'arts', name: 'Arts', sub: 'Galleries & Theater', icon: Palette },
  { id: 'food', name: 'Foodie', sub: 'Festivals & Tastings', icon: Utensils },
  { id: 'sports', name: 'Sports', sub: 'Matches & Fitness', icon: Circle },
  { id: 'gaming', name: 'Gaming', sub: 'Tournaments & LANs', icon: Gamepad2 },
  { id: 'outdoors', name: 'Outdoors', sub: 'Hiking & Camping', icon: Mountain },
];

export const InterestsScreen = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  // Load existing preferences on component mount
  useEffect(() => {
    const preferences = getUserPreferences();
    if (preferences && preferences.interests.length > 0) {
      setSelected(preferences.interests);
    } else {
      // Set default interests for new users
      setSelected(['music', 'tech', 'sports']);
    }
  }, []);

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Save user preferences
    const preferences = getUserPreferences();
    if (preferences) {
      updateUserInterests(selected);
    } else {
      saveUserPreferences(selected);
    }
    
    navigate('/home');
  };

  const handleSkip = () => {
    // Save current selection even when skipping
    const preferences = getUserPreferences();
    if (preferences) {
      updateUserInterests(selected);
    } else {
      saveUserPreferences(selected);
    }
    
    navigate('/home');
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col antialiased">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex justify-between items-center z-10 sticky top-0 bg-background-dark/90 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div className="h-1.5 w-1/3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-primary rounded-full"></div>
        </div>
        <button 
            onClick={handleSkip}
            className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors">
          Skip
        </button>
      </header>

      <main className="flex-grow px-6 pb-40">
        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-extrabold mb-3 leading-tight">
            What's your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">vibe?</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Pick 3 or more interests to help us personalize your event feed.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {INTERESTS.map((item) => {
            const isSelected = selected.includes(item.id);
            return (
              <div key={item.id} className="relative group" onClick={() => toggleInterest(item.id)}>
                <div
                  className={`flex flex-col h-full p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(244,37,244,0.25)]'
                      : 'bg-white/5 border-white/10 hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isSelected ? 'bg-primary text-white' : 'bg-white/10 text-primary'
                      }`}
                    >
                      <item.icon size={24} />
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center transition-all duration-300 ${
                        isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                      }`}
                    >
                      <Check size={16} />
                    </div>
                  </div>
                  <span className="font-bold text-lg mt-auto text-white">{item.name}</span>
                  <span className="text-xs text-slate-400 mt-1">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full z-20">
        <div className="h-20 bg-gradient-to-t from-background-dark to-transparent pointer-events-none"></div>
        <div className="bg-background-dark/95 backdrop-blur-lg px-6 pb-8 pt-2">
          <button
            onClick={handleContinue}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_25px_rgba(244,37,244,0.4)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight size={20} />
          </button>
          <p className="text-center text-xs text-slate-500 mt-4">
            You can always change these later in settings.
          </p>
        </div>
      </div>
    </div>
  );
};