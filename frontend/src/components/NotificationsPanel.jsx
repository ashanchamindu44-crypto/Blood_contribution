import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  ShieldAlert,
  Clock,
  Filter,
  MessageSquare
} from 'lucide-react';
import { apiNotifications } from '../services/api';

export default function NotificationsPanel({ notifications, setNotifications, onShowToast }) {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const [smsForm, setSmsForm] = useState({
    recipient: 'O- Donors in Western Province',
    phone: '+94 77 123 4567',
    title: 'Urgent O- Blood Needed',
    message: 'Urgent need of O- blood at National Hospital Colombo. Please contact hospital or respond if available.',
  });

  const handleSendBroadcast = async (e) => {
    e.preventDefault();

    await apiNotifications.sendSms(smsForm);

    const newNotif = {
      id: `NOTIF-${Math.floor(10 + Math.random() * 90)}`,
      type: 'EMERGENCY',
      title: smsForm.title,
      message: smsForm.message,
      recipient: smsForm.recipient,
      time: 'Just now',
      status: 'SENT',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setShowBroadcastModal(false);
    onShowToast(`[Notification Service] Dispatched SMS Alert via API /notify/sms to ${smsForm.recipient}`);
  };

  const filteredNotifs = selectedFilter === 'ALL' 
    ? notifications 
    : notifications.filter(n => n.type === selectedFilter);

  return (
    <div>
      {/* Section Header & Dispatch Button */}
      <div className="section-header">
        <div className="section-title-wrapper">
          <Bell size={22} color="var(--color-brand-primary)" />
          <h2 className="section-title">Notifications & Emergency Dispatcher</h2>
        </div>

        <button className="btn btn-primary" onClick={() => setShowBroadcastModal(true)}>
          <Send size={16} />
          <span>Dispatch Emergency SMS Alert</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'EMERGENCY', 'MATCH', 'SYSTEM'].map((type) => (
          <button
            key={type}
            className={`btn ${selectedFilter === type ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-full)'
            }}
            onClick={() => setSelectedFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div>
        {filteredNotifs.map((n) => (
          <div key={n.id} className={`notification-item ${n.type.toLowerCase()}`}>
            <div 
              style={{ 
                padding: '0.65rem', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: n.type === 'EMERGENCY' ? 'var(--color-accent-rose-light)' : n.type === 'MATCH' ? 'var(--color-accent-emerald-light)' : 'var(--color-accent-blue-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {n.type === 'EMERGENCY' && <AlertTriangle size={20} color="var(--color-accent-rose)" />}
              {n.type === 'MATCH' && <CheckCircle2 size={20} color="var(--color-accent-emerald)" />}
              {n.type === 'SYSTEM' && <Smartphone size={20} color="var(--color-accent-blue)" />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-heading)' }}>{n.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {n.time}
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.6rem', lineHeight: 1.5 }}>
                {n.message}
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>Target: <strong>{n.recipient}</strong></span>
                <span>Status: <strong style={{ color: 'var(--color-accent-emerald)' }}>{n.status}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast SMS Modal */}
      {showBroadcastModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">
                <Send size={20} color="var(--color-brand-primary)" />
                <span>Emergency Broadcast - Notification Service</span>
              </h3>
              <button 
                onClick={() => setShowBroadcastModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast}>
              <div className="form-group">
                <label className="form-label">Alert Target / Group Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={smsForm.recipient}
                  onChange={(e) => setSmsForm({ ...smsForm, recipient: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Phone Number (/notify/sms)</label>
                <input 
                  type="tel" 
                  className="form-input"
                  value={smsForm.phone}
                  onChange={(e) => setSmsForm({ ...smsForm, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alert Title</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={smsForm.title}
                  onChange={(e) => setSmsForm({ ...smsForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alert Message Body</label>
                <textarea 
                  className="form-textarea"
                  rows="3"
                  value={smsForm.message}
                  onChange={(e) => setSmsForm({ ...smsForm, message: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBroadcastModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Dispatch SMS via Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
