'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-auth';
import { Plus, Pencil, Trash2, Save, X, Upload, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  visibility: 'hidden' | 'visible' | 'featured';
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
  visibility: 'visible',
  display_order: 0,
};

const VISIBILITY_OPTIONS: { value: Project['visibility']; label: string; badge: string }[] = [
  { value: 'hidden', label: 'Hidden', badge: 'badgeGray' },
  { value: 'visible', label: 'Visible', badge: 'badgeBlue' },
  { value: 'featured', label: 'Featured', badge: 'badgeGreen' },
];

const CATEGORIES = ['iot', 'automation', 'web', 'research', 'open-source', 'embedded'];

// ─── Sortable Row Component ───
function SortableRow({
  project,
  onEdit,
  onDelete,
  onVisibilityChange,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
  onVisibilityChange: (p: Project, v: Project['visibility']) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>
        <span className={styles.dragHandle} {...attributes} {...listeners}>
          <GripVertical size={16} />
        </span>
      </td>
      <td>{project.title}</td>
      <td>{project.category}</td>
      <td>
        <select
          className={styles.visibilitySelect}
          value={project.visibility}
          onChange={(e) => onVisibilityChange(project, e.target.value as Project['visibility'])}
          onClick={(e) => e.stopPropagation()}
        >
          {VISIBILITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </td>
      <td>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => onEdit(project)}><Pencil size={14} /></button>
          <button className={styles.btnDanger} onClick={() => onDelete(project)}><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Omit<Project, 'id'> & { id?: string } | null>(null);
  const [techInput, setTechInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function fetchProjects() {
    const { data, error } = await supabaseBrowser
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) setProjects(data as Project[]);
    setLoading(false);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);

    // Optimistically update local state
    setProjects(reordered);

    // Persist new display_order values to Supabase
    const updates = reordered.map((p, i) => ({
      id: p.id,
      display_order: i,
    }));

    for (const u of updates) {
      await supabaseBrowser
        .from('projects')
        .update({ display_order: u.display_order })
        .eq('id', u.id);
    }

    setMessage({ type: 'success', text: 'Order updated!' });
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

  async function handleVisibilityChange(project: Project, visibility: Project['visibility']) {
    // Optimistically update local state
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, visibility } : p));

    const { error } = await supabaseBrowser
      .from('projects')
      .update({ visibility })
      .eq('id', project.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
      fetchProjects(); // revert on error
    } else {
      setMessage({ type: 'success', text: `Visibility set to "${visibility}".` });
    }
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
            <input
              className={styles.fieldInput}
              list="category-suggestions"
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              placeholder="e.g. web, iot, automation"
            />
            <datalist id="category-suggestions">
              {[...new Set(projects.map(p => p.category))].map(c => (
                <option key={c} value={c} />
              ))}
            </datalist>
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

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Visibility</label>
            <select className={styles.fieldSelect} value={editing.visibility} onChange={(e) => setEditing({ ...editing, visibility: e.target.value as Project['visibility'] })}>
              {VISIBILITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>
    );
  }

  // ─── List View with Drag-and-Drop ───
  return (
    <div>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle} style={{ marginBottom: 0 }}>Projects</h1>
        <button className={styles.btnPrimary} onClick={openAdd}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {message && <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Title</th>
                <th>Category</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <SortableRow
                  key={p.id}
                  project={p}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  onVisibilityChange={handleVisibilityChange}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>

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
