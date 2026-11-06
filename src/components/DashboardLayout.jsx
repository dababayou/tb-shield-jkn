import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SkriningRisiko from './SkriningRisiko';
import SkriningAdherence from './SkriningAdherence';
import GiziPanganLokal from './GiziPanganLokal';
import MitosFakta from './MitosFakta';
import RumahSehat from './RumahSehat';
import TiketRujukan from './TiketRujukan';
import DashboardPetugas from './DashboardPetugas';
import { Menu, ShieldCheck, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';

export default function DashboardLayout({ onOpenPrivacy, onOpenPatientSafety, onViewLanding }) {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setCurrentView,
    logout
  } = useTBShield();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleGoLanding = () => {
    if (onViewLanding) {
      onViewLanding();
    } else {
      setCurrentView('landing');
      window.location.hash = '';
    }
  };

  // If user is Staff, render the dedicated Staff Portal
  if (currentUser?.role === 'staff') {
    return (
      <div className="dashboard-content-area" style={{ marginLeft: 0, minHeight: '100vh', background: 'var(--color-cream)' }}>
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleGoLanding}
              className="btn-cta-outline"
              style={{ padding: '6px 14px', fontSize: '0.82rem', height: '36px' }}
            >
              <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Ke Beranda Publik
            </button>
            <h2 className="dashboard-page-title" style={{ fontSize: '1.15rem' }}>
              Portal Petugas Fasilitas Kesehatan Tingkat Pertama (FKTP)
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onOpenPrivacy}
              className="btn-cta-outline"
              style={{ padding: '6px 12px', fontSize: '0.82rem', height: '36px' }}
            >
              <ShieldCheck size={16} style={{ marginRight: '4px' }} /> UU PDP
            </button>
            <button
              onClick={logout}
              className="btn-danger-outline"
              style={{ padding: '6px 12px', fontSize: '0.82rem', height: '36px', borderColor: '#DC2626', color: '#DC2626' }}
            >
              Keluar
            </button>
          </div>
        </header>

        <main style={{ padding: '20px' }}>
          <DashboardPetugas />
        </main>
      </div>
    );
  }

  // Otherwise, render User Dashboard Layout with Sidebar
  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenPrivacy={onOpenPrivacy}
      />

      {/* Main Content Area */}
      <div className="dashboard-content-area">
        {/* Top Header Bar */}
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="dashboard-menu-toggle" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <h2 className="dashboard-page-title">
              {activeTab === 'skrining' && 'Teleskrining Risiko & Akustik Batuk'}
              {activeTab === 'adherence' && 'Skrining Kepatuhan TPT (Drop-Out Prevention)'}
              {activeTab === 'gizi' && 'Imunonutrisi Pangan Lokal & Pelacak IMT'}
              {activeTab === 'mitos' && '20 Modul Mitos vs Fakta Tuberkulosis'}
              {activeTab === 'rumah' && 'Sanitasi Lingkungan & Ventilasi Silang Rumah'}
              {activeTab === 'tiket' && 'Tiket Rujukan Digital & Sinkronisasi JKN'}
              {activeTab === 'safety' && 'Patient Safety Alert & Lapor Tanda Bahaya'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Quick Emergency Report Button */}
            <button
              onClick={onOpenPatientSafety}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                padding: '6px 14px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <ShieldAlert size={16} /> Lapor Tanda Bahaya
            </button>

            {/* Privacy Policy */}
            <button
              onClick={onOpenPrivacy}
              className="btn-cta-outline"
              style={{ padding: '6px 14px', fontSize: '0.82rem', height: '36px' }}
            >
              <ShieldCheck size={16} style={{ marginRight: '4px' }} /> UU PDP
            </button>

            {/* Back to Home Button */}
            <button
              onClick={handleGoLanding}
              className="btn-cta-outline"
              style={{ padding: '6px 14px', fontSize: '0.82rem', height: '36px' }}
            >
              <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Ke Beranda Publik
            </button>
          </div>
        </header>

        {/* Tab Content Rendering */}
        <main style={{ padding: '10px 0 60px' }}>
          {activeTab === 'skrining' && <SkriningRisiko isDashboard={true} onNavigateToTicket={() => setActiveTab('tiket')} />}
          {activeTab === 'adherence' && <SkriningAdherence isDashboard={true} />}
          {activeTab === 'gizi' && <GiziPanganLokal isDashboard={true} />}
          {activeTab === 'mitos' && <MitosFakta isDashboard={true} />}
          {activeTab === 'rumah' && <RumahSehat isDashboard={true} />}
          {activeTab === 'tiket' && <TiketRujukan isDashboard={true} />}
          {activeTab === 'safety' && (
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 24px 60px' }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '2px solid #DC2626',
                padding: '36px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  margin: '0 auto 16px'
                }}>
                  <ShieldAlert size={34} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#991B1B', margin: '0 0 10px' }}>
                  Patient Safety Alert &amp; Pelaporan Efek Samping Obat
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  Jika Anda mengalami tanda bahaya berat selama menjalani terapi (seperti mata atau kulit menguning/ikterus, mual hebat, atau ruam kulit melepuh), klik tombol di bawah untuk mengirim peringatan darurat ke dasbor FKTP Puskesmas terdaftar.
                </p>

                <button
                  onClick={onOpenPatientSafety}
                  style={{
                    background: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '14px 32px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  <ShieldAlert size={20} /> Buka Formulir Lapor Tanda Bahaya
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
