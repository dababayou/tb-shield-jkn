import React, { useState, useEffect } from 'react';
import {
  Users,
  QrCode,
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  Building2,
  Clock,
  PhoneCall,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  LogOut,
  Lock,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';
import { DEMO_STAFF } from '../lib/constants';

export default function DashboardPetugas() {
  const {
    currentUser,
    loginStaff,
    logout,
    contacts,
    auditLogs,
    activeAlerts,
    resolveAlert,
    verifyTicketAtDesk,
    updateContactServiceStatus,
    showToast,
    loginAsDemoStaff
  } = useTBShield();

  // Internal staff sub-tab
  const [subTab, setSubTab] = useState('ikhtisar'); // 'ikhtisar' | 'loket' | 'kontak' | 'alert' | 'audit'

  // Login form state (if not logged in as staff)
  const [staffCodeInput, setStaffCodeInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [step, setStep] = useState(1); // 1: Code & PIN, 2: OTP
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Loket ticket verification form
  const [ticketInput, setTicketInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  // Contact list filter & search
  const [contactSearch, setContactSearch] = useState('');
  const [contactFilterRisk, setContactFilterRisk] = useState('Semua');
  const [selectedContactModal, setSelectedContactModal] = useState(null);

  // Status update modal
  const [newStatusValue, setNewStatusValue] = useState('');
  const [staffNotesInput, setStaffNotesInput] = useState('');

  // Auto idle logout timer (5 minutes)
  const [sessionTimeLeft, setSessionTimeLeft] = useState(300); // 300 seconds

  useEffect(() => {
    if (currentUser?.role !== 'staff') return;

    const timer = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          logout();
          showToast('Sesi petugas berakhir otomatis setelah 5 menit demi kepatuhan keamanan data medis (UU PDP).');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    const resetTimer = () => setSessionTimeLeft(300);
    window.addEventListener('click', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearInterval(timer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [currentUser]);

  // Handle Staff Login Step 1
  const handleProceedOtp = (e) => {
    e.preventDefault();
    const formatted = staffCodeInput.trim().toUpperCase();
    const target = DEMO_STAFF[formatted];
    if (!target) {
      setAuthError('Kode faskes tidak ditemukan. Gunakan demo: TNG-01 atau GBG-01');
      return;
    }
    if (target.pin !== pinInput) {
      setAuthError('PIN salah. Cek akun demo pada petunjuk di bawah.');
      return;
    }

    setAuthError('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpInput(randomOtp); // Pre-fill for reviewer's convenience!
    setStep(2);
    showToast(`OTP Verifikasi Demo: ${randomOtp} (dikirimkan ke perangkat petugas)`, 6000);
  };

  // Handle Staff Login Step 2
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput !== generatedOtp) {
      setAuthError('Kode OTP tidak sesuai.');
      return;
    }
    const res = loginStaff(staffCodeInput, pinInput, otpInput);
    if (!res.success) {
      setAuthError(res.message);
    }
  };

  // Filter contacts belonging to the staff's clinic or all in simulation
  const myClinicContacts = contacts.filter((c) => {
    if (currentUser?.role === 'staff' && currentUser?.fk) {
      return c.fk === currentUser.fk;
    }
    return true;
  });

  const filteredContacts = myClinicContacts.filter((c) => {
    const matchesSearch = c.nama.toLowerCase().includes(contactSearch.toLowerCase()) ||
                          c.nik.includes(contactSearch) ||
                          (c.ticket && c.ticket.toLowerCase().includes(contactSearch.toLowerCase()));
    const matchesRisk = contactFilterRisk === 'Semua' || c.kategoriRisiko === contactFilterRisk;
    return matchesSearch && matchesRisk;
  });

  // KPI Metrics Calculation
  const totalContacts = myClinicContacts.length;
  const highRiskContacts = myClinicContacts.filter((c) => c.kategoriRisiko === 'Tinggi' || c.skor >= 9).length;
  const pendingTickets = myClinicContacts.filter((c) => c.status === 'Rujukan Terbit').length;
  const activeAlertCount = activeAlerts.filter((a) => !a.status.includes('Selesai')).length;

  const handleVerifyTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    const res = verifyTicketAtDesk(ticketInput);
    setVerifyResult(res);
  };

  const handleOpenStatusModal = (contact) => {
    setSelectedContactModal(contact);
    setNewStatusValue(contact.status || 'Terdaftar');
    setStaffNotesInput(contact.lastStaffNotes || '');
  };

  const handleSaveStatusUpdate = () => {
    if (selectedContactModal) {
      updateContactServiceStatus(selectedContactModal.id, newStatusValue, staffNotesInput);
      setSelectedContactModal(null);
    }
  };

  // Format idle timer
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. IF NOT LOGGED IN AS STAFF -> SHOW PETUGAS AUTH PORTAL
  if (currentUser?.role !== 'staff') {
    return (
      <div className="container section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '520px',
          width: '100%',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #D9CBC2',
          padding: '36px',
          boxShadow: 'var(--shadow-md)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#F0F4FC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: 'var(--color-primary)'
            }}>
              <Building2 size={30} />
            </div>
            <span className="badge-demo-tag">Portal Resmi Tenaga Medis</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', margin: '6px 0 4px' }}>
              Masuk Dasbor Petugas FKTP
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.5 }}>
              Akses khusus petugas Puskesmas &amp; FKTP untuk verifikasi loket tiket rujukan, pemantauan kontak erat, dan respon Patient Safety Alert.
            </p>
          </div>

          {authError && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #F87171',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#DC2626',
              fontSize: '0.84rem',
              fontWeight: 600,
              marginBottom: '18px'
            }}>
              {authError}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleProceedOtp}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                  Kode Petugas FKTP
                </label>
                <input
                  type="text"
                  placeholder="Contoh: TNG-01 atau GBG-01"
                  value={staffCodeInput}
                  onChange={(e) => setStaffCodeInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #D9CBC2',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    textTransform: 'uppercase',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                  PIN Akses Petugas (6 Digit)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Masukkan 6 digit PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #D9CBC2',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'var(--color-navy)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '50px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <KeyRound size={18} /> Lanjut ke Verifikasi OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '18px',
                fontSize: '0.84rem',
                color: '#166534'
              }}>
                Kode OTP telah digenerate (Simulasi). Klik masuk untuk membuka dasbor faskes.
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                  Kode OTP (6 Digit)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #0F766E',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.2rem',
                    letterSpacing: '0.2em',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-cta-outline"
                  style={{ flex: 1, height: '44px' }}
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    background: '#0F766E',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '50px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Verifikasi &amp; Masuk Dasbor
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Shortcut Login */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #D9CBC2' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted)', display: 'block', marginBottom: '10px', textAlign: 'center' }}>
              Uji Coba Cepat 1-Klik Akun Petugas Demo:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => loginAsDemoStaff('TNG-01')}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-navy)' }}>
                    Puskesmas Tenggilis (TNG-01)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-muted)' }}>
                    Ns. Ratna Dewi (PIN: 482913)
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>Masuk &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemoStaff('GBG-01')}
                style={{
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-navy)' }}>
                    Puskesmas Gubeng (GBG-01)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-muted)' }}>
                    dr. Ahmad Fauzi (PIN: 715204)
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>Masuk &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED IN AS STAFF -> FULL DASHBOARD
  return (
    <div className="container nw-calc-dashboard-sec" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Banner: Clinic & Staff Identity */}
      <div style={{
        background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: '#E0C58F',
            color: '#112250',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800
          }}>
            <Building2 size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.35rem' }}>{currentUser.fk}</span>
              <span style={{ background: 'rgba(224, 197, 143, 0.3)', color: '#E0C58F', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                {currentUser.code}
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              Petugas: <strong>{currentUser.nama}</strong> {currentUser.nip && `(NIP. ${currentUser.nip})`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Clock size={15} /> Sesi Otomatis: <strong>{formatTimer(sessionTimeLeft)}</strong>
          </div>

          <button
            onClick={logout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        borderBottom: '2px solid #D9CBC2',
        marginBottom: '24px',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'ikhtisar', label: 'Ikhtisar & KPI' },
          { id: 'loket', label: 'Loket Verifikasi Tiket' },
          { id: 'kontak', label: `Kontak Wilayah (${totalContacts})` },
          { id: 'alert', label: `Patient Safety Alert (${activeAlertCount})` },
          { id: 'audit', label: 'Log Audit Keamanan PDP' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'none',
              fontSize: '0.9rem',
              fontWeight: subTab === tab.id ? 800 : 600,
              color: subTab === tab.id ? 'var(--color-navy)' : 'var(--color-muted)',
              borderBottom: subTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: IKHTISAR & KPI */}
      {subTab === 'ikhtisar' && (
        <div>
          {/* 4 KPI Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #D9CBC2', borderRadius: '16px', padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Kontak di Wilayah
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0' }}>
                {totalContacts}
              </div>
              <span style={{ fontSize: '0.76rem', color: '#0F766E', fontWeight: 600 }}>
                Terdaftar di {currentUser.fk}
              </span>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #D9CBC2', borderRadius: '16px', padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase' }}>
                Perlu Rujukan / Red Flag
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#DC2626', margin: '4px 0' }}>
                {highRiskContacts}
              </div>
              <span style={{ fontSize: '0.76rem', color: '#991B1B', fontWeight: 600 }}>
                Prioritas TCM &amp; Foto Toraks
              </span>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #D9CBC2', borderRadius: '16px', padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>
                Tiket Belum Hadir di Loket
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#D97706', margin: '4px 0' }}>
                {pendingTickets}
              </div>
              <span style={{ fontSize: '0.76rem', color: '#92400E', fontWeight: 600 }}>
                Menunggu verifikasi pasien
              </span>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #D9CBC2', borderRadius: '16px', padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: 700, textTransform: 'uppercase' }}>
                Patient Safety Alert Aktif
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#B91C1C', margin: '4px 0' }}>
                {activeAlertCount}
              </div>
              <span style={{ fontSize: '0.76rem', color: '#7F1D1D', fontWeight: 600 }}>
                Perlu panggilan / visit segera
              </span>
            </div>
          </div>

          {/* Quick Shortcuts to Loket & Emergency */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#F0F4FC', border: '1px solid #D0DBEE', borderRadius: '16px', padding: '22px' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                Loket Pendaftaran Cepat
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: '#475569' }}>
                Verifikasi tiket rujukan digital yang dibawa peserta kontak erat dalam hitungan detik.
              </p>
              <button
                onClick={() => setSubTab('loket')}
                style={{
                  background: 'var(--color-navy)',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Buka Pemindai Loket &rarr;
              </button>
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '16px', padding: '22px' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#991B1B' }}>
                Tanggap Darurat Efek Samping
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: '#7F1D1D' }}>
                Pantau laporan tanda bahaya (seperti ikterus atau mual berat) dari kontak yang sedang menjalani TPT.
              </p>
              <button
                onClick={() => setSubTab('alert')}
                style={{
                  background: '#DC2626',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Lihat Inbox Peringatan &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOKET VERIFIKASI TIKET */}
      {subTab === 'loket' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #D9CBC2', borderRadius: '20px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 6px' }}>
            Pemindai &amp; Verifikasi Loket Faskes
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 24px' }}>
            Ketik 4 digit kode tiket rujukan digital atau pindai QR Code yang ditunjukkan oleh pasien kontak erat.
          </p>

          <form onSubmit={handleVerifyTicketSubmit} style={{ maxWidth: '520px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Ketik 4 digit kode (contoh: H4MK atau R7TP)"
                maxLength={4}
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid var(--color-primary)',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--color-navy)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 24px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                Verifikasi
              </button>
            </div>
          </form>

          {/* Verification Result Card */}
          {verifyResult && (
            <div style={{
              background: verifyResult.success ? '#F0FDF4' : '#FEF2F2',
              border: `2px solid ${verifyResult.success ? '#22C55E' : '#EF4444'}`,
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '600px',
              animation: 'slideInToast 0.3s ease'
            }}>
              {verifyResult.success ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#166534', marginBottom: '12px' }}>
                    <CheckCircle size={24} />
                    <strong style={{ fontSize: '1.15rem' }}>TIKET VALID &amp; TERVERIFIKASI HADIR</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.86rem', color: '#14532D' }}>
                    <div>
                      <span>Nama Pasien:</span>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{verifyResult.contact.nama}</div>
                    </div>
                    <div>
                      <span>NIK:</span>
                      <div style={{ fontWeight: 800 }}>{verifyResult.contact.nik.slice(0, 4)}••••••••{verifyResult.contact.nik.slice(-4)}</div>
                    </div>
                    <div>
                      <span>Wilayah Asal:</span>
                      <div>Kel. {verifyResult.contact.kel}, RT {verifyResult.contact.rt}/RW {verifyResult.contact.rw}</div>
                    </div>
                    <div>
                      <span>Alasan Rujukan:</span>
                      <div style={{ fontWeight: 700 }}>{verifyResult.contact.referralReason}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #86EFAC', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleOpenStatusModal(verifyResult.contact)}
                      style={{
                        background: '#166534',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Perbarui Tindak Lanjut Layanan
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#991B1B' }}>
                  <XCircle size={24} />
                  <div>
                    <strong>Tiket Tidak Ditemukan</strong>
                    <p style={{ margin: 0, fontSize: '0.84rem' }}>{verifyResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MANAJEMEN KONTAK WILAYAH */}
      {subTab === 'kontak' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #D9CBC2', borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                Daftar Kontak Erat di Wilayah {currentUser.fk}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                Daftar kontak serumah dan dekat yang telah melakukan penapisan mandiri melalui TB-Shield.
              </p>
            </div>

            {/* Filter & Search */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Cari nama, NIK, kode tiket..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #D9CBC2',
                  fontSize: '0.85rem'
                }}
              />
              <select
                value={contactFilterRisk}
                onChange={(e) => setContactFilterRisk(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D9CBC2',
                  fontSize: '0.85rem',
                  background: '#FFFFFF'
                }}
              >
                <option value="Semua">Semua Risiko</option>
                <option value="Tinggi">Risiko Tinggi</option>
                <option value="Sedang">Risiko Sedang</option>
                <option value="Rendah">Risiko Rendah</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #D9CBC2', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-navy)' }}>Nama Lengkap</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-navy)' }}>Wilayah</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-navy)' }}>Tingkat Risiko</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-navy)' }}>Tiket</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-navy)' }}>Status Layanan</th>
                  <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--color-navy)', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-dark)' }}>{c.nama}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                        {c.nik.slice(0, 4)}••••••••{c.nik.slice(-4)}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      Kel. {c.kel}
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-muted)' }}>RT {c.rt} / RW {c.rw}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        background: c.kategoriRisiko === 'Tinggi' ? '#FEE2E2' : c.kategoriRisiko === 'Sedang' ? '#FEF3C7' : '#D1FAE5',
                        color: c.kategoriRisiko === 'Tinggi' ? '#991B1B' : c.kategoriRisiko === 'Sedang' ? '#92400E' : '#065F46'
                      }}>
                        {c.kategoriRisiko} ({c.skor} Poin)
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {c.ticket ? (
                        <span style={{ color: 'var(--color-primary)' }}>#{c.ticket}</span>
                      ) : (
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: c.status === 'Verifikasi Loket' ? '#DCFCE7' : c.status === 'Rujukan Terbit' ? '#FEF3C7' : '#F1F5F9',
                        color: c.status === 'Verifikasi Loket' ? '#15803D' : c.status === 'Rujukan Terbit' ? '#B45309' : '#475569'
                      }}>
                        {c.status || 'Terdaftar'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenStatusModal(c)}
                        style={{
                          background: 'var(--color-navy)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Detail &amp; Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PATIENT SAFETY ALERT FEED */}
      {subTab === 'alert' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #D9CBC2', borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <ShieldAlert size={26} color="#DC2626" />
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                Live Feed Patient Safety Alert
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                Peringatan darurat efek samping dan tanda bahaya yang dilaporkan kontak erat selama menjalani TPT/OAT.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeAlerts.map((alt) => {
              const isResolved = alt.status.includes('Selesai');
              return (
                <div
                  key={alt.id}
                  style={{
                    background: isResolved ? '#F8FAFC' : '#FEF2F2',
                    border: `1.5px solid ${isResolved ? '#CBD5E1' : '#F87171'}`,
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: isResolved ? '#E2E8F0' : '#DC2626',
                        color: isResolved ? '#475569' : '#FFFFFF'
                      }}>
                        {isResolved ? 'SELESAI DITANGANI' : 'PERINGATAN MERAH AKTIF'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{alt.date}</span>
                    </div>

                    <h4 style={{ margin: '4px 0', fontSize: '1.05rem', fontWeight: 800, color: isResolved ? '#334155' : '#991B1B' }}>
                      {alt.type}
                    </h4>

                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '6px' }}>
                      Pasien: <strong>{alt.contactName}</strong> • FKTP: {alt.contactFKTP}
                    </div>

                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
                      Catatan: "{alt.notes}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a
                      href={`tel:${alt.contactPhone || '081234567890'}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#0F766E',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}
                    >
                      <PhoneCall size={14} /> Hubungi Pasien
                    </a>

                    {!isResolved && (
                      <button
                        onClick={() => resolveAlert(alt.id)}
                        style={{
                          background: '#112250',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Tandai Selesai
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: LOG AUDIT KEAMANAN PDP */}
      {subTab === 'audit' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #D9CBC2', borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <ShieldCheck size={22} color="var(--color-primary)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                Log Audit Akses Data Medis (Kepatuhan UU PDP No. 27/2022)
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                Catatan aktivitas petugas dan sinkronisasi data untuk menjamin kerahasiaan rekam medis.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{log.action}</span>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-muted)' }}>
                    Oleh: {log.staff} • {log.date} {log.time}
                  </div>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: '#D1FAE5',
                  color: '#065F46'
                }}>
                  {log.status || 'Tervalidasi'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: DETAIL & UPDATE STATUS PASIEN */}
      {selectedContactModal && (
        <div className="modal-overlay" onClick={() => setSelectedContactModal(null)}>
          <div className="modal-card" style={{ maxWidth: '540px', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-navy)' }}>
              Perbarui Status Layanan Kontak Erat
            </h3>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.86rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-navy)' }}>
                {selectedContactModal.nama}
              </div>
              <div style={{ color: 'var(--color-muted)' }}>
                NIK: {selectedContactModal.nik} • Usia: {selectedContactModal.age} th ({selectedContactModal.jk})
              </div>
              <div style={{ marginTop: '6px', fontWeight: 700, color: 'var(--color-primary)' }}>
                Skor Skrining: {selectedContactModal.skor}/10 ({selectedContactModal.kategoriRisiko})
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                Pilih Tahap Layanan Klinis:
              </label>
              <select
                value={newStatusValue}
                onChange={(e) => setNewStatusValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #D9CBC2',
                  fontSize: '0.9rem',
                  background: '#FFFFFF'
                }}
              >
                <option value="Terdaftar">Terdaftar (Menunggu Penjadwalan)</option>
                <option value="Rujukan Terbit">Rujukan Terbit (Menunggu Kedatangan Loket)</option>
                <option value="Verifikasi Loket">Verifikasi Loket (Pasien Telah Hadir di FKTP)</option>
                <option value="Pemeriksaan TCM / Rontgen">Dalam Pemeriksaan Laboratorium TCM / Rontgen</option>
                <option value="Konseling TPT 3HP / 1HP">Konseling &amp; Memulai Terapi Pencegahan (TPT)</option>
                <option value="Pengobatan OAT Aktif">Diagnosis TBC Aktif &amp; Terapi OAT</option>
                <option value="Selesai Evaluasi">Selesai Evaluasi (Non-TBC &amp; Edukasi Mandiri)</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                Catatan Klinis Petugas:
              </label>
              <textarea
                value={staffNotesInput}
                onChange={(e) => setStaffNotesInput(e.target.value)}
                placeholder="Contoh: Pasien telah dilakukan uji TCM, hasil negatif. Direkomendasikan regimen TPT 3HP..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #D9CBC2',
                  fontSize: '0.86rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedContactModal(null)}
                className="btn-cta-outline"
                style={{ padding: '8px 18px', height: '40px' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveStatusUpdate}
                style={{
                  background: 'var(--color-navy)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
