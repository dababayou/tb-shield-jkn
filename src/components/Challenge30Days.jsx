import React, { useState, useEffect, useRef } from 'react';
import { Check, Flame, Trophy, Calendar, Cloud, Lock, X, Plus, Settings, AlertCircle, Clock, Moon, Droplets, Footprints, Salad, Ban, Edit3, Trash2, ArrowRight, Activity, Heart, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const initialDefaultTargets = [
  { id: 'water', text: 'Minum minimal 2-3 liter air putih', type: 'quantitative', unit: 'Liter', targetVal: 2.5, minGood: 2.0, maxGood: 4.5, icon: 'Droplets', isMandatory: true, frequency: 'daily' },
  { id: 'walk', text: 'Jalan kaki atau aktif bergerak 30 menit', type: 'quantitative', unit: 'Menit', targetVal: 30, minGood: 30, maxGood: 180, icon: 'Footprints', isMandatory: true, frequency: 'daily' },
  { id: 'veggies', text: 'Konsumsi 2 porsi sayur & buah segar', type: 'quantitative', unit: 'Porsi', targetVal: 2, minGood: 2, maxGood: 8, icon: 'Salad', isMandatory: true, frequency: 'daily' },
  { id: 'sleep', text: 'Tidur berkualitas 7-8 jam per malam', type: 'quantitative', unit: 'Jam', targetVal: 7.5, minGood: 7, maxGood: 9, icon: 'Moon', isMandatory: true, frequency: 'daily' },
  { id: 'nosugar', text: 'Hindari minuman manis berlebih', type: 'boolean', targetVal: 1, icon: 'Ban', isMandatory: true, frequency: 'daily' }
];

// --- Timezone Helpers ---
const TZ_LIST = [
  { label: 'UTC−12:00', iana: 'Etc/GMT+12', offset: -12 },
  { label: 'UTC−11:00', iana: 'Pacific/Midway', offset: -11 },
  { label: 'UTC−10:00', iana: 'Pacific/Honolulu', offset: -10 },
  { label: 'UTC−09:00', iana: 'America/Anchorage', offset: -9 },
  { label: 'UTC−08:00', iana: 'America/Los_Angeles', offset: -8 },
  { label: 'UTC−07:00', iana: 'America/Denver', offset: -7 },
  { label: 'UTC−06:00', iana: 'America/Chicago', offset: -6 },
  { label: 'UTC−05:00', iana: 'America/New_York', offset: -5 },
  { label: 'UTC−04:00', iana: 'America/Halifax', offset: -4 },
  { label: 'UTC−03:00', iana: 'America/Sao_Paulo', offset: -3 },
  { label: 'UTC−02:00', iana: 'Etc/GMT+2', offset: -2 },
  { label: 'UTC−01:00', iana: 'Atlantic/Azores', offset: -1 },
  { label: 'UTC+00:00', iana: 'UTC', offset: 0 },
  { label: 'UTC+01:00', iana: 'Europe/London', offset: 1 },
  { label: 'UTC+02:00', iana: 'Europe/Paris', offset: 2 },
  { label: 'UTC+03:00', iana: 'Europe/Moscow', offset: 3 },
  { label: 'UTC+04:00', iana: 'Asia/Dubai', offset: 4 },
  { label: 'UTC+05:00', iana: 'Asia/Karachi', offset: 5 },
  { label: 'UTC+05:30', iana: 'Asia/Kolkata', offset: 5.5 },
  { label: 'UTC+06:00', iana: 'Asia/Dhaka', offset: 6 },
  { label: 'UTC+07:00 (WIB)', iana: 'Asia/Jakarta', offset: 7 },
  { label: 'UTC+08:00 (WITA)', iana: 'Asia/Makassar', offset: 8 },
  { label: 'UTC+08:00', iana: 'Asia/Singapore', offset: 8 },
  { label: 'UTC+09:00 (WIT)', iana: 'Asia/Jayapura', offset: 9 },
  { label: 'UTC+09:00', iana: 'Asia/Tokyo', offset: 9 },
  { label: 'UTC+10:00', iana: 'Australia/Sydney', offset: 10 },
  { label: 'UTC+11:00', iana: 'Pacific/Noumea', offset: 11 },
  { label: 'UTC+12:00', iana: 'Pacific/Auckland', offset: 12 },
  { label: 'UTC+13:00', iana: 'Pacific/Apia', offset: 13 },
  { label: 'UTC+14:00', iana: 'Pacific/Kiritimati', offset: 14 },
];

function getDeviceTzIana() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta';
  } catch { return 'Asia/Jakarta'; }
}

function ianaToTzEntry(ianaStr) {
  // Try exact match first
  const exact = TZ_LIST.find(t => t.iana === ianaStr);
  if (exact) return exact;
  // Fallback: match by offset
  try {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const localMs = new Date(now.toLocaleString('en-US', { timeZone: ianaStr })).getTime();
    const offsetHours = (localMs - new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()) / 3600000;
    const byOffset = TZ_LIST.find(t => t.offset === offsetHours);
    if (byOffset) return byOffset;
  } catch {}
  return TZ_LIST.find(t => t.iana === 'Asia/Jakarta');
}

