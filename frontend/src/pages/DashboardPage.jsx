import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  Layers,
  CheckSquare,
  CreditCard,
  AlertCircle,
  FileSpreadsheet,
  UserPlus,
  ArrowRight,
  Sparkles,
  Clock,
  Award,
  BookOpen,
  Calendar,
  Bell,
  CheckCircle2,
  DollarSign,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { CardSkeleton } from '../components/LoadingSkeleton';

// Shared Chart Mock Data
const ENROLLMENT_DATA = [
  { month: 'Jan', students: 2150 },
  { month: 'Feb', students: 2210 },
  { month: 'Mar', students: 2260 },
  { month: 'Apr', students: 2300 },
  { month: 'May', students: 2340 },
  { month: 'Jun', students: 2380 },
  { month: 'Jul', students: 2420 },
  { month: 'Aug', students: 2460 },
  { month: 'Sep', students: 2486 },
];

const ATTENDANCE_PIE = [
  { name: 'Present', value: 2210, color: '#16a34a' },
  { name: 'Absent', value: 156, color: '#dc2626' },
  { name: 'Late', value: 120, color: '#f59e0b' },
];

const FEE_COLLECTION_DATA = [
  { grade: 'Grade 6', collected: 45000, pending: 8000 },
  { grade: 'Grade 7', collected: 52000, pending: 9500 },
  { grade: 'Grade 8', collected: 48000, pending: 11000 },
  { grade: 'Grade 9', collected: 61000, pending: 7200 },
  { grade: 'Grade 10', collected: 75000, pending: 6500 },
  { grade: 'Grade 11', collected: 68000, pending: 12400 },
  { grade: 'Grade 12', collected: 82000, pending: 5000 },
];

