'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [countsByPhone, setCountsByPhone] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: custData, error: custErr } = await supabase
        .from('customers')
        .select('id, name, phone, email, created_at')
        .order('created_at', { ascending: false });

      const { data: apptData, error: apptErr } = await supabase
        .from('appointments')
        .select('phone');

      if (cancelled) return;

      if (custErr || apptErr) {
        setError((custErr || apptErr).message);
        setLoading(false);
        return;
      }

      const counts = {};
      (apptData || []).forEach((a) => {
        counts[a.phone] = (counts[a.phone] || 0) + 1;
      });

      setCustomers(custData || []);
      setCountsByPhone(counts);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="admin-content">
      <h1 className="admin-h1">Customers</h1>
      <p className="admin-sub">Everyone who has booked or been added to your customer list.</p>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-panel">
        {loading && <p className="admin-empty">Loading…</p>}
        {!loading && customers.length === 0 && <p className="admin-empty">No customers yet.</p>}
        {!loading && customers.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Appointments</th>
                  <th>Since</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.email || '—'}</td>
                    <td>{countsByPhone[c.phone] || 0}</td>
                    <td>{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
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
