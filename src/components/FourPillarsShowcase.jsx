import React from 'react';
import {
  Activity,
  Apple,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  Mic,
  Scale
} from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';

export default function FourPillarsShowcase({ onSelectPillar }) {
  const { setActiveTab } = useTBShield();

  const pillars = [
    {
      id: 'pilar1',
      tabKey: 'skrining',
      number: '01',
      title: 'Skrining Presisi & Teletriase Akustik',
      subtitle: 'Early Warning Filter dari Rumah',
      icon: Activity,
      color: '#3C507D',
      bgLight: '#F0F4FC',
      points: [
        'Instrumen skoring usulan 0–10 poin (Gejala, Risiko, Paparan).',
        'Analisis frekuensi dan ritme tempo batuk menggunakan kecerdasan buatan.',
        'Penapis awal privat tanpa stigma sebelum melangkah ke fasilitas kesehatan.'
      ]
    },
    {
      id: 'pilar2',
      tabKey: 'gizi',
      number: '02',
      title: 'Imunonutrisi Lokal & Pelacak IMT',
      subtitle: 'Pendamping Daya Tahan Tubuh Alami',
      icon: Apple,
      color: '#0F766E',
      bgLight: '#D5F0E6',
      points: [
        'Katalog resep: Daun Kelor, Tepung Ikan Kembung, Jamur, dan Telur.',
        'Target L-Arginine, Zinc, Vitamin D3, dan Protein tinggi.',
        'Pelacak IMT otomatis; memicu rujukan konseling gizi jika IMT < 18,5.'
      ]
    },
    {
      id: 'pilar3',
      tabKey: 'tiket',
      number: '03',
      title: 'Tiket Rujukan Digital & Integrasi JKN',
      subtitle: 'Konektivitas Puskesmas & P-Care (Demo)',
      icon: FileCheck2,
      color: '#112250',
      bgLight: '#E8ECF5',
      points: [
        'Penerbitan tiket rujukan ber-QR Code & kode unik 4 karakter.',
        'Sinkronisasi simulasi ke P-Care BPJS Kesehatan & SATUSEHAT.',
        'Perlindungan identitas NIK disamarkan sesuai amanat UU PDP No. 27/2022.'
      ]
    },
    {
      id: 'pilar4',
      tabKey: 'safety',
      number: '04',
      title: 'Chatbot 24 Jam & Patient Safety Alert',
      subtitle: 'Literasi & Mitigasi Efek Samping Obat',
      icon: ShieldAlert,
      color: '#E8472F',
      bgLight: '#FDECE9',
      points: [
        'Asisten AI edukasi 24 jam dengan klasifikasi niat 3-tier.',
        'Swipe-Card 20 butir Mitos vs Fakta TBC untuk hapus stigma.',
        'Patient Safety Alert: Deteksi tanda bahaya ikterus dengan layar peringatan merah.'
      ]
    }
  ];

  const handlePillarClick = (tabKey) => {
    if (onSelectPillar) {
      onSelectPillar(tabKey);
    } else {
      setActiveTab(tabKey);
      window.location.hash = `#${tabKey}`;
    }
  };

  return (
    <section className="container section" id="inovasi" style={{ paddingTop: '60px', paddingBottom: '70px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span className="badge-tb-jkn">Arsitektur Solusi</span>
          <span className="badge-demo-tag">Single Source of Truth</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 12px' }}>
          Empat Pilar Utama Inovasi TB-Shield JKN
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '1.02rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
          Platform preventif digital holistik yang merajut skrining awal, pendampingan gizi daya tahan tubuh, keterhubungan faskes, serta keselamatan pasien dalam satu ekosistem terpadu.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="pillars-grid">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="pillar-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div className="pillar-number">
                    {p.number}
                  </div>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: p.bgLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: p.color
                  }}>
                    <Icon size={22} />
                  </div>
                </div>

                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: p.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {p.subtitle}
                </span>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', margin: '6px 0 14px', lineHeight: 1.35 }}>
                  {p.title}
                </h3>

                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  {p.points.map((pt, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => handlePillarClick(p.tabKey)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: p.color,
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 0
                  }}
                >
                  Jelajahi Fitur Pilar Ini <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
