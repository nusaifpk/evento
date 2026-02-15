import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoicon from '../assets/logoicon.png';
import { getUserId, hasCompletedOnboarding } from '../utils/userManager';

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Generate/get user ID
    getUserId();

    const timer = setTimeout(() => {
      // Check if user has completed onboarding
      if (hasCompletedOnboarding()) {
        navigate('/home');
      } else {
        navigate('/interests');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-background-dark font-display antialiased h-screen w-full overflow-hidden flex flex-col items-center justify-center relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[80vw] h-[80vw] bg-purple-900/20 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-8 space-y-8 animate-fade-in-up">
        {/* Logo */}
        <div className="relative group cursor-default">
          <div className="absolute inset-0 bg-primary rounded-xl blur-xl opacity-40 animate-pulse"></div>
            <img src={logoicon} alt="Evento" />
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(244,37,244,0.5)]">
            Evento
          </h1>
          <p className="text-white/60 text-lg font-medium tracking-wide">
            Discover what’s happening near you
          </p>
        </div>

        {/* Loader */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center pt-20">
          <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/3 animate-[pulse_1s_ease-in-out_infinite] translate-x-full"></div>
          </div>
        </div>
      </main>
    </div>
  );
};