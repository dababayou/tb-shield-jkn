import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FourPillarsShowcase from './components/FourPillarsShowcase';
import SkriningRisiko from './components/SkriningRisiko';
import SkriningAdherence from './components/SkriningAdherence';
import GiziPanganLokal from './components/GiziPanganLokal';
import MitosFakta from './components/MitosFakta';
import RumahSehat from './components/RumahSehat';
import TiketRujukan from './components/TiketRujukan';
import DashboardLayout from './components/DashboardLayout';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PrivacyModal from './components/PrivacyModal';
import PatientSafetyModal from './components/PatientSafetyModal';
import Chatbot from './components/Chatbot';
import { useTBShield } from './context/TBShieldContext';
import { CheckCircle2, ShieldCheck, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function App() {
  const {
    currentView,
    setCurrentView,
    currentUser,
    activeTab,
    setActiveTab,
    toastMessage
  } = useTBShield();

  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [patientSafetyOpen, setPatientSafetyOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['skrining', 'adherence', 'gizi', 'mitos', 'rumah', 'tiket', 'safety'].includes(hash)) {
        if (currentUser) {
          setCurrentView('dashboard');
          setActiveTab(hash);
        } else {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (hash === 'dashboard') {
        setCurrentView('dashboard');
      } else if (hash === 'auth' || hash === 'login' || hash === 'register') {
        setAuthModalOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  // Is the dashboard active?
  // When user is logged in and not explicitly browsing the public landing page ('landing')
  const isDashboardActive = Boolean(currentUser && currentView !== 'landing');

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-cream)' }}>
      {/* VIEW 1: LOGGED-IN DASHBOARD (Tiap Pengguna: Kontak Erat atau Petugas FKTP) */}
      {isDashboardActive ? (
        <DashboardLayout
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenPatientSafety={() => setPatientSafetyOpen(true)}
          onViewLanding={() => {
            setCurrentView('landing');
            window.location.hash = '';
          }}
        />
      ) : (
        /* VIEW 2: PUBLIC GUEST / PREVIEW LANDING PAGE */
        <>
          {/* Active Logged-in Header Strip if user navigates to public landing page */}
          {currentUser && (
            <div style={{
              background: '#112250',
              color: '#FFFFFF',
              padding: '10px 24px',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderBottom: '3px solid #E0C58F',
              position: 'sticky',
              top: 0,
              zIndex: 1001
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                <span>
                  Sesi Aktif: <strong>{currentUser.nama}</strong> ({currentUser.role === 'staff' ? currentUser.fk : 'Kontak Erat JKN'})
                </span>
              </div>

              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  window.location.hash = '#dashboard';
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#E0C58F',
                  color: '#112250',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '6px 18px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <LayoutDashboard size={15} /> Kembali ke Dasbor Saya &rarr;
              </button>
            </div>
          )}

          <Navbar
            onOpenPrivacy={() => setPrivacyOpen(true)}
            onOpenPatientSafety={() => setPatientSafetyOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
          />

          <main style={{ flex: 1 }}>
            {/* Hero Section */}
            <Hero
              onOpenAuth={() => setAuthModalOpen(true)}
              onStartScreening={() => {
                if (currentUser) {
                  setCurrentView('dashboard');
                  setActiveTab('skrining');
                } else {
                  document.getElementById('skrining')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* 4 Pillars Inovasi Showcase */}
            <FourPillarsShowcase
              onSelectPillar={(pillarKey) => {
                if (currentUser) {
                  setCurrentView('dashboard');
                  setActiveTab(pillarKey);
                  window.location.hash = `#${pillarKey}`;
                } else {
                  document.getElementById(pillarKey)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Pilar 1: Skrining Mandiri & Teletriase Akustik Batuk */}
            <SkriningRisiko
              isDashboard={false}
              onNavigateToTicket={() => {
                if (currentUser) {
                  setCurrentView('dashboard');
                  setActiveTab('tiket');
                } else {
                  document.getElementById('tiket')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Skrining Hambatan Kepatuhan TPT (Drop-out Prevention) */}
            <SkriningAdherence isDashboard={false} />

            {/* Pilar 2: Imunonutrisi Pangan Lokal & Pelacak IMT */}
            <GiziPanganLokal isDashboard={false} />

            {/* 20 Mitos vs Fakta Tuberkulosis */}
            <MitosFakta isDashboard={false} />

            {/* Sanitasi Rumah & Ventilasi Silang */}
            <RumahSehat isDashboard={false} />

            {/* Pilar 3: Tiket Rujukan Digital & Integrasi JKN */}
            <TiketRujukan isDashboard={false} />
          </main>

          {/* Official Footer */}
          <Footer
            onOpenPrivacy={() => setPrivacyOpen(true)}
            onOpenPatientSafety={() => setPatientSafetyOpen(true)}
          />
        </>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      <PatientSafetyModal
        isOpen={patientSafetyOpen}
        onClose={() => setPatientSafetyOpen(false)}
      />

      {/* 24h AI Chatbot Widget */}
      <Chatbot currentPage={isDashboardActive ? 'Dashboard' : 'Beranda'} />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="tbshield-toast">
          <CheckCircle2 size={20} color="#E0C58F" style={{ flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
