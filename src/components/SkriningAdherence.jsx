import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HeartHandshake,
  UserCheck
} from 'lucide-react';
import { ADHERENCE_QUESTIONS } from '../lib/constants';
import { useTBShield } from '../context/TBShieldContext';

export default function SkriningAdherence({ isDashboard = false }) {
  const { currentUser, setContacts, showToast, addAuditLog } = useTBShield();

  // Stores answers: true (Yes/Ya) or false (No/Tidak) - Default Kosong
  const [answers, setAnswers] = useState({
    adh_1: false,
    adh_2: false,
    adh_3: false,
    adh_4: false,
    adh_5: false
  });

  const [hasCalculated, setHasCalculated] = useState(false);

  const handleToggle = (id) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Compute adherence score: count of 'Yes' answers (0-5)
  const adherenceScore = Object.values(answers).filter(Boolean).length;

  let adherenceLevel = 'Risiko Rendah (Adherence High)';
  let recommendationTier = 'Automated Chat & Pengingat Harian';
  let levelColor = '#0F766E';
  let badgeBg = '#D1FAE5';
  let badgeText = '#065F46';

  if (adherenceScore >= 4) {
    adherenceLevel = 'Risiko Tinggi (High Drop-out Risk)';
    recommendationTier = 'Active Interview Faskes & Penetapan PMO Khusus';
    levelColor = '#DC2626';
    badgeBg = '#FEE2E2';
    badgeText = '#991B1B';
  } else if (adherenceScore >= 2) {
    adherenceLevel = 'Risiko Sedang (Moderate Drop-out Risk)';
    recommendationTier = 'Fokus Konseling Hambatan Spesifik oleh Petugas FKTP';
    levelColor = '#D97706';
    badgeBg = '#FEF3C7';
    badgeText = '#92400E';
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasCalculated(true);

    if (currentUser) {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === currentUser.id) {
            return {
              ...c,
              adherenceScore,
              adherenceCategory: adherenceLevel,
              adherenceAnswers: answers
            };
          }
          return c;
        })
      );
      addAuditLog(`Skrining Kepatuhan TPT Pasien: Skor ${adherenceScore}/5 (${adherenceLevel})`);
    }

    showToast(`Penilaian risiko kepatuhan selesai: Skor ${adherenceScore}/5`);
    setTimeout(() => {
      document.getElementById('adherence-result-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setAnswers({
      adh_1: false,
      adh_2: false,
      adh_3: false,
      adh_4: false,
      adh_5: false
    });
    setHasCalculated(false);
  };

  return (
    <div
      className={`container ${isDashboard ? 'nw-calc-dashboard-sec' : 'section'}`}
      id="adherence"
      style={isDashboard ? { padding: '20px 24px 60px' } : undefined}
    >
      <div>
        {/* Header */}
        {!isDashboard && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-tb-jkn">Pencegahan DO (Drop-Out)</span>
              <span className="badge-demo-tag">5 Indikator Stratifikasi</span>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 10px' }}>
              Skrining Risiko Ketidakpatuhan TPT
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Instrumen evaluasi dini hambatan psikososial, persepsi kesehatan, dan dukungan keluarga agar kontak erat mampu menyelesaikan terapi pencegahan hingga tuntas tanpa putus obat.
            </p>
          </div>
        )}

        {/* Survey Card */}
        <div style={{
          background: 'var(--color-card-bg)',
          borderRadius: '24px',
          border: '1px solid #D9CBC2',
          padding: '32px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {ADHERENCE_QUESTIONS.map((item, index) => {
                const isChecked = !!answers[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: isChecked ? '2px solid #D97706' : '1px solid #D9CBC2',
                      background: isChecked ? '#FFFBEB' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Controlled by outer div onClick
                      style={{ marginTop: '5px', width: '20px', height: '20px', accentColor: '#D97706', cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                          Poin {index + 1}: {item.indicator}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--color-dark)', lineHeight: 1.5 }}>
                        "{item.question}"
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <button
                type="button"
                onClick={handleReset}
                className="btn-cta-outline"
                style={{ padding: '8px 18px', height: '42px', fontSize: '0.88rem' }}
              >
                <RotateCcw size={15} style={{ marginRight: '6px' }} /> Bersihkan Jawaban
              </button>

              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '10px 24px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(60, 80, 125, 0.2)'
                }}
              >
                <ShieldCheck size={18} /> Nilai Risiko Kepatuhan ({adherenceScore} Tercentang)
              </button>
            </div>
          </form>
        </div>

        {/* Results Box */}
        {hasCalculated && (
          <div id="adherence-result-anchor" style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: `2px solid ${levelColor}`,
            padding: '28px',
            boxShadow: '0 16px 40px rgba(17, 34, 80, 0.08)',
            marginBottom: '32px',
            animation: 'slideInToast 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderBottom: '1px solid #D9CBC2',
              paddingBottom: '18px',
              marginBottom: '18px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                  Hasil Stratifikasi Hambatan Kepatuhan
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: levelColor, margin: '4px 0 0' }}>
                  {adherenceLevel}
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Skor Hambatan:</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-navy)', lineHeight: 1 }}>
                  {adherenceScore} <span style={{ fontSize: '1rem', color: 'var(--color-muted)' }}>/ 5</span>
                </div>
              </div>
            </div>

            {/* Rekomendasi Tindak Lanjut untuk Faskes */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '14px',
              padding: '18px',
              borderLeft: `5px solid ${levelColor}`,
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <UserCheck size={18} color={levelColor} />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-navy)' }}>
                  Rekomendasi Tindak Lanjut Tenaga Kesehatan (FKTP):
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                <strong>{recommendationTier}:</strong>
                {adherenceScore <= 1 && ' Pengguna memiliki pemahaman & dukungan sangat baik. Pertahankan kedisiplinan minum obat melalui chatbot pengingat otomatis dan pesan motivasi berkala.'}
                {adherenceScore >= 2 && adherenceScore <= 3 && ' Terdapat kecemasan efek samping atau hambatan privasi/waktu. Petugas Puskesmas disarankan memberikan konseling terfokus untuk menjelaskan manajemen efek samping dan keunggulan regimen singkat.'}
                {adherenceScore >= 4 && ' Risiko drop-out tinggi. Membutuhkan intervensi wawancara aktif (active interview) tatap muka oleh petugas FKTP serta penetapan Pengawas Menelan Obat (PMO) terlatih dari pihak keluarga inti.'}
              </p>
            </div>

            {/* Detail Checklist Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              fontSize: '0.82rem'
            }}>
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: answers.adh_1 ? '#FEF2F2' : '#F0FDF4', border: '1px solid #D9CBC2' }}>
                <strong>1. Persepsi Sehat:</strong> {answers.adh_1 ? 'Ada kendala merasa tidak butuh obat' : 'Sadar pentingnya pencegahan'}
              </div>
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: answers.adh_2 ? '#FEF2F2' : '#F0FDF4', border: '1px solid #D9CBC2' }}>
                <strong>2. Efek Samping:</strong> {answers.adh_2 ? 'Khawatir mual / fungsi hepar' : 'Percaya keamanan obat'}
              </div>
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: answers.adh_3 ? '#FEF2F2' : '#F0FDF4', border: '1px solid #D9CBC2' }}>
                <strong>3. Privasi / Stigma:</strong> {answers.adh_3 ? 'Khawatir diketahui tetangga' : 'Merasa aman & nyaman'}
              </div>
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: answers.adh_4 ? '#FEF2F2' : '#F0FDF4', border: '1px solid #D9CBC2' }}>
                <strong>4. Kompleksitas Jadwal:</strong> {answers.adh_4 ? 'Sering lupa / jadwal padat' : 'Jadwal minum teratur'}
              </div>
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: answers.adh_5 ? '#FEF2F2' : '#F0FDF4', border: '1px solid #D9CBC2' }}>
                <strong>5. Dukungan PMO:</strong> {answers.adh_5 ? 'Tidak ada PMO di rumah' : 'Ada dukungan keluarga'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