const ACADEMIC_PERFORMANCE = [
  { grade: 'Class 6', average: 84 },
  { grade: 'Class 7', average: 81 },
  { grade: 'Class 8', average: 79 },
  { grade: 'Class 9', average: 86 },
  { grade: 'Class 10', average: 89 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const role = (user?.role || 'admin').toLowerCase();

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (role === 'teacher') {
    return <TeacherDashboard user={user} todayStr={todayStr} />;
  }
  if (role === 'student') {
    return <StudentDashboard user={user} todayStr={todayStr} />;
  }
  if (role === 'parent') {
    return <ParentDashboard user={user} todayStr={todayStr} />;
  }

  // Default to Admin Dashboard
  return <AdminDashboard user={user} todayStr={todayStr} />;
}

/* ==========================================================================
   1. ADMIN DASHBOARD
   ========================================================================== */
function AdminDashboard({ user, todayStr }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const results = await Promise.allSettled([
          api.get('/students?limit=1'),
          api.get('/teachers?limit=1'),
          api.get('/classes?limit=1'),
          api.get('/attendance?limit=1'),
          api.get('/examinations?limit=1'),
        ]);

        const [students, teachers, classes, attendance, exams] = results;

        setStats({
          students: students.value?.data?.data?.pagination?.total ?? 2486,
          teachers: teachers.value?.data?.data?.pagination?.total ?? 142,
          classes: classes.value?.data?.data?.pagination?.total ?? 24,
          attendance: attendance.value?.data?.data?.pagination?.total ?? '96.2%',
          exams: exams.value?.data?.data?.pagination?.total ?? 8,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header Banner */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.08) 0%, rgba(217, 119, 6, 0.05) 100%)',
          borderColor: 'rgba(22, 101, 52, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          padding: '24px 30px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              Administrator Overview
            </span>
            <span>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{todayStr}</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'Administrator'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Here is your school's live attendance, financial health, academic metrics, and admissions overview today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/students" className="btn btn-primary btn-sm">
            <UserPlus size={15} /> Add Admission
          </a>
          <a href="/attendance" className="btn btn-secondary btn-sm">
            <CheckSquare size={15} /> Take Attendance
          </a>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          <StatCard
            title="Total Students"
            value={stats.students?.toLocaleString?.() || '2,486'}
            icon={GraduationCap}
            trend="+8.2%"
            trendLabel="from last month"
            color="emerald"
            delay={0.05}
          />
          <StatCard
            title="Faculty & Teachers"
            value={stats.teachers || '142'}
            icon={Users}
            trend="+3.4%"
            trendLabel="active teaching staff"
            color="sky"
            delay={0.1}
          />
          <StatCard
            title="Today's Attendance"
            value="96.2%"
            icon={CheckSquare}
            trend="+1.8%"
            trendLabel="2,210 of 2,486 present"
            color="emerald"
            delay={0.15}
          />
          <StatCard
            title="Fees Collected (Term)"
            value="$431,000"
            icon={CreditCard}
            trend="+12.5%"
            trendLabel="86% collection rate"
            color="amber"
            delay={0.2}
          />
          <StatCard
            title="Pending Tuition Fees"
            value="$59,600"
            icon={AlertCircle}
            trend="-4.1%"
            trendLabel="due within 30 days"
            color="terracotta"
            delay={0.25}
          />
          <StatCard
            title="Active Classes"
            value={stats.classes || '24'}
            icon={Layers}
            trend="100%"
            trendLabel="curriculum allocated"
            color="emerald"
            delay={0.3}
          />
          <StatCard
            title="Upcoming Examinations"
            value={stats.exams || '8'}
            icon={FileSpreadsheet}
            trend="Midterms"
            trendLabel="starts Oct 15"
            color="sky"
            delay={0.35}
          />
          <StatCard
            title="New Admissions (Q3)"
            value="184"
            icon={Sparkles}
            trend="+15.0%"
            trendLabel="exceeds target"
            color="amber"
            delay={0.4}
          />
        </div>
      )}

      {/* Primary Analytics Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Student Enrollment Growth Area Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Student Enrollment Growth</h3>
              <p className="card-subtitle">Monthly total active students enrolled in 2026</p>
            </div>
            <span className="badge badge-emerald">Live Trend</span>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENROLLMENT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[2000, 2600]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                />
                <Area type="monotone" dataKey="students" stroke="#166534" strokeWidth={2.5} fillOpacity={1} fill="url(#emeraldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Breakdown Donut Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Today's Attendance</h3>
              <p className="card-subtitle">Status breakdown for today</p>
            </div>
          </div>

          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ATTENDANCE_PIE}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ATTENDANCE_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10, fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#16a34a' }} />
              <span>Present: 2,210</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#dc2626' }} />
              <span>Absent: 156</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <span>Late: 120</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Fee Collections & Grade Academic Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Fee Collection by Grade */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Tuition Fee Collections by Grade</h3>
              <p className="card-subtitle">Collected vs Pending amounts ($ USD)</p>
            </div>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FEE_COLLECTION_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="grade" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: 8 }} />
                <Bar dataKey="collected" name="Collected ($)" fill="#166534" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending ($)" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Academic Performance by Class */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Academic Performance by Class</h3>
              <p className="card-subtitle">Average score percentage across classes</p>
            </div>
            <Award size={18} color="var(--primary)" />
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACADEMIC_PERFORMANCE} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" domain={[50, 100]} stroke="var(--text-muted)" fontSize={11} />
                <YAxis dataKey="grade" type="category" stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="average" name="Class Average %" fill="#059669" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. TEACHER DASHBOARD
   ========================================================================== */
