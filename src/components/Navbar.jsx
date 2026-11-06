import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  User,
  LogOut,
  Building2,
  Menu,
  X,
  Lock,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';

export default function Navbar({ onOpenPrivacy, onOpenPatientSafety, onOpenAuth }) {
  const {
    currentUser,
    logout,
    currentView,
    setCurrentView,
    setAuthRole,
    setAuthMode
  } = useTBShield();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navbarRef = useRef(null);
  const innerRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 80, left: 24, width: 'calc(100% - 48px)' });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateMenuPosition = () => {
    if (innerRef.current) {
      const innerRect = innerRef.current.getBoundingClientRect();
      const wrapperRect = navbarRef.current?.getBoundingClientRect();
      const top = scrolled
        ? (wrapperRect ? wrapperRect.bottom + 8 : innerRect.bottom + 8)
        : innerRect.bottom + 8;

      setMenuPosition({
        top: Math.round(top),
        left: Math.round(innerRect.left),
        width: Math.round(innerRect.width)
      });
    }
  };

  const handleToggleMenu = () => {
    if (!mobileMenuOpen) {
      updateMenuPosition();
    }
    setMobileMenuOpen(prev => !prev);
  };

  // Lock page scrolling when menu is open and handle resize/Escape
  useEffect(() => {
    if (mobileMenuOpen) {
      updateMenuPosition();

      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleResize = () => updateMenuPosition();
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen, scrolled]);

  const handleOpenAuthModal = (role = 'user', mode = 'login') => {
    setAuthRole(role);
    setAuthMode(mode);
    if (onOpenAuth) {
      onOpenAuth();
    }
    setMobileMenuOpen(false);
  };

  const handleNavScroll = (elementId) => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 34, 80, 0.25)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            zIndex: 998
          }}
          aria-hidden="true"
        />
      )}

      <nav
        ref={navbarRef}
        className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}
        style={{
          background: scrolled ? 'rgba(245, 240, 233, 0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid #D9CBC2' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(17, 34, 80, 0.06)' : 'none',
          padding: scrolled ? '12px 24px' : '16px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div
          ref={innerRef}
          className="navbar-inner"
          style={{
            background: scrolled ? 'transparent' : 'rgba(255, 255, 255, 0.88)',
            backdropFilter: scrolled ? 'none' : 'blur(12px)',
            WebkitBackdropFilter: scrolled ? 'none' : 'blur(12px)',
            border: scrolled ? 'none' : '1px solid #D9CBC2',
            boxShadow: scrolled ? 'none' : '0 8px 30px rgba(17, 34, 80, 0.08)',
            borderRadius: scrolled ? 0 : '60px',
            padding: scrolled ? 0 : '10px 24px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Brand Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="navbar-logo"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #E0C58F',
              color: '#E0C58F',
              fontWeight: 800,
              fontSize: '1.15rem',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{
                fontWeight: 800,
                fontSize: '1.22rem',
                color: 'var(--color-navy)',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.05,
                margin: 0,
                padding: 0
              }}>
                TB-Shield <span style={{ color: 'var(--color-primary)' }}>JKN</span>
              </span>
              <span style={{
                fontSize: '0.64rem',
                color: 'var(--color-muted)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'block',
                lineHeight: 1,
                marginTop: '1px',
                padding: 0
              }}>
                Pencegahan Kontak Erat TBC
              </span>
            </div>
          </a>

        {/* Desktop Navigation Links */}
        <ul className="navbar-menu" style={{ display: 'none', gap: '22px' }}>
          <li>
            <a href="#inovasi" onClick={() => handleNavScroll('inovasi')} style={{ color: 'var(--color-navy)', fontSize: '0.88rem' }}>
              4 Pilar Inovasi
            </a>
          </li>
          <li>
            <a href="#skrining" onClick={() => handleNavScroll('skrining')} style={{ color: 'var(--color-navy)', fontSize: '0.88rem' }}>
              Skrining Risiko
            </a>
          </li>
          <li>
            <a href="#adherence" onClick={() => handleNavScroll('adherence')} style={{ color: 'var(--color-navy)', fontSize: '0.88rem' }}>
              Kepatuhan TPT
            </a>
          </li>
          <li>
            <a href="#gizi" onClick={() => handleNavScroll('gizi')} style={{ color: 'var(--color-navy)', fontSize: '0.88rem' }}>
              Imunonutrisi &amp; IMT
            </a>
          </li>
          <li>
            <a href="#mitos-fakta" onClick={() => handleNavScroll('mitos-fakta')} style={{ color: 'var(--color-navy)', fontSize: '0.88rem' }}>
              Mitos vs Fakta
            </a>
          </li>
          <li>
            <a href="#tiket" onClick={() => handleNavScroll('tiket')} style={{ color: 'var(--color-navy)', fontSize: '0.88rem' }}>
              Tiket Rujukan
            </a>
          </li>
        </ul>

        {/* Right Actions Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Patient Safety Quick Alert Button */}
          <button
            onClick={onOpenPatientSafety}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#DC2626',
              padding: '6px 12px',
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Lapor tanda bahaya efek samping obat"
          >
            <ShieldAlert size={15} />
            <span style={{ display: 'none' }} className="d-sm-inline">Lapor Efek Samping</span>
          </button>

          {/* Privacy Modal Button */}
          <button
            onClick={onOpenPrivacy}
            className="btn-nav-privacy"
            style={{
              color: 'var(--color-navy)',
              fontSize: '0.82rem',
              padding: '6px 10px',
              borderRadius: '8px',
              display: 'none'
            }}
            title="Kebijakan Privasi UU PDP No. 27/2022"
          >
            <Lock size={15} color="var(--color-primary)" />
            <span>UU PDP</span>
          </button>

          {/* User Auth / Profile Status */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  window.location.hash = '#dashboard';
                }}
                className="nav-btn-dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-navy)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '7px 16px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Buka Dasbor {currentUser.role === 'staff' ? 'Petugas' : 'Saya'} &rarr;
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#FFFFFF',
                    border: '1.5px solid var(--color-primary)',
                    borderRadius: '50px',
                    padding: '4px 10px 4px 4px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--color-navy)'
                  }}
                  title="Menu Profil"
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: currentUser.role === 'staff' ? '#112250' : 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 800
                  }}>
                    {currentUser.role === 'staff' ? 'P' : currentUser.nama?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown size={14} color="var(--color-muted)" />
                </button>

                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '230px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #D9CBC2',
                    boxShadow: '0 12px 36px rgba(17, 34, 80, 0.15)',
                    padding: '8px',
                    zIndex: 1000
                  }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--color-navy)' }}>
                        {currentUser.nama}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-muted)' }}>
                        {currentUser.role === 'staff' ? currentUser.fk : `Peserta JKN (NIK: ${currentUser.nik?.slice(0, 4)}••••)`}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setCurrentView('dashboard');
                        window.location.hash = '#dashboard';
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'var(--color-navy)',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                    >
                      Buka Dasbor {currentUser.role === 'staff' ? 'Petugas' : 'Saya'}
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenPrivacy();
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                    >
                      Kebijakan Privasi UU PDP
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#DC2626',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        borderTop: '1px solid #F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <LogOut size={14} /> Keluar Akun
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="nav-auth-login" style={{ gap: '8px' }}>
              <button
                onClick={() => handleOpenAuthModal('user', 'login')}
                className="btn-nav-auth"
                style={{
                  background: 'var(--color-navy)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '8px 18px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Masuk / Daftar
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={handleToggleMenu}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-navy)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            className="mobile-menu-btn"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: typeof menuPosition.top === 'number' ? `${menuPosition.top}px` : menuPosition.top,
            left: typeof menuPosition.left === 'number' ? `${menuPosition.left}px` : menuPosition.left,
            width: typeof menuPosition.width === 'number' ? `${menuPosition.width}px` : menuPosition.width,
            maxWidth: '1240px',
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #D9CBC2',
            boxShadow: '0 20px 50px rgba(17, 34, 80, 0.2)',
            padding: '24px',
            zIndex: 999,
            maxHeight: typeof menuPosition.top === 'number'
              ? `calc(100vh - ${menuPosition.top + 24}px)`
              : 'calc(100vh - 120px)',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <a
              href="#inovasi"
              onClick={() => handleNavScroll('inovasi')}
              style={{ textDecoration: 'none', color: 'var(--color-navy)', fontWeight: 700, fontSize: '0.92rem' }}
            >
              4 Pilar Inovasi
            </a>
            <a
              href="#skrining"
              onClick={() => handleNavScroll('skrining')}
              style={{ textDecoration: 'none', color: 'var(--color-navy)', fontWeight: 700, fontSize: '0.92rem' }}
            >
              Skrining Mandiri &amp; Batuk AI
            </a>
            <a
              href="#adherence"
              onClick={() => handleNavScroll('adherence')}
              style={{ textDecoration: 'none', color: 'var(--color-navy)', fontWeight: 700, fontSize: '0.92rem' }}
            >
              Skrining Kepatuhan TPT
            </a>
            <a
              href="#gizi"
              onClick={() => handleNavScroll('gizi')}
              style={{ textDecoration: 'none', color: 'var(--color-navy)', fontWeight: 700, fontSize: '0.92rem' }}
            >
              Imunonutrisi &amp; Pelacak IMT
            </a>
            <a
              href="#mitos-fakta"
              onClick={() => handleNavScroll('mitos-fakta')}
              style={{ textDecoration: 'none', color: 'var(--color-navy)', fontWeight: 700, fontSize: '0.92rem' }}
            >
              20 Mitos vs Fakta
            </a>
            <a
              href="#rumah"
              onClick={() => handleNavScroll('rumah')}
              style={{ textDecoration: 'none', color: 'var(--color-navy)', fontWeight: 700, fontSize: '0.92rem' }}
            >
              Sanitasi Rumah &amp; Ventilasi
            </a>
            <a
              href="#tiket"
              onClick={() => handleNavScroll('tiket')}
              style={{ textDecoration: 'none', color: 'var(--color-navy)', fontWeight: 700, fontSize: '0.92rem' }}
            >
              Tiket Rujukan Digital
            </a>

            <div style={{ paddingTop: '14px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {!currentUser && (
                <button
                  onClick={() => handleOpenAuthModal('user', 'login')}
                  style={{
                    background: 'var(--color-navy)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}
                >
                  <User size={16} /> Masuk / Daftar Akun
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPrivacy();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  color: 'var(--color-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Kebijakan Privasi (UU PDP No. 27/2022)
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthRole('staff');
                  setCurrentView('dashboard');
                }}
                style={{
                  background: '#F0F4FC',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Portal Petugas Puskesmas / FKTP &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  </>
);
}
