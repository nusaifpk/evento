import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Edit, Bookmark, Bell } from 'lucide-react';

export const ProfileScreen = () => {
    const navigate = useNavigate();
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
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-background-dark">
                            <Edit size={16} />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Alex Rivera</h2>
                    <p className="text-sm text-slate-400 mb-4 text-center max-w-[260px]">Bass head 🎧 | Weekend explorer 🌌 | NYC</p>
                    
                    <div className="flex items-center gap-8 mt-2">
                        <div className="text-center">
                            <span className="block text-xl font-bold text-primary">42</span>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Events</span>
                        </div>
                        <div className="w-px h-8 bg-slate-700"></div>
                        <div className="text-center">
                            <span className="block text-xl font-bold text-white">1.2k</span>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Followers</span>
                        </div>
                        <div className="w-px h-8 bg-slate-700"></div>
                         <div className="text-center">
                            <span className="block text-xl font-bold text-white">285</span>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Following</span>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="font-bold text-lg">Your Vibe</h3>
                        <button className="text-xs font-bold text-primary uppercase tracking-wide">Edit</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                         <span className="px-4 py-2 rounded-full bg-surface-dark border border-white/5 text-sm font-medium shadow-sm flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-purple-500"></span> Electronic
                         </span>
                         <span className="px-4 py-2 rounded-full bg-surface-dark border border-white/5 text-sm font-medium shadow-sm flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-red-500"></span> Indie Rock
                         </span>
                    </div>
                </section>

                <section className="mb-8">
                    <div className="p-1 bg-surface-dark rounded-xl flex mb-6 relative">
                        <button className="flex-1 py-2.5 text-sm font-bold rounded-lg bg-primary shadow-sm text-white">Saved Events</button>
                        <button className="flex-1 py-2.5 text-sm font-medium rounded-lg text-slate-400">Past Events</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="group flex items-center p-3 rounded-2xl bg-surface-dark border border-transparent hover:border-primary/30 transition-all shadow-sm">
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden mr-4">
                                <img src="https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=200&auto=format&fit=crop" alt="Thumb" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">Sat, Oct 14</div>
                                <h4 className="font-bold text-white truncate">Neon Garden Party</h4>
                                <p className="text-xs text-slate-400 truncate mt-0.5">The Warehouse, Brooklyn</p>
                            </div>
                            <button className="p-2 text-primary"><Bookmark size={20} /></button>
                        </div>
                    </div>
                </section>
                
                 <section>
                    <h3 className="font-bold text-lg mb-4 pl-1">Preferences</h3>
                    <div className="bg-surface-dark rounded-2xl p-2 space-y-1">
                         <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-primary/10 text-primary"><Bell size={20} /></div>
                                <div><h4 className="text-sm font-semibold">Alerts</h4><p className="text-xs text-slate-400">Notifications</p></div>
                            </div>
                             <div className="w-11 h-6 bg-primary rounded-full relative"><div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full"></div></div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};