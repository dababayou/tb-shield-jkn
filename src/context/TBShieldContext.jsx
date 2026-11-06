import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CONTACTS,
  DEMO_STAFF,
  INITIAL_AUDIT_LOGS,
  SCREENING_QUESTIONS,
  ADHERENCE_QUESTIONS
} from '../lib/constants';

const TBShieldContext = createContext();

export function TBShieldProvider({ children }) {
  // Migration check: ensure fresh clean initial state on updated version
  if (typeof window !== 'undefined' && !localStorage.getItem('tbshield_v3_clean_state')) {
    localStorage.removeItem('tbshield_contacts');
    localStorage.removeItem('tbshield_current_user');
    localStorage.setItem('tbshield_v3_clean_state', 'true');
  }

  // Current logged in user or staff
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tbshield_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation View ('home' | 'auth' | 'dashboard' | 'landing')
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('tbshield_current_user');
    return saved ? 'dashboard' : 'home';
  });
  const [authRole, setAuthRole] = useState('user'); // 'user' | 'staff'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Active dashboard tab for User
  const [activeTab, setActiveTabState] = useState(() => {
    const saved = localStorage.getItem('tbshield_user_tab');
    return saved || 'skrining';
  });

  // Active dashboard tab for Staff
  const [staffTab, setStaffTabState] = useState('ikhtisar'); // 'ikhtisar' | 'loket' | 'kontak' | 'alert' | 'audit'

  // Contacts dataset (persisted in local state)
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('tbshield_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  // Audit Logs dataset
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('tbshield_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Patient Safety Alerts (global feed for active red alert)
  const [activeAlerts, setActiveAlerts] = useState(() => {
    const alerts = [];
    INITIAL_CONTACTS.forEach((c) => {
      if (c.alerts && c.alerts.length > 0) {
        c.alerts.forEach((alt) => {
          alerts.push({
            ...alt,
            contactId: c.id,
            contactName: c.nama,
            contactFKTP: c.fk,
            contactNik: c.nik
          });
        });
      }
    });
    return alerts;
  });

  // Red Screen Overlay Trigger
  const [redScreenTriggered, setRedScreenTriggered] = useState(false);
  const [currentRedAlertData, setCurrentRedAlertData] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tbshield_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tbshield_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tbshield_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('tbshield_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showToast = (message, duration = 4000) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  const addAuditLog = (action, staffName = 'Sistem TB-Shield', status = 'Tercatat') => {
    const newEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('id-ID'),
      date: new Date().toISOString().split('T')[0],
      staff: staffName,
      action,
      status
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    localStorage.setItem('tbshield_user_tab', tab);
  };

  // Helper to calculate Screening Score from answers
  const computeScreeningScore = (gejalaIds = [], risikoIds = [], paparanIds = []) => {
    let score = 0;
    let hasCardinal = false;
    let hasCough2w = false;
    let riskExposureScore = 0;

    // 1. Gejala (maks 5 poin)
    SCREENING_QUESTIONS.gejala.forEach((item) => {
      if (gejalaIds.includes(item.id)) {
        score += item.points;
        if (item.isCardinal) hasCardinal = true;
        if (item.id === 'cough_2w') hasCough2w = true;
      }
    });

    // 2. Faktor risiko kesehatan (maks 3 poin)
    SCREENING_QUESTIONS.faktorRisiko.forEach((item) => {
      if (risikoIds.includes(item.id)) {
        score += item.points;
        riskExposureScore += item.points;
      }
    });

    // 3. Tingkat paparan (maks 2 poin)
    SCREENING_QUESTIONS.paparan.forEach((item) => {
      if (paparanIds.includes(item.id)) {
        score += item.points;
        riskExposureScore += item.points;
      }
    });

    // Total score capped at 10
    const totalScore = Math.min(10, score);

    // Referral triggers according to knowledge brief & proposal:
    // - Batuk >= 2 minggu memicu rujukan pemeriksaan
    // - Gejala utama signifikan lainnya (misal batuk darah)
    // - Jika tanpa gejala kardinal, skor gabungan risiko & paparan >= 2 memicu evaluasi prioritas TPT
    // - Atau total skor >= 9 (Risiko Tinggi / Red Flag)
    let isReferralNeeded = false;
    let referralReason = '';

    if (hasCough2w) {
      isReferralNeeded = true;
      referralReason = 'Batuk selama 2 minggu atau lebih (Gejala Kardinal TBC)';
    } else if (hasCardinal) {
      isReferralNeeded = true;
      referralReason = 'Terdapat tanda bahaya / gejala kardinal (Batuk bercampur darah)';
    } else if (totalScore >= 9) {
      isReferralNeeded = true;
      referralReason = 'Skor risiko epidemiologis tinggi (≥ 9 poin)';
    } else if (gejalaIds.length === 0 && riskExposureScore >= 2) {
      isReferralNeeded = true;
      referralReason = 'Kontak erat tanpa gejala dengan akumulasi faktor risiko & paparan tinggi (≥ 2 poin)';
    } else if (totalScore >= 4) {
      referralReason = 'Risiko Sedang: Diperlukan konseling TPT di FKTP terdekat';
    } else {
      referralReason = 'Risiko Rendah: Pemantauan mandiri di rumah & pemenuhan nutrisi rutin';
    }

    let riskCategory = 'Rendah';
    if (totalScore >= 9 || hasCardinal || hasCough2w) {
      riskCategory = 'Tinggi';
    } else if (totalScore >= 4) {
      riskCategory = 'Sedang';
    }

    return {
      totalScore,
      riskCategory,
      isReferralNeeded,
      referralReason,
      hasCardinal,
      hasCough2w,
      riskExposureScore
    };
  };

  // Generate a Digital Referral Ticket
  const issueDigitalTicket = (contactId, customReason) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const ticketId = `TB-${code}-${new Date().getFullYear()}`;

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId || (currentUser && c.id === currentUser.id)) {
          return {
            ...c,
            ticket: code,
            ticketId,
            status: 'Rujukan Terbit',
            ticketStatus: 'Tersinkronisasi P-Care (Demo)',
            ticketDate: new Date().toLocaleDateString('id-ID'),
            referralReason: customReason || c.referralReason || 'Skrining Risiko TBC'
          };
        }
        return c;
      })
    );

    if (currentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        ticket: code,
        ticketId,
        status: 'Rujukan Terbit',
        ticketStatus: 'Tersinkronisasi P-Care (Demo)',
        ticketDate: new Date().toLocaleDateString('id-ID'),
        referralReason: customReason || prev.referralReason || 'Skrining Risiko TBC'
      }));
    }

    addAuditLog(`Penerbitan Tiket Rujukan Digital #${code}`, 'Sistem Mandiri Pasien', 'Tersinkronisasi Simulasi');
    showToast(`Tiket Rujukan Digital #${code} berhasil diterbitkan dan tersinkronisasi (Demo)!`);
    return code;
  };

  // Trigger Patient Safety Alert (e.g. Ikterus, adverse effects)
  const reportPatientSafetyAlert = (alertData) => {
    const alertId = `alt-${Date.now().toString().slice(-4)}`;
    const newAlert = {
      id: alertId,
      date: new Date().toLocaleString('id-ID'),
      type: alertData.type || 'Peringatan Tanda Bahaya Medis',
      notes: alertData.notes || 'Pasien melaporkan tanda bahaya',
      status: 'Aktif - Memerlukan Panggilan Segera',
      contactId: currentUser?.id || 'guest',
      contactName: currentUser?.nama || 'Pengguna Mandiri',
      contactFKTP: currentUser?.fk || 'Puskesmas Terdekat',
      contactNik: currentUser?.nik || '3578••••••••0000',
      contactPhone: alertData.phone || '0812-3456-7890'
    };

    setActiveAlerts((prev) => [newAlert, ...prev]);

    // Red screen trigger
    setCurrentRedAlertData(newAlert);
    setRedScreenTriggered(true);

    addAuditLog(
      `PATIENT SAFETY ALERT: ${alertData.type} dari ${currentUser?.nama || 'Pasien'}`,
      'Sistem Patient Safety',
      'DARURAT'
    );
  };

  const dismissRedScreen = () => {
    setRedScreenTriggered(false);
  };

  // Staff Operations
  const loginStaff = (code, pin, otp) => {
    const staff = DEMO_STAFF[code.toUpperCase()];
    if (!staff) {
      return { success: false, message: 'Kode petugas FKTP tidak terdaftar.' };
    }
    if (staff.pin !== pin) {
      return { success: false, message: 'PIN petugas tidak cocok.' };
    }
    // Success
    const staffUser = {
      role: 'staff',
      code: code.toUpperCase(),
      nama: staff.nama,
      fk: staff.fk,
      nip: staff.nip
    };
    setCurrentUser(staffUser);
    setCurrentView('dashboard');
    addAuditLog(`Login Sesi Petugas FKTP (${code.toUpperCase()})`, staff.nama, 'Berhasil Masuk');
    showToast(`Selamat bertugas di ${staff.fk}, ${staff.nama}!`);
    return { success: true };
  };

  // Verify ticket at registration desk
  const verifyTicketAtDesk = (ticketCode) => {
    const formatted = ticketCode.trim().toUpperCase();
    const contact = contacts.find((c) => c.ticket && c.ticket.toUpperCase() === formatted);
    if (!contact) {
      return { success: false, message: `Tiket #${formatted} tidak ditemukan dalam database simulasi.` };
    }

    const updated = contacts.map((c) => {
      if (c.id === contact.id) {
        return {
          ...c,
          status: 'Verifikasi Loket',
          ticketStatus: 'Diverifikasi di Loket FKTP (Demo)',
          verifiedAt: new Date().toLocaleTimeString('id-ID')
        };
      }
      return c;
    });
    setContacts(updated);
    addAuditLog(`Verifikasi Tiket #${formatted} Pasien: ${contact.nama}`, currentUser?.nama || 'Petugas Loket', 'Tervalidasi');
    showToast(`Tiket #${formatted} (${contact.nama}) berhasil divalidasi di loket!`);
    return { success: true, contact };
  };

  // Update contact status by staff
  const updateContactServiceStatus = (contactId, newStatus, notes = '') => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            status: newStatus,
            lastStaffNotes: notes || c.lastStaffNotes,
            lastUpdated: new Date().toLocaleDateString('id-ID')
          };
        }
        return c;
      })
    );
    addAuditLog(`Update status pasien #${contactId} menjadi: ${newStatus}`, currentUser?.nama || 'Petugas FKTP');
    showToast(`Status pasien berhasil diperbarui menjadi: ${newStatus}`);
  };

  // Mark an alert as handled
  const resolveAlert = (alertId) => {
    setActiveAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Selesai Ditindaklanjuti Petugas' } : a))
    );
    addAuditLog(`Peringatan Keselamatan #${alertId} telah ditangani`, currentUser?.nama || 'Petugas FKTP');
    showToast('Peringatan keselamatan pasien ditandai selesai.');
  };

  // Login with NIK / BPJS for existing registered contact
  const loginContactWithNik = (nikInput) => {
    const clean = (nikInput || '').trim();
    if (!clean) {
      return { success: false, message: 'Masukkan 16 digit NIK atau nomor kartu BPJS Anda.' };
    }
    const found = contacts.find((c) => c.nik === clean || c.bp === clean || c.ticket === clean.toUpperCase());
    if (!found) {
      return {
        success: false,
        message: `Identitas "${clean}" belum ditemukan di database simulasi. Silakan pilih tab "Daftar Baru" atau pilih salah satu akun demo di bawah.`
      };
    }
    const userObj = {
      role: 'user',
      ...found
    };
    setCurrentUser(userObj);
    setCurrentView('dashboard');
    window.location.hash = '#dashboard';
    addAuditLog(`Login Kontak Erat: ${userObj.nama}`, 'Sistem Mandiri', 'Sukses');
    showToast(`Selamat datang kembali, ${userObj.nama}! Membuka dasbor Anda...`);
    return { success: true, user: userObj };
  };

  // Demo shortcut logins
  const loginAsDemoContact = (contactId) => {
    const target = contacts.find((c) => c.id === contactId) || contacts[0];
    const userObj = {
      role: 'user',
      ...target
    };
    setCurrentUser(userObj);
    setCurrentView('dashboard');
    window.location.hash = '#dashboard';
    addAuditLog(`Login Demo Kontak Erat: ${userObj.nama}`, 'Simulasi', 'Sukses');
    showToast(`Masuk sebagai kontak erat: ${userObj.nama}`);
  };

  const loginAsDemoStaff = (staffCode = 'TNG-01') => {
    const staff = DEMO_STAFF[staffCode];
    if (staff) {
      const staffUser = {
        role: 'staff',
        code: staffCode,
        nama: staff.nama,
        fk: staff.fk,
        nip: staff.nip
      };
      setCurrentUser(staffUser);
      setCurrentView('dashboard');
      window.location.hash = '#dashboard';
      addAuditLog(`Login Demo Petugas FKTP: ${staff.nama}`, 'Simulasi', 'Sukses');
      showToast(`Masuk sebagai: ${staff.nama} (${staff.fk})`);
    }
  };

  const logout = () => {
    addAuditLog(`Pengguna keluar dari sesi`, currentUser?.nama || 'Pengguna');
    setCurrentUser(null);
    setCurrentView('home');
    window.location.hash = '';
    showToast('Anda telah keluar dari aplikasi.');
  };

  return (
    <TBShieldContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentView,
        setCurrentView,
        authRole,
        setAuthRole,
        authMode,
        setAuthMode,
        activeTab,
        setActiveTab,
        staffTab,
        setStaffTabState,
        contacts,
        setContacts,
        auditLogs,
        addAuditLog,
        activeAlerts,
        reportPatientSafetyAlert,
        redScreenTriggered,
        currentRedAlertData,
        dismissRedScreen,
        toastMessage,
        showToast,
        computeScreeningScore,
        issueDigitalTicket,
        loginStaff,
        verifyTicketAtDesk,
        updateContactServiceStatus,
        resolveAlert,
        loginContactWithNik,
        loginAsDemoContact,
        loginAsDemoStaff,
        logout
      }}
    >
      {children}
    </TBShieldContext.Provider>
  );
}

export function useTBShield() {
  const context = useContext(TBShieldContext);
  if (!context) {
    throw new Error('useTBShield must be used within a TBShieldProvider');
  }
  return context;
}
