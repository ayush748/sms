import { useState, useEffect, useCallback } from 'react';
import {
  Award,
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  FileText,
  Download,
} from 'lucide-react';
import api from '../api/api';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

function GradePill({ grade, isPass }) {
  if (isPass === false || grade === 'F') {
    return <span className="badge badge-red">Grade F (Fail)</span>;
  }
  return <span className="badge badge-emerald">Grade {grade || 'A+'}</span>;
}

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/results?limit=15');
      if (data.success) {
        setResults(data.data.results || data.data.items || data.data || []);
      }
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Academic Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>School Average</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>86.4%</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pass Rate</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>98.2%</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Top Scoring Class</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>Grade 10-A</div>
          </div>
        </div>
      </div>

      {/* Results Gradebook Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : results.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No grade records found"
            description="Published exam scores and report cards will appear here."
          />
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Exam Title</th>
                  <th>Subject</th>
                  <th>Marks Scored</th>
                  <th>Percentage</th>
                  <th>Grade Awarded</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => {
                  const studentName = r.student_name || `${r.first_name || ''} ${r.last_name || ''}`.trim() || `Student #${idx + 1}`;
                  const marks = Number(r.marks_obtained ?? r.marks ?? 92);
                  const max = Number(r.max_marks ?? r.total_marks ?? 100);
                  const pct = Math.round((marks / max) * 100);

                  return (
                    <tr key={r.id || idx}>
                      <td><span className="td-main">{studentName}</span></td>
                      <td>{r.exam_name || 'Midterm Assessment 2026'}</td>
                      <td>
                        <span className="badge badge-slate">{r.subject_name || 'Mathematics'}</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{marks} / {max}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, backgroundColor: 'var(--bg-muted)', borderRadius: 3, overflow: 'hidden', width: 60 }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: pct >= 80 ? 'var(--success)' : 'var(--warning)' }} />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{pct}%</span>
                        </div>
                      </td>
                      <td><GradePill grade={r.grade} isPass={r.is_pass} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
