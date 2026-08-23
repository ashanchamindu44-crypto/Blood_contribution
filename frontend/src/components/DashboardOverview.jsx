import React from 'react';
import { 
  Database, 
  Users, 
  HeartHandshake, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Droplet,
  ShieldCheck,
  Activity,
  Server
} from 'lucide-react';

export default function DashboardOverview({ 
  inventory = [], 
  donors = [], 
  requests = [], 
  notifications = [], 
  setActiveTab,
  onShowToast
}) {
  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
  const criticalItems = inventory.filter((item) => item.status === 'Critical');
  const healthyItems = inventory.filter((item) => item.status === 'Healthy');
  const eligibleDonors = donors.filter(d => d.eligible);
  const pendingRequests = requests.filter(r => r.status !== 'FULFILLED');

  const bloodGroupsOrder = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Map inventory data into complete 8 blood groups
  const inventoryMap = {};
  inventory.forEach(i => {
    inventoryMap[i.bloodType] = i;
  });

  return (
    <div>
      {/* Top Welcome Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'rgba(220, 38, 38, 0.25)', border: '1px solid rgba(220, 38, 38, 0.4)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800, color: '#fca5a5', marginBottom: '0.75rem' }}>
            <Droplet size={12} fill="#fca5a5" /> Hospital Blood Bank Management Platform
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.4rem', color: '#ffffff' }}>
            BloodLink Operations Center
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Real-time monitoring of blood inventory, donor registry, urgent hospital matching, and automated email/SMS emergency alert dispatch across 5 Spring Boot microservices.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('requests')}>
            <HeartHandshake size={16} /> Submit Request
          </button>
          <button className="btn btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => setActiveTab('donors')}>
            <Users size={16} /> Register Donor
          </button>
        </div>

        <div 
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            opacity: 0.06,
            pointerEvents: 'none'
          }}
        >
          <Droplet size={260} color="#ffffff" />
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid-stats">
        <div className="stat-card" onClick={() => setActiveTab('inventory')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Total Blood Units</div>
            <div className="stat-value" style={{ color: 'var(--color-brand-primary)' }}>
              {totalUnits}
            </div>
            <div className="stat-subtext">Across {inventory.length} blood types</div>
          </div>
          <div className="stat-icon-wrapper icon-red">
            <Database size={24} />
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('inventory')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Critical Stock Alert</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-rose)' }}>
              {criticalItems.length}
            </div>
            <div className="stat-subtext">Types under 10 units threshold</div>
          </div>
          <div className="stat-icon-wrapper icon-red" style={{ backgroundColor: '#fef2f2' }}>
            <AlertTriangle size={24} color="var(--color-accent-rose)" />
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('donors')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Registered Donors</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-emerald)' }}>
              {donors.length}
            </div>
            <div className="stat-subtext">{eligibleDonors.length} currently eligible</div>
          </div>
          <div className="stat-icon-wrapper icon-emerald">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('requests')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Active Requests</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-blue)' }}>
              {pendingRequests.length}
            </div>
            <div className="stat-subtext">Awaiting donor matching</div>
          </div>
          <div className="stat-icon-wrapper icon-blue">
            <HeartHandshake size={24} />
          </div>
        </div>
      </div>

      {/* Blood Groups Status Summary Grid */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplet size={18} color="var(--color-brand-primary)" fill="var(--color-brand-primary)" />
              Blood Group Inventory Overview
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Stock capacity indicators for all 8 blood groups (Healthy: 20+ units | Warning: 10-19 units | Critical: &lt;10 units)
            </p>
          </div>

          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('inventory')}>
            Manage Inventory <ArrowRight size={14} />
          </button>
        </div>

        <div className="blood-groups-grid">
          {bloodGroupsOrder.map((bg) => {
            const item = inventoryMap[bg] || { bloodType: bg, units: 0, status: 'Critical', location: 'Central Vault' };
            const status = item.units >= 20 ? 'Healthy' : item.units >= 10 ? 'Warning' : 'Critical';
            
            return (
              <div key={bg} className="blood-group-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div className="bg-badge-big">{bg}</div>
                  <span className={`status-pill status-${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-heading)', lineHeight: 1 }}>
                    {item.units} <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>units</span>
                  </div>
                </div>

                {/* Meter Bar */}
                <div style={{ backgroundColor: 'var(--bg-secondary)', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (item.units / 60) * 100)}%`,
                      backgroundColor: status === 'Critical' ? 'var(--color-accent-rose)' : status === 'Warning' ? 'var(--color-accent-amber)' : 'var(--color-accent-emerald)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Active Requests & Emergency Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Active Requests List */}
        <div className="card-panel" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HeartHandshake size={18} color="var(--color-accent-blue)" />
              Urgent Blood Requests
            </h3>
            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }} onClick={() => setActiveTab('requests')}>
              View All ({requests.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {requests.slice(0, 4).map((req) => (
              <div key={req.id} style={{ padding: '0.9rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-heading)' }}>{req.recipientName}</span>
                    <span className="status-pill status-critical" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                      {req.bloodType} ({req.units}u)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {req.hospital} • {req.city}
                  </div>
                </div>

                <button 
                  className="btn btn-light-red" 
                  style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
                  onClick={() => setActiveTab('requests')}
                >
                  <Sparkles size={12} /> Match
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Microservices Health & Emergency Alerts */}
        <div className="card-panel" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="var(--color-accent-emerald)" />
              Microservices Ecosystem Status
            </h3>
            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }} onClick={() => setActiveTab('docs')}>
              Specs & Ports
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'API Gateway & User Auth Service', port: 8080, db: 'gateway_db', status: 'ONLINE' },
              { name: 'Donor Service', port: 8081, db: 'donor_db', status: 'ONLINE' },
              { name: 'Blood Inventory Service', port: 8082, db: 'inventory_db', status: 'ONLINE' },
              { name: 'Request & Matching Service', port: 8083, db: 'request_db', status: 'ONLINE' },
              { name: 'Notification Service', port: 8084, db: 'notification_db', status: 'ONLINE' },
            ].map((svc) => (
              <div key={svc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="pulse-green" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>{svc.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Port {svc.port} • DB: {svc.db}</div>
                  </div>
                </div>

                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-accent-emerald)', padding: '0.15rem 0.5rem', backgroundColor: 'var(--color-accent-emerald-light)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-accent-emerald-border)' }}>
                  {svc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
