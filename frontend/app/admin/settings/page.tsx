'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { api } from '@/lib/api';

export default function AdminSettingsPage() {
  const { getToken } = useAuth();
  const [settings, setSettings] = useState({ aiProvider: 'gemini', appName: 'CareerCoach Ai' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = await getToken();
        const response = await api.get('/admin/settings', { headers: { Authorization: `Bearer ${token}` } });
        setSettings(response.data.data);
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [getToken]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await getToken();
      await api.patch('/admin/settings', settings, { headers: { Authorization: `Bearer ${token}` } });
      alert('Settings saved!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell title="Settings">
        <div className="card-surface p-8 text-center">Loading settings...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">Application Settings</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block font-semibold">App Name</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full rounded-xl border px-4 py-3"
                style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
              />
            </div>
            <div>
              <label className="mb-2 block font-semibold">AI Provider</label>
              <select
                value={settings.aiProvider}
                onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
                className="w-full rounded-xl border px-4 py-3"
                style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI (Coming Soon)</option>
                <option value="anthropic">Anthropic (Coming Soon)</option>
              </select>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary w-full rounded-xl px-4 py-3 font-bold disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </section>

        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">System Information</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Version</span>
              <span className="font-semibold">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Database</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Connected</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Authentication</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Active</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>AI Service</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Operational</span>
            </div>
          </div>
        </section>

        <section className="card-surface p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
              <div>
                <h3 className="font-semibold">Clear AI History</h3>
                <p className="text-sm text-red-600">This will delete all AI generation history permanently.</p>
              </div>
              <button className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-100">
                Clear History
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
              <div>
                <h3 className="font-semibold">Reset Database</h3>
                <p className="text-sm text-red-600">This will reset all data to initial seed state.</p>
              </div>
              <button className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-100">
                Reset Data
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
