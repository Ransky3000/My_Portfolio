'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-auth';
import { Plus, Pencil, Trash2, Save, X, GripVertical } from 'lucide-react';
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

// ─── Sortable Row Component ───
function SortableRow({
  link,
  onEdit,
  onDelete,
  onVisibilityChange,
}: {
  link: SocialLink;
  onEdit: (l: SocialLink) => void;
  onDelete: (l: SocialLink) => void;
  onVisibilityChange: (l: SocialLink, visible: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

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
      <td>{link.platform}</td>
      <td className={styles.truncate}>{link.url}</td>
      <td>{link.icon_name || '—'}</td>
      <td>
        <select
          className={styles.visibilitySelect}
          value={link.visible ? 'visible' : 'hidden'}
          onChange={(e) => onVisibilityChange(link, e.target.value === 'visible')}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </td>
      <td>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => onEdit(link)}><Pencil size={14} /></button>
          <button className={styles.btnDanger} onClick={() => onDelete(link)}><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Omit<SocialLink, 'id'> & { id?: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);

    setLinks(reordered);

    const updates = reordered.map((l, i) => ({
      id: l.id,
      display_order: i,
    }));

    for (const u of updates) {
      await supabaseBrowser
        .from('social_links')
        .update({ display_order: u.display_order })
        .eq('id', u.id);
    }

    setMessage({ type: 'success', text: 'Order updated!' });
  }

  async function handleVisibilityChange(link: SocialLink, visible: boolean) {
    setLinks(prev => prev.map(l => l.id === link.id ? { ...l, visible } : l));

    const { error } = await supabaseBrowser
      .from('social_links')
      .update({ visible })
      .eq('id', link.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
      fetchLinks();
    } else {
      setMessage({ type: 'success', text: `${link.platform} set to ${visible ? 'visible' : 'hidden'}.` });
    }
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
            <label className={styles.fieldLabel}>Visibility</label>
            <select className={styles.fieldSelect} value={editing.visible ? 'visible' : 'hidden'} onChange={(e) => setEditing({ ...editing, visible: e.target.value === 'visible' })}>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Platform</th>
                <th>URL</th>
                <th>Icon</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map(link => (
                <SortableRow
                  key={link.id}
                  link={link}
                  onEdit={(l) => { setEditing({ ...l }); setMessage(null); }}
                  onDelete={setDeleteTarget}
                  onVisibilityChange={handleVisibilityChange}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>

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
