import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, Music, Palette, ArrowRight } from 'lucide-react';

export const SearchScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-dark text-white font-display min-h-screen flex flex-col">
            {/* Header */}
            <div className="px-6 pt-12 pb-4 bg-background-dark/95 backdrop-blur-md z-20 sticky top-0 border-b border-white/5">
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
                    <input className="block w-full pl-12 pr-4 py-3.5 border-none rounded-2xl bg-surface-dark text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 shadow-sm transition-all" placeholder="Artists, venues, or vibes..." type="text" />
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
                        <button className="flex-shrink-0 px-6 py-3 rounded-2xl bg-primary text-white font-medium shadow-lg shadow-primary/25 border border-primary">Today</button>
                        <button className="flex-shrink-0 px-6 py-3 rounded-2xl bg-surface-dark border border-white/10 text-gray-300 font-medium">Tomorrow</button>
                        <button className="flex-shrink-0 px-6 py-3 rounded-2xl bg-surface-dark border border-white/10 text-gray-300 font-medium">This Weekend</button>
                    </div>
                </section>

                {/* Vibe Grid */}
                <section className="mt-8 px-6">
                    <h2 className="text-lg font-bold mb-4">What's the vibe?</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Music */}
                        <button className="relative h-24 rounded-2xl overflow-hidden group border-2 border-primary">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-black/80 z-10"></div>
                            <img src="https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Music" />
                            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
                                <Music className="text-primary" size={18} />
                                <span className="font-bold text-white">Music</span>
                            </div>
                            <div className="absolute top-3 right-3 z-20 bg-primary w-2 h-2 rounded-full shadow-[0_0_8px_#f425f4]"></div>
                        </button>
                        {/* Art */}
                         <button className="relative h-24 rounded-2xl overflow-hidden group border border-transparent dark:border-white/10 bg-surface-dark">
                            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/80 z-10"></div>
                            <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Art" />
                            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
                                <Palette className="text-gray-300" size={18} />
                                <span className="font-bold text-gray-200">Arts</span>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Radius */}
                <section className="mt-8 px-6">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">How far?</h2>
                        <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg">25 km</span>
                    </div>
                    <div className="bg-surface-dark p-6 rounded-3xl border border-white/5 shadow-sm">
                        <div className="relative w-full h-8 flex items-center">
                            <input className="z-20" type="range" min="5" max="50" defaultValue="25" />
                            <div className="absolute h-1 w-1/2 bg-primary rounded-l-full left-0 z-10 pointer-events-none top-[14px]"></div>
                        </div>
                         <div className="flex justify-between mt-2 text-xs font-medium text-gray-400">
                            <span>5km</span>
                            <span>50km</span>
                        </div>
                    </div>
                </section>
            </div>
            
             <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-30">
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all">
                    <span>Show Events</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};