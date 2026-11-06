import React, { useState } from 'react';
import {
  ClipboardCheck,
  Activity,
  Heart,
  ShieldAlert,
  ArrowRight,
  Lock,
  X,
  Salad,
  Moon,
  Flame,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const HEALTH_TOPICS = [
  'Indeks BMI Tubuh',
  'Konsumsi Sayur & Buah',
  'Asupan Minuman Manis',
  'Makanan Cepat Saji',
  'Kadar Garam Harian',
  'Rutin Olahraga',
  'Riwayat Kesehatan Keluarga',
  'Paparan Asap Rokok',
  'Kualitas Tidur Malam',
  'Keseimbangan Stres'
];

const HEALTH_DOMAINS = [
  {
    title: 'Kesehatan Metabolisme',
    sub: 'Keseimbangan berat badan, serat & gula darah',
    badge: 'Terpantau Baik',
    pct: '88%',
    color: '#4ADE80',
    icon: Salad
  },
  {
    title: 'Kebugaran Jantung & Pembuluh',
    sub: 'Kontrol natrium, lemak & aktivitas fisik harian',
    badge: 'Perlu Dijaga',
    pct: '76%',
    color: '#FBBF24',
    icon: Heart
  },
  {
    title: 'Kualitas Istirahat & Pikiran',
    sub: 'Durasi tidur 7–8 jam & pengelolaan stres',
    badge: 'Optimal',
    pct: '92%',
    color: '#86EFAC',
    icon: Moon
  }
];

export default function KuisTeaser({ onOpenAuth }) {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  return (
    <section id="kuis-skrining" className="container nw-bio-quiz-wrap">
      <div className="nw-bio-quiz-card">
        {/* Soft Organic Decorative Leaves/Circles */}
        <div className="nw-bio-quiz-glow" aria-hidden="true" />

        <div className="nw-bio-quiz-top">
          {/* Left: Friendly Health Narrative */}
          <div className="nw-bio-quiz-copy">
            <div className="nw-bio-quiz-badge">
              <ClipboardCheck size={16} />
              <span>Skrining Gaya Hidup &amp; Kesehatan Mandiri</span>
            </div>

            <h2 className="nw-bio-quiz-title">
              Kenali kondisi kesehatan &amp; kebiasaan harianmu dalam{' '}
              <span className="nw-bio-quiz-highlight">3 menit.</span>
            </h2>

            <p className="nw-bio-quiz-desc">
              Pencegahan selalu lebih baik daripada pengobatan. Evaluasi indikator gaya hidup harianmu untuk mendeteksi potensi risiko awal{' '}
              <strong>Diabetes Tipe 2, Hipertensi, dan Kesehatan Jantung</strong> secara ramah dan mudah dipahami.
            </p>

            {/* Natural Topic Pills */}
            <div className="nw-bio-topic-pills">
              {HEALTH_TOPICS.map((topic) => (
                <span key={topic} className="nw-bio-topic-pill">
                  <CheckCircle2 size={13} className="nw-bio-topic-icon" />
                  <span>{topic}</span>
                </span>
              ))}
            </div>

            <div className="nw-bio-quiz-cta-row">
              <button
                type="button"
                onClick={() => setShowAuthPrompt(true)}
                className="nw-bio-quiz-btn"
              >
                <span>Mulai Kuis Skrining</span>
                <ArrowRight size={18} />
              </button>
              <span className="nw-bio-quiz-note">
                *Gratis &amp; langsung dapatkan panduan kebiasaan sehat pribadi Anda.
              </span>
            </div>
          </div>

          {/* Right: Warm Visual Health Domain Preview Card */}
          <div className="nw-bio-domain-preview">
            <div className="nw-bio-domain-card">
              <div className="nw-bio-domain-head">
                <span className="nw-bio-domain-tag">
                  <Sparkles size={14} /> Pratinjau Analisis Kesehatan
                </span>
                <span className="nw-bio-domain-time">~3 Menit</span>
              </div>

              <h3 className="nw-bio-domain-heading">
                3 Aspek Utama yang Dievaluasi
              </h3>

              <div className="nw-bio-domain-list">
                {HEALTH_DOMAINS.map((dom) => {
                  const Icon = dom.icon;
                  return (
                    <div key={dom.title} className="nw-bio-domain-item">
                      <div className="nw-bio-domain-item__top">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="nw-bio-domain-icon">
                            <Icon size={17} color={dom.color} />
                          </span>
                          <div>
                            <div className="nw-bio-domain-name">{dom.title}</div>
                            <div className="nw-bio-domain-sub">{dom.sub}</div>
                          </div>
                        </div>
                        <span
                          className="nw-bio-domain-pill"
                          style={{ color: dom.color, borderColor: `${dom.color}44` }}
                        >
                          {dom.badge}
                        </span>
                      </div>
                      <div className="nw-bio-domain-bar">
                        <span style={{ width: dom.pct, background: dom.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 3 Highlights Grid */}
        <div className="nw-bio-quiz-pillars">
          <div className="nw-bio-quiz-pillar">
            <div className="nw-bio-quiz-pillar__icon">
              <Activity size={20} />
            </div>
            <div>
              <h4>9 Pertanyaan + Integrasi BMI</h4>
              <p>
                Mencakup pola makan harian, konsumsi gula &amp; garam, jam tidur, olahraga, serta riwayat kesehatan keluarga.
              </p>
            </div>
          </div>

          <div className="nw-bio-quiz-pillar">
            <div className="nw-bio-quiz-pillar__icon">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4>Pemetaan Tingkat Risiko</h4>
              <p>
                Memberikan gambaran kondisi gaya hidup Anda (Risiko Rendah, Sedang, atau Tinggi) berdasarkan pedoman kesehatan.
              </p>
            </div>
          </div>

          <div className="nw-bio-quiz-pillar">
            <div className="nw-bio-quiz-pillar__icon">
              <Heart size={20} />
            </div>
            <div>
              <h4>Rekomendasi Kebiasaan Nyata</h4>
              <p>
                Dapatkan saran langkah kecil yang dapat langsung ditambahkan ke target harian di 30-Day Health Challenge.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Akses Fitur Terkunci Modal */}
      {showAuthPrompt && (
        <div className="modal-overlay" onClick={() => setShowAuthPrompt(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', textAlign: 'center', padding: '36px 32px' }}>
            <button className="modal-close" onClick={() => setShowAuthPrompt(false)}>
              <X size={20} />
            </button>
            <div style={{ width: '64px', height: '64px', background: 'rgba(56, 179, 114, 0.15)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Lock color="var(--color-forest)" size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px', color: 'var(--color-dark)' }}>
              Akses Fitur Terkunci
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Silakan <strong>Masuk</strong> atau <strong>Daftar Akun NutriWise</strong> terlebih dahulu untuk memulai Kuis Skrining Risiko Kesehatan &amp; PTM.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowAuthPrompt(false)} className="btn-warning-outline" style={{ padding: '8px 20px', height: '44px' }}>
                Nanti Saja
              </button>
              <button onClick={() => { setShowAuthPrompt(false); if (onOpenAuth) onOpenAuth(); }} className="btn-nav-combined">
                <span className="btn-text-default">Masuk / Daftar</span>
                <span className="btn-text-hover">Masuk / Daftar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
