import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ArrowRight, Activity, Flame, Droplets, Info, X, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Kalkulator({ currentUser, onNavigateToQuiz }) {
  // Shared inputs (synced across all 3 calculators)
  const [sharedWeight, setSharedWeight] = useState('');
  const [sharedHeight, setSharedHeight] = useState('');

  // BMI State
  const [bmiResult, setBmiResult] = useState(null);

  // Calorie State
  const [calAge, setCalAge] = useState('');
  const [calGender, setCalGender] = useState('Pria');
  const [calActivity, setCalActivity] = useState('1.375');
  const [calResult, setCalResult] = useState(null);

  // Water State
  const [waterActivity, setWaterActivity] = useState('santai');
  const [waterResult, setWaterResult] = useState(null);

  // On-demand Algorithm Info Modal State
  const [showAlgoModal, setShowAlgoModal] = useState(false);

  // Load existing calculated BMI on mount & currentUser change
  useEffect(() => {
    setSharedWeight('');
    setSharedHeight('');
    setCalAge('');
    setCalResult(null);
    setWaterResult(null);

    if (!currentUser) {
      setBmiResult(null);
      return;
    }

    const meta = currentUser.user_metadata || {};
    const uid = currentUser.id;
    const bmiKey = `NutriWise_bmi_data_${uid}`;
    const savedBmi = meta.NutriWise_bmi_data || JSON.parse(localStorage.getItem(bmiKey) || 'null');
    setBmiResult(savedBmi);
  }, [currentUser]);

  // Calculate BMI
  const handleCalcBmi = async (e) => {
    e.preventDefault();
    const w = parseFloat(sharedWeight);
    const h = parseFloat(sharedHeight) / 100;

    if (w > 0 && h > 0) {
      const valNum = parseFloat((w / (h * h)).toFixed(1));
      let cat = 'Berat Badan Normal / Sehat';
      let points = 0;
      let rawCat = '18.5-24.9 (Normal)';

      if (valNum < 18.5) {
        cat = 'Kurus / Berat Kurang (Underweight)';
        points = 1;
        rawCat = '<18.5 (Underweight)';
      } else if (valNum >= 25 && valNum < 29.9) {
        cat = 'Kelebihan Berat Badan (Overweight)';
        points = 3;
        rawCat = '25-29.9 (Overweight)';
      } else if (valNum >= 30) {
        cat = 'Obesitas (Obese)';
        points = 5;
        rawCat = '≥30 (Obesitas)';
      }

      const resultObj = {
        bmi: String(valNum).replace('.', ','),
        numericVal: valNum,
        category: cat,
        rawCategory: rawCat,
        points: points,
        weight: w,
        height: parseFloat(sharedHeight),
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      setBmiResult(resultObj);
      const bmiKey = currentUser?.id ? `NutriWise_bmi_data_${currentUser.id}` : 'NutriWise_bmi_data';
      localStorage.setItem(bmiKey, JSON.stringify(resultObj));

      if (currentUser && isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.updateUser({
            data: { NutriWise_bmi_data: resultObj }
          });
        } catch (err) {
          console.error('Gagal menyimpan BMI ke Supabase:', err);
        }
      }
    }
  };

  // Calculate Calories (Mifflin-St Jeor)
  const handleCalcCalories = (e) => {
    e.preventDefault();
    const w = parseFloat(sharedWeight);
    const h = parseFloat(sharedHeight);
    const a = parseFloat(calAge);
    const mult = parseFloat(calActivity);

    if (w > 0 && h > 0 && a > 0) {
      let bmr = (10 * w) + (6.25 * h) - (5 * a);
      bmr = calGender === 'Pria' ? bmr + 5 : bmr - 161;
      const tdee = Math.round(bmr * mult);

      setCalResult({
        calories: tdee,
        bmr: Math.round(bmr)
      });
    }
  };

  // Calculate Water
  const handleCalcWater = (e) => {
    e.preventDefault();
    const w = parseFloat(sharedWeight);
    if (w > 0) {
      let baseMl = w * 35;
      if (waterActivity === 'sedang') baseMl += 400;
      if (waterActivity === 'berat') baseMl += 800;

      const liters = (baseMl / 1000).toFixed(1);
      const glasses = Math.round(baseMl / 250);

      setWaterResult({
        liters: liters.replace('.', ','),
        glasses: glasses
      });
    }
  };

  const getBmiZoneIndex = () => {
    if (!bmiResult?.numericVal) return -1;
    const v = bmiResult.numericVal;
    if (v < 18.5) return 0;
    if (v < 25) return 1;
    if (v < 30) return 2;
    return 3;
  };

  const activeBmiZone = getBmiZoneIndex();
  const isDashboard = !!currentUser;

  return (
    <section
      id="kalkulator"
      className={`container ${isDashboard ? 'nw-calc-dashboard-sec' : 'section nw-calc-landing-sec'}`}
    >
      {/* Header: Full Title on Landing Page, Compact Helper Bar on Dashboard */}
      {isDashboard ? (
        <div className="nw-calc-dash-bar">
          <p className="nw-calc-dash-hint">
            Masukkan berat &amp; tinggi badan Anda sekali untuk menghitung BMI, kebutuhan kalori, dan air harian.
          </p>
          <button
            type="button"
            onClick={() => setShowAlgoModal(true)}
            className="nw-algo-info-btn"
          >
            <Info size={15} />
            <span>Info Rumus &amp; Standar Medis</span>
          </button>
        </div>
      ) : (
        <div className="nw-calc-landing-header">
          <div>
            <span className="nw-natural-section-tag">Nutrisi &amp; Tubuh Personal</span>
            <h2 className="section-title nw-natural-h2">Kalkulator Kesehatan Harian</h2>
            <p className="section-subtitle nw-natural-subtitle">
              Pahami kebutuhan tubuhmu secara personal. Cukup isi berat dan tinggi badan sekali untuk memantau indeks massa tubuh, energi harian, dan hidrasi.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAlgoModal(true)}
            className="nw-algo-info-btn"
          >
            <Info size={16} />
            <span>Info Rumus &amp; Standar Medis</span>
          </button>
        </div>
      )}

      <div className="calc-grid nw-compact-calc-grid">
        {/* Card 1: BMI */}
        <div className="calc-card nw-compact-calc-card">
          <div className="nw-calc-card-body">
            <div className="nw-compact-card-head">
              <span className="nw-compact-icon nw-compact-icon--green">
                <Activity size={19} />
              </span>
              <h3 className="calc-title nw-compact-title">Indeks Massa Tubuh (BMI)</h3>
            </div>

            <form onSubmit={handleCalcBmi} className="nw-calc-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group nw-compact-fg">
                  <label className="form-label">Berat (kg)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input nw-compact-input"
                    placeholder="Contoh: 65"
                    value={sharedWeight}
                    onChange={(e) => setSharedWeight(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
                <div className="form-group nw-compact-fg">
                  <label className="form-label">Tinggi (cm)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input nw-compact-input"
                    placeholder="Contoh: 170"
                    value={sharedHeight}
                    onChange={(e) => setSharedHeight(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-calc-submit nw-compact-submit">
                Hitung BMI
              </button>
            </form>
          </div>

          <div className={`calc-result-box nw-compact-result ${bmiResult ? 'has-result' : ''}`}>
            <div className="result-number nw-compact-res-num">{bmiResult ? bmiResult.bmi : '-'}</div>
            <div className="result-subtitle">{bmiResult ? bmiResult.category : 'Belum dihitung'}</div>

            {/* 4-Zone Visual Scale Bar */}
            <div className="nw-bmi-scale" aria-hidden="true">
              <span className={`nw-bmi-seg seg-under ${activeBmiZone === 0 ? 'is-active' : ''}`} title="<18.5 Kurus" />
              <span className={`nw-bmi-seg seg-norm ${activeBmiZone === 1 ? 'is-active' : ''}`} title="18.5-24.9 Normal" />
              <span className={`nw-bmi-seg seg-over ${activeBmiZone === 2 ? 'is-active' : ''}`} title="25-29.9 Overweight" />
              <span className={`nw-bmi-seg seg-obese ${activeBmiZone === 3 ? 'is-active' : ''}`} title="≥30 Obesitas" />
            </div>

            {bmiResult && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(36, 90, 59, 0.15)' }}>
                <button
                  onClick={onNavigateToQuiz}
                  className="btn-nav-combined"
                  style={{ width: '100%', padding: '8px 14px', height: '38px', fontSize: '0.82rem' }}
                >
                  <span className="btn-text-default" style={{ gap: '6px' }}>
                    <ClipboardCheck size={15} /> Lanjut ke Kuis Skrining PTM
                  </span>
                  <span className="btn-text-hover" style={{ gap: '6px' }}>
                    Lanjut ke Kuis Skrining PTM <ArrowRight size={14} />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Kalori Harian */}
        <div className="calc-card nw-compact-calc-card">
          <div className="nw-calc-card-body">
            <div className="nw-compact-card-head">
              <span className="nw-compact-icon nw-compact-icon--gold">
                <Flame size={19} />
              </span>
              <h3 className="calc-title nw-compact-title">Kebutuhan Kalori Harian</h3>
            </div>

            <form onSubmit={handleCalcCalories} className="nw-calc-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group nw-compact-fg">
                  <label className="form-label">Berat (kg)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input nw-compact-input"
                    placeholder="Contoh: 65"
                    value={sharedWeight}
                    onChange={(e) => setSharedWeight(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
                <div className="form-group nw-compact-fg">
                  <label className="form-label">Tinggi (cm)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input nw-compact-input"
                    placeholder="Contoh: 170"
                    value={sharedHeight}
                    onChange={(e) => setSharedHeight(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group nw-compact-fg">
                  <label className="form-label">Usia (Tahun)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input nw-compact-input"
                    placeholder="Contoh: 22"
                    value={calAge}
                    onChange={(e) => setCalAge(e.target.value < 0 ? '' : e.target.value)}
                    required
                  />
                </div>
                <div className="form-group nw-compact-fg">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    className="form-select nw-compact-input"
                    value={calGender}
                    onChange={(e) => setCalGender(e.target.value)}
                  >
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                  </select>
                </div>
              </div>

              <div className="form-group nw-compact-fg">
                <label className="form-label">Tingkat Aktivitas</label>
                <select
                  className="form-select nw-compact-input"
                  value={calActivity}
                  onChange={(e) => setCalActivity(e.target.value)}
                >
                  <option value="1.2">Santai / Jarang Olahraga</option>
                  <option value="1.375">Sedang (3 - 5x/minggu)</option>
                  <option value="1.55">Aktif (6 - 7x/minggu)</option>
                  <option value="1.725">Sangat Aktif (Atlet / Pekerja Fisik)</option>
                </select>
              </div>

              <button type="submit" className="btn-calc-submit nw-compact-submit">
                Hitung Kalori
              </button>
            </form>
          </div>

          <div className={`calc-result-box nw-compact-result ${calResult ? 'has-result' : ''}`}>
            <div className="result-number nw-compact-res-num">{calResult ? `${calResult.calories} kkal` : '-'}</div>
            <div className="result-subtitle">
              {calResult ? `BMR dasar: ${calResult.bmr} kkal/hari • disesuaikan aktivitas` : 'Belum dihitung'}
            </div>
          </div>
        </div>

        {/* Card 3: Air Harian */}
        <div className="calc-card nw-compact-calc-card">
          <div className="nw-calc-card-body">
            <div className="nw-compact-card-head">
              <span className="nw-compact-icon nw-compact-icon--sky">
                <Droplets size={19} />
              </span>
              <h3 className="calc-title nw-compact-title">Kebutuhan Air Harian</h3>
            </div>

            <form onSubmit={handleCalcWater} className="nw-calc-form">
              <div className="form-group nw-compact-fg">
                <label className="form-label">Berat Badan (kg)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="form-input nw-compact-input"
                  placeholder="Contoh: 65"
                  value={sharedWeight}
                  onChange={(e) => setSharedWeight(e.target.value < 0 ? '' : e.target.value)}
                  required
                />
              </div>

              <div className="form-group nw-compact-fg">
                <label className="form-label">Tingkat Aktivitas</label>
                <select
                  className="form-select nw-compact-input"
                  value={waterActivity}
                  onChange={(e) => setWaterActivity(e.target.value)}
                >
                  <option value="santai">Santai / Minim Gerak</option>
                  <option value="sedang">Sedang (Olahraga Ringan)</option>
                  <option value="berat">Berat (Intens / Cuaca Panas)</option>
                </select>
              </div>

              <button type="submit" className="btn-calc-submit nw-compact-submit">
                Hitung Kebutuhan Air
              </button>
            </form>
          </div>

          <div className={`calc-result-box nw-compact-result ${waterResult ? 'has-result' : ''}`}>
            <div className="result-number nw-compact-res-num">{waterResult ? `${waterResult.liters} liter` : '-'}</div>
            <div className="result-subtitle">
              {waterResult ? `= ${waterResult.glasses} gelas (250 ml) per hari` : 'Belum dihitung'}
            </div>
          </div>
        </div>
      </div>

      {/* On-Demand Algorithm & Clinical Standards Modal */}
      {showAlgoModal && (
        <div className="modal-overlay" onClick={() => setShowAlgoModal(false)}>
          <div
            className="modal-card nw-algo-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '28px 30px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="nw-compact-icon nw-compact-icon--green">
                  <Info size={20} />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-dark)' }}>
                    Metodologi &amp; Standar Kalkulasi
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                    Dasar ilmiah yang digunakan pada Kalkulator NutriWise
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAlgoModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>

            <div className="nw-algo-modal-list">
              <div className="nw-algo-modal-item">
                <div className="nw-algo-modal-item__title">
                  <Activity size={17} color="var(--color-forest)" />
                  <span>1. Indeks Massa Tubuh (BMI) — Standar WHO Asia-Pacific</span>
                </div>
                <p>
                  Dihitung dari rasio <code>Berat (kg) / Tinggi (m)²</code> dengan klasifikasi batas normal <strong>18,5 – 24,9 kg/m²</strong>. Hasil BMI ini juga tersinkronisasi otomatis ke modul Kuis Skrining PTM.
                </p>
              </div>

              <div className="nw-algo-modal-item">
                <div className="nw-algo-modal-item__title">
                  <Flame size={17} color="#B87D4B" />
                  <span>2. Kalori Harian (TDEE &amp; BMR) — Rumus Mifflin-St Jeor</span>
                </div>
                <p>
                  Menggunakan persamaan klinis <strong>Mifflin-St Jeor</strong> (<code>10×BB + 6,25×TB − 5×Usia + Faktor Gender</code>) untuk menghitung Basal Metabolic Rate (BMR), lalu dikalikan faktor aktivitas harian (1,2 s.d. 1,725).
                </p>
              </div>

              <div className="nw-algo-modal-item">
                <div className="nw-algo-modal-item__title">
                  <Droplets size={17} color="#0284C7" />
                  <span>3. Kebutuhan Air Harian — Hidrasi Dinamis 35 ml/kg</span>
                </div>
                <p>
                  Menggunakan kebutuhan cairan dasar <strong>35 ml per kg berat badan</strong>, ditambah kompensasi cairan ekstra (+400 ml untuk olahraga ringan dan +800 ml untuk aktivitas berat/cuaca panas).
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowAlgoModal(false)}
                className="btn-auth-primary"
                style={{ height: '40px', padding: '0 22px', width: 'auto' }}
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
