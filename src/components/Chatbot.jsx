import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  AlertOctagon,
  Sparkles,
  Info,
  ShieldAlert,
  ChevronRight,
  RotateCcw,
  Bot,
  User,
  HeartHandshake
} from 'lucide-react';
import { useTBShield } from '../context/TBShieldContext';

export default function Chatbot({ currentPage = 'Beranda' }) {
  const {
    reportPatientSafetyAlert,
    currentUser,
    setActiveTab,
    setCurrentView
  } = useTBShield();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'bot',
      category: 'welcome',
      text: 'Halo! Saya Asisten Virtual Edukasi TB-Shield JKN 24 Jam. Ada yang bisa saya bantu seputar pencegahan TBC, Terapi Pencegahan TBC (TPT), gizi pangan lokal, atau pemantauan efek samping obat?',
      time: 'Baru saja'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // 3-Tier Intent Classifier Function
  const classifyIntentAndRespond = (userText) => {
    const text = userText.toLowerCase();

    // 1. KATEGORI 1: TANDA BAHAYA / RED FLAG
    const redFlagKeywords = [
      'kuning', 'ikterus', 'mata kuning', 'kulit kuning', 'muntah terus', 'muntah hebat',
      'kencing gelap', 'kencing teh', 'ruam melepuh', 'gatal hebat', 'sesak berat', 'batuk darah'
    ];
    const isRedFlag = redFlagKeywords.some((kw) => text.includes(kw));

    if (isRedFlag) {
      return {
        category: 'red_flag',
        text: 'PERINGATAN DARURAT MEDIS: Gejala yang Anda sebutkan berpotensi merupakan tanda bahaya atau reaksi efek samping berat (seperti gangguan fungsi hati / ikterus). Jangan menghentikan atau mengganti obat sendiri tanpa arahan dokter. Segera laporkan melalui Patient Safety Alert atau kunjungi IGD Puskesmas terdekat!',
        hasEmergencyAction: true,
        alertType: text.includes('kuning') || text.includes('ikterus') ? 'Mata / Kulit Menguning (Ikterus)' : 'Tanda Bahaya Efek Samping Obat Berat'
      };
    }

    // 2. KATEGORI 2: MITOS VS FAKTA / EDUKASI UMUM
    const mythKeywords = [
      'keturunan', 'alat makan', 'sendok', 'piring', 'bersalaman', 'sentuhan', 'herbal',
      'jamu', 'sembuh', 'bcg', 'merokok', 'diabetes', 'gula', 'gratis', 'biaya', 'anak',
      'rontgen', 'paru', 'mitos', 'fakta'
    ];
    const isMyth = mythKeywords.some((kw) => text.includes(kw));

    if (isMyth) {
      if (text.includes('keturunan')) {
        return {
          category: 'mitos_fakta',
          text: 'MITOS: TBC BUKAN penyakit keturunan. TBC disebabkan oleh bakteri Mycobacterium tuberculosis yang menular lewat udara saat penderita batuk atau berbicara.',
          linkToMyth: true
        };
      }
      if (text.includes('alat makan') || text.includes('sendok') || text.includes('bersalaman')) {
        return {
          category: 'mitos_fakta',
          text: 'MITOS: TBC TIDAK menular lewat alat makan, piring, sendok, atau bersalaman. Bakteri TBC menular melalui droplet udara pernapasan yang terhirup ke paru-paru.',
          linkToMyth: true
        };
      }
      if (text.includes('jamu') || text.includes('herbal')) {
        return {
          category: 'mitos_fakta',
          text: 'MITOS: Jamu atau herbal tidak dapat membunuh kuman TBC. Hanya kombinasi obat anti-TBC (OAT/TPT) medis yang terbukti melenyapkan bakteri TBC.',
          linkToMyth: true
        };
      }
      if (text.includes('gratis') || text.includes('biaya')) {
        return {
          category: 'mitos_fakta',
          text: 'FAKTA: Pemeriksaan dahak TCM, rontgen paru, dan obat TBC/TPT di Puskesmas 100% GRATIS ditanggung oleh program pemerintah dan BPJS Kesehatan!',
          linkToMyth: true
        };
      }

      return {
        category: 'mitos_fakta',
        text: 'Pengetahuan seputar TBC sangat penting untuk memutus rantai penularan dan menghilangkan stigma. Anda dapat membuka 20 modul Mitos vs Fakta interaktif lengkap kami.',
        linkToMyth: true
      };
    }

    // 3. KATEGORI 3: KONSELING TPT & EFEK SAMPING RINGAN / GIZI
    const counselingKeywords = [
      'tpt', '3hp', '1hp', 'efek samping', 'mual', 'urine merah', 'kencing merah',
      'lupa minum', 'minum obat', 'aturan', 'stigma', 'malu', 'kelor', 'ikan kembung', 'gizi'
    ];
    const isCounseling = counselingKeywords.some((kw) => text.includes(kw));

    if (isCounseling) {
      if (text.includes('kencing merah') || text.includes('urine merah')) {
        return {
          category: 'counseling',
          text: 'Air seni (urine) atau air mata berwarna kemerahan/oranye setelah minum obat Rifapentine/Rifampisin adalah EFEK NORMAL dan TIDAK BERBAHAYA. Ini terjadi karena zat warna alami obat yang diekskresikan tubuh. Pengobatan dapat tetap dilanjutkan dengan aman.'
        };
      }
      if (text.includes('mual') || text.includes('perut')) {
        return {
          category: 'counseling',
          text: 'Mual ringan pada awal terapi dapat disiasati dengan meminum obat bersama makanan ringan (seperti biskuit atau pisang) atau diminum sesaat sebelum tidur malam. Bila mual berlanjut hingga muntah hebat, segera hubungi petugas FKTP.'
        };
      }
      if (text.includes('3hp') || text.includes('1hp') || text.includes('tpt')) {
        return {
          category: 'counseling',
          text: 'Terapi Pencegahan Tuberkulosis (TPT) adalah pengobatan preventif untuk membunuh kuman TBC yang masih tidur (laten) di tubuh kontak erat. Regimen modern seperti 3HP hanya diminum 1 kali seminggu selama 12 minggu (total 12 dosis).'
        };
      }
      if (text.includes('kelor') || text.includes('gizi') || text.includes('ikan')) {
        return {
          category: 'counseling',
          text: 'Pangan lokal seperti daun kelor (kaya L-Arginine dan Zinc) serta ikan kembung (kaya Vitamin D3 dan Protein) sangat dianjurkan untuk mendukung sistem imun makrofag dalam menahan kuman TBC.'
        };
      }

      return {
        category: 'counseling',
        text: 'Kepatuhan minum obat pencegahan TPT sangat krusial. Bila Anda mengalami kendala jadwal atau keluhan ringan, konsultasikan dengan petugas FKTP melalui dasbor rujukan.'
      };
    }

    // Default Fallback Response
    return {
      category: 'general',
      text: 'Terima kasih atas pertanyaannya. TB-Shield JKN siap mendampingi Anda mengenai skrining risiko TBC, teletriase akustik batuk, imunonutrisi lokal, dan tiket rujukan ke Puskesmas. Silakan pilih topik di bawah ini atau tanyakan hal spesifik.'
    };
  };

  const handleSendMessage = (textToSend) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim()) return;

    // Add user message
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // AI Classification & Response delay
    setTimeout(() => {
      const responseObj = classifyIntentAndRespond(messageText);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        category: responseObj.category,
        text: responseObj.text,
        hasEmergencyAction: responseObj.hasEmergencyAction,
        alertType: responseObj.alertType,
        linkToMyth: responseObj.linkToMyth,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickChip = (chipText) => {
    handleSendMessage(chipText);
  };

  const triggerEmergencyFromBot = (alertType) => {
    reportPatientSafetyAlert({
      type: alertType || 'Mata / Kulit Menguning (Ikterus)',
      notes: 'Dipicu melalui konsultasi interaktif Chatbot AI Tanda Bahaya.'
    });
  };

  return (
    <>
      {/* Floating Chatbot Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
            color: '#FFFFFF',
            border: '2px solid #E0C58F',
            boxShadow: '0 8px 30px rgba(17, 34, 80, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 9999,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          title="Tanya Asisten AI TB-Shield 24 Jam"
        >
          <MessageCircle size={28} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '14px',
            height: '14px',
            background: '#10B981',
            borderRadius: '50%',
            border: '2px solid #FFFFFF'
          }} />
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: 'min(92vw, 400px)',
          height: 'min(80vh, 580px)',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #D9CBC2',
          boxShadow: '0 20px 60px rgba(17, 34, 80, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden',
          animation: 'slideInToast 0.3s ease'
        }}>
          {/* Chat Window Header */}
          <div style={{
            background: 'linear-gradient(135deg, #112250 0%, #3C507D 100%)',
            color: '#FFFFFF',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #E0C58F'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#E0C58F',
                color: '#112250',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                <Bot size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  TB-Shield AI Assistant
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>
                  Edukasi &amp; Patient Safety Alert 24 Jam
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Viewport */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#F8FAFC'
          }}>
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%'
                  }}
                >
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    background: isBot
                      ? (m.hasEmergencyAction ? '#FEF2F2' : '#FFFFFF')
                      : '#112250',
                    color: isBot ? '#112250' : '#FFFFFF',
                    border: isBot ? (m.hasEmergencyAction ? '2px solid #EF4444' : '1px solid #D9CBC2') : 'none',
                    fontSize: '0.86rem',
                    lineHeight: 1.5,
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {m.text}

                    {/* Trigger Red Emergency Action Button */}
                    {m.hasEmergencyAction && (
                      <div style={{ marginTop: '12px' }}>
                        <button
                          onClick={() => triggerEmergencyFromBot(m.alertType)}
                          style={{
                            width: '100%',
                            background: '#DC2626',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <AlertOctagon size={16} /> Buka Layar Peringatan Merah &amp; Notifikasi Puskesmas
                        </button>
                      </div>
                    )}

                    {/* Link to Mitos vs Fakta Module */}
                    {m.linkToMyth && (
                      <div style={{ marginTop: '10px' }}>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            setActiveTab('mitos');
                            window.location.hash = '#mitos';
                          }}
                          style={{
                            background: 'rgba(60, 80, 125, 0.12)',
                            color: 'var(--color-primary)',
                            border: '1px solid var(--color-primary)',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Sparkles size={14} /> Buka Modul Mitos vs Fakta
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontSize: '0.68rem',
                    color: 'var(--color-muted)',
                    marginTop: '3px',
                    textAlign: isBot ? 'left' : 'right',
                    padding: '0 4px'
                  }}>
                    {m.time}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: '#FFFFFF', border: '1px solid #D9CBC2', padding: '8px 14px', borderRadius: '14px', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                Asisten sedang mengetik...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div style={{
            padding: '8px 12px',
            background: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {[
              'Apa tanda bahaya obat TPT?',
              'Apakah TBC penyakit keturunan?',
              'Air kencing merah setelah minum obat?',
              'Resep daun kelor untuk TBC?'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChip(chip)}
                style={{
                  background: '#F5F0E9',
                  border: '1px solid #D9CBC2',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--color-navy)',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div style={{ padding: '12px 14px', background: '#FFFFFF', borderTop: '1px solid #D9CBC2' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ display: 'flex', gap: '8px' }}
            >
              <input
                type="text"
                placeholder="Tanya seputar TBC, TPT, gizi, tanda bahaya..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: '50px',
                  border: '1px solid #D9CBC2',
                  fontSize: '0.86rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--color-navy)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Send size={16} />
              </button>
            </form>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', textAlign: 'center', marginTop: '6px' }}>
              *Edukasi AI bukan saran diagnosis dokter &amp; tidak meresepkan obat.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
