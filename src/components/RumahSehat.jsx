import React, { useState } from 'react';
import { Wind, Sun, CheckSquare, ShieldCheck, Home, AlertCircle } from 'lucide-react';

export default function RumahSehat({ isDashboard = false }) {
  // Checklist sanitasi rumah (Default Kosong: dicheck mandiri oleh pengguna)
  const [checklist, setChecklist] = useState({
    flushing: false,
    sunlight: false,
    mattress: false,
    mask: false
  });

  const toggleCheck = (key) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div
      className={`container ${isDashboard ? 'nw-calc-dashboard-sec' : 'section'}`}
      id="rumah"
      style={isDashboard ? { padding: '20px 24px 60px' } : undefined}
    >
      <div>
        {/* Header */}
        {!isDashboard && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-tb-jkn">Pilar 2 &amp; Sanitasi Lingkungan</span>
              <span className="badge-demo-tag">Ventilasi Silang &amp; Sinar UV</span>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 10px' }}>
              Sanitasi Rumah &amp; Pengurasan Udara
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Bakteri TBC melayang sebagai aerosol mikroskopis di udara tertutup. Maksimalkan sirkulasi udara silang dan penetrasi sinar ultraviolet (UV) matahari alami di kediaman kontak serumah.
            </p>
          </div>
        )}

        {/* 2 Interactive SVG Illustrations (Ventilation & Sunlight) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Card 1: Ventilasi Silang & Air Flushing */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #D9CBC2',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Wind size={22} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                Pengurasan Udara (Air Flushing)
              </h3>
            </div>

            {/* Scalable SVG Illustration */}
            <svg viewBox="0 0 320 130" style={{ width: '100%', height: 'auto', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #D9CBC2' }}>
              {/* Healthy Room (Left) */}
              <rect x="10" y="20" width="140" height="90" fill="none" stroke="#0F766E" strokeWidth="2.5" rx="6" />
              <rect x="6" y="45" width="8" height="40" fill="#2DB5A6" rx="2" />
              <rect x="146" y="45" width="8" height="40" fill="#2DB5A6" rx="2" />
              {/* Wind Airflow Arrow */}
              <path d="M 0 65 L 45 65 M 105 65 L 160 65" stroke="#0F766E" strokeWidth="3" strokeDasharray="5 3" />
              <polygon points="160,65 152,60 152,70" fill="#0F766E" />
              <text x="80" y="122" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0F766E">
                Optimal: Jendela Berseberangan
              </text>

              {/* Stagnant Room (Right) */}
              <rect x="170" y="20" width="140" height="90" fill="none" stroke="#DC2626" strokeWidth="2.5" rx="6" />
              <rect x="166" y="45" width="8" height="40" fill="#94A3B8" rx="2" />
              <text x="240" y="68" textAnchor="middle" fontSize="10.5" fill="#DC2626" fontWeight="700">
                Tertutup &amp; Udara Mengendap
              </text>
              <text x="240" y="122" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#DC2626">
                Risiko Tinggi Penularan
              </text>
            </svg>

            <div style={{ marginTop: '16px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.55 }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong>Protokol Air Flushing:</strong> Buka jendela dan pintu yang saling berseberangan selama minimal <strong>15–30 menit, 2–3 kali sehari</strong>.
              </p>
              <p style={{ margin: 0, color: 'var(--color-muted)' }}>
                Ventilasi alami yang ideal memiliki luas bukaan permanen minimal 10% dari total luas lantai ruangan.
              </p>
            </div>
          </div>

          {/* Card 2: Sinar UV Matahari Alami */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #D9CBC2',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sun size={22} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                Pencahayaan Sinar UV Matahari
              </h3>
            </div>

            {/* Scalable SVG Illustration */}
            <svg viewBox="0 0 320 130" style={{ width: '100%', height: 'auto', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #D9CBC2' }}>
              {/* Sunny Room (Left) */}
              <rect x="10" y="20" width="140" height="90" fill="#FFFBEB" stroke="#0F766E" strokeWidth="2.5" rx="6" />
              <rect x="10" y="30" width="6" height="45" fill="#F59E0B" rx="1" />
              <polygon points="16,30 16,75 110,110 65,110" fill="#FDE68A" opacity="0.6" />
              <text x="80" y="122" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0F766E">
                Terang: Sinar UV Tembus Lantai
              </text>

              {/* Dark Room (Right) */}
              <rect x="170" y="20" width="140" height="90" fill="#E2E8F0" stroke="#DC2626" strokeWidth="2.5" rx="6" />
              <rect x="170" y="30" width="6" height="45" fill="#64748B" rx="1" />
              <text x="240" y="68" textAnchor="middle" fontSize="10.5" fill="#64748B" fontWeight="700">
                Gelap, Lembap &amp; Tanpa Sinar
              </text>
              <text x="240" y="122" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#DC2626">
                Bakteri TBC Bertahan Berhari-hari
              </text>
            </svg>

            <div style={{ marginTop: '16px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.55 }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong>Disinfeksi Alami Sinar UV:</strong> Kuman TBC sangat rentan dan cepat mati bila terkena sinar matahari langsung.
              </p>
              <p style={{ margin: 0, color: 'var(--color-muted)' }}>
                Jemur kasur, bantal, dan karpet secara teratur di bawah terik matahari siang untuk membasmi kuman yang menempel.
              </p>
            </div>
          </div>
        </div>

        {/* Daily Home Sanitation Checklist */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '20px',
          border: '1px solid #CBD5E1',
          padding: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-navy)' }}>
              Checklist Harian Rumah Sehat Kontak Serumah
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F766E' }}>
                Tercapai: <strong>{completedCount} / 4</strong> Praktik Sanitasi
              </span>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setChecklist({ flushing: false, sunlight: false, mattress: false, mask: false })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'flushing', label: 'Buka jendela dan pintu kamar selama minimal 15 menit pagi ini.' },
              { id: 'sunlight', label: 'Pastikan cahaya matahari alami masuk menerangi ruang tamu dan kamar tidur.' },
              { id: 'mattress', label: 'Jemur kasur, selimut, atau sprei di bawah terik matahari mingguan.' },
              { id: 'mask', label: 'Kenakan masker medis bila merawat anggota keluarga yang sedang batuk aktif.' }
            ].map((chk) => (
              <label
                key={chk.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: checklist[chk.id] ? '#F0FDF4' : '#FFFFFF',
                  borderRadius: '10px',
                  border: checklist[chk.id] ? '1.5px solid #10B981' : '1px solid #D9CBC2',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={checklist[chk.id]}
                  onChange={() => toggleCheck(chk.id)}
                  style={{ width: '18px', height: '18px', accentColor: '#0F766E' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  {chk.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