// Normalize legacy TZ string format to IANA
function normalizeTzToIana(tz) {
  if (!tz) return 'Asia/Jakarta';
  if (tz.includes('WIB') || tz.includes('Jakarta')) return 'Asia/Jakarta';
  if (tz.includes('WITA') || tz.includes('Makassar')) return 'Asia/Makassar';
  if (tz.includes('WIT') || tz.includes('Jayapura')) return 'Asia/Jayapura';
  // Check if it's already an IANA string
  if (TZ_LIST.find(t => t.iana === tz)) return tz;
  return 'Asia/Jakarta';
}

export default function Challenge30Days({ currentUser, onOpenAuth }) {
  const [setupDone, setSetupDone] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [timezone, setTimezone] = useState('Asia/Jakarta');
  const [targets, setTargets] = useState(initialDefaultTargets);
  const [initialTz, setInitialTz] = useState('Asia/Jakarta');
  const [initialTargets, setInitialTargets] = useState(initialDefaultTargets);
  const [historyData, setHistoryData] = useState({}); // { '1': { water: 2.5, walk: 30, ... }, '2': ... }
  const [currentDayNum, setCurrentDayNum] = useState(1);
  const [startDate, setStartDate] = useState(() => new Date().toISOString());
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [recommendedTargets, setRecommendedTargets] = useState([]);
  const syncTimeoutRef = useRef(null);

  // Timezone Drum Picker State
  const [autoSyncTz, setAutoSyncTz] = useState(false);
  const [drumIndex, setDrumIndex] = useState(() => TZ_LIST.findIndex(t => t.iana === 'Asia/Jakarta'));
  const drumRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartIndexRef = useRef(0);

  // New Custom Target Form State
  const [newTargetText, setNewTargetText] = useState('');
  const [newTargetType, setNewTargetType] = useState('quantitative'); // 'quantitative' | 'boolean'
  const [newTargetUnit, setNewTargetUnit] = useState('Kali');
  const [newTargetVal, setNewTargetVal] = useState(1);
  const [newTargetFreq, setNewTargetFreq] = useState('daily'); // 'daily' | 'every_2_days' | 'every_3_days' | 'weekly'
  const [showAddForm, setShowAddForm] = useState(false);

  // Sync refs to avoid stale closures in debounced & unmount cloud persistence
  const historyRef = useRef(historyData);
  const targetsRef = useRef(targets);
  const setupDoneRef = useRef(setupDone);
  const timezoneRef = useRef(timezone);
  const startDateRef = useRef(startDate);

  useEffect(() => { historyRef.current = historyData; }, [historyData]);
  useEffect(() => { targetsRef.current = targets; }, [targets]);
  useEffect(() => { setupDoneRef.current = setupDone; }, [setupDone]);
  useEffect(() => { timezoneRef.current = timezone; }, [timezone]);
  useEffect(() => { startDateRef.current = startDate; }, [startDate]);

  // Helper to generate user-scoped localStorage keys
  const getStorageKey = (baseKey) => {
    return currentUser?.id ? `NutriWise_${baseKey}_${currentUser.id}` : `NutriWise_${baseKey}`;
  };

  // Load from Supabase / localStorage on mount & currentUser change
  useEffect(() => {
    if (currentUser) {
      const meta = currentUser.user_metadata || {};
      const uid = currentUser.id;
      const historyKey = `NutriWise_history_${uid}`;
      const targetsKey = `NutriWise_targets_${uid}`;
      const setupKey = `NutriWise_setup_done_${uid}`;
      const tzKey = `NutriWise_tz_${uid}`;
      const startKey = `NutriWise_start_date_${uid}`;

      let localHistory = {};
      try {
        const localHistoryStr = (localStorage.getItem(historyKey) );
        if (localHistoryStr) localHistory = JSON.parse(localHistoryStr);
      } catch (e) {
        console.error('Error parsing local history:', e);
      }

      let localTargets = null;
      try {
        const localTargetsStr = (localStorage.getItem(targetsKey) );
        if (localTargetsStr) localTargets = JSON.parse(localTargetsStr);
      } catch (e) {
        console.error('Error parsing local targets:', e);
      }
      
      const cloudTargets = meta.NutriWise_targets ;
      const savedTargets = cloudTargets || localTargets;

      const cloudHistory = meta.NutriWise_history  || {};
      const mergedHistory = {
        ...cloudHistory,
        ...localHistory
      };

      const hasLocalSetup = localStorage.getItem(setupKey) !== null;
      const savedSetupDone = meta.NutriWise_setup_done ?? (hasLocalSetup ? JSON.parse(localStorage.getItem(setupKey)) : false);

      // Normalize legacy TZ strings to IANA format
      const rawTz = meta.NutriWise_tz || localStorage.getItem(tzKey) || '';
      const savedTz = rawTz ? normalizeTzToIana(rawTz) : 'Asia/Jakarta';
      const savedStartDate = meta.NutriWise_start_date || localStorage.getItem(startKey) || new Date().toISOString();

      // Ensure user-scoped local storage is in sync with merged data
      localStorage.setItem(historyKey, JSON.stringify(mergedHistory));
      localStorage.setItem(setupKey, JSON.stringify(savedSetupDone));
      localStorage.setItem(tzKey, savedTz);
      localStorage.setItem(startKey, savedStartDate);

      if (savedTargets) {
        setTargets(savedTargets);
        setInitialTargets(savedTargets);
        localStorage.setItem(targetsKey, JSON.stringify(savedTargets));
      } else {
        setTargets(initialDefaultTargets);
        setInitialTargets(initialDefaultTargets);
      }

      setHistoryData(mergedHistory);
      setSetupDone(savedSetupDone);
      setTimezone(savedTz);
      setInitialTz(savedTz);
      setStartDate(savedStartDate);

      // Sync drum index to loaded TZ
      const tzEntry = ianaToTzEntry(savedTz);
      const idx = TZ_LIST.findIndex(t => t.iana === (tzEntry?.iana || 'Asia/Jakarta'));
      setDrumIndex(idx >= 0 ? idx : TZ_LIST.findIndex(t => t.iana === 'Asia/Jakarta'));
    } else {
      setSetupDone(false);
      setHistoryData({});
      setTargets(initialDefaultTargets);
      setInitialTargets(initialDefaultTargets);
      setInitialTz('Asia/Jakarta');
    }
  }, [currentUser]);

  const loadRecommendedTargets = () => {
    let meta = currentUser?.user_metadata || {};
    let uid = currentUser?.id;
    const quizKey = uid ? `NutriWise_quiz_result_${uid}` : 'NutriWise_quiz_result';
    
    let localQuiz = null;
    try {
      const str = localStorage.getItem(quizKey) ;
      if (str) localQuiz = JSON.parse(str);
    } catch(e){}

    const savedQuiz = meta.NutriWise_quiz_result  || localQuiz;
    if (savedQuiz && savedQuiz.recommendedTargets) {
      setRecommendedTargets(savedQuiz.recommendedTargets);
    } else {
      setRecommendedTargets([]);
    }
  };

  useEffect(() => {
    loadRecommendedTargets();
  }, [currentUser]);

  useEffect(() => {
    const handleUpdate = () => loadRecommendedTargets();
    window.addEventListener('nutriwise_quiz_updated', handleUpdate);
    return () => window.removeEventListener('nutriwise_quiz_updated', handleUpdate);
  }, [currentUser]);

  // Flush pending changes to Supabase when user navigates away or component unmounts
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (currentUser && isSupabaseConfigured && supabase) {
        supabase.auth.updateUser({
          data: {
            NutriWise_targets: targetsRef.current,
            NutriWise_history: historyRef.current,
            NutriWise_setup_done: setupDoneRef.current,
            NutriWise_tz: timezoneRef.current,
            NutriWise_start_date: startDateRef.current
          }
        }).catch(err => console.error('Unmount sync to Supabase failed:', err));
      }
    };
  }, [currentUser]);

  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Sync drumIndex -> timezone state
  useEffect(() => {
    const entry = TZ_LIST[drumIndex];
    if (entry) setTimezone(entry.iana);
  }, [drumIndex]);

  // Drum drag/scroll interaction
  useEffect(() => {
    const el = drumRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      setDrumIndex(prev => Math.max(0, Math.min(TZ_LIST.length - 1, prev + (e.deltaY > 0 ? 1 : -1))));
    };

    const onTouchStart = (e) => {
      isDraggingRef.current = true;
      dragStartYRef.current = e.touches[0].clientY;
      dragStartIndexRef.current = drumIndex;
    };
    const onTouchMove = (e) => {
      if (!isDraggingRef.current) return;
      const dy = dragStartYRef.current - e.touches[0].clientY;
      const delta = Math.round(dy / 40);
      setDrumIndex(Math.max(0, Math.min(TZ_LIST.length - 1, dragStartIndexRef.current + delta)));
    };
    const onTouchEnd = () => { isDraggingRef.current = false; };

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      dragStartYRef.current = e.clientY;
      dragStartIndexRef.current = drumIndex;
    };
    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dy = dragStartYRef.current - e.clientY;
      const delta = Math.round(dy / 40);
      setDrumIndex(Math.max(0, Math.min(TZ_LIST.length - 1, dragStartIndexRef.current + delta)));
    };
    const onMouseUp = () => { isDraggingRef.current = false; };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove);
    el.addEventListener('touchend', onTouchEnd);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousedown', onMouseDown);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousedown', onMouseDown);
    };
  }, [drumIndex]);

  // Live Clock & Real Calendar Day Calculation in Selected Timezone
  useEffect(() => {
    const updateClockAndDay = () => {
      const ianaZone = normalizeTzToIana(timezone);
      let tzAbbr = '';
      if (ianaZone.includes('Jakarta')) tzAbbr = ' WIB';
      else if (ianaZone.includes('Makassar')) tzAbbr = ' WITA';
      else if (ianaZone.includes('Jayapura')) tzAbbr = ' WIT';

      const now = new Date();

      // Format time HH.mm (e.g. "03.34 WIB")
      const formatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: ianaZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const formattedTime = formatter.format(now).replace(':', '.');
      setCurrentTimeStr(`${formattedTime}${tzAbbr}`);

      // Calculate calendar day difference relative to start date in selected timezone
      if (startDate) {
        try {
          const yearFormatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: normalizeTzToIana(timezone),
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          const startStr = yearFormatter.format(new Date(startDate));
          const nowStr = yearFormatter.format(now);

          const startDateObj = new Date(`${startStr}T00:00:00Z`);
          const nowDateObj = new Date(`${nowStr}T00:00:00Z`);

          const diffMs = nowDateObj.getTime() - startDateObj.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
          setCurrentDayNum(Math.min(Math.max(diffDays, 1), 30));
        } catch (err) {
          console.error('Error calculating day num:', err);
        }
      }
    };

    updateClockAndDay();
    const timer = setInterval(updateClockAndDay, 1000);
    return () => clearInterval(timer);
  }, [startDate, timezone]);

  // Sync to Cloud / LocalStorage
  const persistState = async (newTargets, newHistory, newSetupDone, newTz, newStart) => {
    setTargets(newTargets);
    setHistoryData(newHistory);
    setSetupDone(newSetupDone);
    setTimezone(newTz);
    if (newStart) setStartDate(newStart);

    localStorage.setItem(getStorageKey('targets'), JSON.stringify(newTargets));
    localStorage.setItem(getStorageKey('history'), JSON.stringify(newHistory));
    localStorage.setItem(getStorageKey('setup_done'), JSON.stringify(newSetupDone));
    localStorage.setItem(getStorageKey('tz'), newTz);
    if (newStart) localStorage.setItem(getStorageKey('start_date'), newStart);

    if (currentUser && isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.updateUser({
          data: {
            NutriWise_targets: newTargets,
            NutriWise_history: newHistory,
            NutriWise_setup_done: newSetupDone,
            NutriWise_tz: newTz,
            NutriWise_start_date: newStart || startDate
          }
        });
      } catch (err) {
        console.error('Failed to sync settings to Supabase:', err);
      }
    }
  };

  // Add Custom Target (Staged in React state until Save is clicked)
  const handleAddCustomTarget = (e) => {
    e.preventDefault();
    if (!newTargetText.trim()) return;

    const newTarget = {
      id: 'custom_' + Date.now(),
      text: newTargetText.trim(),
      type: newTargetType,
      unit: newTargetType === 'quantitative' ? newTargetUnit : '',
      targetVal: Number(newTargetVal) || 1,
      minGood: Number(newTargetVal) || 1,
      maxGood: Number(newTargetVal) * 2 || 2,
      isMandatory: false,
      frequency: newTargetFreq,
      icon: 'Check'
    };

    setTargets(prev => [...prev, newTarget]);
    setNewTargetText('');
    setShowAddForm(false);
  };

  // Add Recommended Target
  const handleAddRecommendedTarget = (rt) => {
    const newTarget = { ...rt, isMandatory: false };
    const newTargets = [...targets, newTarget];
    setTargets(newTargets);
    setInitialTargets(newTargets);
    if (setupDone) {
      persistState(newTargets, historyData, setupDone, timezone, startDate);
    }
  };

  // Delete Custom Target (Staged in React state until Save is clicked)
  const handleDeleteTarget = (id) => {
    setTargets(prev => prev.filter(t => t.id !== id || t.isMandatory));
  };

  // Cancel Setup Changes (Revert back to initial saved state)
  const handleCancelSetup = () => {
    setTargets(initialTargets);
    setTimezone(initialTz);
    setShowSetupModal(false);
  };

  // Update Today's Target Entry (Debounced Cloud Sync to prevent input drops when typing fast)
  const handleUpdateTargetValue = (dayNum, targetId, val) => {
    if (!currentUser) {
      setShowAuthPrompt(true);
      return;
    }

    setHistoryData((prevHistory) => {
      const dayEntry = prevHistory[dayNum] || prevHistory[String(dayNum)] || {};
      const updatedHistory = {
        ...prevHistory,
        [dayNum]: {
          ...dayEntry,
          [targetId]: val
        }
      };

      historyRef.current = updatedHistory;

      // 1. Write to localStorage immediately for instant UI responsiveness
      localStorage.setItem(getStorageKey('history'), JSON.stringify(updatedHistory));

      // 2. Debounce cloud sync to Supabase (400ms delay) so rapid typing stays smooth
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(async () => {
        if (currentUser && isSupabaseConfigured && supabase) {
          try {
            await supabase.auth.updateUser({
              data: {
                NutriWise_targets: targetsRef.current,
                NutriWise_history: updatedHistory,
                NutriWise_setup_done: setupDoneRef.current,
                NutriWise_tz: timezoneRef.current,
                NutriWise_start_date: startDateRef.current || localStorage.getItem(getStorageKey('start_date')) || new Date().toISOString()
              }
            });
          } catch (err) {
            console.error('Failed to sync history to Supabase:', err);
          }
        }
      }, 400);

      return updatedHistory;
    });
  };

  // Evaluate Target Status for a Day based on Ideal Healthy Ranges
  // Returns: 'green' (Ideal/Selesai), 'yellow' (Kurang / Melebihi Batas Aman), 'red' (Belum Dikerjakan/0), 'none' (Kosong)
  const evaluateTargetStatus = (target, val) => {
    if (val === undefined || val === null || val === '') return 'none';

    if (target.type === 'boolean') {
      return val ? 'green' : 'red';
    }

    const num = Number(val);
    if (isNaN(num)) return 'none';
    if (num <= 0) return 'red';

    // Determine healthy thresholds (minGood to maxGood)
    let minG = target.minGood ?? target.targetVal;
    let maxG = target.maxGood ?? (target.targetVal * 2.5);

    // Standard medical & nutritional guidelines:
    if (target.id === 'water') {
      minG = 2.0;
      maxG = 4.5; // Overhydration warning above 4.5 L daily
    } else if (target.id === 'walk') {
      minG = 30;
      maxG = 180; // Overtraining / physical exertion warning above 180 mins daily
    } else if (target.id === 'veggies') {
      minG = 2;
      maxG = 8; // Digestive excess warning above 8 portions daily
    } else if (target.id === 'sleep') {
      minG = 7.0;
      maxG = 9.0; // Deprivation (< 7h) or hypersomnia (> 9h) warning
    }

    if (num >= minG && num <= maxG) {
      return 'green';
    } else {
      // Either under the minimum target or exceeds the safe upper limit!
      return 'yellow';
    }
  };

  // Filter Active Targets for a Specific Day based on Frequency
  const getActiveTargetsForDay = (dayNum) => {
    return targets.filter((t) => {
      if (!t.frequency || t.frequency === 'daily') return true;
      if (t.frequency === 'every_2_days') return (dayNum % 2) === 1;
      if (t.frequency === 'every_3_days') return (dayNum % 3) === 1;
      if (t.frequency === 'weekly') return (dayNum % 7) === 1;
      return true;
    });
  };

  // Calculate Overall Day Status & Completion % for Calendar Colors
  const calculateDayStatus = (dayNum) => {
    const activeForDay = getActiveTargetsForDay(dayNum);
    if (activeForDay.length === 0) return { status: 'future', percent: 0 };

    const dayEntry = historyData[dayNum] || historyData[String(dayNum)] || {};
    let greenCount = 0;
    let totalAssessed = 0;

    activeForDay.forEach((t) => {
      const val = dayEntry[t.id];
      const res = evaluateTargetStatus(t, val);
      if (res === 'green') greenCount++;
      if (res !== 'none') totalAssessed++;
    });

    const percent = Math.round((greenCount / activeForDay.length) * 100);

    // If day is in the future
    if (dayNum > currentDayNum) {
      return { status: 'future', percent: 0 };
    }

    // Past or Current Day
    if (percent === 100) return { status: 'green', percent };
    if (percent >= 60) return { status: 'yellow', percent };
    if (percent >= 30) return { status: 'orange', percent };
    return { status: 'red', percent };
  };

  // Today's Progress Percentage
  const todayActiveTargets = getActiveTargetsForDay(currentDayNum);
  const todayEntry = historyData[currentDayNum] || historyData[String(currentDayNum)] || {};
  let todayCompletedCount = 0;
  todayActiveTargets.forEach((t) => {
    if (evaluateTargetStatus(t, todayEntry[t.id]) === 'green') {
      todayCompletedCount++;
    }
  });
  const todayProgressPercent = todayActiveTargets.length > 0 
    ? Math.round((todayCompletedCount / todayActiveTargets.length) * 100)
    : 0;

  // Monthly Completed Days Count (Days with 'green' or 'yellow' >= 60%)
  let monthlyCompletedDaysCount = 0;
  for (let d = 1; d <= currentDayNum; d++) {
    const { status } = calculateDayStatus(d);
    if (status === 'green') {
      monthlyCompletedDaysCount++;
    }
  }
  const monthlyProgressPercent = Math.round((monthlyCompletedDaysCount / 30) * 100);

  const handleStartChallenge = () => {
    const newStart = setupDone ? startDate : new Date().toISOString();
    persistState(targets, historyData, true, timezone, newStart);
    setInitialTargets(targets);
    setInitialTz(timezone);
    setShowSetupModal(false);
  };

  const isSetupChanged = timezone !== initialTz || JSON.stringify(targets) !== JSON.stringify(initialTargets);

  return (
    <section id="challenge" className={`container ${currentUser ? 'nw-calc-dashboard-sec' : 'section nw-section'}`}>
      {!currentUser && (
        <div className="nw-challenge-landing-intro">
          <div className="nw-section-header" style={{ marginBottom: '24px' }}>
            <div>
              <span className="nw-natural-section-tag">Rutinitas Sehat Berkelanjutan</span>
              <h2 className="section-title nw-natural-h2">30-Day Health Habit Challenge</h2>
              <p className="section-subtitle nw-natural-subtitle">
                Bangun kebiasaan hidup sehat secara konsisten selama 30 hari penuh dengan pelacak target harian, penyesuaian zona waktu otomatis, dan kalender progres.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* ================= 1. ONBOARDING SETUP UI (if not setup yet or modal open) ================= */}
      {(!setupDone || showSetupModal) ? (
        <div className="challenge-setup-wrapper">
          <div className="setup-header">
            <div className="setup-badge"><Clock size={16} /> Hari ke-{currentDayNum} • {currentTimeStr} • Pengaturan Tantangan</div>
            <h2>Konfigurasi 30-Day Health Challenge Anda</h2>
            <p>Atur target harian, sesuaikan frekuensi, dan atur zona waktu sebelum memulai perjalanan pola hidup sehat 30 hari.</p>
          </div>

          <div className="setup-grid" style={setupDone ? { gridTemplateColumns: '1fr' } : {}}>
            {/* Left Card: Timezone & General Settings */}
            {!setupDone && (
            <div className="setup-card">
              <h3><Clock size={20} color="var(--color-forest)" /> 1. Zona Waktu &amp; Jadwal</h3>
              <p className="setup-subtext">Penentuan pergantian hari otomatis disesuaikan dengan zona lokasi Anda.</p>

              {/* Auto-sync toggle — only active when TZ not yet saved (first-time setup) */}
              <div className="tz-autosync-row" style={{ marginTop: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-dark)' }}>Sinkronisasi Otomatis Perangkat</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                    {!setupDone
                      ? 'Gunakan zona waktu perangkat ini (hanya berlaku saat pengaturan pertama)'
                      : 'Zona waktu sudah terkunci dari pengaturan awal'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (setupDone) return; // locked after first setup
                    const next = !autoSyncTz;
                    setAutoSyncTz(next);
                    if (next) {
                      const deviceIana = getDeviceTzIana();
                      const entry = ianaToTzEntry(deviceIana);
                      const idx = TZ_LIST.findIndex(t => t.iana === (entry?.iana || 'Asia/Jakarta'));
                      setDrumIndex(idx >= 0 ? idx : TZ_LIST.findIndex(t => t.iana === 'Asia/Jakarta'));
                    }
                  }}
                  className={`tz-toggle-btn ${autoSyncTz ? 'tz-toggle-on' : 'tz-toggle-off'} ${setupDone ? 'tz-toggle-locked' : ''}`}
                  title={setupDone ? 'Zona waktu terkunci dari sesi pengaturan pertama' : ''}
                >
                  <span className="tz-toggle-knob" />
                </button>
              </div>

              {/* Drum Picker */}
              <div style={{ opacity: autoSyncTz && !setupDone ? 0.45 : 1, transition: 'opacity 0.2s', pointerEvents: autoSyncTz && !setupDone ? 'none' : 'auto' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pilih Offset UTC secara Manual</div>
                <div className="tz-drum-wrapper" ref={drumRef}>
                  {/* Shadow overlays top/bottom */}
                  <div className="tz-drum-shadow-top" />
                  <div className="tz-drum-shadow-bottom" />
                  {/* Selection highlight bar */}
                  <div className="tz-drum-selector" />
                  {/* Drum items */}
                  <div
                    className="tz-drum-inner"
                    style={{ transform: `translateY(calc(${-drumIndex} * 48px + 48px))` }}
                  >
                    {TZ_LIST.map((tz, i) => (
                      <div
                        key={tz.iana}
                        className={`tz-drum-item ${i === drumIndex ? 'tz-drum-active' : i === drumIndex - 1 || i === drumIndex + 1 ? 'tz-drum-adjacent' : 'tz-drum-far'}`}
                        onClick={() => setDrumIndex(i)}
                      >
                        {tz.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tz-drum-caption">
                  {TZ_LIST[drumIndex]?.iana || 'Asia/Jakarta'}
                </div>
              </div>
            </div>
            )}

            {/* Right Card: Custom Target List Manager */}
            <div className="setup-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3><Edit3 size={20} color="var(--color-forest)" /> {setupDone ? 'Target Harian & Custom' : '2. Target Harian & Custom'}</h3>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="btn-cta-outline"
                  style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                >
                  <Plus size={16} /> Tambah Target
                </button>
              </div>

              {/* Add Custom Form */}
              {showAddForm && (
                <form onSubmit={handleAddCustomTarget} className="add-target-box">
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Buat Target Baru</h4>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nama target (misal: Segelas Jus Alpukat)"
                    value={newTargetText}
                    onChange={(e) => setNewTargetText(e.target.value)}
                    required
                    style={{ marginBottom: '10px' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <label className="form-label">Tipe Target</label>
                      <select className="form-input" value={newTargetType} onChange={(e) => setNewTargetType(e.target.value)}>
                        <option value="quantitative">Hitung Angka</option>
                        <option value="boolean">Ya / Tidak</option>
                      </select>
                    </div>

                    {newTargetType === 'quantitative' && (
                      <div>
                        <label className="form-label">Satuan</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Liter, Menit, Porsi, dll"
                          value={newTargetUnit}
                          onChange={(e) => setNewTargetUnit(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label">Nilai Target</label>
                      <input
                        type="number"
                        className="form-input"
                        value={newTargetVal}
                        onChange={(e) => setNewTargetVal(e.target.value)}
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="form-label">Frekuensi Tampil</label>
                      <select className="form-input" value={newTargetFreq} onChange={(e) => setNewTargetFreq(e.target.value)}>
                        <option value="daily">Setiap Hari</option>
                        <option value="every_2_days">Selang 2 Hari</option>
                        <option value="every_3_days">Selang 3 Hari</option>
                        <option value="weekly">1x Seminggu</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn-cta-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Batal</button>
                    <button
                      type="submit"
                      className="btn-auth-primary"
                      disabled={!newTargetText.trim()}
                      style={{
                        padding: '6px 16px',
                        fontSize: '0.8rem',
                        opacity: !newTargetText.trim() ? 0.45 : 1,
                        cursor: !newTargetText.trim() ? 'not-allowed' : 'pointer',
                        pointerEvents: !newTargetText.trim() ? 'none' : 'auto'
                      }}
                    >
                      Simpan Target
                    </button>
                  </div>
                </form>
              )}

              {/* Target Items List */}
              <div className="setup-targets-list">
                {targets.map((t) => (
                  <div key={t.id} className="setup-target-item">
                    <div>
                      <div className="target-item-title">
                        {t.text} {t.isMandatory && <span className="mandatory-badge">Wajib</span>}
                      </div>
                      <div className="target-item-meta">
                        {t.type === 'quantitative' ? `Target: ${t.targetVal} ${t.unit}` : 'Target: Ya/Tidak'} • Frekuensi: {
                          t.frequency === 'every_2_days' ? '2 Hari Sekali' :
                          t.frequency === 'every_3_days' ? '3 Hari Sekali' :
                          t.frequency === 'weekly' ? 'Mingguan' : 'Harian'
                        }
                      </div>
                    </div>

                    {!t.isMandatory && (
                      <button onClick={() => handleDeleteTarget(t.id)} className="btn-delete-target" title="Hapus target">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="setup-ready-footer">
            {setupDone && (
              <button onClick={handleCancelSetup} className="btn-danger-outline">
                Batal
              </button>
            )}
            <button
              onClick={handleStartChallenge}
              className="btn-nav-combined"
              disabled={setupDone && !isSetupChanged}
              style={{
                minWidth: '200px',
                opacity: setupDone && !isSetupChanged ? 0.45 : 1,
                cursor: setupDone && !isSetupChanged ? 'not-allowed' : 'pointer',
                pointerEvents: setupDone && !isSetupChanged ? 'none' : 'auto'
              }}
            >
              <span className="btn-text-default">{setupDone ? 'Simpan Perubahan' : 'Siap, Mulai Tantangan!'}</span>
              <span className="btn-text-hover">{setupDone ? 'Simpan Perubahan' : 'Siap, Mulai Tantangan!'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= 2. ACTIVE CHALLENGE DASHBOARD UI (Matches cal.png layout) ================= */
        <div className="challenge-card main-challenge-card">
          {!currentUser && (
            <div className="preview-mode-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Lock size={20} color="var(--color-forest)" />
                <span>Mode Pratinjau: Masuk atau daftar akun untuk menyimpan progres Anda.</span>
              </div>
              <button onClick={() => setShowAuthPrompt(true)} className="btn-nav-combined" style={{ height: '36px', minWidth: '140px', fontSize: '0.85rem' }}>
                <span className="btn-text-default">Masuk / Daftar</span>
                <span className="btn-text-hover">Masuk / Daftar</span>
              </button>
            </div>
          )}

          {/* Section Header */}
          <div className="challenge-title-row">
            <div>
              <div className="challenge-live-clock-badge">
                <Clock size={16} /> Hari ke-{currentDayNum} • {currentTimeStr}
              </div>
              <h2 className="challenge-hero-title">Kemajuan Tantangan Sehat</h2>
              <p className="today-progress-sublabel">Progress Hari Ini ({todayProgressPercent}%)</p>
            </div>

            <button 
              onClick={() => setShowSetupModal(true)} 
              className="btn-cta-outline"
              style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
            >
              <Settings size={16} /> Pengaturan Tantangan
            </button>
          </div>

          {/* Today's Separated Progress Bar */}
          <div className="progress-bar-bg today-progress-bar">
            <div className="progress-bar-fill" style={{ width: `${todayProgressPercent}%` }}></div>
          </div>

          {/* Dynamic Recommendations Panel */}
          {recommendedTargets.filter((rt) => !targets.some((t) => t.id === rt.id)).length > 0 && (
            <div className="recommendation-banner" style={{ marginTop: '24px', marginBottom: '24px', borderRadius: '16px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-forest)', fontWeight: 800 }}>
                <Sparkles size={20} color="var(--color-forest)" /> 
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Rekomendasi Target Khusus Anda</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Berdasarkan hasil Kuis Skrining PTM Anda, kami menyarankan menambahkan target berikut untuk memaksimalkan gaya hidup sehat Anda.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recommendedTargets.filter((rt) => !targets.some((t) => t.id === rt.id)).map((rt) => (
                  <div key={rt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-dark)' }}>{rt.text}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                        {rt.type === 'quantitative' ? `Target: ${rt.targetVal} ${rt.unit}` : 'Target: Ya/Tidak'}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddRecommendedTarget(rt)}
                      className="btn-auth-primary btn-add-rec-target"
                      title="Tambah Target"
                    >
                      <Plus size={16} className="btn-add-rec-icon" />
                      <span className="btn-add-rec-text">Tambah</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtitle: Target Hari Ini */}
          <h3 className="section-sub-title">Target Hari Ini (Hari ke-{currentDayNum} • {currentTimeStr})</h3>

          {/* Today's Target Input Grid */}
          <div className="target-input-grid">
            {todayActiveTargets.map((target) => {
              const currentVal = todayEntry[target.id] ?? '';
              const evalStatus = evaluateTargetStatus(target, currentVal);

              return (
                <div key={target.id} className={`target-input-card status-${evalStatus}`}>
                  <div className="target-card-top">
                    <span className="target-card-title">{target.text}</span>
                    <span className={`status-pill pill-${evalStatus}`}>
                      {evalStatus === 'green' && '✓ Selesai'}
                      {evalStatus === 'yellow' && '~ Warning'}
                      {evalStatus === 'red' && '✗ Belum'}
                      {evalStatus === 'none' && 'Isi Target'}
                    </span>
                  </div>

                  <div className="target-card-body">
                    {target.type === 'quantitative' ? (
                      <div className="quantitative-input-row">
                        <input
                          type="number"
                          step="0.5"
                          className="form-input quant-input"
                          placeholder={`Misal ${target.targetVal}`}
                          value={currentVal}
                          onChange={(e) => handleUpdateTargetValue(currentDayNum, target.id, e.target.value)}
                        />
                        <span className="quant-unit">{target.unit}</span>
                      </div>
                    ) : (
                      <div className="boolean-input-row">
                        <button
                          type="button"
                          onClick={() => handleUpdateTargetValue(currentDayNum, target.id, true)}
                          className={`btn-bool ${currentVal === true ? 'active-yes' : ''}`}
                        >
                          ✓ Ya (Selesai)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateTargetValue(currentDayNum, target.id, false)}
                          className={`btn-bool ${currentVal === false ? 'active-no' : ''}`}
                        >
                          ✗ Tidak
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtitle: Kalender 30 Hari */}
          <div style={{ marginTop: '36px', marginBottom: '16px' }}>
            <h3 className="section-sub-title">Kalender 30 hari</h3>
          </div>

          {/* Auto-Colored 30 Day Grid */}
          <div className="calendar-grid-30">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const { status, percent } = calculateDayStatus(day);
              const isToday = day === currentDayNum;

              return (
                <div
                  key={day}
                  className={`calendar-day-box status-${status} ${isToday ? 'is-today' : ''}`}
                  title={`Hari ${day}: ${percent}% Terpenuhi`}
                >
                  <span className="day-label">H-{day}</span>
                  <div className="day-icon-wrap">
                    {status === 'green' && <Check size={18} color="var(--color-forest)" />}
                    {status === 'yellow' && <span className="day-symbol yellow">~</span>}
                    {status === 'orange' && <span className="day-symbol orange">-</span>}
                    {status === 'red' && <span className="day-symbol red">✕</span>}
                    {status === 'future' && <Calendar size={16} opacity={0.35} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Separated Progress Bar */}
          <div className="monthly-progress-section">
            <p className="monthly-progress-text">
              {monthlyCompletedDaysCount} dari 30 hari selesai ({monthlyProgressPercent}%)
            </p>
            <div className="progress-bar-bg monthly-progress-bar">
              <div className="progress-bar-fill" style={{ width: `${monthlyProgressPercent}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showAuthPrompt && (
        <div className="modal-overlay" onClick={() => setShowAuthPrompt(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', textAlign: 'center', padding: '36px 32px' }}>
            <button className="modal-close" onClick={() => setShowAuthPrompt(false)}>
              <X size={20} />
            </button>
            <div style={{ width: '64px', height: '64px', background: 'rgba(56, 179, 114, 0.15)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Lock color="var(--color-forest)" size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px', color: 'var(--color-dark)' }}>
              Akses Fitur Terkunci
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Silakan <strong>Masuk</strong> atau <strong>Daftar Akun NutriWise</strong> terlebih dahulu untuk mengaktifkan pelacak harian 30-Day Health Challenge.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowAuthPrompt(false)} className="btn-warning-outline" style={{ padding: '8px 20px', height: '44px' }}>Nanti Saja</button>
              <button onClick={() => { setShowAuthPrompt(false); if (onOpenAuth) onOpenAuth(); }} className="btn-nav-combined">
                <span className="btn-text-default">Masuk / Daftar</span>
                <span className="btn-text-hover">Masuk / Daftar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
