import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';
import api from '../api/api';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

function getInitials(first, last) {
  return `${(first || '')[0] || ''}${(last || '')[0] || ''}`.toUpperCase() || 'T';
}

function StatusPill({ status }) {
  const map = {
    active: 'badge-emerald',
    inactive: 'badge-red',
    on_leave: 'badge-amber',
    retired: 'badge-slate',
  };
  return <span className={`badge ${map[status] || 'badge-emerald'}`}>{status || 'active'}</span>;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.set('search', search);

      const { data } = await api.get(`/teachers?${params}`);
      if (data.success) {
        setTeachers(data.data.teachers || []);
        setPagination(data.data.pagination || {});
      }
    } catch (err) {
      console.error('Failed to load teachers:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  const totalPages = pagination.totalPages || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Metric Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Faculty</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{pagination.total ?? 142}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Departments</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>12</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Experience</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>7.4 Yrs</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260 }}>
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                className="form-input"
                placeholder="Search teachers by name, employee ID, qualification..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm">Search</button>
          </form>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : teachers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No teachers found"
            description="Try changing your search keywords."
          />
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Faculty Member</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Qualification</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>View</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t.id} onClick={() => setSelectedTeacher(t)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="avatar">
                          {getInitials(t.first_name, t.last_name)}
                        </div>
                        <div>
                          <div className="td-main">{t.first_name} {t.last_name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.linked_user_email || 'teacher@school.edu'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>{t.employee_id}</code>
                    </td>
                    <td>
                      <span className="badge badge-slate">{t.department_name || 'Academics'}</span>
                    </td>
                    <td>{t.qualification || 'M.Sc., B.Ed'}</td>
                    <td>
                      <div style={{ fontSize: '0.78rem' }}>{t.phone || '+1 (555) 019-3829'}</div>
                    </td>
                    <td><StatusPill status={t.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="icon-btn btn-sm"
                        style={{ width: 30, height: 30, display: 'inline-flex' }}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTeacher(t);
                        }}
                      >
                        <Eye size={14} />
                      </button>
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
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Teacher Profile Modal */}
      {selectedTeacher && (
        <div className="modal-backdrop" onClick={() => setSelectedTeacher(null)}>
          <div className="modal-card" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="avatar avatar-lg">
                  {getInitials(selectedTeacher.first_name, selectedTeacher.last_name)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedTeacher.first_name} {selectedTeacher.last_name}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Employee ID: {selectedTeacher.employee_id}</p>
                </div>
              </div>
              <button type="button" className="icon-btn btn-sm" onClick={() => setSelectedTeacher(null)}>
                <X size={15} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="card" style={{ padding: 14 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Mail size={12} /> Email
                  </span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, fontSize: '0.82rem' }}>
                    {selectedTeacher.linked_user_email || 'teacher@school.edu'}
                  </p>
                </div>
                <div className="card" style={{ padding: 14 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={12} /> Phone
                  </span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, fontSize: '0.82rem' }}>
                    {selectedTeacher.phone || '+1 (555) 019-3829'}
                  </p>
                </div>
                <div className="card" style={{ padding: 14 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Department</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, fontSize: '0.82rem' }}>
                    {selectedTeacher.department_name || 'Academics'}
                  </p>
                </div>
                <div className="card" style={{ padding: 14 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Qualification</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, fontSize: '0.82rem' }}>
                    {selectedTeacher.qualification || 'Master of Science'}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedTeacher(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
