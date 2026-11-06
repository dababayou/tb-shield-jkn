import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  User,
  X,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  FileText,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';
import { REGIONS_DATA, DEMO_STAFF, INITIAL_CONTACTS } from '../lib/constants';

export default function AuthModal({ isOpen, onClose }) {
  const {
    authRole,
    setAuthRole,
    setCurrentUser,
    setCurrentView,
    loginStaff,
    loginContactWithNik,
    setContacts,
    showToast,
    addAuditLog,
    loginAsDemoContact,
    loginAsDemoStaff
  } = useTBShield();

  // Mode for User ('register' | 'login')
  const [userTab, setUserTab] = useState('register');
  const [loginNik, setLoginNik] = useState('');

  // User Registration Form State
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [bpjs, setBpjs] = useState('');
  const [tglLahir, setTglLahir] = useState('1995-05-15');
  const [gender, setGender] = useState('Perempuan');
  const [provinsi, setProvinsi] = useState('Jawa Timur');
  const [kabupaten, setKabupaten] = useState('Kota Surabaya');
  const [kecamatan, setKecamatan] = useState('Tenggilis Mejoyo');
  const [kelurahan, setKelurahan] = useState('Kendangsari');
  const [rt, setRt] = useState('05');
  const [rw, setRw] = useState('03');
  const [hubungan, setHubungan] = useState('Serumah dengan pasien');
  const [consentChecked, setConsentChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifyingJKN, setIsVerifyingJKN] = useState(false);

  // Staff Login State
  const [staffCode, setStaffCode] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [staffOtp, setStaffOtp] = useState('');
  const [staffStep, setStaffStep] = useState(1);
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Dynamically resolve district & clinic
  const kabData = REGIONS_DATA[provinsi]?.[kabupaten];
  const kecList = kabData ? Object.keys(kabData) : [];
  const selectedKecData = kabData?.[kecamatan];
  const kelList = selectedKecData?.kl || [];
  const fktpList = selectedKecData?.fk || [];
  const selectedFKTP = fktpList[0] || 'Puskesmas Tenggilis';

  const handleKecamatanChange = (kec) => {
    setKecamatan(kec);
    const d = kabData?.[kec];
    if (d && d.kl.length > 0) {
      setKelurahan(d.kl[0]);
    }
  };

  // Submit User Registration
  const handleUserRegister = (e) => {
    e.preventDefault();
    if (nama.trim().length < 3) {
      return setErrorMessage('Nama lengkap minimal 3 karakter.');
    }
    if (!/^\d{16}$/.test(nik)) {
      return setErrorMessage('NIK harus tepat 16 digit angka sesuai KTP.');
    }
    if (!/^\d{13}$/.test(bpjs)) {
      return setErrorMessage('Nomor kartu BPJS Kesehatan harus tepat 13 digit angka.');
    }
    if (!consentChecked) {
      return setErrorMessage('Anda wajib menyetujui pernyataan persetujuan pemrosesan data (Informed Consent UU PDP).');
    }

    setErrorMessage('');
    setIsVerifyingJKN(true);

    // Simulate JKN P-Care API verification
    setTimeout(() => {
      setIsVerifyingJKN(false);
      const birthDate = new Date(tglLahir);
      const age = Math.max(1, Math.floor((Date.now() - birthDate) / 31557600000));

      const newUser = {
        role: 'user',
        id: `ct-${Date.now().toString().slice(-4)}`,
        nama: nama.trim(),
        nik,
        bp: bpjs,
        jk: gender,
        age,
        kel: kelurahan,
        rw,
        rt,
        fk: selectedFKTP,
        hubungan,
        status: 'Terdaftar',
        ticket: null,
        skor: 0,
        kategoriRisiko: 'Rendah',
        imt: 21.0
      };

      setContacts((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setCurrentView('dashboard');
      window.location.hash = '#dashboard';
      addAuditLog(`Registrasi Kontak Erat Baru: ${nama} (${selectedFKTP})`, 'Verifikasi JKN (Simulasi)', 'Sukses');
      showToast(`Pendaftaran berhasil! Selamat datang, ${nama}! Membuka dasbor Anda...`);
      if (onClose) onClose();
    }, 900);
  };

  // Submit Existing User Login by NIK
  const handleUserLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginContactWithNik(loginNik);
    if (res.success) {
      if (onClose) onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  // Staff Proceed OTP
  const handleStaffProceed = (e) => {
    e.preventDefault();
    const formatted = staffCode.trim().toUpperCase();
    const s = DEMO_STAFF[formatted];
    if (!s || s.pin !== staffPin) {
      return setErrorMessage('Kode petugas atau PIN salah. Lihat akun demo di bawah.');
    }
    setErrorMessage('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setStaffOtp(randomOtp);
    setStaffStep(2);
    showToast(`OTP Demo: ${randomOtp}`, 6000);
  };

  const handleStaffLogin = (e) => {
    e.preventDefault();
    if (staffOtp !== generatedOtp) {
      return setErrorMessage('Kode OTP salah.');
    }
    const res = loginStaff(staffCode, staffPin, staffOtp);
    if (res.success) {
      if (onClose) onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-card"
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Role Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <span className="badge-tb-jkn" style={{ marginBottom: '6px' }}>Autentikasi Pengguna</span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 0' }}>
              Masuk / Registrasi TB-Shield JKN
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Role Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: '#F1F5F9',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => {
              setAuthRole('user');
              setErrorMessage('');
            }}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: authRole === 'user' ? '#FFFFFF' : 'none',
              color: authRole === 'user' ? 'var(--color-navy)' : 'var(--color-muted)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: authRole === 'user' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <User size={16} /> Kontak Erat / Pasien
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthRole('staff');
              setErrorMessage('');
            }}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: authRole === 'staff' ? '#FFFFFF' : 'none',
              color: authRole === 'staff' ? 'var(--color-navy)' : 'var(--color-muted)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: authRole === 'staff' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Building2 size={16} /> Petugas Puskesmas / FKTP
          </button>
        </div>

        {errorMessage && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #F87171',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#DC2626',
            fontSize: '0.84rem',
            fontWeight: 600,
            marginBottom: '18px'
          }}>
            {errorMessage}
          </div>
        )}

        {/* ROLE 1: KONTAK ERAT / PASIEN FORM */}
        {authRole === 'user' ? (
          <div>
            {/* Sub-toggle: Register vs Login */}
            <div style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '18px',
              borderBottom: '1px solid #D9CBC2',
              paddingBottom: '8px'
            }}>
              <button
                type="button"
                onClick={() => {
                  setUserTab('register');
                  setErrorMessage('');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: userTab === 'register' ? 'var(--color-navy)' : 'transparent',
                  color: userTab === 'register' ? '#FFFFFF' : 'var(--color-muted)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <UserPlus size={14} /> Daftar Baru (Registrasi JKN)
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserTab('login');
                  setErrorMessage('');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: userTab === 'login' ? 'var(--color-navy)' : 'transparent',
                  color: userTab === 'login' ? '#FFFFFF' : 'var(--color-muted)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <LogIn size={14} /> Masuk dengan NIK / No. BPJS
              </button>
            </div>

            {userTab === 'login' ? (
              /* LOGIN TAB */
              <form onSubmit={handleUserLogin}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', marginBottom: '6px', color: 'var(--color-navy)' }}>
                    Nomor Induk Kependudukan (NIK) atau Nomor BPJS
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan 16 digit NIK atau 13 digit No. BPJS"
                    value={loginNik}
                    onChange={(e) => setLoginNik(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--color-primary)',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <small style={{ color: 'var(--color-muted)', fontSize: '0.76rem', display: 'block', marginTop: '4px' }}>
                    Contoh terdaftar: <code>3578010101900021</code> (Siti) atau <code>3578010202780033</code> (Agus)
                  </small>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '50px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Masuk ke Dasbor Kontak Erat
                </button>
              </form>
            ) : (
              /* REGISTER TAB */
              <form onSubmit={handleUserRegister}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px', color: 'var(--color-navy)' }}>
                      Nama Lengkap <small style={{ fontWeight: 400, color: 'var(--color-muted)' }}>(Sesuai KTP)</small>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Siti Rahayu"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #D9CBC2',
                        fontSize: '0.88rem',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px', color: 'var(--color-navy)' }}>
                        Nomor Induk Kependudukan (NIK - 16 Digit)
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="Contoh: 3578010101900021"
                        value={nik}
                        onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #D9CBC2',
                          fontSize: '0.88rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px', color: 'var(--color-navy)' }}>
                        Nomor Kartu BPJS Kesehatan (13 Digit)
                      </label>
                      <input
                        type="text"
                        maxLength={13}
                        placeholder="Contoh: 0001234567890"
                        value={bpjs}
                        onChange={(e) => setBpjs(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #D9CBC2',
                          fontSize: '0.88rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px', color: 'var(--color-navy)' }}>
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        value={tglLahir}
                        onChange={(e) => setTglLahir(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #D9CBC2',
                          fontSize: '0.88rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px', color: 'var(--color-navy)' }}>
                        Jenis Kelamin
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #D9CBC2',
                          fontSize: '0.88rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          background: '#FFFFFF'
                        }}
                      >
                        <option>Perempuan</option>
                        <option>Laki-laki</option>
                      </select>
                    </div>
                  </div>

                  {/* Wilayah Berjenjang */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2px', color: 'var(--color-navy)' }}>
                        Provinsi
                      </label>
                      <select
                        value={provinsi}
                        onChange={(e) => setProvinsi(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D9CBC2', fontSize: '0.82rem', background: '#FFFFFF' }}
                      >
                        {Object.keys(REGIONS_DATA).map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2px', color: 'var(--color-navy)' }}>
                        Kota / Kabupaten
                      </label>
                      <select
                        value={kabupaten}
                        onChange={(e) => setKabupaten(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D9CBC2', fontSize: '0.82rem', background: '#FFFFFF' }}
                      >
                        {kabData && Object.keys(kabData).map((k) => (
                          <option key={k}>{k}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2px', color: 'var(--color-navy)' }}>
                        Kecamatan
                      </label>
                      <select
                        value={kecamatan}
                        onChange={(e) => handleKecamatanChange(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D9CBC2', fontSize: '0.82rem', background: '#FFFFFF' }}
                      >
                        {kecList.map((kc) => (
                          <option key={kc}>{kc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2px', color: 'var(--color-navy)' }}>
                        Kelurahan
                      </label>
                      <select
                        value={kelurahan}
                        onChange={(e) => setKelurahan(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #D9CBC2', fontSize: '0.82rem', background: '#FFFFFF' }}
                      >
                        {kelList.map((kl) => (
                          <option key={kl}>{kl}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2px', color: 'var(--color-navy)' }}>
                        RT
                      </label>
                      <select
                        value={rt}
                        onChange={(e) => setRt(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D9CBC2', fontSize: '0.82rem', background: '#FFFFFF' }}
                      >
                        {Array.from({ length: 15 }, (_, i) => String(i + 1).padStart(2, '0')).map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2px', color: 'var(--color-navy)' }}>
                        RW
                      </label>
                      <select
                        value={rw}
                        onChange={(e) => setRw(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D9CBC2', fontSize: '0.82rem', background: '#FFFFFF' }}
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2px', color: 'var(--color-navy)' }}>
                        Hubungan Kontak TBC
                      </label>
                      <select
                        value={hubungan}
                        onChange={(e) => setHubungan(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D9CBC2', fontSize: '0.82rem', background: '#FFFFFF' }}
                      >
                        <option>Serumah dengan pasien</option>
                        <option>Kontak dekat (tetangga/rekan kerja)</option>
                        <option>Pasien TBC aktif</option>
                      </select>
                    </div>
                  </div>

                  {/* Detected FKTP */}
                  <div style={{
                    background: '#F0F4FC',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem'
                  }}>
                    <span style={{ color: 'var(--color-muted)' }}>FKTP Terdaftar JKN Terpilih (Simulasi):</span>
                    <div style={{ fontWeight: 800, color: '#0F766E', fontSize: '0.94rem' }}>
                      {selectedFKTP}
                    </div>
                  </div>

                  {/* Informed Consent Checkbox */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '0.8rem',
                    color: '#334155',
                    lineHeight: 1.5,
                    padding: '10px',
                    background: '#FFFBEB',
                    borderRadius: '8px',
                    border: '1px solid #FCD34D',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      style={{ marginTop: '3px' }}
                    />
                    <span>
                      Saya menyatakan data adalah benar dan memberikan persetujuan eksplisit (<em>explicit informed consent</em>) untuk pemrosesan data identitas dan skrining rujukan TBC sesuai UU PDP No. 27/2022.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingJKN}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '50px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: isVerifyingJKN ? 'wait' : 'pointer'
                  }}
                >
                  {isVerifyingJKN ? 'Memverifikasi Kepesertaan JKN...' : 'Daftar & Masuk ke Dasbor JKN'}
                </button>
              </form>
            )}

            {/* Quick Demo 1-Click Login Shortcuts */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-muted)', display: 'block', marginBottom: '8px', textAlign: 'center' }}>
                Atau langsung masuk menggunakan akun simulasi demo:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoContact('ct-001');
                    if (onClose) onClose();
                  }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #D9CBC2',
                    background: '#F8FAFC',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Siti Rahayu (Serumah)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoContact('ct-002');
                    if (onClose) onClose();
                  }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #D9CBC2',
                    background: '#F8FAFC',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Agus Prasetyo (Rujukan H4MK)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoContact('ct-004');
                    if (onClose) onClose();
                  }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #D9CBC2',
                    background: '#F8FAFC',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Hendra Wijaya (Red Flag R7TP)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoContact('ct-003');
                    if (onClose) onClose();
                  }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #D9CBC2',
                    background: '#F8FAFC',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Dewi Lestari (Rekan Kerja)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ROLE 2: PETUGAS FKTP LOGIN */
          <div>
            {staffStep === 1 ? (
              <form onSubmit={handleStaffProceed}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', color: 'var(--color-navy)' }}>
                    Kode Petugas FKTP
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: TNG-01 atau GBG-01"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D9CBC2',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', color: 'var(--color-navy)' }}>
                    PIN Petugas (6 Digit)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="6 digit PIN"
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D9CBC2',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: 'var(--color-navy)',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '50px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Lanjut ke Verifikasi OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleStaffLogin}>
                <div style={{
                  background: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '0.82rem',
                  color: '#166534'
                }}>
                  OTP demo otomatis terisi: <strong>{generatedOtp}</strong>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', color: 'var(--color-navy)' }}>
                    Kode OTP (6 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={staffOtp}
                    onChange={(e) => setStaffOtp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1.5px solid #0F766E',
                      fontSize: '1.2rem',
                      fontFamily: 'var(--font-mono)',
                      textAlign: 'center',
                      letterSpacing: '0.2em',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setStaffStep(1)}
                    className="btn-cta-outline"
                    style={{ flex: 1 }}
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      background: '#0F766E',
                      color: '#FFFFFF',
                      padding: '12px',
                      borderRadius: '50px',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Masuk Dasbor Petugas
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Staff Buttons */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-muted)', display: 'block', marginBottom: '8px', textAlign: 'center' }}>
                Akses cepat akun petugas demo:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoStaff('TNG-01');
                    if (onClose) onClose();
                  }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #D9CBC2',
                    background: '#F8FAFC',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Puskesmas Tenggilis (TNG-01)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoStaff('GBG-01');
                    if (onClose) onClose();
                  }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #D9CBC2',
                    background: '#F8FAFC',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Puskesmas Gubeng (GBG-01)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
