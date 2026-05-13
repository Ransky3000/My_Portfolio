'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-auth';
import { Save, Upload } from 'lucide-react';
import Image from 'next/image';
import styles from '@/styles/admin-pages.module.css';

interface SiteSettingsData {
  id?: string;
  site_title: string;
  headline: string;
  subtitle: string;
  footer_text: string;
  profile_image_url: string | null;
  cv_url: string | null;
}

const STORAGE_BUCKET = 'portfolio-images';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettingsData>({
    site_title: '',
    headline: '',
    subtitle: '',
    footer_text: '',
    profile_image_url: null,
    cv_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabaseBrowser
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (!error && data) {
        setSettings(data as SiteSettingsData);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleUpload(file: File, folder: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const filePath = `${folder}/${Date.now()}.${fileExt}`;

    const { error } = await supabaseBrowser.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, { upsert: true });

    if (error) {
      setMessage({ type: 'error', text: `Upload failed: ${error.message}` });
      return null;
    }

    const { data: { publicUrl } } = supabaseBrowser.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async function handleProfileImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleUpload(file, 'profile');
    if (url) {
      setSettings((prev) => ({ ...prev, profile_image_url: url }));
    }
  }

  async function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleUpload(file, 'cv');
    if (url) {
      setSettings((prev) => ({ ...prev, cv_url: url }));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { id, ...rest } = settings;
    const payload = { ...rest, updated_at: new Date().toISOString() };

    let result;
    if (id) {
      result = await supabaseBrowser
        .from('site_settings')
        .update(payload)
        .eq('id', id);
    } else {
      result = await supabaseBrowser
        .from('site_settings')
        .insert(payload);
    }

    if (result.error) {
      setMessage({ type: 'error', text: result.error.message });
    } else {
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    }
    setSaving(false);
  }

  if (loading) {
    return <div className={styles.pageTitle}>Loading...</div>;
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Site Settings</h1>

      {message && (
        <div className={message.type === 'success' ? styles.success : styles.error}>
          {message.text}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Site Title</label>
          <input
            type="text"
            className={styles.fieldInput}
            value={settings.site_title}
            onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Headline (Hero Title)</label>
          <input
            type="text"
            className={styles.fieldInput}
            value={settings.headline}
            onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Subtitle / Tagline</label>
          <input
            type="text"
            className={styles.fieldInput}
            value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Footer Text</label>
          <input
            type="text"
            className={styles.fieldInput}
            value={settings.footer_text}
            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Profile Image</label>
          <div className={styles.fileUpload}>
            {settings.profile_image_url && (
              <Image
                src={settings.profile_image_url}
                alt="Profile"
                width={80}
                height={80}
                className={styles.filePreview}
              />
            )}
            <label className={styles.btnSecondary} style={{ cursor: 'pointer' }}>
              <Upload size={16} /> Upload Image
              <input type="file" accept="image/*" onChange={handleProfileImageChange} hidden />
            </label>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>CV File</label>
          <div className={styles.fileUpload}>
            {settings.cv_url && (
              <a href={settings.cv_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                Current CV ↗
              </a>
            )}
            <label className={styles.btnSecondary} style={{ cursor: 'pointer' }}>
              <Upload size={16} /> Upload CV
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} hidden />
            </label>
          </div>
        </div>

        <button type="submit" className={styles.btnPrimary} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
