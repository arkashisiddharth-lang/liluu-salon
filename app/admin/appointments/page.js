'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [servicesById, setServicesById] = useState({});
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data: services } = await supabase.from('services').select('id, name');
    const map = {};
    (services || []).forEach((s) => { map[s.id] = s.name; });
    setServicesById(map);

    const { data, error: err } = await supabase
      .from('appointments')
      .select('id, customer_name, phone, email, service_id, appointment_date, appointment_time, status, created_at')
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, status) {
    setBusyId(id);
    const { error: err } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (!err) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } else {
      setError(err.message);
    }
    setBusyId(null);
  }

  async function deleteAppointment(id) {
    if (!confirm('Delete this appointment permanently? This cannot be undone.')) return;
    setBusyId(id);
    const { error: err } = await supabase.from('appointments').delete().eq('id', id);
    if (!err) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } else {
      setError(err.message);
    }
    setBusyId(null);
  }

  const filtered = filter === 'All'
    ? appointments
    : appointments.filter((a) => a.status === filter.toLowerCase());

  return (
    <div className="admin-content">
      <h1 className="admin-h1">Appointments</h1>
      <p className="admin-sub">Manage incoming booking requests.</p>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-filters">
        {FILTERS.map((f) => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="admin-panel">
        {loading && <p className="admin-empty">Loading…</p>}
        {!loading && filtered.length === 0 && <p className="admin-empty">No appointments here.</p>}
        {!loading && filtered.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td>{a.customer_name}</td>
                    <td>
                      {a.phone}
                      <br />
                      <a
                        href={`https://wa.me/${a.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener"
                        style={{ fontSize: '11px', color: 'var(--gold)' }}
                      >
                        WhatsApp
                      </a>
                    </td>
                    <td>{servicesById[a.service_id] || '—'}</td>
                    <td>{a.appointment_date}</td>
                    <td>{a.appointment_time}</td>
                    <td><span className={`admin-badge ${a.status}`}>{a.status}</span></td>
                    <td>
                      {a.status !== 'confirmed' && (
                        <button className="admin-btn" disabled={busyId === a.id} onClick={() => updateStatus(a.id, 'confirmed')}>Confirm</button>
                      )}
                      {a.status !== 'completed' && (
                        <button className="admin-btn" disabled={busyId === a.id} onClick={() => updateStatus(a.id, 'completed')}>Complete</button>
                      )}
                      {a.status !== 'cancelled' && (
                        <button className="admin-btn" disabled={busyId === a.id} onClick={() => updateStatus(a.id, 'cancelled')}>Cancel</button>
                      )}
                      <button className="admin-btn danger" disabled={busyId === a.id} onClick={() => deleteAppointment(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