function TeacherDashboard({ user, todayStr }) {
  const teacherSchedule = [
    { time: '08:30 AM - 09:30 AM', subject: 'Mathematics (10-A)', room: 'Room 204', status: 'Completed', color: 'emerald' },
    { time: '09:45 AM - 10:45 AM', subject: 'Advanced Algebra (11-B)', room: 'Room 302', status: 'In Progress', color: 'amber' },
    { time: '11:15 AM - 12:15 PM', subject: 'Physics Lab (9-A)', room: 'Lab 2', status: 'Upcoming', color: 'sky' },
    { time: '02:00 PM - 03:00 PM', subject: 'Calculus (12-A)', room: 'Room 204', status: 'Upcoming', color: 'sky' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header Banner */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.1) 0%, rgba(2, 132, 199, 0.06) 100%)',
          borderColor: 'rgba(22, 101, 52, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          padding: '24px 30px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              Faculty Portal
            </span>
            <span>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{todayStr}</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome back, {user?.name || 'Prof. Educator'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Department of Science & Mathematics • You have 4 teaching sessions scheduled today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/attendance" className="btn btn-primary btn-sm">
            <CheckSquare size={15} /> Take Class Attendance
          </a>
          <a href="/results" className="btn btn-secondary btn-sm">
            <Award size={15} /> Enter Grades
          </a>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        <StatCard title="Assigned Classes" value="4 Classes" icon={Layers} trend="142 Students" trendLabel="total enrollment" color="emerald" />
        <StatCard title="Today's Attendance" value="98.5%" icon={UserCheck} trend="3 of 4" trendLabel="sessions recorded" color="sky" />
        <StatCard title="Upcoming Exams" value="2 Midterms" icon={FileSpreadsheet} trend="Oct 15" trendLabel="exam start date" color="amber" />
        <StatCard title="Avg Class Score" value="86.4%" icon={TrendingUp} trend="+2.3%" trendLabel="vs last term" color="emerald" />
      </div>

      {/* Schedule & Quick Attendance Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 20 }}>
        {/* Today's Schedule Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Today's Teaching Schedule</h3>
              <p className="card-subtitle">Your allocated periods and room assignments</p>
            </div>
            <span className="badge badge-emerald"><Calendar size={13} style={{ marginRight: 4 }} /> Active Day</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {teacherSchedule.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-muted)',
                borderLeft: `4px solid ${item.color === 'emerald' ? '#166534' : item.color === 'amber' ? '#d97706' : '#0284c7'}`,
              }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.subject}</h4>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {item.time}</span>
                    <span>•</span>
                    <span>{item.room}</span>
                  </div>
                </div>
                <div>
                  <span className={`badge badge-${item.color}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Widgets */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <h3 className="card-title">Class Management Quick Actions</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Quickly record daily roll call, publish assignment scores, or post announcements to your enrolled classes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="/attendance" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <CheckSquare size={16} /> Record Attendance for Class 10-A
              </a>
              <a href="/results" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Award size={16} /> Enter Midterm Test Scores
              </a>
              <a href="/announcements" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Bell size={16} /> Broadcast Class Announcement
              </a>
            </div>
          </div>

          <div style={{
            marginTop: 24,
            padding: '16px',
            backgroundColor: 'rgba(217, 119, 6, 0.08)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(217, 119, 6, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--amber)', fontWeight: 700, fontSize: '0.85rem' }}>
              <AlertCircle size={16} /> Pending Grade Submissions
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Class 11-B Unit Test 2 marks are due by Friday 5:00 PM for report card generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. STUDENT DASHBOARD
   ========================================================================== */
function StudentDashboard({ user, todayStr }) {
  const studentSubjects = [
    { name: 'Mathematics 10', teacher: 'Prof. Amit Sharma', score: '92%', grade: 'A+', attendance: '98%' },
    { name: 'Physics & Lab', teacher: 'Dr. Neha Verma', score: '88%', grade: 'A', attendance: '96%' },
    { name: 'Chemistry', teacher: 'Prof. Sandeep Singh', score: '84%', grade: 'B+', attendance: '92%' },
    { name: 'English Literature', teacher: 'Mrs. Priya Patel', score: '91%', grade: 'A+', attendance: '100%' },
    { name: 'Computer Science', teacher: 'Mr. Rahul Kumar', score: '96%', grade: 'O', attendance: '98%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header Banner */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.1) 0%, rgba(217, 119, 6, 0.08) 100%)',
          borderColor: 'rgba(22, 101, 52, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          padding: '24px 30px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              Student Portal
            </span>
            <span>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{todayStr}</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome back, {user?.name || 'Aarav Sharma'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Grade 10-A • Student ID: STU2026042 • Enrolled in 5 Core Subjects
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/results" className="btn btn-primary btn-sm">
            <Award size={15} /> My Report Card
          </a>
          <a href="/fees" className="btn btn-secondary btn-sm">
            <CreditCard size={15} /> Tuition Receipts
          </a>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        <StatCard title="Overall Grade" value="3.9 / 4.0 (A+)" icon={Award} trend="Rank #3" trendLabel="in Class 10-A" color="emerald" />
        <StatCard title="Attendance Rate" value="96.8%" icon={CheckCircle2} trend="178/184" trendLabel="days present" color="emerald" />
        <StatCard title="Fee Status" value="PAID ($0 Due)" icon={DollarSign} trend="Term 1 Cleared" trendLabel="receipt #8429" color="sky" />
        <StatCard title="Upcoming Exam" value="Oct 15" icon={FileSpreadsheet} trend="Mathematics" trendLabel="Midterm 1" color="amber" />
      </div>

      {/* Enrolled Subjects & Marks */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Enrolled Subjects & Academic Standing</h3>
              <p className="card-subtitle">Your score breakdown and class attendance rates</p>
            </div>
            <BookOpen size={18} color="var(--primary)" />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Faculty Instructor</th>
                  <th>Attendance</th>
                  <th>Current Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {studentSubjects.map((sub, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sub.name}</td>
                    <td>{sub.teacher}</td>
                    <td>
                      <span className="badge badge-emerald">{sub.attendance}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{sub.score}</td>
                    <td>
                      <span className="badge badge-amber">{sub.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notices for Student */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Class Bulletins & Deadlines</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Physics Lab Report #4 Due
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Submit hard copy by tomorrow 9:00 AM to Dr. Neha Verma.
              </p>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Midterm Exam Schedule Released
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Exams run from Oct 15 - Oct 24. Download timetable from Examinations tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. PARENT DASHBOARD
   ========================================================================== */
function ParentDashboard({ user, todayStr }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header Banner */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.1) 0%, rgba(231, 111, 81, 0.08) 100%)',
          borderColor: 'rgba(22, 101, 52, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          padding: '24px 30px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)' }}>
              Parent & Guardian Portal
            </span>
            <span>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{todayStr}</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome back, {user?.name || 'Suresh Sharma'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Linked Wards: Aarav Sharma (Grade 10-A) & Ananya Sharma (Grade 7-B)
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/fees" className="btn btn-primary btn-sm">
            <CreditCard size={15} /> Pay Tuition Fees
          </a>
          <a href="/announcements" className="btn btn-secondary btn-sm">
            <Bell size={15} /> School Notices
          </a>
        </div>
      </motion.div>

      {/* Linked Children Profiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Child 1 */}
        <div className="card" style={{ borderColor: 'rgba(22, 101, 52, 0.3)' }}>
          <div className="card-header" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 101, 52, 0.15)',
                color: 'var(--primary)',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}>
                AS
              </div>
              <div>
                <h3 className="card-title">Aarav Sharma</h3>
                <p className="card-subtitle">Grade 10-A • STU2026042</p>
              </div>
            </div>
            <span className="badge badge-emerald">Present Today</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '12px 0' }}>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Attendance</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>96.8%</h4>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Class Avg</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>89.2%</h4>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fee Dues</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a' }}>Cleared</h4>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <a href="/attendance" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              View Detailed Attendance Log →
            </a>
            <a href="/results" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              View Report Card →
            </a>
          </div>
        </div>

        {/* Child 2 */}
        <div className="card" style={{ borderColor: 'rgba(2, 132, 199, 0.3)' }}>
          <div className="card-header" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(2, 132, 199, 0.15)',
                color: '#0284c7',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}>
                AS
              </div>
              <div>
                <h3 className="card-title">Ananya Sharma</h3>
                <p className="card-subtitle">Grade 7-B • STU2026089</p>
              </div>
            </div>
            <span className="badge badge-emerald">Present Today</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '12px 0' }}>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Attendance</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>98.2%</h4>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Class Avg</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>91.5%</h4>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fee Dues</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a' }}>Cleared</h4>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <a href="/attendance" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              View Detailed Attendance Log →
            </a>
            <a href="/results" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              View Report Card →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
