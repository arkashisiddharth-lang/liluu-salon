'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const EMPTY_FORM = { id: null, name: '', category: '', description: '', price: '', duration: '', image: '' };

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('services')
      .select('id, name, category, description, price, duration, image, is_active, sort_order')
      .order('sort_order', { ascending: true });
    if (err) setError(err.message);
    setServices(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function startEdit(service) {
    setForm({
      id: service.id,
      name: service.name || '',
      category: service.category || '',
      description: service.description || '',
      price: service.price ?? '',
      duration: service.duration || '',
      image: service.image || '',
    });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || null,
      description: form.description.trim() || null,
      price: Number(form.price) || 0,
      duration: form.duration.trim() || null,
      image: form.image.trim() || null,
    };

    let err;
    if (form.id) {
      ({ error: err } = await supabase.from('services').update(payload).eq('id', form.id));
    } else {
      const nextSortOrder = services.length > 0 ? Math.max(...services.map((s) => s.sort_order || 0)) + 1 : 1;
      ({ error: err } = await supabase.from('services').insert({ ...payload, sort_order: nextSortOrder, is_active: true }));
    }

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    resetForm();
    load();
  }

  async function toggleActive(service) {
    setBusyId(service.id);
    const { error: err } = await supabase.from('services').update({ is_active: !service.is_active }).eq('id', service.id);
    if (err) setError(err.message);
    setBusyId(null);
    load();
  }

  async function deleteService(service) {
    if (!confirm(`Delete "${service.name}"? This cannot be undone. Consider deactivating instead if it has past bookings.`)) return;
    setBusyId(service.id);
    const { error: err } = await supabase.from('services').delete().eq('id', service.id);
    if (err) setError(err.message);
    setBusyId(null);
    load();
  }

  async function move(service, direction) {
    const idx = services.findIndex((s) => s.id === service.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= services.length) return;
    const other = services[swapIdx];

    setBusyId(service.id);
    await Promise.all([
      supabase.from('services').update({ sort_order: other.sort_order }).eq('id', service.id),
      supabase.from('services').update({ sort_order: service.sort_order }).eq('id', other.id),
    ]);
    setBusyId(null);
    load();
  }

  return (
    <div className="admin-content">
      <h1 className="admin-h1">Services</h1>
      <p className="admin-sub">Changes here reflect on the homepage immediately — no redeploy needed.</p>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-panel">
        <h2>{form.id ? 'Edit service' : 'Add new service'}</h2>
        <form onSubmit={handleSave}>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="admin-field">
              <label>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Hair / Skin / Nails / Beauty / Bridal" />
            </div>
            <div className="admin-field full">
              <label>Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Price (₹)</label>
              <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="admin-field">
              <label>Duration</label>
              <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 45-60 min" />
            </div>
            <div className="admin-field full">
              <label>Image URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
            </div>
          </div>
          <button type="submit" className="admin-btn primary" disabled={saving}>
            {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add service'}
          </button>
          {form.id && (
            <button type="button" className="admin-btn" onClick={resetForm} style={{ marginLeft: 8 }}>
              Cancel edit
            </button>
          )}
        </form>
      </div>

      <div className="admin-panel">
        {loading && <p className="admin-empty">Loading…</p>}
        {!loading && services.length === 0 && <p className="admin-empty">No services yet.</p>}
        {!loading && services.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s, i) => (
                  <tr key={s.id}>
                    <td>
                      <button className="admin-btn" disabled={busyId === s.id || i === 0} onClick={() => move(s, 'up')}>↑</button>
                      <button className="admin-btn" disabled={busyId === s.id || i === services.length - 1} onClick={() => move(s, 'down')}>↓</button>
                    </td>
                    <td>{s.name}</td>
                    <td>{s.category || '—'}</td>
                    <td>₹{Number(s.price).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`admin-badge ${s.is_active ? 'confirmed' : 'cancelled'}`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="admin-btn" onClick={() => startEdit(s)}>Edit</button>
                      <button className="admin-btn" disabled={busyId === s.id} onClick={() => toggleActive(s)}>
                        {s.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="admin-btn danger" disabled={busyId === s.id} onClick={() => deleteService(s)}>Delete</button>
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
