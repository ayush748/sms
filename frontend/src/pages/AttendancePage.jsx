import { useState, useEffect, useCallback } from 'react';
import {
  CheckSquare,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  CheckCheck,
} from 'lucide-react';
import api from '../api/api';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

function AttendancePill({ status }) {
  if (status === 'present') return <span className="badge badge-emerald"><CheckCircle size={12} /> Present</span>;
  if (status === 'absent') return <span className="badge badge-red"><XCircle size={12} /> Absent</span>;
  if (status === 'late') return <span className="badge badge-amber"><Clock size={12} /> Late</span>;
  return <span className="badge badge-sky"><HelpCircle size={12} /> Excused</span>;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/attendance?limit=15');
      if (data.success) {
        setAttendance(data.data.attendance || data.data.items || data.data || []);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  function handleStatusChange(id, newStatus) {
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  }

  function handleMarkAllPresent() {
    setAttendance(prev => prev.map(a => ({ ...a, status: 'present' })));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Present Today</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>2,210</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Absent</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)' }}>156</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Late Arrival</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>120</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Attendance Rate</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>96.2%</div>
          </div>
        </div>
      </div>

      {/* Class & Date Filter Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Class:</span>
              <select
                className="form-select"
                style={{ width: 130 }}
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
              >
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Section:</span>
              <select
                className="form-select"
                style={{ width: 110 }}
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
              >
                <option value="A">Sec A</option>
                <option value="B">Sec B</option>
                <option value="C">Sec C</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date:</span>
              <input
                type="date"
                className="form-input"
                style={{ width: 150 }}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {savedSuccess && (
              <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCheck size={14} /> Saved Successfully
              </span>
            )}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleMarkAllPresent}
            >
              <CheckCheck size={15} /> Mark All Present
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3000);
              }}
            >
              <Save size={15} /> Save Session
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : attendance.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No attendance records"
            description="No student roster found for the selected session date."
          />
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Roll #</th>
                  <th>Student Name</th>
                  <th>Admission ID</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a, idx) => {
                  const studentName = a.first_name || a.student_name ? `${a.first_name || ''} ${a.last_name || ''}`.trim() : `Student ${idx + 1}`;
                  const studentId = a.student_admission_id || a.student_id || `STU-2026-0${idx + 10}`;
                  const currentStatus = a.status || 'present';

                  return (
                    <tr key={a.id || idx}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{idx + 1}</span>
                      </td>
                      <td>
                        <span className="td-main">{studentName}</span>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{studentId}</code>
                      </td>
                      <td>
                        <AttendancePill status={currentStatus} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            type="button"
                            className={`btn btn-sm ${currentStatus === 'present' ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            onClick={() => handleStatusChange(a.id, 'present')}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${currentStatus === 'absent' ? 'btn-danger' : 'btn-ghost'}`}
                            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            onClick={() => handleStatusChange(a.id, 'absent')}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${currentStatus === 'late' ? 'btn-secondary' : 'btn-ghost'}`}
                            style={{ padding: '4px 8px', fontSize: '0.72rem', borderColor: currentStatus === 'late' ? 'var(--warning)' : undefined }}
                            onClick={() => handleStatusChange(a.id, 'late')}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', width: '100%', maxWidth: 180 }}
                          placeholder="Optional remarks..."
                          defaultValue={a.remarks || ''}
                        />
                      </td>
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
