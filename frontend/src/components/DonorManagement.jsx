import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  History, 
  Phone, 
  Mail, 
  MapPin,
  Filter,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { apiDonors } from '../services/api';

export default function DonorManagement({ donors, setDonors, onShowToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDonorHistory, setSelectedDonorHistory] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    bloodType: 'O+',
    city: 'Colombo',
    phone: '',
    email: '',
    age: '',
    weight: '',
    lastDonated: '',
  });

  const eligibleCount = donors.filter(d => d.eligible).length;
  const ineligibleCount = donors.length - eligibleCount;

  const handleRegisterDonor = async (e) => {
    e.preventDefault();
    const newDonorPayload = {
      ...formData,
      age: parseInt(formData.age, 10),
      weight: parseInt(formData.weight, 10),
      eligible: true,
      totalDonations: 1,
    };

    const res = await apiDonors.create(newDonorPayload);

    setDonors((prev) => [res, ...prev]);
    setShowAddModal(false);
    onShowToast(`[Donor Service] Registered donor ${res.name} (${res.bloodType}) via API /donors`);

    // Reset Form
    setFormData({
      name: '',
      bloodType: 'O+',
      city: 'Colombo',
      phone: '',
      email: '',
      age: '',
      weight: '',
      lastDonated: '',
    });
  };

  const handleViewHistory = async (donor) => {
    setSelectedDonorHistory(donor);
    const records = await apiDonors.getHistory(donor.id);
    setHistoryRecords(records);
  };

  const filteredDonors = donors.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.city && d.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (d.phone && d.phone.includes(searchTerm));
    const matchesBlood = selectedBloodGroup === 'ALL' || d.bloodType === selectedBloodGroup;
    return matchesSearch && matchesBlood;
  });

  return (
    <div>
      {/* Donor Summary KPI Cards */}
      <div className="grid-stats">
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Donors</div>
            <div className="stat-value" style={{ color: 'var(--color-brand-primary)' }}>
              {donors.length}
            </div>
            <div className="stat-subtext">Registered in Donor Service</div>
          </div>
          <div className="stat-icon-wrapper icon-red">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Eligible Donors</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-emerald)' }}>
              {eligibleCount}
            </div>
            <div className="stat-subtext">Ready for blood donation</div>
          </div>
          <div className="stat-icon-wrapper icon-emerald">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Temporary Ineligible</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-amber)' }}>
              {ineligibleCount}
            </div>
            <div className="stat-subtext">Cooling period or medical deferral</div>
          </div>
          <div className="stat-icon-wrapper icon-amber">
            <ShieldAlert size={24} />
          </div>
        </div>
      </div>

      {/* Section Header & Search Filters */}
      <div className="section-header">
        <div className="section-title-wrapper">
          <Users size={22} color="var(--color-brand-primary)" />
          <h2 className="section-title">Donor Registry Directory</h2>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} />
          <span>Register New Donor</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search donors by name, city, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-surface)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Filter size={15} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Blood Group:</span>
          <select 
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-heading)', fontSize: '0.85rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
          >
            <option value="ALL">All Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Donors Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Donor ID</th>
                <th>Donor Name</th>
                <th>Blood Type</th>
                <th>Contact Details</th>
                <th>City / Location</th>
                <th>Eligibility Status</th>
                <th>Donation History</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map((donor) => (
                <tr key={donor.id}>
                  <td style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{donor.id}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{donor.name}</td>
                  <td>
                    <span className="bg-badge-big" style={{ width: '36px', height: '36px', fontSize: '0.95rem' }}>
                      {donor.bloodType}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.82rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                        <Phone size={12} color="var(--text-muted)" /> {donor.phone}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                        <Mail size={12} /> {donor.email}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                      <MapPin size={13} color="var(--color-brand-primary)" /> {donor.city}
                    </span>
                  </td>
                  <td>
                    {donor.eligible ? (
                      <span className="status-pill status-healthy" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={12} /> Eligible
                      </span>
                    ) : (
                      <span className="status-pill status-critical" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <XCircle size={12} /> Deferral Period
                      </span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      onClick={() => handleViewHistory(donor)}
                    >
                      <History size={13} /> History Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Donor Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">
                <UserPlus size={20} color="var(--color-brand-primary)" />
                <span>Register New Donor - Donor Service</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterDonor}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ruwan Wickramasinghe"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
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
                  <label className="form-label">City / District</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 7X XXX XXXX"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@gmail.com"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Age (Years)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="18-65"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Min 50kg"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register via API Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Donor History Modal */}
      {selectedDonorHistory && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">
                <History size={20} color="var(--color-brand-primary)" />
                <span>Donation History: {selectedDonorHistory.name}</span>
              </h3>
              <button 
                onClick={() => setSelectedDonorHistory(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem', backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-heading)', fontSize: '0.95rem' }}>
                Blood Group: <span style={{ color: 'var(--color-brand-primary)' }}>{selectedDonorHistory.bloodType}</span> | Total Donations: {selectedDonorHistory.totalDonations || 1}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Phone: {selectedDonorHistory.phone} | City: {selectedDonorHistory.city}
              </div>
            </div>

            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Past Donation Events (/donors/history)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {historyRecords.map(h => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-heading)' }}>{h.location}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{h.date}</div>
                  </div>
                  <span className="status-pill status-healthy">{h.status} ({h.units} unit)</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedDonorHistory(null)}>
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
