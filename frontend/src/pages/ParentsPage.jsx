import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';
import api from '../api/api';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

function getInitials(name) {
  if (!name) return 'P';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export default function ParentsPage() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedParent, setSelectedParent] = useState(null);

  const fetchParents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.set('search', search);

      const { data } = await api.get(`/parents?${params}`);
      if (data.success) {
        setParents(data.data.parents || []);
        setPagination(data.data.pagination || {});
      }
    } catch (err) {
      console.error('Failed to load parents:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchParents(); }, [fetchParents]);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  const totalPages = pagination.totalPages || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search Header */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 450 }}>
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              className="form-input"
              placeholder="Search parents by name, phone or email..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">Search</button>
        </form>
      </div>

      {/* Parents Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : parents.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No parents found"
            description="Try searching with a different name or phone number."
          />
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Parent / Guardian</th>
                  <th>Contact Email</th>
                  <th>Phone Number</th>
                  <th>Occupation</th>
                  <th>Residential Address</th>
                </tr>
              </thead>
              <tbody>
                {parents.map(p => (
                  <tr key={p.id} onClick={() => setSelectedParent(p)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="avatar">
                          {getInitials(p.full_name)}
                        </div>
                        <span className="td-main">{p.full_name}</span>
                      </div>
                    </td>
                    <td>{p.email || p.linked_user_email || 'parent@example.com'}</td>
                    <td>{p.phone || '+1 (555) 019-3829'}</td>
                    <td>
                      <span className="badge badge-slate">{p.occupation || 'Professional'}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {p.address ? (p.address.length > 35 ? p.address.slice(0, 35) + '…' : p.address) : 'Springfield, USA'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderTop: '1px solid var(--border)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}>
            <span>Showing page {page} of {totalPages}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page === 1}
                onClick={() => setPage(pr => Math.max(1, pr - 1))}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(pr => Math.min(totalPages, pr + 1))}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Parent Detail Modal */}
      {selectedParent && (
        <div className="modal-backdrop" onClick={() => setSelectedParent(null)}>
          <div className="modal-card" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="avatar avatar-lg">
                  {getInitials(selectedParent.full_name)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedParent.full_name}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Guardian Profile</p>
                </div>
              </div>
              <button type="button" className="icon-btn btn-sm" onClick={() => setSelectedParent(null)}>
                <X size={15} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="card" style={{ padding: 12 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Email</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, fontSize: '0.82rem' }}>
                    {selectedParent.email || selectedParent.linked_user_email || 'parent@example.com'}
                  </p>
                </div>
                <div className="card" style={{ padding: 12 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Phone</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, fontSize: '0.82rem' }}>
                    {selectedParent.phone || '+1 (555) 019-3829'}
                  </p>
                </div>
                <div className="card" style={{ padding: 12, gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Occupation & Address</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, fontSize: '0.82rem' }}>
                    {selectedParent.occupation || 'Engineer'} • {selectedParent.address || '742 Evergreen Terrace'}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedParent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
