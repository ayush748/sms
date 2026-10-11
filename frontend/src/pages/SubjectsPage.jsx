import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Award,
  Layers,
  Search,
  PlusCircle,
} from 'lucide-react';
import api from '../api/api';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/subjects?limit=20');
      if (data.success) {
        setSubjects(data.data.subjects || data.data.items || data.data || []);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Subjects Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : subjects.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No subjects found"
            description="Curriculum subjects will appear here."
          />
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Title</th>
                  <th>Department</th>
                  <th>Credit Units</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, idx) => (
                  <tr key={s.id || idx}>
                    <td>
                      <code style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        {s.subject_code || s.code || `SUB-10${idx + 1}`}
                      </code>
                    </td>
                    <td>
                      <span className="td-main">{s.subject_name || s.name || 'Core Curriculum'}</span>
                    </td>
                    <td>
                      <span className="badge badge-slate">{s.department_name || 'General Studies'}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{s.credit_hours ?? s.credits ?? 3} Credits</td>
                    <td><span className="badge badge-emerald">Active</span></td>
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
