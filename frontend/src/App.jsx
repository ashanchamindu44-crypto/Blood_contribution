import React, { useState, useEffect } from 'react';
import './styles/theme.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import InventoryDashboard from './components/InventoryDashboard';
import DonorManagement from './components/DonorManagement';
import RequestMatching from './components/RequestMatching';
import NotificationsPanel from './components/NotificationsPanel';
import GatewaySettingsModal from './components/GatewaySettingsModal';
import AuthModal from './components/AuthModal';

import { 
  getGatewayConfig, 
  apiInventory, 
  apiDonors, 
  apiRequests, 
  apiNotifications 
} from './services/api';
import { FileText, CheckCircle2, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [gatewayConfig, setGatewayConfigState] = useState(getGatewayConfig());
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Core Data States
  const [inventory, setInventory] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch initial data from microservices / API Gateway
    const loadInitialData = async () => {
      const invData = await apiInventory.getAll();
      const donorData = await apiDonors.getAll();
      const reqData = await apiRequests.getAll();
      const notifData = await apiNotifications.getAll();

      setInventory(invData);
      setDonors(donorData);
      setRequests(reqData);
      setNotifications(notifData);
    };

    loadInitialData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-brand-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.35rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 2000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} color="var(--color-accent-emerald)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)' }}>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gatewayConfig={gatewayConfig}
        onOpenSettings={() => setShowSettingsModal(true)}
        unreadCount={notifications.filter(n => n.type === 'EMERGENCY').length}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header Navbar */}
        <Header 
          activeTab={activeTab}
          gatewayConfig={gatewayConfig}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenAuth={() => setShowAuthModal(true)}
          user={user}
          unreadCount={notifications.filter(n => n.type === 'EMERGENCY').length}
          onNavigateToNotifications={() => setActiveTab('notifications')}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Page Content Body */}
        <main className="page-body">
          {/* Tab 0: Main Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              inventory={inventory}
              donors={donors}
              requests={requests}
              notifications={notifications}
              setActiveTab={setActiveTab}
              onShowToast={showToast}
            />
          )}

          {/* Tab 1: Inventory Dashboard (Blood Inventory Service) */}
          {activeTab === 'inventory' && (
            <InventoryDashboard 
              inventory={inventory}
              setInventory={setInventory}
              onShowToast={showToast}
            />
          )}

          {/* Tab 2: Donor Management (Donor Service) */}
          {activeTab === 'donors' && (
            <DonorManagement 
              donors={donors}
              setDonors={setDonors}
              onShowToast={showToast}
            />
          )}

          {/* Tab 3: Request & Matching (Request & Matching Service) */}
          {activeTab === 'requests' && (
            <RequestMatching 
              requests={requests}
              setRequests={setRequests}
              donors={donors}
              onShowToast={showToast}
            />
          )}

          {/* Tab 4: Notifications (Notification Service) */}
          {activeTab === 'notifications' && (
            <NotificationsPanel 
              notifications={notifications}
              setNotifications={setNotifications}
              onShowToast={showToast}
            />
          )}

          {/* Tab 5: Microservices & API Docs Overview */}
          {activeTab === 'docs' && (
            <div className="card-panel">
              <div className="section-title-wrapper" style={{ marginBottom: '1.5rem' }}>
                <FileText size={24} color="var(--color-brand-primary)" />
                <h2 className="section-title">Microservices Architecture Specification</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.4rem', fontWeight: 800 }}>1. User & Auth Service / Gateway</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Port:</strong> 8080 | <strong>DB:</strong> gateway_db</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> /auth/register, /auth/login, /auth/logs</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Handles OAuth 2.0, API Gateway integration, rate limiting, and token issuance.</p>
                  </div>
                  <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ marginTop: '1rem', width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ExternalLink size={14} /> Open Gateway Swagger
                  </a>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.4rem', fontWeight: 800 }}>2. Donor Service</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Port:</strong> 8081 | <strong>DB:</strong> donor_db</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> /donors, /donors/{'{id}'}, /donors/history</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Manages donor records, donation history, and eligibility checks with API Key security.</p>
                  </div>
                  <a href="http://localhost:8081/swagger-ui.html" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ marginTop: '1rem', width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ExternalLink size={14} /> Open Donor Swagger
                  </a>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.4rem', fontWeight: 800 }}>3. Blood Inventory Service</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Port:</strong> 8082 | <strong>DB:</strong> inventory_db</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> /inventory, /inventory/{'{bloodType}'}, /inventory/update</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Tracks available blood units by type, stock levels, and transfusion updates.</p>
                  </div>
                  <a href="http://localhost:8082/swagger-ui.html" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ marginTop: '1rem', width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ExternalLink size={14} /> Open Inventory Swagger
                  </a>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.4rem', fontWeight: 800 }}>4. Request & Matching Service</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Port:</strong> 8083 | <strong>DB:</strong> request_db</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> /requests, /requests/{'{id}'}, /requests/match</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Handles recipient requests, matching donors to recipients based on blood type & location.</p>
                  </div>
                  <a href="http://localhost:8083/swagger-ui.html" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ marginTop: '1rem', width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ExternalLink size={14} /> Open Request Swagger
                  </a>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.35rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.4rem', fontWeight: 800 }}>5. Notification Service</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Port:</strong> 8084 | <strong>DB:</strong> notification_db</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> /notify/email, /notify/sms, /notify/alerts</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Sends urgent alerts to donors and hospitals. Enforces API Key authentication.</p>
                  </div>
                  <a href="http://localhost:8084/swagger-ui.html" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ marginTop: '1rem', width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ExternalLink size={14} /> Open Notification Swagger
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p><strong>BloodLink</strong> • Microservices Blood Donation Ecosystem</p>
          <p style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>Connected via Spring Cloud API Gateway (OAuth 2.0 & API Key Enforced)</p>
        </footer>
      </div>

      {/* Gateway Settings Modal */}
      {showSettingsModal && (
        <GatewaySettingsModal 
          gatewayConfig={gatewayConfig}
          setGatewayConfigState={setGatewayConfigState}
          onClose={() => setShowSettingsModal(false)}
          onShowToast={showToast}
        />
      )}

      {/* User Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          user={user}
          setUser={setUser}
          onClose={() => setShowAuthModal(false)}
          onShowToast={showToast}
        />
      )}
    </div>
  );
}
