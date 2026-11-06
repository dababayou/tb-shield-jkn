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
  UserCheck,
  Building2
} from 'lucide-react';
import { ADHERENCE_QUESTIONS } from '../lib/constants';
import { useTBShield } from '../context/TBShieldContext';

export default function SkriningAdherence({ isDashboard = false }) {
  const { currentUser, setContacts, showToast, addAuditLog } = useTBShield();

  // Stores answers per question: { [questionId]: { points: number, label: string } }
  const [answers, setAnswers] = useState({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const [validationWarning, setValidationWarning] = useState(false);

  // Group questions by factor
  const factorGroups = [
    {
      key: 'Pengetahuan',
      title: '1. Pengetahuan & Pemahaman TB',
      description: 'Pemahaman mengenai durasi pengobatan, kesembuhan, dan risiko resistensi obat.',
      maxScore: 6
    },
    {
      key: 'Akses',
      title: '2. Akses & Jarak ke Faskes',
      description: 'Kemudahan jarak tempuh, sarana transportasi, dan kesesuaian waktu layanan.',
      maxScore: 6
    },
    {
      key: 'Ekonomi',
      title: '3. Ekonomi & Jaminan Kesehatan',
      description: 'Kemampuan biaya penunjang, kepemilikan BPJS aktif, serta risiko kehilangan nafkah.',
      maxScore: 6
    },
    {
      key: 'Dukungan sosial',
      title: '4. Dukungan Sosial & Lingkungan',
      description: 'Keberadaan Pengawas Menelan Obat (PMO) keluarga dan stabilitas tempat tinggal.',
      maxScore: 4
    },
    {
      key: 'Stigma',
      title: '5. Stigma & Kekhawatiran Sosial',
      description: 'Rasa malu, kekhawatiran dijauhi masyarakat, tetangga, maupun tempat kerja.',
      maxScore: 4
    },
    {
      key: 'Perilaku dan kondisi',
      title: '6. Perilaku, Kebiasaan & Kondisi Penyerta',
      description: 'Riwayat kepatuhan jangka panjang, kecemasan efek samping, dan kebiasaan minum obat.',
      maxScore: 8
    }
  ];

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        points: option.points,
        label: option.label
      }
    }));
    setValidationWarning(false);
  };

  // Calculate scores
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = ADHERENCE_QUESTIONS.length;

  const adherenceScore = Object.values(answers).reduce(
    (sum, val) => sum + (val?.points || 0),
    0
  );

  // Calculate score per factor for detailed feedback in results
  const factorScores = factorGroups.map((group) => {
    const groupQuestions = ADHERENCE_QUESTIONS.filter((q) => q.factor === group.key);
    const score = groupQuestions.reduce((sum, q) => {
      return sum + (answers[q.id]?.points || 0);
    }, 0);
    return {
      ...group,
      score
    };
  });

  // Tiers and recommendations:
  // 0 – 8   : Rendah (Kepatuhan Baik / Adherence High) -> Automated Chat & Pengingat Harian
  // 9 – 18  : Sedang (Moderate Drop-out Risk) -> Fokus Konseling Hambatan Spesifik FKTP
  // 19 – 34 : Tinggi (High Drop-out Risk) -> Active Interview Faskes & Penetapan PMO Khusus
  let adherenceLevel = 'Risiko Rendah (Kepatuhan Baik)';
  let recommendationTier = 'Automated Chat & Pengingat Harian';
  let levelColor = '#0F766E';
  let badgeBg = '#D1FAE5';
  let badgeText = '#065F46';
  let recommendationDetail =
    'Pengguna memiliki pemahaman dan kesiapan yang sangat baik. Pertahankan kedisiplinan minum obat melalui chatbot pengingat otomatis dan pesan motivasi berkala.';

  if (adherenceScore >= 19) {
    adherenceLevel = 'Risiko Tinggi (High Drop-out Risk)';
    recommendationTier = 'Active Interview Faskes & Penetapan PMO Khusus';
    levelColor = '#DC2626';
    badgeBg = '#FEE2E2';
    badgeText = '#991B1B';
    recommendationDetail =
      'Risiko putus obat tinggi akibat akumulasi hambatan psikososial, stigma, riwayat putus obat, atau ketiadaan pendamping. Membutuhkan intervensi wawancara tatap muka aktif (active interview) oleh petugas FKTP serta penetapan Pengawas Menelan Obat (PMO) terlatih dari keluarga inti.';
  } else if (adherenceScore >= 9) {
    adherenceLevel = 'Risiko Sedang (Moderate Drop-out Risk)';
    recommendationTier = 'Fokus Konseling Hambatan Spesifik oleh Petugas FKTP';
    levelColor = '#D97706';
    badgeBg = '#FEF3C7';
    badgeText = '#92400E';
    recommendationDetail =
      'Terdapat beberapa hambatan (seperti akses/transportasi ke faskes, kecemasan efek samping obat, atau beban ekonomi). Petugas Puskesmas disarankan memberikan konseling terfokus untuk menjelaskan solusi praktis dan keunggulan regimen singkat TPT.';
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (answeredCount < totalQuestions) {
      setValidationWarning(true);
      showToast(`Harap lengkapi semua ${totalQuestions} pertanyaan skrining kepatuhan. (Baru ${answeredCount} terjawab)`, 5000);
      return;
    }

    setHasCalculated(true);
    setValidationWarning(false);

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
      addAuditLog(`Skrining Kepatuhan TPT Pasien: Skor ${adherenceScore}/34 (${adherenceLevel})`);
    }

    showToast(`Penilaian risiko kepatuhan selesai: Skor ${adherenceScore}/34`);
    setTimeout(() => {
      document.getElementById('adherence-result-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setAnswers({});
    setHasCalculated(false);
    setValidationWarning(false);
  };

  return (
    <div
      className={`container ${isDashboard ? 'nw-calc-dashboard-sec' : 'section'}`}
      id="adherence"
      style={isDashboard ? { padding: '20px 24px 60px' } : undefined}
    >
      <div>
        {/* Header Title */}
        {!isDashboard && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-tb-jkn">Pencegahan DO (Drop-Out)</span>
              <span className="badge-demo-tag">Instrumen Kepatuhan TPT (17 Faktor)</span>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 10px' }}>
              Skrining Risiko Ketidakpatuhan TPT
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', maxWidth: '660px', margin: '0 auto', lineHeight: 1.6 }}>
              Instrumen evaluasi dini hambatan pengetahuan, aksesibilitas, ekonomi, stigma sosial, dan dukungan keluarga agar kontak erat mampu menyelesaikan terapi pencegahan hingga tuntas tanpa putus obat.
            </p>
          </div>
        )}

        {/* Questionnaire Card */}
        <div style={{
          background: 'var(--color-card-bg)',
          borderRadius: '24px',
          border: '1px solid #D9CBC2',
          padding: '32px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '32px' }}>
              {factorGroups.map((group) => {
                const groupQuestions = ADHERENCE_QUESTIONS.filter((q) => q.factor === group.key);
                return (
                  <div key={group.key} style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '24px'
                  }}>
                    {/* Factor Header */}
                    <div style={{ marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                      <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                        {group.title}
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                        {group.description}
                      </p>
                    </div>

                    {/* Questions in Factor */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {groupQuestions.map((item) => {
                        const selectedAnswer = answers[item.id];
                        return (
                          <div
                            key={item.id}
                            style={{
                              padding: '14px 18px',
                              borderRadius: '12px',
                              background: selectedAnswer ? '#FAFAFA' : '#FFFFFF',
                              border: selectedAnswer ? '1px solid #CBD5E1' : '1px dashed #D9CBC2',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--color-dark)', marginBottom: '10px', lineHeight: 1.5 }}>
                              <span style={{ color: 'var(--color-primary)', fontWeight: 800, marginRight: '6px' }}>
                                {item.no}.
                              </span>
                              {item.question}
                            </div>

                            {/* Options without showing points in UI */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                              gap: '10px'
                            }}>
                              {item.options.map((opt, optIdx) => {
                                const isSelected = selectedAnswer?.label === opt.label;
                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleSelectOption(item.id, opt)}
                                    style={{
                                      padding: '10px 14px',
                                      borderRadius: '10px',
                                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid #CBD5E1',
                                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                                      color: isSelected ? 'var(--color-primary)' : '#334155',
                                      fontWeight: isSelected ? 800 : 600,
                                      fontSize: '0.88rem',
                                      cursor: 'pointer',
                                      textAlign: 'center',
                                      boxShadow: isSelected ? '0 2px 8px rgba(60, 80, 125, 0.15)' : 'none',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <span style={{
                                      width: '14px',
                                      height: '14px',
                                      borderRadius: '50%',
                                      border: isSelected ? '4px solid var(--color-primary)' : '1.5px solid #94A3B8',
                                      background: '#FFFFFF',
                                      display: 'inline-block'
                                    }} />
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Validation warning if incomplete */}
            {validationWarning && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#991B1B',
                fontSize: '0.88rem'
              }}>
                <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
                <span>
                  Mohon jawab seluruh 17 pertanyaan skrining untuk mendapatkan evaluasi kepatuhan yang akurat. (Baru terjawab {answeredCount} dari {totalQuestions})
                </span>
              </div>
            )}

            {/* Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-cta-outline"
                  style={{ padding: '8px 18px', height: '42px', fontSize: '0.88rem' }}
                >
                  <RotateCcw size={15} style={{ marginRight: '6px' }} /> Bersihkan Jawaban
                </button>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                  Terjawab: <strong>{answeredCount}</strong> dari {totalQuestions} pertanyaan
                </span>
              </div>

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
                  padding: '12px 28px',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(60, 80, 125, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ShieldCheck size={18} /> Evaluasi Tingkat Kepatuhan
              </button>
            </div>
          </form>
        </div>

        {/* Results Box (Points displayed in final result) */}
        {hasCalculated && (
          <div id="adherence-result-anchor" style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: `2px solid ${levelColor}`,
            padding: '30px',
            boxShadow: '0 16px 40px rgba(17, 34, 80, 0.08)',
            marginBottom: '32px',
            animation: 'slideInToast 0.3s ease'
          }}>
            {/* Header Result */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderBottom: '1px solid #D9CBC2',
              paddingBottom: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                  Hasil Stratifikasi Hambatan Kepatuhan TPT
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: levelColor, margin: '4px 0 0' }}>
                  {adherenceLevel}
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Skor Hambatan Kepatuhan:</span>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-navy)', lineHeight: 1 }}>
                  {adherenceScore} <span style={{ fontSize: '1.1rem', color: 'var(--color-muted)' }}>/ 34</span>
                </div>
              </div>
            </div>

            {/* Rekomendasi Tindak Lanjut untuk Faskes */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '14px',
              padding: '18px',
              borderLeft: `5px solid ${levelColor}`,
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <UserCheck size={18} color={levelColor} />
                <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-navy)' }}>
                  Rekomendasi Tindak Lanjut Tenaga Kesehatan (FKTP):
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                <strong>{recommendationTier}:</strong> {recommendationDetail}
              </p>
            </div>

            {/* Factor Breakdown Grid (Showing Points in Result) */}
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '12px' }}>
              Rincian Skor per Faktor Hambatan:
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '10px'
            }}>
              {factorScores.map((fg) => {
                const ratio = fg.score / fg.maxScore;
                const isHigh = ratio >= 0.5;
                return (
                  <div
                    key={fg.key}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: isHigh ? '#FFFBEB' : '#F8FAFC',
                      border: isHigh ? '1px solid #FCD34D' : '1px solid #E2E8F0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                        {fg.key}
                      </span>
                      <strong style={{
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-mono)',
                        color: isHigh ? '#D97706' : '#0F766E'
                      }}>
                        {fg.score} / {fg.maxScore} Poin
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-muted)' }}>
                      {ratio === 0 ? 'Tidak ada hambatan signifikan' : isHigh ? 'Perlu perhatian khusus / konseling' : 'Hambatan tergolong rendah'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
