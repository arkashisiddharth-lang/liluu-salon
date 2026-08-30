'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      const todayStr = new Date().toISOString().split('T')[0];

      const [
        totalAppointments,
        todayAppointments,
        pending,
        confirmed,
        completed,
        totalCustomers,
        activeServices,
      ] = await Promise.all([
        supabase.from('appointments').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', todayStr),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'confirmed'),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      if (cancelled) return;

      const firstError = [totalAppointments, todayAppointments, pending, confirmed, completed, totalCustomers, activeServices]
        .find((r) => r.error);
      if (firstError) {
        setError(firstError.error.message);
        return;
      }

      setStats({
        total: totalAppointments.count ?? 0,
        today: todayAppointments.count ?? 0,
        pending: pending.count ?? 0,
        confirmed: confirmed.count ?? 0,
        completed: completed.count ?? 0,
        customers: totalCustomers.count ?? 0,
        services: activeServices.count ?? 0,
      });
    }

    loadStats();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="admin-content">
      <h1 className="admin-h1">Dashboard</h1>
      <p className="admin-sub">Live overview of your salon's bookings and customers.</p>

      {error && <p className="admin-error">Couldn't load stats: {error}</p>}

      {!stats && !error && <p className="admin-empty">Loading…</p>}

      {stats && (
        <div className="admin-stat-grid">
          <div className="admin-stat-card"><b>{stats.total}</b><span>Total Appointments</span></div>
          <div className="admin-stat-card"><b>{stats.today}</b><span>Today's Appointments</span></div>
          <div className="admin-stat-card"><b>{stats.pending}</b><span>Pending</span></div>
          <div className="admin-stat-card"><b>{stats.confirmed}</b><span>Confirmed</span></div>
          <div className="admin-stat-card"><b>{stats.completed}</b><span>Completed</span></div>
          <div className="admin-stat-card"><b>{stats.customers}</b><span>Total Customers</span></div>
          <div className="admin-stat-card"><b>{stats.services}</b><span>Active Services</span></div>
        </div>
      )}
    </div>
  );
}
