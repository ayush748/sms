import { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  CheckCircle,
  PlusCircle,
} from 'lucide-react';
import api from '../api/api';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

export default function AcademicYearsPage() {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchYears = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/academic-years');
      if (data.success) {
        setAcademicYears(data.data.academicYears || data.data.items || data.data || []);
      }
    } catch (err) {
      console.error('Failed to load academic years:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchYears(); }, [fetchYears]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : academicYears.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No academic sessions found"
            description="Academic calendar terms will appear here."
          />
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Session Name</th>
                  <th>Session Code</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {academicYears.map((ay, idx) => (
                  <tr key={ay.id || idx}>
                    <td>
                      <span className="td-main">{ay.year_name || ay.name || '2026–2027 Academic Year'}</span>
                    </td>
                    <td>
                      <code style={{ color: 'var(--primary)', fontWeight: 600 }}>{ay.code || ay.year_code || 'AY-2026-27'}</code>
                    </td>
                    <td>{ay.start_date ? new Date(ay.start_date).toLocaleDateString() : '01 Jun 2026'}</td>
                    <td>{ay.end_date ? new Date(ay.end_date).toLocaleDateString() : '30 May 2027'}</td>
                    <td>
                      <span className="badge badge-emerald">
                        <CheckCircle size={12} /> Current Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
