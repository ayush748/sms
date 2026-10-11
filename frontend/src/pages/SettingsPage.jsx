import { useState } from 'react';
import {
  Settings,
  Building,
  Shield,
  Bell,
  Palette,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
      {saved && (
        <div style={{
          padding: '12px 18px',
          backgroundColor: 'var(--primary-light)',
          border: '1px solid rgba(22, 101, 52, 0.3)',
          color: 'var(--primary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <CheckCircle size={16} /> Configuration saved successfully.
        </div>
      )}

      {/* Institution Profile */}
      <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building size={18} color="var(--primary)" />
            <h3 className="card-title">School & Institution Details</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">School Name</label>
            <input className="form-input" defaultValue="EduManage International Academy" />
          </div>
          <div className="form-group">
            <label className="form-label">Affiliation / Board Code</label>
            <input className="form-input" defaultValue="CBSE / INT-9842" />
          </div>
          <div className="form-group">
            <label className="form-label">Official Contact Email</label>
            <input type="email" className="form-input" defaultValue="administration@edumanage.com" />
          </div>
          <div className="form-group">
            <label className="form-label">School Phone Number</label>
            <input type="tel" className="form-input" defaultValue="+1 (555) 019-2834" />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Campus Address</label>
            <input className="form-input" defaultValue="100 Academic Boulevard, Suite 400, Education City" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
          <button type="submit" className="btn btn-primary btn-sm">
            <Save size={15} /> Save Changes
          </button>
        </div>
      </form>

      {/* Preferences */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Palette size={18} color="var(--primary)" />
            <h3 className="card-title">Theme & Interface Preferences</h3>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Dark Theme Mode</h5>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Toggle between warm light and dark slate aesthetic</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={toggleTheme}>
            Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}
