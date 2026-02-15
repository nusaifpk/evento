import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { ArrowLeft } from 'lucide-react';

export const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <div className="px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


