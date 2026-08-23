import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  LogOut,
  Droplet,
  CheckCircle2
} from 'lucide-react';
import { apiAuth, setGatewayConfig } from '../services/api';

export default function AuthModal({ user, setUser, onClose, onShowToast }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('DONOR');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegisterMode) {
      await apiAuth.register({ email, password, fullName, bloodGroup, city, phone, role });
      onShowToast(`User ${email} registered via Gateway (/auth/register)`);
      setIsRegisterMode(false);
    } else {
      const res = await apiAuth.login({ email, password });
      setUser(res.user || { email, role });
      onShowToast(`Logged in successfully! Issued OAuth 2.0 JWT Token.`);
      onClose();
    }
  };

  const handleLogout = () => {
    setUser(null);
    setGatewayConfig({ token: null });
    onShowToast('Logged out from API Gateway.');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">
            <ShieldCheck size={20} color="var(--color-brand-primary)" />
            <span>BloodLink Authentication (OAuth 2.0)</span>
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {user ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-accent-emerald-light)', color: 'var(--color-accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', border: '1px solid var(--color-accent-emerald-border)' }}>
              <ShieldCheck size={32} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>Authenticated Session</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Logged in as <strong>{user.email}</strong> ({user.role || 'USER'})
            </p>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={14} color="var(--color-accent-emerald)" /> OAuth 2.0 JWT Token Active
              </div>
              Validated through User & Auth Gateway Service on Port 8080.
            </div>

            <button className="btn btn-primary" onClick={handleLogout} style={{ backgroundColor: 'var(--color-accent-rose)' }}>
              <LogOut size={16} /> Terminate Session
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Mail size={13} style={{ display: 'inline', marginRight: '0.3rem' }} /> Email Address
              </label>
              <input 
                type="email" 
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="donor@blood.lk"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={13} style={{ display: 'inline', marginRight: '0.3rem' }} /> Password
              </label>
              <input 
                type="password" 
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isRegisterMode && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kasun Perera"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Colombo"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">User Role</label>
                    <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="DONOR">Donor</option>
                      <option value="RECIPIENT">Recipient</option>
                      <option value="HOSPITAL">Hospital Staff</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem' }}>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: 'var(--color-brand-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
                onClick={() => setIsRegisterMode(!isRegisterMode)}
              >
                {isRegisterMode ? 'Already have an account? Login' : "Don't have an account? Register"}
              </button>

              <button type="submit" className="btn btn-primary">
                {isRegisterMode ? 'Register User' : 'Login / Authorize'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
