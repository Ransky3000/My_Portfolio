'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabaseBrowser } from '@/lib/supabase-auth';
import { Trash2, Eye, EyeOff, Search, ArrowUpDown } from 'lucide-react';
import styles from '@/styles/admin-pages.module.css';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

type StatusFilter = 'all' | 'new' | 'read';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter & Sort state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!alertMsg) return;
    const timer = setTimeout(() => setAlertMsg(null), 3000);
    return () => clearTimeout(timer);
  }, [alertMsg]);

  async function fetchMessages() {
    const { data, error } = await supabaseBrowser
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setMessages(data as ContactSubmission[]);
    setLoading(false);
  }

  // Derived filtered + sorted + searched messages
  const filteredMessages = useMemo(() => {
    let result = [...messages];

    // Status filter
    if (statusFilter === 'new') result = result.filter(m => !m.read);
    if (statusFilter === 'read') result = result.filter(m => m.read);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return sortNewestFirst ? diff : -diff;
    });

    return result;
  }, [messages, statusFilter, sortNewestFirst, searchQuery]);

  async function toggleRead(msg: ContactSubmission) {
    const { error } = await supabaseBrowser
      .from('contact_submissions')
      .update({ read: !msg.read })
      .eq('id', msg.id);

    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabaseBrowser
      .from('contact_submissions')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      setAlertMsg({ type: 'error', text: error.message });
    } else {
      setAlertMsg({ type: 'success', text: 'Message deleted.' });
      fetchMessages();
    }
    setDeleteTarget(null);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const newCount = messages.filter(m => !m.read).length;

  if (loading) return <div className={styles.pageTitle}>Loading...</div>;

  return (
    <div>
      <h1 className={styles.pageTitle}>Messages ({messages.length})</h1>

      {alertMsg && <div className={alertMsg.type === 'success' ? styles.success : styles.error}>{alertMsg.text}</div>}

      {/* ─── Filter Bar ─── */}
      <div className={styles.filterBar}>
        <div className={styles.filterButtons}>
          {([
            { key: 'all' as StatusFilter, label: `All (${messages.length})` },
            { key: 'new' as StatusFilter, label: `New (${newCount})` },
            { key: 'read' as StatusFilter, label: `Read (${messages.length - newCount})` },
          ]).map(f => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${statusFilter === f.key ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.filterControls}>
          <div className={styles.searchBox}>
            <Search size={14} />
            <input
              type="text"
              placeholder="Search name, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className={styles.sortBtn}
            onClick={() => setSortNewestFirst(!sortNewestFirst)}
            title={sortNewestFirst ? 'Showing newest first' : 'Showing oldest first'}
          >
            <ArrowUpDown size={14} />
            {sortNewestFirst ? 'Newest' : 'Oldest'}
          </button>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.map((msg) => (
            <>
              <tr
                key={msg.id}
                className={styles.clickableRow}
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                style={{ opacity: msg.read ? 0.6 : 1 }}
              >
                <td>
                  <span className={`${styles.badge} ${msg.read ? styles.badgeGray : styles.badgeGreen}`}>
                    {msg.read ? 'Read' : 'New'}
                  </span>
                </td>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td className={styles.truncate}>{msg.message}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatDate(msg.created_at)}</td>
                <td>
                  <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                    <button className={styles.btnSecondary} onClick={() => toggleRead(msg)} title={msg.read ? 'Mark as unread' : 'Mark as read'}>
                      {msg.read ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button className={styles.btnDanger} onClick={() => setDeleteTarget(msg)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedId === msg.id && (
                <tr key={`${msg.id}-expanded`} className={styles.expandedRow}>
                  <td colSpan={6}>
                    <div className={styles.expandedContent}>
                      <strong>From:</strong> {msg.name} ({msg.email})<br />
                      <strong>Date:</strong> {formatDate(msg.created_at)}<br /><br />
                      {msg.message}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      {filteredMessages.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          {searchQuery || statusFilter !== 'all' ? 'No messages match your filters.' : 'No messages yet.'}
        </div>
      )}

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Message</h3>
            <p className={styles.modalText}>Delete message from &ldquo;{deleteTarget.name}&rdquo;?</p>
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
