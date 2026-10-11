import { useState } from 'react';
import { Bell, Calendar, Clock, User, Tag, PlusCircle } from 'lucide-react';

const NOTICES = [
  {
    id: 1,
    title: 'Grade 10 & 12 Pre-Board Exam Schedule Released',
    content: 'The date sheet for Grade 10 & 12 Pre-Board examinations has been finalized. Invigilation duty rosters are available in the Staff Room. Students are requested to bring admit cards starting Monday.',
    date: 'Today, 9:00 AM',
    author: 'Principal Office',
    category: 'Academic',
    categoryColor: 'badge-emerald',
  },
  {
    id: 2,
    title: 'Annual Inter-House Sports Meet Registrations Open',
    content: 'House Captains are invited to submit their participant lists for track and field events, football, and basketball by next Friday. Sports practice will commence daily from 3:30 PM.',
    date: 'Yesterday, 2:30 PM',
    author: 'Physical Education Dept',
    category: 'Sports & Events',
    categoryColor: 'badge-amber',
  },
  {
    id: 3,
    title: 'Term 1 Parent-Teacher Meeting (PTM) Timing Circular',
    content: 'The first term PTM will be conducted this Saturday from 9:00 AM to 1:00 PM. Parents can book individual time slots with subject educators via the Parent Portal.',
    date: 'Sep 28, 2026',
    author: 'Academic Coordinator',
    category: 'General',
    categoryColor: 'badge-sky',
  },
];

export default function AnnouncementsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Official School Circulars & Notice Board</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Broadcasting announcements to teachers, students, and guardians</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {NOTICES.map(n => (
          <div key={n.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</h4>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={12} /> {n.author}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {n.date}</span>
                  </div>
                </div>
              </div>
              <span className={`badge ${n.categoryColor}`}>{n.category}</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {n.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
