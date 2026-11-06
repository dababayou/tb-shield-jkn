import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, X, AlertTriangle, CheckCircle, Hospital } from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';

export default function PatientSafetyModal({ isOpen, onClose }) {
  const {
    reportPatientSafetyAlert,
    redScreenTriggered,
    currentRedAlertData,
    dismissRedScreen,
    currentUser
  } = useTBShield();

  const [selectedSymptom, setSelectedSymptom] = useState('ikterus');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState('0812-3456-7890');
  const [submitted, setSubmitted] = useState(false);

  const dangerSymptoms = [
    {
      id: 'ikterus',
      name: 'Mata atau Kulit Menguning (Ikterus / Sakit Kuning)',
      severity: 'SANGAT TINGGI (RED FLAG)',
      desc: 'Tanda potensi gangguan fungsi hati (hepatotoksisitas) berat akibat obat TBC/TPT. Membutuhkan evaluasi medis segera!'
    },
    {
      id: 'severe_vomiting',
      name: 'Mual dan Muntah Hebat Berkelanjutan',
      severity: 'TINGGI',
      desc: 'Tidak dapat menelan makanan atau cairan sama sekali selama lebih dari 24 jam.'
    },
    {
      id: 'severe_rash',
      name: 'Ruam Kulit Hebat / Melepuh / Gatal Seluruh Tubuh',
      severity: 'TINGGI',
      desc: 'Kecurigaan reaksi alergi hipersensitivitas obat berat (DRESS / Steven-Johnson Syndrome).'
    },
    {
      id: 'vision_hearing',
      name: 'Gangguan Penglihatan (Kabur) atau Telinga Berdenging Hebat',
      severity: 'SEDANG - TINGGI',
      desc: 'Dapat menjadi efek samping spesifik obat tertentu yang perlu evaluasi dokter FKTP.'
    },
    {
      id: 'numbness',
      name: 'Kesemutan atau Kebas Hebat di Tangan/Kaki (Neuropati)',
      severity: 'SEDANG',
      desc: 'Kekurangan vitamin B6 (piridoksin) akibat konsumsi isoniazid, perlu penyesuaian suplemen oleh dokter.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const sym = dangerSymptoms.find((s) => s.id === selectedSymptom);
    reportPatientSafetyAlert({
      type: sym?.name || 'Tanda Bahaya Medis',
      notes: notes || 'Gejala dialami mendadak selama mengonsumsi obat pencegahan TBC / OAT.',
      phone
    });
    setSubmitted(true);
    if (onClose) onClose();
  };

  return (
    <>
      {/* 1. Normal Safety Form Modal */}
      {isOpen && !redScreenTriggered && (
        <div
          className="modal-overlay"
          onClick={onClose}
          style={{
            zIndex: 10000,
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '24px 16px'
          }}
        >
          <div
            className="modal-card"
            style={{
              maxWidth: '620px',
              width: '100%',
              margin: 'auto 0',
              padding: '28px',
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626'
                }}>
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                    Lapor Tanda Bahaya &amp; Efek Samping
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                    Patient Safety Alert — Notifikasi Langsung ke Petugas Puskesmas
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              color: '#92400E',
              lineHeight: 1.5
            }}>
              <strong>PENTING:</strong> Sistem ini tidak mengubah dosis atau menghentikan obat secara mandiri.
              Laporan Anda akan memicu peringatan darurat ke dasbor petugas FKTP setempat untuk segera dihubungi.
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--color-navy)' }}>
                  Pilih Keluhan / Tanda Bahaya yang Dialami:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dangerSymptoms.map((s) => (
                    <label
                      key={s.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: selectedSymptom === s.id ? '2px solid #DC2626' : '1px solid #D9CBC2',
                        background: selectedSymptom === s.id ? '#FEF2F2' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="radio"
                        name="dangerSymptom"
                        value={s.id}
                        checked={selectedSymptom === s.id}
                        onChange={(e) => setSelectedSymptom(e.target.value)}
                        style={{ marginTop: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#112250' }}>{s.name}</span>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: s.severity.includes('SANGAT') ? '#DC2626' : '#F59E0B',
                            color: '#FFFFFF'
                          }}>
                            {s.severity}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                          {s.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                  Catatan Tambahan (Kapan mulai terasa, obat yang diminum, dll):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Mulai merasa mata menguning dan mual sejak kemarin malam setelah minum dosis 3HP..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #D9CBC2',
                    fontFamily: 'inherit',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                  Nomor HP / WhatsApp Aktif untuk Dihubungi Petugas:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #D9CBC2',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-cta-outline"
                  style={{ padding: '8px 18px', height: '42px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '10px 22px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.92rem'
                  }}
                >
                  <AlertOctagon size={18} /> Kirim Patient Safety Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Red Screen Alarm Overlay (Full viewport when triggered) */}
      {redScreenTriggered && (
        <div
          className="patient-safety-red-overlay"
          style={{
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '24px 16px'
          }}
        >
          <div
            className="patient-safety-modal-card"
            style={{
              margin: 'auto 0',
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
          >
            <div className="red-alert-header">
              <div className="red-alert-icon-ring">
                <AlertOctagon size={32} />
              </div>
              <div>
                <span style={{
                  background: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Peringatan Keselamatan Pasien Aktif
                </span>
                <h2 style={{ margin: '4px 0 0', fontSize: '1.45rem', fontWeight: 800, color: '#991B1B' }}>
                  TANDA BAHAYA TERDETEKSI
                </h2>
              </div>
            </div>

            <div style={{
              background: '#FEF2F2',
              border: '2px solid #EF4444',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#B91C1C', marginBottom: '6px' }}>
                {currentRedAlertData?.type || 'Mata / Kulit Menguning (Ikterus)'}
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#7F1D1D', lineHeight: 1.5 }}>
                Kondisi ini merupakan sinyal penting perlunya evaluasi fungsi hati segera oleh dokter.
                <strong> Petugas {currentRedAlertData?.contactFKTP || 'Puskesmas'} telah menerima notifikasi prioritas merah</strong> dan akan segera memverifikasi kondisi Anda.
              </p>
            </div>

            <div style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '20px',
              fontSize: '0.85rem'
            }}>
              <div style={{ fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Langkah Keselamatan Segera:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', lineHeight: 1.6 }}>
                <li>Jangan minum dosis obat berikutnya sebelum berkonsultasi langsung dengan dokter FKTP.</li>
                <li>Segera datangi IGD Puskesmas atau rumah sakit terdekat bila disertai lemas berat atau muntah.</li>
                <li>Bawa seluruh kemasan obat pencegahan/OAT yang sedang Anda konsumsi.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="tel:119"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}
              >
                <PhoneCall size={20} /> Hubungi Hotline Darurat Medis (119 / PSC)
              </a>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="#tiket"
                  onClick={() => {
                    dismissRedScreen();
                    window.location.hash = '#tiket';
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#112250',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                >
                  <Hospital size={16} /> Lihat Tiket Rujukan FKTP
                </a>

                <button
                  type="button"
                  onClick={dismissRedScreen}
                  style={{
                    flex: 1,
                    background: '#E2E8F0',
                    color: '#334155',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  Tutup Peringatan Layar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
