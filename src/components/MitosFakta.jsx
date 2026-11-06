import React, { useState, useMemo } from 'react';
import { RotateCw, Sparkles, CheckCircle2, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { MYTHS_AND_FACTS } from '../lib/constants';

const ITEMS_PER_PAGE = 6;

export default function MitosFakta({ isDashboard = false }) {
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['Semua', 'Penularan', 'Pengobatan', 'Pencegahan', 'Komorbiditas', 'Sanitasi', 'Diagnosis', 'Kepatuhan'];

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredData = useMemo(() => {
    return MYTHS_AND_FACTS.filter((item) => {
      const matchesCategory = selectedCategory === 'Semua' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch = item.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.explanation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = filteredData.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const flippedCount = Object.values(flippedCards).filter(Boolean).length;
  const allFlipped = flippedCount === MYTHS_AND_FACTS.length;

  const handleToggleAll = () => {
    if (allFlipped) {
      setFlippedCards({});
    } else {
      const next = {};
      MYTHS_AND_FACTS.forEach((item) => {
        next[item.id] = true;
      });
      setFlippedCards(next);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <section
      id="mitos-fakta"
      className="container"
      style={{
        padding: isDashboard ? '20px 24px 60px' : '60px 24px 80px',
        overflow: 'visible'
      }}
    >
      {/* Title & Description */}
      {!isDashboard && (
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge-tb-jkn">Literasi Bebas Stigma</span>
            <span className="badge-demo-tag">20 Modul Edukasi Medis</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0 10px' }}>
            Mitos vs Fakta Seputar TBC &amp; TPT
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.98rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Hapus stigma keliru, ketakutan efek samping, dan salah persepsi seputar tuberkulosis. Klik setiap kartu 3D untuk membalik dan melihat fakta ilmiah berbasis bukti medis.
          </p>
        </div>
      )}

      {/* Toolbar: Category Chips, Search Bar & Counter */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #D9CBC2',
        borderRadius: '18px',
        padding: '16px 20px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '14px'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={18} color="var(--color-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari mitos (contoh: keturunan, alat makan, jamu, anak)..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '9px 12px 9px 38px',
                borderRadius: '50px',
                border: '1px solid #D9CBC2',
                fontSize: '0.88rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Counter & Toggle All */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-navy)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#E0C58F" />
              Terbuka: <strong>{flippedCount} / {MYTHS_AND_FACTS.length}</strong> Fakta
            </span>
            <button
              onClick={handleToggleAll}
              className="btn-cta-outline"
              style={{ padding: '6px 14px', fontSize: '0.82rem', height: '36px' }}
            >
              <RotateCw size={14} style={{ marginRight: '6px' }} />
              {allFlipped ? 'Tutup Semua' : 'Buka Semua Kartu'}
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '5px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: selectedCategory === cat ? 'var(--color-navy)' : '#F5F0E9',
                color: selectedCategory === cat ? '#FFFFFF' : '#112250',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Flip Card Grid */}
      <div className="nw-myth-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {paginatedData.map((item) => {
          const isFlipped = !!flippedCards[item.id];
          const isMyth = item.type === 'MITOS';

          return (
            <div
              key={item.id}
              onClick={() => toggleFlip(item.id)}
              style={{
                perspective: '1000px',
                height: '340px',
                minHeight: '340px',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  textAlign: 'left',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'none'
                }}
              >
                {/* FRONT SIDE (Statement) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1.5px solid #D9CBC2',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    boxSizing: 'border-box',
                    overflowY: 'auto'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '6px',
                        background: '#F5F0E9',
                        color: 'var(--color-navy)',
                        textTransform: 'uppercase'
                      }}>
                        {item.category} • #{item.id}
                      </span>
                      <RotateCw size={15} color="var(--color-muted)" />
                    </div>

                    <h4 style={{
                      margin: '10px 0 0',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: 'var(--color-navy)',
                      lineHeight: 1.5
                    }}>
                      "{item.statement}"
                    </h4>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    marginTop: '16px',
                    borderTop: '1px solid #F5F0E9'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      Klik untuk balik kartu
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '4px',
                      background: 'rgba(60, 80, 125, 0.1)',
                      color: 'var(--color-primary)'
                    }}>
                      Mitos atau Fakta?
                    </span>
                  </div>
                </div>

                {/* BACK SIDE (Fact & Medical Explanation) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: isMyth ? '#FEF2F2' : '#F0FDF4',
                    border: `2px solid ${isMyth ? '#EF4444' : '#10B981'}`,
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-md)',
                    boxSizing: 'border-box',
                    overflowY: 'auto'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: isMyth ? '#DC2626' : '#059669',
                        color: '#FFFFFF'
                      }}>
                        {isMyth ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                        {item.type}
                      </span>
                      <RotateCw size={15} color={isMyth ? '#991B1B' : '#065F46'} />
                    </div>

                    <p style={{
                      margin: '10px 0 0',
                      fontSize: '0.88rem',
                      color: isMyth ? '#7F1D1D' : '#064E3B',
                      lineHeight: 1.6
                    }}>
                      {item.explanation}
                    </p>
                  </div>

                  <div style={{
                    paddingTop: '12px',
                    marginTop: '12px',
                    borderTop: `1px solid ${isMyth ? '#FCA5A5' : '#A7F3D0'}`,
                    fontSize: '0.74rem',
                    color: isMyth ? '#991B1B' : '#065F46',
                    fontWeight: 700
                  }}>
                    *Verifikasi edukatif sesuai pedoman penanggulangan TBC Kemenkes.
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {filteredData.length > 0 && totalPages > 1 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginTop: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '50px',
                border: '1.5px solid #D9CBC2',
                background: safePage === 1 ? '#F1F5F9' : '#FFFFFF',
                color: safePage === 1 ? '#94A3B8' : 'var(--color-navy)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: safePage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: safePage === 1 ? 'none' : 'var(--shadow-sm)'
              }}
            >
              <ChevronLeft size={16} /> Sebelumnya
            </button>

            {/* Page Number Pills */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: 'none',
                    background: safePage === pageNum ? 'var(--color-navy)' : '#FFFFFF',
                    color: safePage === pageNum ? '#FFFFFF' : 'var(--color-navy)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '50px',
                border: '1.5px solid #D9CBC2',
                background: safePage === totalPages ? '#F1F5F9' : '#FFFFFF',
                color: safePage === totalPages ? '#94A3B8' : 'var(--color-navy)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: safePage === totalPages ? 'none' : 'var(--shadow-sm)'
              }}
            >
              Berikutnya <ChevronRight size={16} />
            </button>
          </div>

          <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontWeight: 600 }}>
            Menampilkan {paginatedData.length} dari {filteredData.length} Mitos &amp; Fakta (Halaman {safePage} dari {totalPages})
          </span>
        </div>
      )}

      {filteredData.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
          Tidak ada mitos atau fakta yang cocok dengan kata kunci pencarian Anda.
        </div>
      )}
    </section>
  );
}
