import React from 'react';
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Building2,
  FileText,
  Lock,
  Heart,
  User
} from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';

export default function Hero({ onOpenAuth, onStartScreening }) {
  const { currentUser, setCurrentView, setAuthRole, setActiveTab, setAuthMode } = useTBShield();

  const handleStart = () => {
    if (currentUser) {
      setCurrentView('dashboard');
      setActiveTab('skrining');
      window.location.hash = '#skrining';
    } else if (onStartScreening) {
      onStartScreening();
    } else {
      document.getElementById('skrining')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoStaff = () => {
    setAuthRole('staff');
    if (currentUser?.role === 'staff') {
      setCurrentView('dashboard');
      window.location.hash = '#dashboard';
    } else if (onOpenAuth) {
      onOpenAuth();
    } else {
      setCurrentView('dashboard');
      window.location.hash = '#dashboard';
    }
  };

  const handleMobileAuthClick = () => {
    if (currentUser) {
      setCurrentView('dashboard');
      window.location.hash = '#dashboard';
    } else if (onOpenAuth) {
      setAuthRole('user');
      if (setAuthMode) setAuthMode('login');
      onOpenAuth();
    }
  };

  return (
    <section className="hero-section" style={{
      padding: '100px 0 70px',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 80% 20%, rgba(224, 197, 143, 0.25) 0%, rgba(245, 240, 233, 0.8) 50%, #F5F0E9 100%)'
    }}>
      {/* Texture Background Overlay (bghero.jpeg dengan transparansi 60-70%) */}
      <div className="hero-texture-overlay" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid-layout">
          {/* Left Column: Text & Hero Content */}
          <div className="hero-text-content">
            <div className="hero-badges-wrapper">
              <span className="badge-tb-jkn hero-badge-inovasi">
                <ShieldCheck size={14} color="var(--color-primary)" /> Inovasi Preventif Kontak Serumah TBC
              </span>
              <span className="badge-demo-tag hero-badge-pdp">
                Kepatuhan UU PDP No. 27/2022
              </span>
            </div>

            <h1 className="hero-main-title">
              Perlindungan Presisi Kontak Erat TBC dengan Strategi Preventif Terintegrasi
            </h1>

            <p className="hero-lead-desc">
              Teleskrining risiko epidemiologis dari rumah, teletriase akustik batuk berbasis AI, imunonutrisi pangan lokal (kelor, ikan kembung, jamur, telur), dan sinkronisasi tiket rujukan digital ke FKTP P-Care BPJS Kesehatan.
            </p>

            {/* Tombol Masuk / Daftar khusus Mobile (pindah dari header navbar) */}
            <div className="hero-mobile-auth-wrapper">
              <button
                onClick={handleMobileAuthClick}
                className="hero-btn-mobile-auth"
              >
                <User size={18} style={{ marginRight: '8px' }} />
                {currentUser ? `Buka Dasbor ${currentUser.role === 'staff' ? 'Petugas' : 'Saya'} →` : 'Masuk / Daftar Akun'}
              </button>
            </div>

            {/* Quick Micro-Stats */}
            <div className="hero-micro-stats">
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-mono)' }}>
                  15 Soal
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                  Skrining Risiko Presisi
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                  4 Pangan
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                  Imunonutrisi Lokal
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F766E', fontFamily: 'var(--font-mono)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600 }}>
                  Gratis di Puskesmas
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card (Interactive Preview) */}
          <div className="hero-preview-col" style={{ position: 'relative', width: '100%' }}>
            {/* Main Interactive Floating Card */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '2px solid #D9CBC2',
              boxShadow: '0 24px 60px rgba(17, 34, 80, 0.15)',
              padding: '28px',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: '460px',
              width: '100%',
              margin: '0 auto'
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#112250',
                    color: '#E0C58F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    TB
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-navy)', display: 'block' }}>
                      Ringkasan Tele-Skrining
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                      Kontak Serumah Pasien Terkonfirmasi
                    </span>
                  </div>
                </div>

                <span style={{
                  background: '#FEF3C7',
                  color: '#92400E',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '6px'
                }}>
                  SIMULASI PREVIEW
                </span>
              </div>

              {/* Simulated Audio Triage Wave */}
              <div style={{
                background: '#112250',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '18px',
                color: '#FFFFFF'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px' }}>
                  <span style={{ color: '#E0C58F', fontWeight: 700 }}>AI Cough Rhythm Detector</span>
                  <span style={{ color: '#94A3B8' }}>Frekuensi: 180 Hz • Normal</span>
                </div>
                <div style={{ display: 'flex', gap: '3px', height: '36px', alignItems: 'center' }}>
                  {[12, 24, 18, 32, 28, 14, 20, 36, 26, 16, 30, 22, 14, 28, 34, 18, 12, 22].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}px`,
                        background: i % 3 === 0 ? '#E0C58F' : '#3C507D',
                        borderRadius: '3px'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
                <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', display: 'block' }}>Skor Risiko</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-navy)' }}>3 / 27</strong>
                </div>
                <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', display: 'block' }}>Indeks IMT</span>
                  <strong style={{ fontSize: '1.05rem', color: '#0F766E' }}>21.4 (Normal)</strong>
                </div>
                <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', display: 'block' }}>Status Tiket</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>Tersinkron</strong>
                </div>
              </div>

              {/* Rujukan & Action */}
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#059669" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065F46' }}>
                    Terhubung ke Puskesmas Tenggilis (Demo)
                  </span>
                </div>
                <button
                  onClick={handleStart}
                  style={{
                    background: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Buka Skrining
                </button>
              </div>
            </div>

            {/* Decorative Floating Pill */}
            <div
              className="hero-floating-pill"
              style={{
                position: 'absolute',
                bottom: '-16px',
                left: '-16px',
              background: '#FFFFFF',
              border: '1px solid #D9CBC2',
              borderRadius: '50px',
              padding: '8px 18px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--color-navy)'
            }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
              24 Jam Edukasi Chatbot &amp; Patient Safety Alert
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
