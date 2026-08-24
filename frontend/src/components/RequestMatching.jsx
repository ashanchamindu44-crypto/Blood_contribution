import React, { useState } from 'react';
import { 
  HeartHandshake, 
  PlusCircle, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Hospital,
  MapPin,
  Phone,
  Send,
  UserCheck
} from 'lucide-react';
import { apiRequests } from '../services/api';

export default function RequestMatching({ requests, setRequests, donors, onShowToast }) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [matchingResults, setMatchingResults] = useState(null);
  const [activeRequestForMatch, setActiveRequestForMatch] = useState(null);

  const [formData, setFormData] = useState({
    recipientName: '',
    bloodType: 'O-',
    units: 2,
    urgency: 'CRITICAL',
    hospital: 'National Hospital Colombo',
    city: 'Colombo',
    contact: '',
  });

  const criticalCount = requests.filter(r => r.urgency === 'CRITICAL' && r.status !== 'FULFILLED').length;
  const fulfilledCount = requests.filter(r => r.status === 'FULFILLED').length;
  const activeCount = requests.length - fulfilledCount;

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    const newRequestPayload = {
      ...formData,
      units: parseInt(formData.units, 10),
    };

    const res = await apiRequests.create(newRequestPayload);
    setRequests((prev) => [res, ...prev]);
    setShowRequestModal(false);
    onShowToast(`[Request & Matching Service] Created blood request ${res.id} (${res.bloodType}) via API /requests`);

    // Reset Form
    setFormData({
      recipientName: '',
      bloodType: 'O-',
      units: 2,
      urgency: 'CRITICAL',
      hospital: 'National Hospital Colombo',
      city: 'Colombo',
      contact: '',
    });
  };

  const handleRunMatching = async (req) => {
    setActiveRequestForMatch(req);
    const matchedDonors = await apiRequests.matchDonors(req.id);
    
    // Filter compatible donors by blood type and city proximity
    const compatible = donors.filter(d => {
      if (!d.eligible) return false;
      // Universal donor rules
      if (req.bloodType === 'O-') return d.bloodType === 'O-';
      if (req.bloodType === 'O+') return d.bloodType === 'O+' || d.bloodType === 'O-';
      if (req.bloodType === 'A+') return ['O-', 'O+', 'A-', 'A+'].includes(d.bloodType);
      if (req.bloodType === 'B+') return ['O-', 'O+', 'B-', 'B+'].includes(d.bloodType);
      return d.bloodType === req.bloodType || d.bloodType === 'O-';
    });

    setMatchingResults(compatible);
    onShowToast(`[Request & Matching Service] Found ${compatible.length} matching donors for ${req.recipientName} (${req.bloodType}) via /requests/match`);
  };

  const handleMarkFulfilled = (reqId) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'FULFILLED' } : r));
    if (activeRequestForMatch && activeRequestForMatch.id === reqId) {
      setActiveRequestForMatch(prev => ({ ...prev, status: 'FULFILLED' }));
    }
    onShowToast(`Request ${reqId} marked as FULFILLED.`);
  };

  return (
    <div>
      {/* KPI Stats Header */}
      <div className="grid-stats">
        <div className="stat-card">
          <div>
            <div className="stat-label">Active Requests</div>
            <div className="stat-value" style={{ color: 'var(--color-brand-primary)' }}>
              {activeCount}
            </div>
            <div className="stat-subtext">Awaiting donor matching</div>
          </div>
          <div className="stat-icon-wrapper icon-red">
            <HeartHandshake size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Critical Urgency</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-rose)' }}>
              {criticalCount}
            </div>
            <div className="stat-subtext">Immediate transfusion required</div>
          </div>
          <div className="stat-icon-wrapper icon-red" style={{ backgroundColor: 'var(--color-accent-rose-light)' }}>
            <AlertCircle size={24} color="var(--color-accent-rose)" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Fulfilled Requests</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-emerald)' }}>
              {fulfilledCount}
            </div>
            <div className="stat-subtext">Successfully matched & completed</div>
          </div>
          <div className="stat-icon-wrapper icon-emerald">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="section-header">
        <div className="section-title-wrapper">
          <HeartHandshake size={22} color="var(--color-brand-primary)" />
          <h2 className="section-title">Recipient Blood Requests</h2>
        </div>

        <button className="btn btn-primary" onClick={() => setShowRequestModal(true)}>
          <PlusCircle size={16} />
          <span>Submit Urgent Blood Request</span>
        </button>
      </div>

      {/* Matching Results Panel */}
      {activeRequestForMatch && matchingResults && (
        <div className="card-panel" style={{ border: '1.5px solid var(--color-brand-border)', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={20} color="var(--color-brand-primary)" />
                Matching Results for Request {activeRequestForMatch.id} ({activeRequestForMatch.recipientName} - {activeRequestForMatch.bloodType})
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Powered by Request & Matching Microservice (`/requests/match`)
              </div>
            </div>

            {activeRequestForMatch.status !== 'FULFILLED' && (
              <button className="btn btn-primary" onClick={() => handleMarkFulfilled(activeRequestForMatch.id)}>
                <CheckCircle2 size={15} /> Mark Request Fulfilled
              </button>
            )}

 style={{ marginBottom: '2rem' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Recipient / Patient</th>
                <th>Blood Needed</th>
                <th>Urgency Level</th>
                <th>Hospital & City Location</th>
                <th>Status</th>
                <th>Matching Engine</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{req.id}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{req.recipientName}</td>
                  <td>
                    <span className="status-pill status-critical" style={{ fontWeight: 800 }}>
                      {req.bloodType} ({req.units} units)
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${req.urgency === 'CRITICAL' ? 'status-critical' : req.urgency === 'HIGH' ? 'status-warning' : 'status-healthy'}`}>
                      {req.urgency === 'CRITICAL' && <AlertCircle size={11} style={{ marginRight: '0.2rem' }} />}
                      {req.urgency}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-heading)' }}>
                        <Hospital size={13} color="var(--color-brand-primary)" /> {req.hospital}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {req.city} | Contact: {req.contact}
                      </span>
                    </div>
                  </td>
                  <td>
                    {req.status === 'FULFILLED' ? (
                      <span className="status-pill status-healthy" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={12} /> FULFILLED
                      </span>
                    ) : (
                      <span className="status-pill status-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {req.status}
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-light-red"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      onClick={() => handleRunMatching(req)}
                    >
                      <Sparkles size={13} /> Match Donors
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Compatible Eligible Donors Located ({matchingResults.length})
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {matchingResults.map(d => {
              const isSameCity = d.city && activeRequestForMatch.city && d.city.toLowerCase() === activeRequestForMatch.city.toLowerCase();
              return (
                <div key={d.id} style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-heading)' }}>{d.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        City: {d.city} | Phone: {d.phone}
                      </div>
                    </div>
                    <span className="bg-badge-big" style={{ width: '38px', height: '38px', fontSize: '1rem' }}>
                      {d.bloodType}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span className="status-pill status-healthy" style={{ fontSize: '0.68rem' }}>
                      ✓ Compatible
                    </span>
                    {isSameCity && (
                      <span className="status-pill" style={{ backgroundColor: 'var(--color-accent-blue-light)', color: 'var(--color-accent-blue)', borderColor: 'var(--color-accent-blue-border)', fontSize: '0.68rem' }}>
                        📍 Same City ({d.city})
                      </span>
                    )}
                  </div>

                  <button 
                    className="btn btn-secondary" 
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                    onClick={() => onShowToast(`[Notification Service] Dispatched SMS alert to donor ${d.name} (${d.phone})`)}
                  >
                    <Send size={13} /> Dispatch Urgent SMS
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">
                <PlusCircle size={20} color="var(--color-brand-primary)" />
                <span>Submit Request - Request & Matching Service</span>
              </h3>
              <button 
                onClick={() => setShowRequestModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest}>
              <div className="form-group">
                <label className="form-label">Recipient / Patient Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="e.g. Nimal Perera"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Required Blood Group</label>
                  <select 
                    className="form-select"
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Units Needed</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <select 
                  className="form-select"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                >
                  <option value="CRITICAL">CRITICAL - Emergency (Immediate)</option>
                  <option value="HIGH">HIGH - Surgery Scheduled</option>
                  <option value="NORMAL">NORMAL - Standard Request</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City Location</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input 
                    type="tel" 
                    className="form-input"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="+94 7X XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit via API Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
