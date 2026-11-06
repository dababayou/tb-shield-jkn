import React from 'react';
import { ShieldCheck, Lock, X, CheckCircle, FileText, AlertTriangle } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-card"
        style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#F0F4FC',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                Kebijakan Privasi &amp; Perlindungan Data
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                Kepatuhan UU PDP No. 27 Tahun 2022 &amp; Standar Kerahasiaan Medis
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

        <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.65 }}>
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #D9CBC2',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px'
          }}>
            <strong style={{ color: 'var(--color-navy)', display: 'block', marginBottom: '4px' }}>
              Prinsip Perlindungan Data Pribadi Kesehatan Spesifik:
            </strong>
            Data kesehatan dan riwayat paparan tuberkulosis Anda dilindungi secara ketat di bawah ketentuan
            <strong> Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong>.
          </div>

          <h4 style={{ color: 'var(--color-navy)', fontSize: '0.98rem', fontWeight: 800, margin: '16px 0 6px' }}>
            1. Persetujuan Eksplisit (Explicit Informed Consent)
          </h4>
          <p style={{ margin: '0 0 12px' }}>
            Pengumpulan data identitas (NIK), nomor kartu BPJS, data antropometri (berat/tinggi badan), dan sampel suara batuk hanya dilakukan setelah Anda memberikan persetujuan eksplisit. Anda memiliki hak untuk menarik kembali persetujuan atau meminta penghapusan riwayat penapisan kapan saja.
          </p>

          <h4 style={{ color: 'var(--color-navy)', fontSize: '0.98rem', fontWeight: 800, margin: '16px 0 6px' }}>
            2. Anonimisasi &amp; Masking NIK
          </h4>
          <p style={{ margin: '0 0 12px' }}>
            Pada seluruh tampilan antarmuka dan laporan dasbor FKTP, nomor identitas kependudukan (NIK) dan nomor BPJS disamarkan (masked) menjadi format <code>3578••••••••0021</code> guna mencegah penyalahgunaan identitas.
          </p>

          <h4 style={{ color: 'var(--color-navy)', fontSize: '0.98rem', fontWeight: 800, margin: '16px 0 6px' }}>
            3. Batasan Akses Berbasis Peran (RBAC) &amp; Audit Trail
          </h4>
          <p style={{ margin: '0 0 12px' }}>
            Petugas kesehatan di Fasilitas Kesehatan Tingkat Pertama (FKTP) hanya memiliki kewenangan melihat data kontak erat yang berada di dalam yurisdiksi wilayah kerjanya. Setiap aktivitas akses data tercatat otomatis dalam Log Audit yang tidak dapat dimanipulasi.
          </p>

          <h4 style={{ color: 'var(--color-navy)', fontSize: '0.98rem', fontWeight: 800, margin: '16px 0 6px' }}>
            4. Keamanan Sampel Akustik Batuk
          </h4>
          <p style={{ margin: '0 0 12px' }}>
            Rekaman audio batuk yang diberikan pengguna diproses secara aman semata-mata untuk ekstraksi fitur gelombang frekuensi dan ritme tempo triase. File audio tidak dibagikan kepada pihak ketiga di luar tindak lanjut rujukan medis resmi.
          </p>

          <h4 style={{ color: 'var(--color-navy)', fontSize: '0.98rem', fontWeight: 800, margin: '16px 0 6px' }}>
            5. Status Simulasi Integrasi P-Care &amp; SATUSEHAT
          </h4>
          <p style={{ margin: '0 0 12px' }}>
            Seluruh data yang ditampilkan dalam prototipe ini menggunakan data sintetis (mock data) dan tidak menghubungkan rekam medis riil peserta JKN tanpa kerja sama dan integrasi resmi yang disahkan oleh BPJS Kesehatan dan Kementerian Kesehatan RI.
          </p>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'var(--color-navy)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 24px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Saya Memahami &amp; Menyetujui
          </button>
        </div>
      </div>
    </div>
  );
}
