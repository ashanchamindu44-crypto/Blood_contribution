import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Users, 
  HeartHandshake, 
  Bell, 
  FileText, 
  Droplet, 
  Server, 
  Settings,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  gatewayConfig, 
  onOpenSettings,
  unreadCount,
  isMobileOpen,
  setIsMobileOpen
}) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Main Dashboard', 
      icon: LayoutDashboard, 
      service: 'System Overview' 
    },
    { 
      id: 'inventory', 
      label: 'Blood Inventory', 
      icon: Database, 
      service: 'Inventory Service (8082)' 
    },
    { 
      id: 'donors', 
      label: 'Donor Directory', 
      icon: Users, 
      service: 'Donor Service (8081)' 
    },
    { 
      id: 'requests', 
      label: 'Requests & Matching', 
      icon: HeartHandshake, 
      service: 'Request Service (8083)' 
    },
    { 
      id: 'notifications', 
      label: 'Alerts & Notifications', 
      icon: Bell, 
      service: 'Notification Service (8084)',
      badge: unreadCount > 0 ? unreadCount : null
    },
    { 
      id: 'docs', 
      label: 'Microservices Specs', 
      icon: FileText, 
      service: 'API Gateway Hub (8080)' 
    },
  ];

  const handleSelect = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 99
          }}
        />
      )}

      <aside className={`sidebar-container ${isMobileOpen ? 'open' : ''}`}>
        <div>
          {/* Sidebar Header & Branding */}
          <div className="sidebar-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="brand-wrapper">
                <div className="brand-icon-box">
                  <Droplet size={22} color="#ffffff" fill="#ffffff" />
                </div>
                <div>
                  <div className="brand-title-text">BloodLink</div>
                  <div className="brand-subtitle-text">Microservices System</div>
                </div>
              </div>

              {isMobileOpen && (
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="sidebar-nav">
            <div className="nav-section-label">Core Modules</div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelect(item.id)}
                >
                  <div className="sidebar-item-left">
                    <Icon size={18} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{item.label}</span>
                      <span style={{ fontSize: '0.68rem', opacity: 0.7, fontWeight: 400 }}>
                        {item.service}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span className="sidebar-badge badge-red">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer - Gateway Status */}
        <div className="sidebar-footer">
          <div className="gateway-card" onClick={onOpenSettings} title="Configure Spring Cloud API Gateway">
            <span className="pulse-green" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Server size={13} color="var(--color-accent-emerald)" /> Gateway Active
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {gatewayConfig.gatewayUrl || 'http://localhost:8080'}
              </div>
            </div>
            <Settings size={14} color="var(--text-dim)" />
          </div>
        </div>
      </aside>
    </>
  );
}
