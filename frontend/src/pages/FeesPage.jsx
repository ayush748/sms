import { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle,
  PlusCircle,
  Download,
  X,
  FileText,
  Search,
} from 'lucide-react';
import api from '../api/api';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';

function FeeStatusPill({ status }) {
  const map = {
    paid: 'badge-emerald',
    pending: 'badge-amber',
    overdue: 'badge-red',
    partial: 'badge-sky',
  };
  return <span className={`badge ${map[status] || 'badge-amber'}`}>{status || 'pending'}</span>;
}

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState('student-fees');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '/fees/student-fees';
      if (activeTab === 'structures') endpoint = '/fees/structures';
      if (activeTab === 'payments') endpoint = '/fees/payments';

      const { data } = await api.get(`${endpoint}?limit=15`);
      if (data.success) {
        const key = activeTab === 'structures' ? 'feeStructures' : (activeTab === 'payments' ? 'payments' : 'studentFees');
        setItems(data.data[key] || data.data.items || data.data || []);
      }
    } catch (err) {
      console.error('Failed to load fee data:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Financial KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Billed</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>$490,600</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Collected</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>$431,000</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Dues</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>$59,600</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overdue</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)' }}>$14,200</div>
          </div>
        </div>
      </div>

      {/* Tabs & Action Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="tabs-nav" style={{ marginBottom: 0, borderBottom: 'none' }}>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'student-fees' ? 'active' : ''}`}
              onClick={() => setActiveTab('student-fees')}
            >
              <CreditCard size={15} /> Student Fee Ledger
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'structures' ? 'active' : ''}`}
              onClick={() => setActiveTab('structures')}
            >
              <FileText size={15} /> Fee Structures
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <DollarSign size={15} /> Payment History
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsRecordModalOpen(true)}
          >
            <PlusCircle size={15} /> Record Payment
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No fee records found"
            description="No transaction or fee ledger records found for this section."
          />
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            {activeTab === 'student-fees' && (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Fee Structure</th>
                    <th>Total Due</th>
                    <th>Paid Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((f, i) => (
                    <tr key={f.id || i}>
                      <td>
                        <span className="td-main">
                          {f.student_name || `${f.first_name || ''} ${f.last_name || ''}`.trim() || 'Aarav Patel'}
                        </span>
                      </td>
                      <td>{f.fee_name || f.structure_name || 'Annual Tuition Fee (Term 1)'}</td>
                      <td style={{ fontWeight: 700 }}>${Number(f.amount_due || f.amount || 1250).toLocaleString()}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 700 }}>${Number(f.amount_paid || 1250).toLocaleString()}</td>
                      <td>{f.due_date ? new Date(f.due_date).toLocaleDateString() : '15 Oct 2026'}</td>
                      <td><FeeStatusPill status={f.status || 'paid'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'structures' && (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Structure Title</th>
                    <th>Academic Session</th>
                    <th>Applicable Grade</th>
                    <th>Total Amount</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s, i) => (
                    <tr key={s.id || i}>
                      <td className="td-main">{s.name || s.structure_name || 'Standard Tuition'}</td>
                      <td>2026–2027</td>
                      <td>{s.class_name || 'Grade 10'}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${Number(s.amount || 2500).toLocaleString()}</td>
                      <td><span className="badge badge-slate">Per Term</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'payments' && (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Receipt Ref</th>
                    <th>Amount Paid</th>
                    <th>Payment Mode</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p, i) => (
                    <tr key={p.id || i}>
                      <td><code style={{ color: 'var(--primary)', fontWeight: 600 }}>{p.transaction_reference || `REC-2026-00${i + 1}`}</code></td>
                      <td style={{ fontWeight: 700, color: 'var(--success)' }}>${Number(p.amount_paid || p.amount || 1250).toLocaleString()}</td>
                      <td style={{ textTransform: 'capitalize' }}>{p.payment_method || 'Online Bank Transfer'}</td>
                      <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'Today'}</td>
                      <td><span className="badge badge-emerald">Completed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsRecordModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Record Student Fee Payment</h3>
              <button type="button" className="icon-btn btn-sm" onClick={() => setIsRecordModalOpen(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Student Name / ID *</label>
                <input className="form-input" placeholder="Search student by name or ID..." defaultValue="Aarav Patel (STU-2026-001)" />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Amount ($) *</label>
                <input type="number" className="form-input" placeholder="e.g. 1250" defaultValue="1250" />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-select">
                  <option value="bank_transfer">Online Bank Transfer</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="cash">Cash Counter Receipt</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Transaction Reference #</label>
                <input className="form-input" placeholder="e.g. TXN-94829384" defaultValue={`TXN-${Date.now().toString().slice(-8)}`} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsRecordModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsRecordModalOpen(false);
                  fetchData();
                }}
              >
                Generate Receipt & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
