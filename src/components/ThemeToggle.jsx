import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle — single icon-only button that toggles Light / Dark mode.
 * Uses a solid, bordered surface so the icon stays visible on any background
 * (transparent hero navbar, scrolled navbar, white dashboard topbar, etc.).
 */
export default function ThemeToggle({ className = '', style = {} }) {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      title={label}
      aria-label={label}
      aria-pressed={isDark}
      style={style}
    >
      <span className="theme-toggle-inner" key={isDark ? 'dark' : 'light'}>
        {isDark ? (
          <Sun size={18} className="theme-icon sun-icon" />
        ) : (
          <Moon size={18} className="theme-icon moon-icon" />
        )}
      </span>
    </button>
  );
}
