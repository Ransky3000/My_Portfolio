'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-auth';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import styles from '@/styles/admin-pages.module.css';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string | null;
  display_order: number;
  visible: boolean;
}

const EMPTY_LINK: Omit<SocialLink, 'id'> = {
  platform: '',
  url: '',
  icon_name: '',
  display_order: 0,
  visible: true,
};

const ICON_OPTIONS = ['github', 'linkedin', 'upwork', 'email', 'twitter', 'youtube'];

export default function AdminSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Omit<SocialLink, 'id'> & { id?: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function fetchLinks() {
    const { data, error } = await supabaseBrowser
      .from('social_links')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) setLinks(data as SocialLink[]);
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setMessage(null);

    let result;
    if (editing.id) {
      const { id, ...rest } = editing;
      result = await supabaseBrowser.from('social_links').update(rest).eq('id', id);
    } else {
      const { id, ...rest } = editing;
      result = await supabaseBrowser.from('social_links').insert(rest);
    }

    if (result.error) {
      setMessage({ type: 'error', text: result.error.message });
    } else {
      setMessage({ type: 'success', text: editing.id ? 'Link updated!' : 'Link created!' });
      setEditing(null);
      fetchLinks();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabaseBrowser.from('social_links').delete().eq('id', deleteTarget.id);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Link deleted.' });
      fetchLinks();
    }
    setDeleteTarget(null);
  }

  if (loading) return <div className={styles.pageTitle}>Loading...</div>;

  if (editing) {
    return (
      <div>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle} style={{ marginBottom: 0 }}>
            {editing.id ? 'Edit Link' : 'Add Link'}
          </h1>
          <button className={styles.btnSecondary} onClick={() => setEditing(null)}>
            <X size={16} /> Cancel
          </button>
        </div>

        {message && <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>}

        <div className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Platform Name</label>
            <input className={styles.fieldInput} value={editing.platform} onChange={(e) => setEditing({ ...editing, platform: e.target.value })} required />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>URL</label>
            <input className={styles.fieldInput} value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} required />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Icon Name</label>
            <select className={styles.fieldSelect} value={editing.icon_name ?? ''} onChange={(e) => setEditing({ ...editing, icon_name: e.target.value || null })}>
              <option value="">None</option>
              {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Display Order</label>
            <input type="number" className={styles.fieldInput} value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })} />
          </div>

          <div className={styles.toggleGroup}>
            <button type="button" className={`${styles.toggle} ${editing.visible ? styles.active : ''}`} onClick={() => setEditing({ ...editing, visible: !editing.visible })} />
            <span className={styles.toggleLabel}>Visible on site</span>
          </div>

          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Link'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle} style={{ marginBottom: 0 }}>Social Links</h1>
        <button className={styles.btnPrimary} onClick={() => { setEditing({ ...EMPTY_LINK }); setMessage(null); }}>
          <Plus size={16} /> Add Link
        </button>
      </div>

      {message && <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Platform</th>
            <th>URL</th>
            <th>Icon</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => (
            <tr key={link.id}>
              <td>{link.display_order}</td>
              <td>{link.platform}</td>
              <td className={styles.truncate}>{link.url}</td>
              <td>{link.icon_name || '—'}</td>
              <td>
                <span className={`${styles.badge} ${link.visible ? styles.badgeGreen : styles.badgeGray}`}>
                  {link.visible ? 'Yes' : 'No'}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.btnSecondary} onClick={() => { setEditing({ ...link }); setMessage(null); }}><Pencil size={14} /></button>
                  <button className={styles.btnDanger} onClick={() => setDeleteTarget(link)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Link</h3>
            <p className={styles.modalText}>Delete &ldquo;{deleteTarget.platform}&rdquo;?</p>
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className={styles.btnDanger} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
