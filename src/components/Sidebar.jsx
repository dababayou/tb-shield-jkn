import React from 'react';
import {
  Activity,
  Apple,
  FileCheck2,
  Lightbulb,
  LogOut,
  User,
  ShieldCheck,
  ShieldAlert,
  Wind,
  HeartHandshake,
  Building2,
  X
} from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';

export default function Sidebar({ mobileOpen, setMobileOpen, onOpenPrivacy }) {
  const {
    currentUser,
    logout,
    activeTab,
    setActiveTab,
    setAuthRole,
    setCurrentView,
    loginAsDemoStaff
  } = useTBShield();

  const menuItems = [
    { id: 'skrining', label: 'Skrining Risiko & Batuk AI', icon: Activity },
    { id: 'adherence', label: 'Skrining Kepatuhan TPT', icon: HeartHandshake },
    { id: 'gizi', label: 'Imunonutrisi & Pelacak IMT', icon: Apple },
    { id: 'mitos', label: '20 Mitos vs Fakta TBC', icon: Lightbulb },
    { id: 'rumah', label: 'Sanitasi & Ventilasi Rumah', icon: Wind },
    { id: 'tiket', label: 'Tiket Rujukan Digital JKN', icon: FileCheck2 },
    { id: 'safety', label: 'Patient Safety Alert', icon: ShieldAlert }
  ];

  const displayName = currentUser?.nama || 'Kontak Erat Mandiri';
  const clinic = currentUser?.fk || 'Puskesmas Tenggilis';
  const maskedNik = currentUser?.nik
    ? `${currentUser.nik.slice(0, 4)}••••••••${currentUser.nik.slice(-4)}`
    : '3578••••••••0021';

  const handleSwitchToStaff = () => {
    loginAsDemoStaff('TNG-01');
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`dashboard-sidebar ${mobileOpen ? 'mobile-active' : ''}`}>
        {/* Mobile Close Button */}
        <button className="sidebar-mobile-close" onClick={() => setMobileOpen(false)}>
          <X size={20} />
        </button>

        {/* Brand Logo Header */}
        <div className="sidebar-brand">
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
            border: '1.5px solid #E0C58F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E0C58F',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-title">TB-Shield JKN</span>
            <span className="sidebar-tagline">Pencegahan Kontak Erat TBC</span>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="sidebar-user-card">
          <div className="sidebar-avatar" style={{ background: 'var(--color-primary)', color: '#FFFFFF' }}>
            <User size={20} />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-email">
              NIK: {maskedNik}
            </div>
            <div className="sidebar-user-email">
              {clinic}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} className="nav-item-icon" />
                <span className="nav-item-label" style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Role Switch & Logout */}
        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleSwitchToStaff}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 12px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              color: 'var(--color-navy)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <Building2 size={16} color="var(--color-primary)" />
            <span>Mode Petugas FKTP</span>
          </button>

          <button onClick={logout} className="sidebar-logout-btn">
            <LogOut size={16} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
}
