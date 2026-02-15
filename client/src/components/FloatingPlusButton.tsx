import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const FloatingPlusButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide button on admin and submit pages
  const hideOnPaths = ['/admin', '/submit-event', '/interests', '/'];
  if (hideOnPaths.some(path => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/submit-event')}
      className="fixed bottom-24 right-6 w-14 h-14 bg-[#f425f4] hover:bg-[#f425f4]/90 text-white rounded-full shadow-lg shadow-[#f425f4]/30 flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95"
      aria-label="Submit Event"
    >
      <Plus size={24} />
    </button>
  );
};

