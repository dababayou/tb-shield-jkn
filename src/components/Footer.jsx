import React from 'react';
import { ShieldCheck, PhoneCall, Lock, Heart, Building2, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenPrivacy, onOpenPatientSafety }) {
  return (
    <footer style={{
      background: '#112250',
      color: '#FFFFFF',
      padding: '64px 0 32px',
      borderTop: '4px solid #E0C58F'
    }}>
      <div className="container">
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Column 1: Identity & Description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#3C507D',
                border: '1.5px solid #E0C58F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E0C58F'
              }}>
                <ShieldCheck size={24} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
                TB-Shield <span style={{ color: '#E0C58F' }}>JKN</span>
              </span>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.65, margin: '0 0 16px' }}>
              Inovasi platform kesehatan digital untuk mendukung eliminasi tuberkulosis melalui tele-skrining presisi, teletriase akustik batuk, imunonutrisi pangan lokal, dan sinkronisasi tiket rujukan FKTP P-Care BPJS Kesehatan.
            </p>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(224, 197, 143, 0.15)',
              color: '#E0C58F',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              <Lock size={13} /> Kepatuhan UU PDP No. 27/2022
            </span>
          </div>

          {/* Column 2: 4 Pilar Inovasi Links */}
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#E0C58F', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Empat Pilar Solusi
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li>
                <a href="#skrining" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  • Pilar 1: Skrining Risiko &amp; Teletriase Batuk
                </a>
              </li>
              <li>
                <a href="#gizi" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  • Pilar 2: Imunonutrisi Lokal &amp; Pelacak IMT
                </a>
              </li>
              <li>
                <a href="#tiket" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  • Pilar 3: Tiket Rujukan Digital &amp; P-Care
                </a>
              </li>
              <li>
                <a href="#mitos-fakta" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  • Pilar 4: Chatbot 24 Jam &amp; Safety Alert
                </a>
              </li>
              <li>
                <a href="#adherence" style={{ color: '#CBD5E1', textDecoration: 'none', transition: 'color 0.2s' }}>
                  • Evaluasi Hambatan Kepatuhan TPT
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency & Disclaimers */}
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#E0C58F', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Layanan Darurat &amp; Faskes
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '14px' }}>
              Bila Anda atau keluarga mengalami tanda bahaya berat (seperti batuk darah banyak atau mata menguning/ikterus):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="tel:119"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                <PhoneCall size={16} /> Hotline Darurat Medis 119
              </a>

              <button
                type="button"
                onClick={onOpenPatientSafety}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Lapor Patient Safety Alert
              </button>
            </div>
          </div>
        </div>

        {/* Medical & Technical Disclaimer Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '18px 22px',
          marginBottom: '32px',
          fontSize: '0.78rem',
          color: '#94A3B8',
          lineHeight: 1.6
        }}>
          <strong style={{ color: '#E0C58F', display: 'block', marginBottom: '4px' }}>
            BATASAN PENGGUNAAN TEKNOLOGI &amp; KESELAMATAN MEDIS:
          </strong>
          TB-Shield JKN adalah platform digital pendukung pencegahan dan penapisan awal, bukan pengganti pemeriksaan medis, diagnosis dokter, atau layanan resmi BPJS Kesehatan. Hasil skor skrining (0–10) dan analisis akustik suara batuk merupakan instrumen rancangan usulan yang masih memerlukan validasi klinis lokal. Rekomendasi pangan lokal adalah pendamping gaya hidup pemenuhan gizi dan tidak menggantikan Terapi Pencegahan TBC (TPT) maupun Obat Anti-Tuberkulosis (OAT). Integrasi sistem eksternal (P-Care BPJS Kesehatan &amp; SATUSEHAT) disajikan dalam format simulasi prototipe.
        </div>

        {/* Bottom Credits & Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.8rem',
          color: '#94A3B8'
        }}>
          <div>
            &copy; {new Date().getFullYear()} TB-Shield JKN. Inovasi Preventif Kesehatan Digital Indonesia.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={onOpenPrivacy}
              style={{ background: 'none', border: 'none', color: '#E0C58F', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
            >
              Kebijakan Privasi Data (UU PDP)
            </button>
            <a
              href="#inovasi"
              style={{ color: '#CBD5E1', textDecoration: 'none' }}
            >
              Dokumentasi Inovasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
