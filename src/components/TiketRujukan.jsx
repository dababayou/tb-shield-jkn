import React, { useState } from 'react';
import {
  QrCode,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  AlertCircle,
  FileText,
  Building2,
  RefreshCw,
  ExternalLink,
  FileCheck2,
  RotateCcw
} from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';

export default function TiketRujukan({ isDashboard = false }) {
  const {
    currentUser,
    setCurrentUser,
    contacts,
    setContacts,
    issueDigitalTicket,
    verifyTicketAtDesk,
    showToast,
    setActiveTab
  } = useTBShield();

  const [isSyncing, setIsSyncing] = useState(false);

  // Find user's active contact record (tidak auto-fallback ke kontak yang sudah punya tiket)
  const userContact = currentUser
    ? contacts.find((c) => c.id === currentUser.id || (currentUser.nik && c.nik === currentUser.nik)) || currentUser
    : null;

  // Tiket hanya muncul jika user sudah benar-benar membuat / memiliki tiket
  const hasTicket = Boolean(userContact?.ticket);

  const ticketCode = userContact?.ticket || '';
  const ticketId = userContact?.ticketId || (ticketCode ? `TB-${ticketCode}-2026` : '');
  const patientName = userContact?.nama || currentUser?.nama || 'Peserta JKN Mandiri';
  const rawNik = userContact?.nik || currentUser?.nik || '3578010101900021';
  const maskedNik = `${rawNik.slice(0, 4)}••••••••${rawNik.slice(-4)}`;
  const bpjsCard = userContact?.bp ? `${userContact.bp.slice(0, 4)}••••${userContact.bp.slice(-4)}` : (currentUser?.bp ? `${currentUser.bp.slice(0, 4)}••••${currentUser.bp.slice(-4)}` : '0001••••6789');
  const fktpName = userContact?.fk || currentUser?.fk || 'Puskesmas Tenggilis';
  const referralReason = userContact?.referralReason || 'Penerbitan Mandiri Pasien Kontak Erat & Evaluasi TPT';
  const ticketStatus = userContact?.ticketStatus || 'Tersinkronisasi P-Care (Demo)';

  const handleCreateTicket = () => {
    if (currentUser) {
      issueDigitalTicket(currentUser.id, 'Penerbitan Mandiri Kontak Erat & Rujukan Prioritas Puskesmas');
    } else {
      // Guest demo ticket creation
      const guestId = `ct-${Date.now().toString().slice(-4)}`;
      const guestUser = {
        role: 'user',
        id: guestId,
        nama: 'Peserta JKN Mandiri',
        nik: '3578010101900021',
        bp: '0001234567890',
        fk: 'Puskesmas Tenggilis',
        status: 'Rujukan Terbit'
      };
      setContacts((prev) => [guestUser, ...prev]);
      setCurrentUser(guestUser);
      issueDigitalTicket(guestId, 'Penerbitan Mandiri Kontak Erat & Rujukan Prioritas Puskesmas');
    }
  };

  const handleResetTicket = () => {
    if (userContact) {
      setContacts((prev) =>
        prev.map((c) => (c.id === userContact.id ? { ...c, ticket: null, ticketId: null, status: 'Terdaftar' } : c))
      );
    }
    if (currentUser) {
      setCurrentUser((prev) => ({ ...prev, ticket: null, ticketId: null, status: 'Terdaftar' }));
    }
    showToast('Tiket rujukan berhasil diatur ulang.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Sinkronisasi data rujukan ke P-Care BPJS Kesehatan berhasil diperbarui (Simulasi)!');
    }, 1200);
  };

  const handleSimulateVerify = () => {
    if (!ticketCode) return;
    const res = verifyTicketAtDesk(ticketCode);
    if (res.success) {
      showToast(`Tiket #${ticketCode} telah berhasil diverifikasi oleh petugas loket FKTP!`);
    }
  };

  return (
    <div
      className={`container ${isDashboard ? 'nw-calc-dashboard-sec' : 'section'}`}
      id="tiket"
      style={isDashboard ? { padding: '20px 24px 60px' } : undefined}
    >
      <div>
        {/* Section Header */}
        {!isDashboard && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-tb-jkn">Pilar 3 Inovasi</span>
              <span className="badge-demo-tag">Simulasi P-Care BPJS &amp; SATUSEHAT</span>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 10px' }}>
              Tiket Rujukan Digital JKN
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto' }}>
              Jembatan digital penghubung hasil skrining mandiri kontak erat dengan proses verifikasi &amp; tindak lanjut tenaga medis di Fasilitas Kesehatan Tingkat Pertama (FKTP).
            </p>
          </div>
        )}

        {/* Demo Notice Banner */}
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FCD34D',
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <AlertCircle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.84rem', color: '#92400E', lineHeight: 1.5 }}>
            <strong>Status Integrasi (Kepatuhan Knowledge Brief):</strong> Integrasi P-Care BPJS Kesehatan &amp; SATUSEHAT dalam website ini merupakan <em>mode simulasi terverifikasi</em>. Data pribadi NIK disamarkan sesuai UU No. 27/2022 tentang Perlindungan Data Pribadi (UU PDP).
          </div>
        </div>

        {/* Conditional Rendering: Belum Buat Tiket vs Tiket Sudah Diterbitkan */}
        {!hasTicket ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '2px dashed #D9CBC2',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#F0F4FC',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 14px rgba(60, 80, 125, 0.12)'
            }}>
              <QrCode size={34} />
            </div>

            <span className="badge-tb-jkn" style={{ marginBottom: '8px' }}>Status: Belum Ada Tiket</span>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-navy)', margin: '10px 0 8px' }}>
              Belum Ada Tiket Rujukan Aktif
            </h3>

            <p style={{ color: 'var(--color-muted)', fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Hasil tiket rujukan digital dengan kode verifikasi loket dan barcode/QR belum dibuat. Silakan tekan tombol <strong>"Buat Tiket Rujukan Digital"</strong> di bawah untuk menerbitkan tiket verifikasi rujukan Puskesmas Anda.
            </p>

            {/* User Identity Preview Box */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '16px 20px',
              maxWidth: '460px',
              margin: '0 auto 28px',
              textAlign: 'left',
              fontSize: '0.86rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-muted)' }}>Nama Calon Pasien:</span>
                <strong style={{ color: 'var(--color-navy)' }}>{patientName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-muted)' }}>Faskes Tujuan:</span>
                <strong style={{ color: '#0F766E' }}>{fktpName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted)' }}>NIK (Terproteksi PDP):</span>
                <code style={{ color: 'var(--color-dark)', fontWeight: 700 }}>{maskedNik}</code>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleCreateTicket}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '12px 28px',
                  fontWeight: 800,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(17, 34, 80, 0.2)'
                }}
              >
                <FileCheck2 size={18} /> Buat Tiket Rujukan Digital Sekarang
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentUser) {
                    setActiveTab('skrining');
                  } else {
                    document.getElementById('skrining')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-cta-outline"
                style={{ padding: '12px 22px', borderRadius: '50px', fontWeight: 700, fontSize: '0.88rem' }}
              >
                Lakukan Skrining Risiko Dulu &rarr;
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* The Digital Ticket Card */}
            <div className="ticket-card-wrapper" id="printable-ticket">
              {/* Header Card */}
              <div className="ticket-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={22} color="#E0C58F" />
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.02em' }}>
                      TB-SHIELD JKN
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', opacity: 0.9 }}>
                    Tiket Rujukan Pemeriksaan &amp; Evaluasi TPT Kontak Erat
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: '#E0C58F',
                    color: '#112250',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                    JKN TERVALIDASI
                  </span>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '4px' }}>
                    Ref: {ticketId}
                  </div>
                </div>
              </div>

              {/* Ticket Body */}
              <div style={{ padding: '28px' }}>
                {/* Short Code Display */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    Kode Verifikasi Loket FKTP
                  </span>
                  <div className="ticket-code-display">
                    {ticketCode}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: '4px 0 0' }}>
                    Tunjukkan 4 digit kode atau QR code ini di loket pendaftaran Puskesmas.
                  </p>
                </div>

                {/* Grid 2 Column: Details & QR Barcode */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                  borderTop: '1px solid #D9CBC2',
                  paddingTop: '20px'
                }}>
                  {/* Left Column: Patient & Clinic Data */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                        Nama Pasien / Kontak Erat
                      </span>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={18} color="var(--color-primary)" /> {patientName}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                          NIK (Terproteksi PDP)
                        </span>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-dark)', fontFamily: 'var(--font-mono)' }}>
                          {maskedNik}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                          No. Kartu BPJS
                        </span>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-dark)', fontFamily: 'var(--font-mono)' }}>
                          {bpjsCard}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                        FKTP Tujuan Terdaftar
                      </span>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F766E', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <Building2 size={18} /> {fktpName}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                        Indikasi &amp; Pemicu Rujukan
                      </span>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#7F1D1D',
                        background: '#FEF2F2',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        borderLeft: '4px solid #DC2626',
                        marginTop: '4px',
                        fontWeight: 600
                      }}>
                        {referralReason}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Vector Barcode & QR code */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="barcode-svg-container" style={{ width: '100%', maxWidth: '240px' }}>
                      {/* High Quality Scalable QR Code Graphic */}
                      <svg viewBox="0 0 120 120" width="120" height="120" style={{ display: 'block' }}>
                        <rect width="120" height="120" fill="#FFFFFF" />
                        {/* Corner 1 */}
                        <rect x="10" y="10" width="30" height="30" fill="#112250" rx="4" />
                        <rect x="16" y="16" width="18" height="18" fill="#FFFFFF" rx="2" />
                        <rect x="21" y="21" width="8" height="8" fill="#112250" />
                        {/* Corner 2 */}
                        <rect x="80" y="10" width="30" height="30" fill="#112250" rx="4" />
                        <rect x="86" y="16" width="18" height="18" fill="#FFFFFF" rx="2" />
                        <rect x="91" y="21" width="8" height="8" fill="#112250" />
                        {/* Corner 3 */}
                        <rect x="10" y="80" width="30" height="30" fill="#112250" rx="4" />
                        <rect x="16" y="86" width="18" height="18" fill="#FFFFFF" rx="2" />
                        <rect x="21" y="91" width="8" height="8" fill="#112250" />
                        {/* Data matrix dots */}
                        <rect x="48" y="16" width="8" height="8" fill="#3C507D" />
                        <rect x="62" y="16" width="8" height="8" fill="#112250" />
                        <rect x="48" y="32" width="12" height="6" fill="#112250" />
                        <rect x="66" y="32" width="6" height="14" fill="#3C507D" />
                        <rect x="18" y="52" width="10" height="8" fill="#112250" />
                        <rect x="34" y="52" width="18" height="8" fill="#3C507D" />
                        <rect x="60" y="52" width="14" height="14" fill="#112250" />
                        <rect x="82" y="52" width="10" height="18" fill="#3C507D" />
                        <rect x="100" y="52" width="8" height="8" fill="#112250" />
                        <rect x="48" y="72" width="10" height="12" fill="#3C507D" />
                        <rect x="64" y="72" width="8" height="8" fill="#112250" />
                        <rect x="48" y="92" width="18" height="12" fill="#112250" />
                        <rect x="72" y="92" width="14" height="8" fill="#3C507D" />
                        <rect x="94" y="82" width="14" height="18" fill="#112250" />
                      </svg>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '8px' }}>
                        SCAN DI LOKET FKTP
                      </span>

                      {/* Linear Barcode Rendering */}
                      <div style={{ marginTop: '10px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2px', height: '34px', alignItems: 'center' }}>
                          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3].map((w, i) => (
                            <div
                              key={i}
                              style={{
                                width: `${w}px`,
                                height: '100%',
                                background: i % 2 === 0 ? '#112250' : 'transparent'
                              }}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--color-muted)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>
                          *{ticketCode}*
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.78rem', color: '#0F766E', fontWeight: 700 }}>
                      <CheckCircle2 size={16} /> Status: {ticketStatus}
                    </div>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #D9CBC2' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-navy)', display: 'block', marginBottom: '12px' }}>
                    Alur Tindak Lanjut Layanan:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    <div style={{ padding: '8px 10px', borderRadius: '8px', background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#065F46' }}>1. TIKET TERBIT</div>
                      <div style={{ fontSize: '0.75rem', color: '#047857' }}>Hasil skrining siap diverifikasi</div>
                    </div>
                    <div style={{ padding: '8px 10px', borderRadius: '8px', background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#065F46' }}>2. SINKRONISASI P-CARE</div>
                      <div style={{ fontSize: '0.75rem', color: '#047857' }}>Antrean rujukan teregistrasi</div>
                    </div>
                    <div style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: userContact?.status === 'Verifikasi Loket' ? '#D1FAE5' : '#FEF3C7',
                      border: userContact?.status === 'Verifikasi Loket' ? '1px solid #6EE7B7' : '1px solid #FCD34D'
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: userContact?.status === 'Verifikasi Loket' ? '#065F46' : '#92400E' }}>
                        3. LOKET PUSKESMAS
                      </div>
                      <div style={{ fontSize: '0.75rem', color: userContact?.status === 'Verifikasi Loket' ? '#047857' : '#B45309' }}>
                        {userContact?.status === 'Verifikasi Loket' ? 'Tervalidasi Hadir' : 'Menunggu kedatangan'}
                      </div>
                    </div>
                    <div style={{ padding: '8px 10px', borderRadius: '8px', background: '#F1F5F9', border: '1px solid #CBD5E1' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569' }}>4. EVALUASI / TPT</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Pemeriksaan &amp; konseling dokter</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              marginTop: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSimulateSync}
                  disabled={isSyncing}
                  className="btn-cta-outline"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', height: '40px' }}
                >
                  <RefreshCw size={15} style={{ marginRight: '6px', animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                  {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Ulang ke P-Care (Demo)'}
                </button>

                <button
                  type="button"
                  onClick={handleSimulateVerify}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#0F766E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '8px 18px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    height: '40px'
                  }}
                >
                  <CheckCircle2 size={16} /> Simulasi Verifikasi Loket FKTP
                </button>

                <button
                  type="button"
                  onClick={handleResetTicket}
                  className="btn-cta-outline"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', height: '40px', color: '#64748B' }}
                  title="Batalkan tiket rujukan saat ini dan kembali ke tampilan awal"
                >
                  <RotateCcw size={14} style={{ marginRight: '4px' }} /> Buat Ulang Tiket
                </button>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-navy)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '8px 20px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  height: '40px'
                }}
              >
                <Printer size={16} /> Cetak / Unduh Tiket
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
