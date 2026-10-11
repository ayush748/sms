import { useState, useEffect, useCallback } from 'react';
import {
  FileSpreadsheet,
  Calendar,
  Clock,
  MapPin,
  Award,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import api from '../api/api';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

function ExamStatusPill({ status }) {
  const map = {
    scheduled: 'badge-sky',
    ongoing: 'badge-amber',
    completed: 'badge-emerald',
    cancelled: 'badge-red',
  };
  return <span className={`badge ${map[status] || 'badge-sky'}`}>{status || 'scheduled'}</span>;
}

export default function ExaminationsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/examinations?limit=15');
      if (data.success) {
        setExams(data.data.examinations || data.data.items || data.data || []);
      }
    } catch (err) {
      console.error('Failed to load exams:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Exams Scheduled</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>8</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Upcoming Session</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Midterm 2026</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Grading System</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>Standard GPA</div>
          </div>
        </div>
      </div>

      {/* Examinations Timetable Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : exams.length === 0 ? (
          <EmptyState
            icon={FileSpreadsheet}
            title="No examinations scheduled"
            description="Examination periods and timetable schedules will appear here."
          />
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Exam Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e, idx) => (
                  <tr key={e.id || idx}>
                    <td>
                      <span className="td-main">{e.exam_name || e.title || 'Midterm Assessment 2026'}</span>
                    </td>
                    <td>
                      <span className="badge badge-slate">{e.exam_type || 'Term Exam'}</span>
                    </td>
                    <td>{e.start_date ? new Date(e.start_date).toLocaleDateString() : '15 Oct 2026'}</td>
                    <td>{e.end_date ? new Date(e.end_date).toLocaleDateString() : '28 Oct 2026'}</td>
                    <td><ExamStatusPill status={e.status || 'scheduled'} /></td>
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
