import React, { useState } from 'react';
import { Bell, BellOff, BellRing, X, Clock, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getUserTimezone } from '../lib/pushNotifications';

/**
 * Modal for notification settings & post-login/register prompt.
 */
export default function NotificationSettingsModal({ 
  isOpen, 
  onClose, 
  pushState, 
  currentUser,
  isAuthPrompt = false 
}) {
  const { 
    isEnabled, 
    permissionState, 
    error, 
    enableNotifications, 
    disableNotifications, 
    triggerTest2000Reminder 
  } = pushState;

  const [testSent, setTestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const userTz = getUserTimezone(currentUser);

  if (!isOpen) return null;

  const markPromptAnswered = () => {
    if (currentUser?.id) {
      localStorage.setItem(`NutriWise_notif_prompt_answered_${currentUser.id}`, 'true');
    }
  };

  const handleModalClose = () => {
    if (isAuthPrompt) {
      markPromptAnswered();
    }
    onClose();
  };

  const handleTurnOn = async () => {
    setLoading(true);
    markPromptAnswered();
    await enableNotifications();
    setLoading(false);
    if (isAuthPrompt) {
      setTimeout(() => handleModalClose(), 600);
    }
  };

  const handleTurnOff = async () => {
    setLoading(true);
    markPromptAnswered();
    await disableNotifications();
    setLoading(false);
    if (isAuthPrompt) {
      handleModalClose();
    }
  };

  const handleTestNotification = () => {
    triggerTest2000Reminder();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  };

  return (
    <div className="modal-overlay" onClick={handleModalClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-card notif-settings-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={`notif-icon-circle ${isEnabled ? 'active' : 'inactive'}`}>
              {isEnabled ? <BellRing size={22} color="var(--color-forest)" /> : <BellOff size={22} color="var(--color-muted)" />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark)', fontFamily: 'var(--font-serif)' }}>
                {isAuthPrompt ? 'Pengaturan Notifikasi Harian' : 'Pengaturan Notifikasi'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                {isAuthPrompt ? 'Atur preferensi pengingat otomatis Anda' : 'Kelola notifikasi tantangan & edukasi'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleModalClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: '4px' }}
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Auth prompt greeting */}
        {isAuthPrompt && (
          <div style={{ 
            background: 'rgba(56, 179, 114, 0.15)', 
            border: '1px solid rgba(56, 179, 114, 0.3)', 
            borderRadius: '12px', 
            padding: '12px 14px', 
            marginBottom: '16px',
            fontSize: '0.86rem',
            color: 'var(--color-forest)',
            lineHeight: 1.45
          }}>
            👋 Halo <strong>{currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Sobat NutriWise'}</strong>! Ingin menyalakan notifikasi pengingat harian otomatis?
          </div>
        )}

        {/* Status card */}
        <div style={{ 
          background: isEnabled ? 'rgba(34, 197, 94, 0.12)' : 'var(--color-cream)', 
          border: `1px solid ${isEnabled ? 'rgba(34, 197, 94, 0.35)' : 'var(--color-border)'}`, 
          borderRadius: '14px', 
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className={`notif-status-dot-pulse ${isEnabled ? 'active' : 'inactive'}`} />
              <strong style={{ fontSize: '0.95rem', color: isEnabled ? 'var(--color-forest)' : 'var(--color-dark)' }}>
                {isEnabled ? 'Notifikasi Sedang Aktif' : 'Notifikasi Dinonaktifkan'}
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-muted)' }}>
              {isEnabled 
                ? 'Anda akan menerima pengingat harian jam 20:00 jika target belum lengkap.' 
                : 'Anda tidak akan menerima notifikasi pengingat.'}
            </p>
          </div>

          <button
            onClick={isEnabled ? handleTurnOff : handleTurnOn}
            disabled={loading}
            className={isEnabled ? 'btn-danger-outline' : 'btn-cta-primary'}
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.84rem', 
              borderRadius: '10px', 
              whiteSpace: 'nowrap',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {loading ? 'Memproses...' : isEnabled ? 'Matikan' : 'Nyalakan'}
          </button>
        </div>

        {/* Feature explanation */}
        <div style={{ 
          background: 'var(--color-cream)', 
          border: '1px solid var(--color-border)', 
          borderRadius: '14px', 
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={16} color="var(--color-forest)" />
            <strong style={{ fontSize: '0.88rem', color: 'var(--color-dark)' }}>
              Pengingat Otomatis Jam 20:00
            </strong>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
            Sistem NutriWise akan memeriksa progres 30-Day Challenge Anda setiap hari pukul <strong>20:00</strong>. Jika semua target telah terpenuhi, Anda tidak akan terganggu.
          </p>
          <div style={{ fontSize: '0.76rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Zona Waktu Aktif:</span>
            <code style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-forest)', fontWeight: 600 }}>
              {userTz}
            </code>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '10px', 
            padding: '10px 12px', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#EF4444'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Test feedback */}
        {testSent && (
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.15)', 
            border: '1px solid rgba(34, 197, 94, 0.3)', 
            borderRadius: '10px', 
            padding: '10px 12px', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: 'var(--color-forest)'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>Notifikasi uji coba berhasil dikirim ke perangkat Anda!</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {isEnabled && (
            <button
              onClick={handleTestNotification}
              className="btn-cta-outline"
              style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={15} /> Uji Notifikasi
            </button>
          )}

          <button
            onClick={handleModalClose}
            className="btn-cta-primary"
            style={{ padding: '8px 20px', fontSize: '0.84rem' }}
          >
            {isAuthPrompt ? 'Selesai' : 'Tutup'}
          </button>
        </div>

        {isAuthPrompt && (
          <p style={{ textAlign: 'center', fontSize: '0.74rem', color: 'var(--color-muted)', marginTop: '14px', marginBottom: 0 }}>
            * Anda dapat mengubah pengaturan ini sewaktu-waktu melalui tombol <strong>Notifikasi</strong> di header dashboard.
          </p>
        )}
      </div>
    </div>
  );
}
