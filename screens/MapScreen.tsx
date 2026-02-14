import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Music, MapPin, LocateFixed, Monitor, Settings, Flame, Palette, Star } from 'lucide-react';

export const MapScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-dark text-white font-display h-screen w-full relative overflow-hidden select-none">
            
            {/* Map Layer */}
            <div className="absolute inset-0 z-0 map-pattern w-full h-full">
                {/* Decorative Map Elements */}
                <div className="absolute top-1/4 left-0 w-full h-32 bg-[#1a1a1a] opacity-50 transform -skew-y-6"></div>
                <div className="absolute bottom-1/3 right-0 w-48 h-48 rounded-full bg-[#152015] blur-xl opacity-30"></div>
                
                {/* Labels */}
                <div className="absolute top-[40%] left-[20%] text-gray-600 text-[10px] tracking-widest uppercase rotate-[-6deg] opacity-60">Main Avenue</div>
                <div className="absolute bottom-[30%] right-[30%] text-gray-600 text-[10px] tracking-widest uppercase rotate-[12deg] opacity-60">Sunset Blvd</div>

                {/* Pins */}
                <div className="absolute top-[30%] left-[20%] flex flex-col items-center group cursor-pointer transition-transform hover:scale-110">
                    <div className="w-10 h-10 rounded-full bg-surface-dark border border-gray-700 shadow-lg flex items-center justify-center text-gray-400">
                        <Monitor size={16} />
                    </div>
                </div>

                <div className="absolute top-[45%] left-[55%] flex flex-col items-center z-10 cursor-pointer">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-primary blur rounded-full opacity-60 animate-pulse"></div>
                        <div className="relative w-12 h-12 rounded-full bg-primary shadow-[0_0_15px_rgba(244,37,244,0.6)] flex items-center justify-center text-white border-2 border-white">
                            <Music size={24} />
                        </div>
                    </div>
                    <div className="mt-2 px-3 py-1 bg-surface-dark/90 backdrop-blur-md border border-primary/30 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap">
                        $45 • Neon Nights
                    </div>
                </div>
            </div>

            {/* UI Layer */}
            <div className="relative z-20 w-full h-full flex flex-col pointer-events-none">
                {/* Top Search */}
                <div className="pt-14 px-4 pb-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-12 bg-surface-dark/60 backdrop-blur-lg border border-white/10 rounded-full flex items-center px-4 shadow-xl cursor-pointer" onClick={() => navigate('/search')}>
                            <Search className="text-gray-400 mr-2" size={20} />
                            <input className="bg-transparent border-none text-white placeholder-gray-400 text-sm w-full focus:ring-0 cursor-pointer" placeholder="Search events nearby..." type="text" readOnly />
                            <button className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition">
                                <Settings className="text-gray-400" size={16} />
                            </button>
                        </div>
                        <button className="h-12 w-12 rounded-full bg-surface-dark/60 backdrop-blur-lg border border-white/10 flex items-center justify-center shadow-xl">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="User" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                        </button>
                    </div>

                    {/* Chips */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                         <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full shadow-[0_0_15px_rgba(244,37,244,0.4)] whitespace-nowrap text-sm font-semibold">
                            <Flame size={16} />
                            Trending
                        </button>
                         <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark/60 backdrop-blur-md border border-white/10 text-gray-300 rounded-full whitespace-nowrap text-sm font-medium">
                            <Music className="text-primary" size={16} />
                            Music
                        </button>
                         <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark/60 backdrop-blur-md border border-white/10 text-gray-300 rounded-full whitespace-nowrap text-sm font-medium">
                            <Palette className="text-blue-400" size={16} />
                            Art
                        </button>
                    </div>
                </div>

                <div className="flex-1"></div>

                {/* Bottom Floating Card */}
                <div className="px-4 pb-24 flex flex-col items-end gap-4 pointer-events-auto bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                     <button className="h-12 w-12 rounded-full bg-surface-dark/80 backdrop-blur-xl border border-white/10 text-white shadow-lg flex items-center justify-center hover:bg-surface-dark transition-colors active:scale-90">
                        <LocateFixed className="text-primary" size={20} />
                    </button>

                    <div className="relative w-full bg-surface-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl flex gap-3 transition-transform duration-300 transform cursor-pointer" onClick={() => navigate('/event/1')}>
                         <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 to-transparent rounded-2xl -z-10 blur-sm"></div>
                         <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=400&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
                            <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Live
                            </div>
                         </div>
                         
                         <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-1">Neon Nights Rave</h3>
                                    <div className="flex items-center gap-0.5 text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                                        <Star size={12} /> 4.9
                                    </div>
                                </div>
                                <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                                    <MapPin size={10} className="mr-1" />
                                    The Warehouse • 0.8 km
                                </p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <div className="text-white font-bold text-base">
                                    $20 <span className="text-xs text-gray-500 font-normal">/ person</span>
                                </div>
                                <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow-[0_0_10px_rgba(244,37,244,0.3)]">
                                    Get Tickets
                                </button>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};