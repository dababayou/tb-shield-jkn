import React, { useState } from 'react';
import {
  Scale,
  Utensils,
  Sparkles,
  Info,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { IMMUNONUTRITION_RECIPES } from '../lib/constants';
import { useTBShield } from '../context/TBShieldContext';

export default function GiziPanganLokal({ isDashboard = false }) {
  const { currentUser, setContacts, showToast, addAuditLog } = useTBShield();

  // BMI Calculator Form State (Default Kosong: diisi mandiri oleh pengguna)
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Perempuan');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // Expanded recipe index (Default null: tidak ada yang otomatis terbuka)
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [calculatedBMI, setCalculatedBMI] = useState(null);

  const calculateBMIValue = (w, h) => {
    const hMeter = h / 100;
    if (hMeter <= 0) return 0;
    return Number((w / (hMeter * hMeter)).toFixed(1));
  };

  const currentBMI = calculatedBMI;

  // Kemenkes RI BMI Classification
  let bmiCategory = 'Normal (Gizi Sehat)';
  let bmiColor = '#0F766E';
  let isUnderweight = false;

  if (currentBMI !== null) {
    if (currentBMI < 17.0) {
      bmiCategory = 'Sangat Kurus (Kekurangan BB Berat)';
      bmiColor = '#DC2626';
      isUnderweight = true;
    } else if (currentBMI < 18.5) {
      bmiCategory = 'Kurus (Kekurangan BB Ringan)';
      bmiColor = '#D97706';
      isUnderweight = true;
    } else if (currentBMI <= 25.0) {
      bmiCategory = 'Normal (Gizi Sehat Optimal)';
      bmiColor = '#0F766E';
      isUnderweight = false;
    } else if (currentBMI <= 27.0) {
      bmiCategory = 'Kelebihan Berat Badan (Overweight)';
      bmiColor = '#D97706';
      isUnderweight = false;
    } else {
      bmiCategory = 'Obesitas';
      bmiColor = '#DC2626';
      isUnderweight = false;
    }
  }

  // Ideal weight range calculation (BMI 18.5 - 24.9 standard Kemenkes RI)
  const hNum = parseFloat(height) || 160;
  const hM = hNum / 100;
  const idealMin = Math.round(18.5 * hM * hM);
  const idealMax = Math.round(24.9 * hM * hM);

  const handleCalculate = (e) => {
    e.preventDefault();
    const wNum = parseFloat(weight);
    const hVal = parseFloat(height);

    if (!wNum || wNum <= 0 || !hVal || hVal <= 0) {
      showToast('Mohon masukkan berat badan dan tinggi badan yang valid.');
      return;
    }

    const val = calculateBMIValue(wNum, hVal);
    setCalculatedBMI(val);

    if (currentUser) {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === currentUser.id) {
            return {
              ...c,
              imt: val,
              kategoriIMT: bmiCategory,
              weight: wNum,
              height: hVal,
              age: age ? Number(age) : c.age,
              jk: gender
            };
          }
          return c;
        })
      );
      addAuditLog(`Perhitungan Indeks Massa Tubuh: IMT ${val} (${bmiCategory})`);
    }

    if (val < 18.5) {
      showToast(`Peringatan: IMT ${val} tergolong di bawah normal (< 18,5). Memicu arahan konseling gizi!`);
    } else {
      showToast(`Kalkulasi IMT selesai: ${val} kg/m² (${bmiCategory})`);
    }
  };

  const handleResetCalculator = () => {
    setAge('');
    setWeight('');
    setHeight('');
    setCalculatedBMI(null);
  };

  return (
    <div
      className={`container ${isDashboard ? 'nw-calc-dashboard-sec' : 'section'}`}
      id="gizi"
      style={isDashboard ? { padding: '20px 24px 60px' } : undefined}
    >
      <div>
        {/* Section Header */}
        {!isDashboard && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-tb-jkn">Pilar 2 Inovasi</span>
              <span className="badge-demo-tag">Daun Kelor • Ikan Kembung • Jamur • Telur</span>
            </div>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 10px' }}>
              Imunonutrisi Pangan Lokal &amp; Pelacak IMT
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
              Pendamping pemenuhan zat gizi mikronutrien (L-Arginine, Seng, Vitamin D3, dan Protein) berbasis bahan pangan lokal terjangkau untuk menunjang daya tahan tubuh kontak erat TBC.
            </p>
          </div>
        )}

        {/* Scientific Limitation Alert Banner */}
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
          <div style={{ fontSize: '0.84rem', color: '#92400E', lineHeight: 1.55 }}>
            <strong>Batasan Ilmiah (Kepatuhan Knowledge Brief):</strong> Rekomendasi pangan lokal ini merupakan
            <strong> pendamping gizi (suplementer)</strong>, bukan obat TBC, dan <strong>TIDAK menggantikan Terapi Pencegahan TBC (TPT)</strong> atau obat dokter.
            Studi RATIONS menguji paket bantuan pangan komprehensif, bukan menu spesifik tertentu secara tunggal.
          </div>
        </div>

        {/* Side-by-side layout: Kalkulator kiri, Katalog kanan (pada layar lebar) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '28px',
          alignItems: 'start'
        }}>
          {/* 1. BMI Tracker & Calculator Card */}
          <div style={{
            background: 'var(--color-card-bg)',
            borderRadius: '24px',
            border: '1px solid #D9CBC2',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#F0F4FC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}>
                <Scale size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                  Kalkulator &amp; Pelacak IMT
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                  Klasifikasi Standar Kemenkes RI
                </p>
              </div>
            </div>

            <form onSubmit={handleCalculate}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                    Usia (Tahun)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="110"
                    placeholder="Contoh: 32"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #D9CBC2',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                    Jenis Kelamin
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #D9CBC2',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      background: '#FFFFFF'
                    }}
                  >
                    <option>Perempuan</option>
                    <option>Laki-laki</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                    Berat Badan (kg)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="250"
                    step="0.1"
                    placeholder="Contoh: 50"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #D9CBC2',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                    Tinggi Badan (cm)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="230"
                    step="0.1"
                    placeholder="Contoh: 160"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #D9CBC2',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}>
                {calculatedBMI !== null && (
                  <button
                    type="button"
                    onClick={handleResetCalculator}
                    className="btn-cta-outline"
                    style={{ padding: '10px 18px', height: '42px', fontSize: '0.88rem' }}
                  >
                    Atur Ulang
                  </button>
                )}
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--color-navy)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '10px 24px',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer'
                  }}
                >
                  <Scale size={16} /> Hitung Nilai IMT
                </button>
              </div>
            </form>

            {/* BMI Result Display Strip */}
            {calculatedBMI !== null ? (
              <div style={{
                background: '#F8FAFC',
                border: `2px solid ${bmiColor}`,
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                animation: 'slideInToast 0.3s ease'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    Hasil Indeks Massa Tubuh
                  </span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: bmiColor, margin: '2px 0 0' }}>
                    {currentBMI} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg/m²</span> — {bmiCategory}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                    Rentang BB Ideal: <strong>{idealMin} – {idealMax} kg</strong>
                  </div>
                </div>

                {isUnderweight ? (
                  <div style={{
                    background: '#FEF2F2',
                    border: '1px solid #F87171',
                    borderRadius: '12px',
                    padding: '12px 16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontWeight: 800, fontSize: '0.85rem' }}>
                      <AlertTriangle size={18} /> Pemicu Rujukan Konseling Gizi!
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#991B1B', lineHeight: 1.45 }}>
                      IMT di bawah 18,5 merupakan faktor risiko penurunan imunitas seluler. Sistem TB-Shield merekomendasikan rujukan konseling gizi dan menambah 1 poin pada skrining risiko.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    background: '#ECFDF5',
                    border: '1px solid #6EE7B7',
                    borderRadius: '12px',
                    padding: '10px 14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065F46', fontWeight: 700, fontSize: '0.82rem' }}>
                      <CheckCircle2 size={16} /> IMT Anda dalam Ambang Sehat Optimal
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: '#F8FAFC',
                border: '1.5px dashed #D9CBC2',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                color: 'var(--color-muted)',
                fontSize: '0.88rem'
              }}>
                <Scale size={24} color="var(--color-primary)" style={{ margin: '0 auto 8px', display: 'block' }} />
                <span>Masukkan berat & tinggi badan lalu klik <strong>Hitung Nilai IMT</strong> untuk melihat hasil analisis gizi Kemenkes RI.</span>
              </div>
            )}
          </div>

          {/* 2. Resep Imunonutrisi Pangan Lokal Showcase */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                  Katalog Menu Imunonutrisi
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                  Ketuk tiap resep untuk bahan, langkah memasak, dan target nutrisi TBC.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {IMMUNONUTRITION_RECIPES.map((recipe) => {
                const isOpen = expandedRecipe === recipe.id;
                return (
                  <div
                    key={recipe.id}
                    className="recipe-card"
                    style={{ border: isOpen ? '2px solid var(--color-primary)' : '1px solid #D9CBC2' }}
                  >
                    {/* Card Header (Accordion Toggle) */}
                    <div
                      onClick={() => setExpandedRecipe(isOpen ? null : recipe.id)}
                      style={{
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: isOpen ? '#F8FAFC' : '#FFFFFF',
                        userSelect: 'none'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                            {recipe.ingredientType}
                          </span>
                          {recipe.tags.map((t, idx) => (
                            <span key={idx} className="recipe-nutrient-pill">
                              {t}
                            </span>
                          ))}
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                          {recipe.title}
                        </h4>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '12px' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={15} /> {recipe.prepTime}
                        </span>
                        {isOpen ? <ChevronUp size={20} color="var(--color-navy)" /> : <ChevronDown size={20} color="var(--color-muted)" />}
                      </div>
                    </div>

                    {/* Expanded Recipe Detail */}
                    {isOpen && (
                      <div style={{ padding: '0 24px 24px', borderTop: '1px solid #D9CBC2', paddingTop: '20px' }}>
                        {/* Target Nutrisi & Mekanisme Imunitas */}
                        <div style={{
                          background: '#F0F4FC',
                          border: '1px solid #D0DBEE',
                          borderRadius: '12px',
                          padding: '14px 18px',
                          marginBottom: '20px'
                        }}>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
                            Mekanisme Biomedis dalam Perlindungan TBC:
                          </div>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.55 }}>
                            {recipe.whyGoodForTB}
                          </p>
                          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--color-navy)', fontWeight: 700 }}>
                            <span>Protein: {recipe.targetNutrients.protein}</span>
                            <span>Zinc: {recipe.targetNutrients.zinc}</span>
                            <span>L-Arginine: {recipe.targetNutrients.arginine}</span>
                            <span>Vitamin D: {recipe.targetNutrients.vitD}</span>
                          </div>
                        </div>

                        {/* Ingredients & Steps Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                          <div>
                            <h5 style={{ margin: '0 0 10px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                              Bahan-Bahan yang Diperlukan:
                            </h5>
                            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
                              {recipe.ingredients.map((ing, i) => (
                                <li key={i}>{ing}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 style={{ margin: '0 0 10px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                              Langkah Memasak Sederhana:
                            </h5>
                            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
                              {recipe.instructions.map((step, s) => (
                                <li key={s} style={{ marginBottom: '6px' }}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
