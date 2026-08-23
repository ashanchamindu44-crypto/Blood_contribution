import React from 'react';
import { 
  ShieldCheck, 
  Settings, 
  User, 
  Bell, 
  Menu,
  Search
} from 'lucide-react';

export default function Header({ 
  activeTab,
  gatewayConfig, 
  onOpenSettings, 
  onOpenAuth, 
  user, 
  unreadCount, 
  onNavigateToNotifications,
  onToggleMobileMenu
}) {
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return { title: 'Main System Dashboard', sub: 'Unified Blood Donation Microservices Ecosystem' };
      case 'inventory': return { title: 'Blood Inventory Management', sub: 'Blood Inventory Service (Port 8082)' };
      case 'donors': return { title: 'Donor Directory & Management', sub: 'Donor Microservice (Port 8081)' };
      case 'requests': return { title: 'Blood Requests & Matching Engine', sub: 'Request & Matching Microservice (Port 8083)' };
      case 'notifications': return { title: 'Alerts & Emergency Dispatcher', sub: 'Notification Microservice (Port 8084)' };
      case 'docs': return { title: 'Microservices & API Documentation', sub: 'Spring Cloud API Gateway Hub (Port 8080)' };
      default: return { title: 'BloodLink System', sub: 'Microservices Platform' };
    }
  };

  const currentTab = getTabTitle(activeTab);

  return (
    <header className="top-header">
      {/* Left: Mobile Toggle + Page Title */}
      <div className="top-header-left">
        <button className="mobile-menu-btn" onClick={onToggleMobileMenu} title="Toggle Navigation Menu">
          <Menu size={22} />
        </button>

        <div>
          <h1 className="page-breadcrumb-title">{currentTab.title}</h1>
          <div className="page-breadcrumb-sub">{currentTab.sub}</div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="top-header-right">
        {/* Search Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search system..." 
            style={{
              paddingLeft: '34px',
              paddingRight: '12px',
              paddingTop: '6px',
              paddingBottom: '6px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-heading)',
              outline: 'none',
              width: '180px'
            }}
          />
        </div>

        {/* Notifications Icon */}
        <button 
          className="btn-icon" 
          onClick={onNavigateToNotifications}
          title="Notifications & Emergency Alerts"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="btn-icon-badge">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Gateway Settings Icon */}
        <button className="btn-icon" onClick={onOpenSettings} title="API Gateway Infrastructure Settings">
          <Settings size={18} />
        </button>

        {/* User Auth Button / Profile Pill */}
        {user ? (
          <button className="user-profile-pill" onClick={onOpenAuth}>
            <div className="avatar-circle">
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                {user.email.split('@')[0]}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-accent-emerald)', fontWeight: 700 }}>
                ● {user.role || 'AUTHENTICATED'}
              </div>
            </div>
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onOpenAuth}>
            <User size={15} />
            <span>Login / Auth</span>
          </button>
        )}
      </div>
    </header>
  );
}
