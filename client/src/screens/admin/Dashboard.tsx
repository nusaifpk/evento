import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { ApiEvent } from '../../types/event.types';

const API_BASE_URL = '/api';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all events (admin can see all)
      const [approvedRes, pendingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/events`),
        fetch(`${API_BASE_URL}/admin/events/pending`),
      ]);

      const approvedData = await approvedRes.json();
      const pendingData = await pendingRes.json();

      setStats({
        total: (approvedData.data?.length || 0) + (pendingData.data?.length || 0),
        approved: approvedData.data?.length || 0,
        pending: pendingData.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Events',
      value: stats.total,
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      onClick: () => navigate('/admin/events'),
    },
    {
      label: 'Approved Events',
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      onClick: () => navigate('/admin/events'),
    },
    {
      label: 'Pending Approval',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      onClick: () => navigate('/admin/pending'),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your event management</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <button
                key={index}
                onClick={card.onClick}
                className="bg-[#1f001f] rounded-2xl shadow-lg p-6 hover:bg-[#1f001f]/80 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={card.color} size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{card.value}</div>
                <div className="text-sm text-gray-400">{card.label}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


