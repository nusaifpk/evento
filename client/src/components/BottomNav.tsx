import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, User, PartyPopper } from 'lucide-react';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, path: '/home', label: 'Home' },
    { icon: Search, path: '/map', label: 'Explore' }, // Mapping Search icon to Map/Explore screen
    { icon: Plus, path: '/create', label: 'Create', isFab: true },
    { icon: PartyPopper, path: '/saved', label: 'Events' }, // Changed to PartyPopper for events
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 h-[72px] bg-surface-dark/90 backdrop-blur-md rounded-full flex justify-between items-center px-2 z-50 shadow-2xl shadow-black/50 border border-white/5">
      {navItems.map((item) => {
        if (item.isFab) {
          return (
            <button
              key={item.path}
              className="relative flex flex-col items-center justify-center w-16 h-16 -mt-8 bg-primary rounded-full text-white shadow-lg shadow-primary/40 border-4 border-background-dark active:scale-95 transition-transform"
              onClick={() => navigate('/submit-event')}
              aria-label="Submit Event"
            >
              <item.icon size={24} />
            </button>
          );
        }

        const isActive = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
              isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon 
              size={20} 
              className={`${isActive && 'drop-shadow-[0_0_8px_rgba(244,37,244,0.5)]'}`}
            />
            {isActive && <span className="w-1 h-1 bg-primary rounded-full absolute bottom-3"></span>}
          </button>
        );
      })}
    </nav>
  );
};