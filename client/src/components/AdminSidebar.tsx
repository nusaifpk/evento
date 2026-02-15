import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckCircle, Clock, Plus } from 'lucide-react';

interface SidebarLink {
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const links: SidebarLink[] = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/events', icon: CheckCircle, label: 'Approved Events' },
  { to: '/admin/pending', icon: Clock, label: 'Pending Events' },
  { to: '/admin/create', icon: Plus, label: 'Create Event' },
];

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-[#120012] border-r border-white/5 min-h-screen fixed left-0 top-0 pt-20">
      <nav className="px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#f425f4]/20 text-[#f425f4]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};


