import React, { useState } from 'react';
import { 
  Database, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Filter, 
  Search,
  Droplet,
  Layers,
  MapPin,
  Clock,
  ArrowUpRight,
  TrendingDown,
  LayoutGrid,
  List
} from 'lucide-react';
import { apiInventory } from '../services/api';

export default function InventoryDashboard({ inventory, setInventory, onShowToast }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBloodType, setSelectedBloodType] = useState('O-');
  const [unitsToAdd, setUnitsToAdd] = useState(5);
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
  const criticalItems = inventory.filter((item) => item.status === 'Critical');
  const warningItems = inventory.filter((item) => item.status === 'Warning');
  const healthyItems = inventory.filter((item) => item.status === 'Healthy');

  const bloodGroupsOrder = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    const updatePayload = {
      bloodType: selectedBloodType,
      amount: parseInt(unitsToAdd, 10),
      timestamp: new Date().toISOString(),
    };

    await apiInventory.updateStock(updatePayload);

    setInventory((prev) =>
      prev.map((item) => {
        if (item.bloodType === selectedBloodType) {
          const newUnits = Math.max(0, item.units + parseInt(unitsToAdd, 10));
          let newStatus = 'Healthy';
          if (newUnits < 10) newStatus = 'Critical';
          else if (newUnits < 20) newStatus = 'Warning';

          return {
            ...item,
            units: newUnits,
            status: newStatus,
            lastUpdated: 'Just now',
          };
        }
        return item;
      })
    );

    setShowUpdateModal(false);
    onShowToast(`[Blood Inventory Service] Updated ${selectedBloodType} stock (${unitsToAdd >= 0 ? '+' : ''}${unitsToAdd} units) via API /inventory/update`);
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesFilter = filterType === 'ALL' || item.status === filterType;
    const matchesSearch = item.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Overview Stat Cards */}
      <div className="grid-stats">
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Blood Stock</div>
            <div className="stat-value" style={{ color: 'var(--color-brand-primary)' }}>
              {totalUnits} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Units</span>
            </div>
            <div className="stat-subtext">Maintained across blood vaults</div>
          </div>
          <div className="stat-icon-wrapper icon-red">
            <Database size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Critical Stock Types</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-rose)' }}>
              {criticalItems.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Types</span>
            </div>
            <div className="stat-subtext">Immediate donor dispatch needed</div>
          </div>
          <div className="stat-icon-wrapper icon-red" style={{ backgroundColor: 'var(--color-accent-rose-light)' }}>
            <AlertTriangle size={24} color="var(--color-accent-rose)" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Warning Low Stock</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-amber)' }}>
              {warningItems.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Types</span>
            </div>
            <div className="stat-subtext">10 to 19 units remaining</div>
          </div>
          <div className="stat-icon-wrapper icon-amber">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Healthy Stock Levels</div>
            <div className="stat-value" style={{ color: 'var(--color-accent-emerald)' }}>
              {healthyItems.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Types</span>
            </div>
            <div className="stat-subtext">20+ units fully available</div>
          </div>
          <div className="stat-icon-wrapper icon-emerald">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Section Header & Toolbar */}
      <div className="section-header">
        <div className="section-title-wrapper">
          <Droplet size={22} color="var(--color-brand-primary)" fill="var(--color-brand-primary)" />
          <h2 className="section-title">Blood Group Stock Inventory</h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search blood type/location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '34px', width: '220px', padding: '0.45rem 0.85rem 0.45rem 34px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Filter Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-surface)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-heading)', fontSize: '0.85rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="Critical">Critical (&lt;10 Units)</option>
              <option value="Warning">Warning (10-19 Units)</option>
              <option value="Healthy">Healthy (20+ Units)</option>
            </select>
          </div>

          {/* Toggle View Mode */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.15rem' }}>
            <button 
              className={`btn ${viewMode === 'cards' ? 'btn-secondary' : ''}`}
              style={{ padding: '0.35rem 0.65rem', border: 'none', backgroundColor: viewMode === 'cards' ? 'var(--bg-secondary)' : 'transparent' }}
              onClick={() => setViewMode('cards')}
              title="Grid Card View"
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              className={`btn ${viewMode === 'table' ? 'btn-secondary' : ''}`}
              style={{ padding: '0.35rem 0.65rem', border: 'none', backgroundColor: viewMode === 'table' ? 'var(--bg-secondary)' : 'transparent' }}
              onClick={() => setViewMode('table')}
              title="Data Table View"
            >
              <List size={16} />
            </button>
          </div>

          {/* Update Stock Button */}
          <button className="btn btn-primary" onClick={() => setShowUpdateModal(true)}>
            <PlusCircle size={16} />
            <span>Update Stock Level</span>
          </button>
        </div>
      </div>

      {/* View Mode 1: Inventory Cards Grid */}
      {viewMode === 'cards' ? (
        <div className="blood-groups-grid">
          {filteredInventory.map((item) => {
            const statusClass = item.status === 'Critical' ? 'status-critical' : item.status === 'Warning' ? 'status-warning' : 'status-healthy';
            const progressColor = item.status === 'Critical' ? 'var(--color-accent-rose)' : item.status === 'Warning' ? 'var(--color-accent-amber)' : 'var(--color-accent-emerald)';

            return (
              <div key={item.bloodType} className="blood-group-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div className="bg-badge-big">{item.bloodType}</div>
                  <span className={`status-pill ${statusClass}`}>
                    {item.status}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-heading)', lineHeight: 1 }}>
                    {item.units}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: '0.4rem' }}>
                      units in bank
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ backgroundColor: 'var(--bg-secondary)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${Math.min(100, (item.units / 60) * 100)}%`,
                      backgroundColor: progressColor,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} color="var(--color-brand-primary)" /> Location: {item.location || 'Central Vault'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} color="var(--text-dim)" /> Last update: {item.lastUpdated || 'Recently'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode 2: Modern Table View */
        <div className="table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Current Stock</th>
                  <th>Status Indicator</th>
                  <th>Capacity Capacity</th>
                  <th>Vault Location</th>
                  <th>Last Transfusion Update</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.bloodType}>
                    <td>
                      <span className="bg-badge-big" style={{ width: '38px', height: '38px', fontSize: '1rem' }}>
                        {item.bloodType}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                      {item.units} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>units</span>
                    </td>
                    <td>
                      <span className={`status-pill ${item.status === 'Critical' ? 'status-critical' : item.status === 'Warning' ? 'status-warning' : 'status-healthy'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ width: '180px' }}>
                      <div style={{ backgroundColor: 'var(--bg-secondary)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${Math.min(100, (item.units / 60) * 100)}%`,
                            backgroundColor: item.status === 'Critical' ? 'var(--color-accent-rose)' : item.status === 'Warning' ? 'var(--color-accent-amber)' : 'var(--color-accent-emerald)'
                          }} 
                        />
                      </div>
                    </td>
                    <td>{item.location || 'Central Vault'}</td>
                    <td>{item.lastUpdated || 'Just now'}</td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={() => {
                          setSelectedBloodType(item.bloodType);
                          setShowUpdateModal(true);
                        }}
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">
                <RefreshCw size={20} color="var(--color-brand-primary)" />
                <span>Update Stock Level - Blood Inventory Service</span>
              </h3>
              <button 
                onClick={() => setShowUpdateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStock}>
              <div className="form-group">
                <label className="form-label">Target Blood Group (/inventory/update)</label>
                <select 
                  className="form-select"
                  value={selectedBloodType}
                  onChange={(e) => setSelectedBloodType(e.target.value)}
                >
                  {inventory.map(i => (
                    <option key={i.bloodType} value={i.bloodType}>
                      {i.bloodType} (Current Stock: {i.units} units - {i.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Units to Add or Deduct (Positive or Negative)</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={unitsToAdd}
                  onChange={(e) => setUnitsToAdd(e.target.value)}
                  placeholder="e.g. 5 or -2"
                  required
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Use positive numbers (e.g. 5) after donation arrival or negative numbers (e.g. -2) for transfusions.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Stock via Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
