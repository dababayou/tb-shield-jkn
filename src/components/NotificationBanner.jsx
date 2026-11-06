import React, { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing, X, CheckCircle2, AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { getUserTimezone } from '../lib/pushNotifications';

/**
 * Notification permission banner & toggle button.
 * Includes automated 20:00 challenge reminder status and test trigger.
 */
export default function NotificationBanner({ pushState, currentUser }) {
  const { permissionState, isRegistered, isSupported, error, startBeams, triggerTest2000Reminder } = pushState;
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [justEnabled, setJustEnabled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const userTz = getUserTimezone(currentUser);

  useEffect(() => {
    if (!isSupported || isRegistered || dismissed) return;
    if (permissionState === 'granted' || permissionState === 'denied') return;

    const wasDismissed = localStorage.getItem('NutriWise_notif_dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isSupported, isRegistered, permissionState, dismissed]);

  const handleEnable = async () => {
    await startBeams();
    setShowBanner(false);
    setJustEnabled(true);
    setTimeout(() => setJustEnabled(false), 3000);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('NutriWise_notif_dismissed', 'true');
  };

  const handleBellClick = async () => {
    if (isRegistered || permissionState === 'granted') {
      setShowMenu(!showMenu);
      return;
    }
    if (permissionState === 'denied') {
      alert('Notifikasi diblokir oleh browser Anda. Silakan aktifkan dari pengaturan browser (ikon gembok di address bar).');
      return;
    }
    await startBeams();
    setJustEnabled(true);
    setTimeout(() => setJustEnabled(false), 3000);
  };

  if (!isSupported) return null;

  return (
    <>
      {/* Floating notification bell button */}
      <button
        className="notif-bell-btn"
        onClick={handleBellClick}
        title={isRegistered ? 'Pengaturan Notifikasi' : 'Aktifkan notifikasi'}
        aria-label={isRegistered ? 'Pengaturan Notifikasi' : 'Aktifkan notifikasi'}
      >
        {isRegistered ? (
          <Bell size={20} className="notif-bell-icon active" />
        ) : permissionState === 'denied' ? (
          <BellOff size={20} className="notif-bell-icon denied" />
        ) : (
          <BellRing size={20} className="notif-bell-icon" />
        )}
        {!isRegistered && permissionState !== 'denied' && (
          <span className="notif-bell-dot" />
        )}
      </button>

      {/* Popover Menu for Active Notification Status */}
      {showMenu && (
        <div className="notif-popover-menu" onClick={(e) => e.stopPropagation()}>
          <div className="notif-popover-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#245A3B" />
              <strong>Notifikasi Otomatis</strong>
            </div>
            <button className="notif-popover-close" onClick={() => setShowMenu(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="notif-popover-body">
            <div className="notif-status-badge">
              <span className="status-indicator active" /> Notifikasi Berhasil Aktif
            </div>

            <div className="notif-info-box">
              <div className="info-title">⏰ Pengingat Tantangan Harian (20:00)</div>
              <p className="info-desc">
                Sistem akan secara otomatis mengirimkan notifikasi pada pukul <strong>20:00</strong> setiap hari jika Anda belum menyelesaikan target tantangan harian.
              </p>
              <div className="info-tz">
                Zona Waktu Anda: <code>{userTz}</code>
              </div>
            </div>

            <button 
              className="btn-test-notif"
              onClick={() => {
                triggerTest2000Reminder();
                setShowMenu(false);
              }}
            >
              <Sparkles size={16} /> Uji Notifikasi Jam 20:00 Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Success toast */}
      {justEnabled && (
        <div className="notif-toast success">
          <CheckCircle2 size={18} />
          <span>Notifikasi berhasil diaktifkan! Pengingat otomatis pukul 20:00 aktif.</span>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="notif-toast error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Permission prompt banner */}
      {showBanner && (
        <div className="notif-banner">
          <div className="notif-banner-content">
            <div className="notif-banner-icon">
              <BellRing size={22} color="#fff" />
            </div>
            <div className="notif-banner-text">
              <strong>Aktifkan Notifikasi Harian 20:00</strong>
              <p>Dapatkan pengingat otomatis setiap pukul 20:00 (sesuai zona waktu Anda) jika tantangan harian belum selesai.</p>
            </div>
            <div className="notif-banner-actions">
              <button className="notif-banner-enable" onClick={handleEnable}>
                Aktifkan
              </button>
              <button className="notif-banner-dismiss" onClick={handleDismiss}>
                Nanti saja
              </button>
            </div>
            <button className="notif-banner-close" onClick={handleDismiss} aria-label="Tutup">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
