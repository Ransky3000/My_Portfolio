'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-auth';
import { Plus, Pencil, Trash2, Save, X, Upload } from 'lucide-react';
import styles from '@/styles/admin-pages.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  problem: string | null;
  solution: string | null;
  category: string;
  tech_stack: string[];
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  display_order: number;
}

const EMPTY_PROJECT: Omit<Project, 'id'> = {
  title: '',
  description: '',
  problem: '',
  solution: '',
  category: 'web',
  tech_stack: [],
  image_url: null,
  github_url: null,
  live_url: null,
  featured: false,
  display_order: 0,
};

const CATEGORIES = ['iot', 'automation', 'web', 'research', 'open-source', 'embedded'];

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Omit<Project, 'id'> & { id?: string } | null>(null);
  const [techInput, setTechInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabaseBrowser
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) setProjects(data as Project[]);
    setLoading(false);
  }

  function openAdd() {
    setEditing({ ...EMPTY_PROJECT });
    setTechInput('');
    setMessage(null);
  }

  function openEdit(project: Project) {
    setEditing({ ...project });
    setTechInput(project.tech_stack.join(', '));
    setMessage(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `projects/${Date.now()}.${fileExt}`;

    const { error } = await supabaseBrowser.storage
      .from('portfolio-images')
      .upload(filePath, file, { upsert: true });

    if (error) {
      setMessage({ type: 'error', text: `Upload failed: ${error.message}` });
      return;
    }

    const { data: { publicUrl } } = supabaseBrowser.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    setEditing({ ...editing, image_url: publicUrl });
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setMessage(null);

    const tech_stack = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { ...editing, tech_stack };

    let result;
    if (editing.id) {
      const { id, ...rest } = payload;
      result = await supabaseBrowser.from('projects').update(rest).eq('id', id);
    } else {
      result = await supabaseBrowser.from('projects').insert(payload);
    }

    if (result.error) {
      setMessage({ type: 'error', text: result.error.message });
    } else {
      setMessage({ type: 'success', text: editing.id ? 'Project updated!' : 'Project created!' });
      setEditing(null);
      fetchProjects();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabaseBrowser.from('projects').delete().eq('id', deleteTarget.id);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Project deleted.' });
      fetchProjects();
    }
    setDeleteTarget(null);
  }

  if (loading) return <div className={styles.pageTitle}>Loading...</div>;

  // ─── Editing Form ───
  if (editing) {
    return (
      <div>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle} style={{ marginBottom: 0 }}>
            {editing.id ? 'Edit Project' : 'Add Project'}
          </h1>
          <button className={styles.btnSecondary} onClick={() => setEditing(null)}>
            <X size={16} /> Cancel
          </button>
        </div>

        {message && <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>}

        <div className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Title</label>
            <input className={styles.fieldInput} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Description</label>
            <textarea className={styles.fieldTextarea} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Problem</label>
            <textarea className={styles.fieldTextarea} value={editing.problem ?? ''} onChange={(e) => setEditing({ ...editing, problem: e.target.value })} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Solution</label>
            <textarea className={styles.fieldTextarea} value={editing.solution ?? ''} onChange={(e) => setEditing({ ...editing, solution: e.target.value })} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Category</label>
            <select className={styles.fieldSelect} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Tech Stack (comma-separated)</label>
            <input className={styles.fieldInput} value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="React, Next.js, Supabase" />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Project Image</label>
            <div className={styles.fileUpload}>
              {editing.image_url && (
                <img src={editing.image_url} alt="Preview" className={styles.filePreview} />
              )}
              <label className={styles.btnSecondary} style={{ cursor: 'pointer' }}>
                <Upload size={16} /> Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>GitHub URL</label>
            <input className={styles.fieldInput} value={editing.github_url ?? ''} onChange={(e) => setEditing({ ...editing, github_url: e.target.value || null })} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Live URL</label>
            <input className={styles.fieldInput} value={editing.live_url ?? ''} onChange={(e) => setEditing({ ...editing, live_url: e.target.value || null })} />
          </div>

          <div className={styles.toggleGroup}>
            <button type="button" className={`${styles.toggle} ${editing.featured ? styles.active : ''}`} onClick={() => setEditing({ ...editing, featured: !editing.featured })} />
            <span className={styles.toggleLabel}>Featured</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Display Order</label>
            <input type="number" className={styles.fieldInput} value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })} />
          </div>

          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>
    );
  }

  // ─── List View ───
  return (
    <div>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle} style={{ marginBottom: 0 }}>Projects</h1>
        <button className={styles.btnPrimary} onClick={openAdd}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {message && <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Category</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>{p.display_order}</td>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>
                <span className={`${styles.badge} ${p.featured ? styles.badgeGreen : styles.badgeGray}`}>
                  {p.featured ? 'Yes' : 'No'}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.btnSecondary} onClick={() => openEdit(p)}><Pencil size={14} /></button>
                  <button className={styles.btnDanger} onClick={() => setDeleteTarget(p)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Project</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete &ldquo;{deleteTarget.title}&rdquo;? This action cannot be undone.
            </p>
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
