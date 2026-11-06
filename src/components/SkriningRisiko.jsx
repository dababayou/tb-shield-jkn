import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Mic,
  MicOff,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { SCREENING_QUESTIONS } from '../lib/constants';
import { useTBShield } from '../context/TBShieldContext';

export default function SkriningRisiko({ isDashboard = false, onNavigateToTicket }) {
  const {
    computeScreeningScore,
    issueDigitalTicket,
    currentUser,
    contacts,
    setContacts,
    showToast,
    setActiveTab
  } = useTBShield();

  // Selected checkboxes (Default Kosong: diisi mandiri oleh pengguna)
  const [selectedGejala, setSelectedGejala] = useState([]);
  const [selectedRisiko, setSelectedRisiko] = useState([]);
  const [selectedPaparan, setSelectedPaparan] = useState([]);

  // Audio recording & waveform simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [audioAnalyzed, setAudioAnalyzed] = useState(false);
  const [audioResult, setAudioResult] = useState(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  // Result view state
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  // Toggle selection helpers
  const toggleItem = (list, setList, id) => {
    if (list.includes(id)) {
      setList(list.filter((x) => x !== id));
    } else {
      setList([...list, id]);
    }
  };

  // Audio Visualizer Waveform Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Base line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(224, 197, 143, 0.2)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Audio waveform lines
      const lines = isRecording ? [
        { color: '#E8472F', amp: 28, freq: 0.05, speed: 0.15 },
        { color: '#E0C58F', amp: 18, freq: 0.08, speed: -0.1 },
        { color: '#3C507D', amp: 10, freq: 0.12, speed: 0.2 }
      ] : [
        { color: 'rgba(224, 197, 143, 0.4)', amp: 6, freq: 0.03, speed: 0.04 },
        { color: 'rgba(60, 80, 125, 0.5)', amp: 4, freq: 0.04, speed: -0.03 }
      ];

      lines.forEach((l) => {
        ctx.beginPath();
        ctx.strokeStyle = l.color;
        ctx.lineWidth = isRecording ? 2.5 : 1.5;
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * l.freq + phase * l.speed) * l.amp * (Math.sin(x / width * Math.PI));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      phase += 1;
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isRecording]);

  // Audio Recording Simulation (3 seconds)
  const handleStartRecording = () => {
    setIsRecording(true);
    setAudioAnalyzed(false);
    setAudioResult(null);
    setRecordProgress(0);

    const interval = 50; // ms
    const totalDuration = 3000;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setRecordProgress(Math.min(100, Math.round((elapsed / totalDuration) * 100)));

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        setIsRecording(false);
        setAudioAnalyzed(true);

        // Simulation logic based on symptoms checked
        const hasCough = selectedGejala.includes('cough_2w') || selectedGejala.includes('hemoptysis');
        setAudioResult({
          confidence: hasCough ? 86 : 38,
          tempoPattern: hasCough ? 'Paroksismal Berat / Pola Akustik Basah' : 'Pola Ritme Normal Teratur',
          acousticRecommendation: hasCough
            ? 'Frekuensi audio batuk terdeteksi dalam spektrum frekuensi rendah khas batuk berdahak (wet cough). Menjadi penguat penunjang untuk evaluasi dahak TCM di FKTP.'
            : 'Pola suara tidak menunjukkan anomali akustik signifikan. Tetap ikuti hasil pembobotan gejala klinis utama.'
        });
        showToast('Analisis akustik batuk AI selesai diproses (Simulasi)!');
      }
    }, interval);
  };

  // Calculate & Submit Screening
  const handleCalculateScore = () => {
    const res = computeScreeningScore(selectedGejala, selectedRisiko, selectedPaparan);
    setResultData(res);
    setShowResult(true);

    // Save to active user record if logged in
    if (currentUser) {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === currentUser.id) {
            return {
              ...c,
              skor: res.totalScore,
              kategoriRisiko: res.riskCategory,
              referralReason: res.referralReason,
              gejalaAktif: selectedGejala,
              faktorAktif: [...selectedRisiko, ...selectedPaparan],
              skriningDate: new Date().toISOString().split('T')[0]
            };
          }
          return c;
        })
      );
    }

    setTimeout(() => {
      document.getElementById('screening-result-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCreateTicketClick = () => {
    const code = issueDigitalTicket(currentUser?.id, resultData?.referralReason);
    if (onNavigateToTicket) {
      onNavigateToTicket();
    } else {
      setActiveTab('tiket');
      window.location.hash = '#tiket';
    }
  };

  const handleReset = () => {
    setSelectedGejala([]);
    setSelectedRisiko([]);
    setSelectedPaparan([]);
    setAudioAnalyzed(false);
    setAudioResult(null);
    setShowResult(false);
    setResultData(null);
  };

  return (
    <div
      className={`container ${isDashboard ? 'nw-calc-dashboard-sec' : 'section'}`}
      id="skrining"
      style={isDashboard ? { padding: '20px 24px 60px' } : undefined}
    >
      <div>
        {/* Header Title */}
        {!isDashboard && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-tb-jkn">Pilar 1 Inovasi</span>
              <span className="badge-demo-tag">Instrumen Usulan 0 - 10</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 10px' }}>
              Teleskrining Risiko &amp; Teletriase Akustik Batuk
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.98rem', maxWidth: '660px', margin: '0 auto', lineHeight: 1.6 }}>
              Penapis awal risiko TBC dari rumah secara privat. Mengintegrasikan penilaian gejala kardinal, riwayat paparan kontak, komorbiditas, serta penunjang analisis tempo suara batuk.
            </p>
          </div>
        )}

        {/* Clinical Disclaimer Box */}
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FCD34D',
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '28px'
        }}>
          <Info size={22} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.85rem', color: '#92400E', lineHeight: 1.55 }}>
            <strong>Pemberitahuan Keselamatan Medis:</strong> Hasil skrining dan teletriase batuk ini merupakan
            <strong> alat penunjang penyaringan awal (*early warning filter*)</strong>, bukan diagnosis medis resmi WHO atau pengganti tes dokter.
            Sistem tidak menyatakan seseorang bebas atau positif TBC hanya berdasarkan skor aplikasi.
          </div>
        </div>

        {/* Screening Questionnaire Card */}
        <div style={{
          background: 'var(--color-card-bg)',
          borderRadius: '24px',
          border: '1px solid #D9CBC2',
          padding: '32px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px'
        }}>
          {/* Group 1: Gejala Utama (Maks. 5 Poin) */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                  A. Gejala Utama Kardinal
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  Maksimum bobot: 5 poin (Batuk ≥ 2 minggu &amp; batuk darah menjadi pemicu rujukan)
                </span>
              </div>
              <span style={{
                background: 'rgba(60, 80, 125, 0.1)',
                color: 'var(--color-primary)',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '4px 10px',
                borderRadius: '8px'
              }}>
                {selectedGejala.reduce((acc, id) => {
                  const q = SCREENING_QUESTIONS.gejala.find((item) => item.id === id);
                  return acc + (q?.points || 0);
                }, 0)} / 5 Poin
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SCREENING_QUESTIONS.gejala.map((item) => {
                const isChecked = selectedGejala.includes(item.id);
                return (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: isChecked ? '2px solid var(--color-primary)' : '1px solid #D9CBC2',
                      background: isChecked ? '#F0F4FC' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(selectedGejala, setSelectedGejala, item.id)}
                      style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--color-dark)' }}>
                          {item.label}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: item.isCardinal ? '#FEE2E2' : '#F1F5F9',
                          color: item.isCardinal ? '#DC2626' : '#475569'
                        }}>
                          +{item.points} Poin {item.isCardinal ? '(Kardinal)' : ''}
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                        {item.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Group 2: Faktor Risiko Kesehatan (Maks. 3 Poin) */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                  B. Faktor Risiko Kesehatan &amp; Komorbiditas
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  Maksimum bobot: 3 poin (Kondisi yang menurunkan daya tahan tubuh)
                </span>
              </div>
              <span style={{
                background: 'rgba(60, 80, 125, 0.1)',
                color: 'var(--color-primary)',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '4px 10px',
                borderRadius: '8px'
              }}>
                {selectedRisiko.reduce((acc, id) => {
                  const q = SCREENING_QUESTIONS.faktorRisiko.find((item) => item.id === id);
                  return acc + (q?.points || 0);
                }, 0)} / 3 Poin
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SCREENING_QUESTIONS.faktorRisiko.map((item) => {
                const isChecked = selectedRisiko.includes(item.id);
                return (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: isChecked ? '2px solid var(--color-primary)' : '1px solid #D9CBC2',
                      background: isChecked ? '#F0F4FC' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(selectedRisiko, setSelectedRisiko, item.id)}
                      style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--color-dark)' }}>
                          {item.label}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: '#F1F5F9',
                          color: '#475569'
                        }}>
                          +{item.points} Poin
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                        {item.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Group 3: Tingkat Paparan Pasien TBC (Maks. 2 Poin) */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                  C. Tingkat Paparan Kontak Erat
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  Maksimum bobot: 2 poin (Kedekatan jarak dan durasi bersama pasien TBC terkonfirmasi)
                </span>
              </div>
              <span style={{
                background: 'rgba(60, 80, 125, 0.1)',
                color: 'var(--color-primary)',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '4px 10px',
                borderRadius: '8px'
              }}>
                {selectedPaparan.reduce((acc, id) => {
                  const q = SCREENING_QUESTIONS.paparan.find((item) => item.id === id);
                  return acc + (q?.points || 0);
                }, 0)} / 2 Poin
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SCREENING_QUESTIONS.paparan.map((item) => {
                const isChecked = selectedPaparan.includes(item.id);
                return (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: isChecked ? '2px solid var(--color-primary)' : '1px solid #D9CBC2',
                      background: isChecked ? '#F0F4FC' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(selectedPaparan, setSelectedPaparan, item.id)}
                      style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--color-dark)' }}>
                          {item.label}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: '#F1F5F9',
                          color: '#475569'
                        }}>
                          +{item.points} Poin
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                        {item.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Group 4: Teletriase Akustik Batuk (AI Audio Cough Analysis) */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '18px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} color="var(--color-primary)" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                  Teletriase Akustik Batuk (Penunjang Triase Awal)
                </h4>
              </div>
              <span className="badge-demo-tag">Fitur Simulasi AI</span>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
              Analisis frekuensi dan ritme tempo batuk menggunakan algoritma AI akustik untuk menilai pola getaran pernapasan.
            </p>

            {/* Audio Waveform Canvas */}
            <div className="cough-visualizer-container">
              <canvas ref={canvasRef} width={680} height={90} className="cough-canvas" />

              {isRecording && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(220, 38, 38, 0.9)',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF', animation: 'pulseRecording 0.8s infinite' }} />
                  Merekam 3 Detik: {recordProgress}%
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="cough-controls">
              <button
                type="button"
                onClick={handleStartRecording}
                disabled={isRecording}
                className={`btn-record-cough ${isRecording ? 'recording' : ''}`}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                {isRecording ? `Menganalisis Batuk (${recordProgress}%)...` : 'Rekam 3 Detik Batuk (Simulasi)'}
              </button>

              <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                *Aman &amp; privat: data suara tidak disebarluaskan sesuai UU PDP.
              </span>
            </div>

            {/* Audio Results Pill */}
            {audioAnalyzed && audioResult && (
              <div style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid #D9CBC2',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-navy)' }}>
                    Hasil Analisis Akustik: {audioResult.tempoPattern}
                  </span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: audioResult.confidence > 70 ? '#FEF3C7' : '#D1FAE5',
                    color: audioResult.confidence > 70 ? '#92400E' : '#065F46'
                  }}>
                    Indeks Akustik: {audioResult.confidence}%
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                  {audioResult.acousticRecommendation}
                </p>
              </div>
            )}
          </div>

          {/* Submit & Reset Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn-cta-outline"
              style={{ padding: '10px 20px', height: '46px', fontSize: '0.9rem' }}
            >
              <RotateCcw size={16} style={{ marginRight: '6px' }} /> Atur Ulang Skrining
            </button>

            <button
              type="button"
              onClick={handleCalculateScore}
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
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(60, 80, 125, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <Stethoscope size={18} /> Hitung Skor &amp; Tampilkan Rekomendasi
            </button>
          </div>
        </div>

        {/* Screening Result View (Appears upon submit) */}
        {showResult && resultData && (
          <div id="screening-result-anchor" style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: `2px solid ${resultData.riskCategory === 'Tinggi' ? '#DC2626' : resultData.riskCategory === 'Sedang' ? '#D97706' : '#0F766E'}`,
            padding: '32px',
            boxShadow: '0 16px 48px rgba(17, 34, 80, 0.1)',
            marginBottom: '32px',
            animation: 'slideInToast 0.4s ease'
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
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-muted)'
                }}>
                  Klasifikasi Tingkat Risiko TB-Shield
                </span>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: resultData.riskCategory === 'Tinggi' ? '#DC2626' : resultData.riskCategory === 'Sedang' ? '#D97706' : '#0F766E',
                  margin: '4px 0 0'
                }}>
                  {resultData.riskCategory === 'Tinggi' && 'Risiko Tinggi / Red Flag'}
                  {resultData.riskCategory === 'Sedang' && 'Risiko Sedang'}
                  {resultData.riskCategory === 'Rendah' && 'Risiko Rendah'}
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block' }}>
                  Total Skor Usulan:
                </span>
                <div style={{
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-navy)',
                  lineHeight: 1
                }}>
                  {resultData.totalScore} <span style={{ fontSize: '1.1rem', color: 'var(--color-muted)' }}>/ 10</span>
                </div>
              </div>
            </div>

            {/* Status Klinis & Alur Sistem */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>
                Status Klinis &amp; Alur Sistem:
              </h4>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: '#334155',
                lineHeight: 1.6,
                background: '#F8FAFC',
                padding: '12px 16px',
                borderRadius: '10px',
                borderLeft: `4px solid ${resultData.riskCategory === 'Tinggi' ? '#DC2626' : resultData.riskCategory === 'Sedang' ? '#D97706' : '#0F766E'}`
              }}>
                {resultData.referralReason}
              </p>
            </div>

            {/* 2 Cards: Rekomendasi Farmakologis (TPT) & Non-Farmakologis */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              {/* Farmakologis Card */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Stethoscope size={18} color="var(--color-primary)" />
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-navy)' }}>
                    Rekomendasi Farmakologis (TPT / Dokter)
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  {resultData.riskCategory === 'Rendah' && (
                    <p style={{ margin: 0 }}>
                      <strong>Tidak Ada Indikasi Terapi Obat:</strong> Obat pencegahan tidak diindikasikan pada kelompok risiko rendah tanpa gejala kardinal dan tanpa komorbiditas tinggi. Lakukan pemantauan berkala di rumah.
                    </p>
                  )}
                  {resultData.riskCategory === 'Sedang' && (
                    <p style={{ margin: 0 }}>
                      <strong>Konseling Terapi Pencegahan TBC (TPT):</strong> Disarankan berkonsultasi ke dokter FKTP terdaftar untuk evaluasi kesiapan pemberian TPT (regimen singkat modern seperti 3HP / 1HP atau 6H).
                    </p>
                  )}
                  {resultData.riskCategory === 'Tinggi' && (
                    <p style={{ margin: 0, color: '#991B1B' }}>
                      <strong>Evaluasi Diagnostik TBC Aktif Segera:</strong> Diperlukan pemeriksaan konfirmasi dahak melalui Tes Cepat Molekuler (TCM) dan/atau Foto Toraks di FKTP sebelum dokter menentukan apakah pasien memerlukan OAT lengkap atau TPT.
                    </p>
                  )}
                </div>
              </div>

              {/* Non-Farmakologis Card */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Sparkles size={18} color="#D97706" />
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-navy)' }}>
                    Rekomendasi Non-Farmakologis (Imunonutrisi)
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  {resultData.riskCategory === 'Rendah' && (
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      <li>Asupan protein harian rutin (telur / tempe) dan sayuran hijau daun kelor.</li>
                      <li>Buka jendela untuk ventilasi silang (air flushing) dan pencahayaan sinar UV matahari harian.</li>
                      <li>Pelajari literasi pada modul Mitos vs Fakta TBC.</li>
                    </ul>
                  )}
                  {resultData.riskCategory === 'Sedang' && (
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      <li>Preskripsi nutrisi TPT: Menu Telur Kelor + Sup Ikan Kembung kaya Vitamin D3 &amp; Zinc.</li>
                      <li>Pantau IMT berkala dengan Pelacak IMT untuk mencegah malnutrisi.</li>
                      <li>Gunakan Chatbot untuk pengingat minum obat &amp; pelaporan efek samping.</li>
                    </ul>
                  )}
                  {resultData.riskCategory === 'Tinggi' && (
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      <li>Isolasi mandiri sementara: Kenakan masker medis dan terapkan etika batuk di rumah.</li>
                      <li>Gunakan fitur Patient Safety Alert bila timbul tanda bahaya seperti ikterus (kulit/mata kuning).</li>
                      <li>Bawa seluruh keluarga serumah untuk skrining bersama di FKTP.</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Referral Ticket Call to Action */}
            {resultData.isReferralNeeded ? (
              <div style={{
                background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <span style={{ background: '#E0C58F', color: '#112250', fontWeight: 800, fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px' }}>
                    TINDAK LANJUT MEDIS DIPERLUKAN
                  </span>
                  <h4 style={{ margin: '6px 0 2px', fontSize: '1.15rem', fontWeight: 800 }}>
                    Terbitkan Tiket Rujukan Digital JKN Sekarang
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                    Hasil skrining Anda akan diteruskan ke dasbor FKTP {currentUser?.fk || 'Puskesmas setempat'} untuk verifikasi cepat di loket.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCreateTicketClick}
                  style={{
                    background: '#E0C58F',
                    color: '#112250',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '12px 26px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <FileText size={18} /> Terbitkan Tiket Rujukan Digital <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={24} color="#059669" />
                  <div>
                    <strong style={{ color: '#065F46', fontSize: '0.92rem' }}>Pemantauan Mandiri Direkomendasikan</strong>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#047857' }}>
                      Saat ini belum diperlukan tiket rujukan ke FKTP. Tetap jaga imunonutrisi pangan lokal dan ulangi skrining jika timbul gejala batuk.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('gizi');
                    window.location.hash = '#gizi';
                  }}
                  className="btn-cta-outline"
                  style={{ padding: '8px 18px', fontSize: '0.85rem', height: '38px' }}
                >
                  Buka Menu Imunonutrisi <ArrowRight size={15} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
