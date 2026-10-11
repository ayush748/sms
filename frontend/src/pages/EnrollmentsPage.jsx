import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList,
  Search,
  CheckCircle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../api/api';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

function EnrollmentStatusPill({ status }) {
  const map = {
    active: 'badge-emerald',
    completed: 'badge-sky',
    dropped: 'badge-red',
    suspended: 'badge-amber',
  };
  return <span className={`badge ${map[status] || 'badge-emerald'}`}>{status || 'active'}</span>;
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      const { data } = await api.get(`/enrollments?${params}`);
      if (data.success) {
        setEnrollments(data.data.enrollments || data.data.items || data.data || []);
        setPagination(data.data.pagination || {});
      }
    } catch (err) {
      console.error('Failed to load enrollments:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  const totalPages = pagination.totalPages || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : enrollments.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No enrollments found"
            description="Student class enrollments will appear here."
          />
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assigned Class</th>
                  <th>Section</th>
                  <th>Academic Session</th>
                  <th>Status</th>
                  <th>Enrollment Date</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e, idx) => (
                  <tr key={e.id || idx}>
                    <td>
                      <span className="td-main">
                        {e.student_name || `${e.first_name || ''} ${e.last_name || ''}`.trim() || `Student #${idx + 1}`}
                      </span>
                    </td>
                    <td>{e.class_name || 'Grade 10'}</td>
                    <td><span className="badge badge-slate">{e.section_name || 'Section A'}</span></td>
                    <td>{e.academic_year_name || '2026–2027'}</td>
                    <td><EnrollmentStatusPill status={e.status || 'active'} /></td>
                    <td>{e.enrollment_date ? new Date(e.enrollment_date).toLocaleDateString() : '01 Aug 2026'}</td>
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
    </div>
  );
}
