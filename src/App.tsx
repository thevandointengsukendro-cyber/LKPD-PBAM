import React, { useState, useEffect, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  TopCode,
  BottomCode,
  OutfitKey,
  TOP_OPTIONS,
  BOTTOM_OPTIONS,
  ALL_OUTFITS,
  SimulationStats,
  INITIAL_STATS,
  MAX_SPIN_TRIALS,
  saveOutfitCombination,
  StudentAnswers,
  INITIAL_ANSWERS,
  ValidationMap,
  evaluateStudentAnswers,
  calculateProgressPercentage,
} from './utils/lkpdLogic';
import { soundEngine } from './utils/soundEngine';
import {
  TumpalBorderSvg,
  TopCardIllustrationSvg,
  BottomCardIllustrationSvg,
  PalembangChibiCharacterSvg,
  PalembangSpinWheelSvg,
} from './components/SvgAssets';

export default function App() {
  // ==================== 1. HALAMAN 1: ANIMASI OTOMATIS 6 BUSANA ADAT (1 DETIK) ====================
  const [coverIndex, setCoverIndex] = useState<number>(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCoverIndex((prev) => (prev + 1) % ALL_OUTFITS.length);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const currentCoverOutfit = ALL_OUTFITS[coverIndex];

  // ==================== 2. HALAMAN 3: STATE BUTIK DIGITAL & TABEL AKTIVITAS 1 ====================
  const [boutiqueTop, setBoutiqueTop] = useState<TopCode | null>(null);
  const [boutiqueBottom, setBoutiqueBottom] = useState<BottomCode | null>(null);
  const [boutiquePopKey, setBoutiquePopKey] = useState<number>(1);
  const [savedOutfits, setSavedOutfits] = useState<OutfitKey[]>([]);
  const [saveNotice, setSaveNotice] = useState<{ text: string; isError: boolean } | null>(null);

  // ==================== 3. HALAMAN 4: STATE SIMULASI SPIN 20 PERCOBAAN ====================
  const [spinTop, setSpinTop] = useState<TopCode | null>(null);
  const [spinBottom, setSpinBottom] = useState<BottomCode | null>(null);
  const [spinPopKey, setSpinPopKey] = useState<number>(1);
  const [wheelAngle, setWheelAngle] = useState<number>(0);
  const [stats, setStats] = useState<SimulationStats>(INITIAL_STATS);
  const [totalTrials, setTotalTrials] = useState<number>(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [spinNotice, setSpinNotice] = useState<string>('');
  const autoSpinTimerRef = useRef<number | null>(null);

  // ==================== 4. AUDIO & JAWABAN SISWA ====================
  const [bgmOn, setBgmOn] = useState<boolean>(false);
  const [sfxOn, setSfxOn] = useState<boolean>(true);
  const [answers, setAnswers] = useState<StudentAnswers>(INITIAL_ANSWERS);
  const [validation, setValidation] = useState<ValidationMap>({});
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [feedbackBanner, setFeedbackBanner] = useState<string>('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (autoSpinTimerRef.current) {
        window.clearInterval(autoSpinTimerRef.current);
      }
    };
  }, []);

  const progressPct = calculateProgressPercentage(answers, savedOutfits.length);

  const updateAnswer = (field: keyof StudentAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getFieldClass = (field: keyof StudentAnswers, extra: string = '') => {
    if (!hasChecked || validation[field] === undefined) {
      return `student-input ${extra}`.trim();
    }
    return `student-input ${validation[field] ? 'input-valid' : 'input-invalid'} ${extra}`.trim();
  };

  // Handler Pilih Atasan & Bawahan di Halaman 3
  const handleSelectBoutiqueTop = (code: TopCode) => {
    setBoutiqueTop(code);
    setBoutiquePopKey((k) => k + 1);
    setSaveNotice(null);
    soundEngine.playPopSfx();
  };

  const handleSelectBoutiqueBottom = (code: BottomCode) => {
    setBoutiqueBottom(code);
    setBoutiquePopKey((k) => k + 1);
    setSaveNotice(null);
    soundEngine.playPopSfx();
  };

  // Handler Tombol SIMPAN SET PAKAIAN di Halaman 3
  const handleSaveBoutiqueOutfit = () => {
    const result = saveOutfitCombination(savedOutfits, boutiqueTop, boutiqueBottom);
    if (result.isDuplicate || result.savedOutfits.length === savedOutfits.length) {
      soundEngine.playPopSfx();
      setSaveNotice({ text: result.message, isError: true });
      return;
    }

    soundEngine.playSuccessChime();
    setSavedOutfits(result.savedOutfits);
    setSaveNotice({ text: result.message, isError: false });

    if (result.savedOutfits.length === 6 && !answers.act1_nS) {
      setAnswers((prev) => ({
        ...prev,
        act1_nS: '6',
        act1_nA: prev.act1_nA || '1',
      }));
    }
  };

  // Sinkronisasi nilai k untuk pasangan (AG, S) ke Bagian 3.3 ketika percobaan selesai
  const syncFrequencyToAnswers = (nextStats: SimulationStats) => {
    const kVal = String(nextStats['AG,S']);
    setAnswers((prev) => ({
      ...prev,
      act33_k: kVal,
      act33_num: kVal,
      act33_N: '20',
      act33_den: '20',
    }));
  };

  // Handler SPIN 1 KALI di Halaman 4
  const handleSpinOnce = () => {
    if (isAutoSpinning) return;
    if (totalTrials >= MAX_SPIN_TRIALS) {
      setSpinNotice('Batas 20 percobaan telah tercapai! Klik RESET DATA untuk mengulang.');
      soundEngine.playPopSfx();
      return;
    }

    const idx = Math.floor(Math.random() * ALL_OUTFITS.length);
    const chosen = ALL_OUTFITS[idx];
    const targetMod = (360 - idx * 60) % 360;

    setWheelAngle((prev) => {
      const currentBase = Math.floor(prev / 360) * 360;
      return currentBase + 720 + targetMod;
    });
    setSpinTop(chosen.top);
    setSpinBottom(chosen.bottom);
    setSpinPopKey((k) => k + 1);
    soundEngine.playPopSfx();

    setStats((prev) => {
      const next = { ...prev, [chosen.key]: prev[chosen.key] + 1 };
      const nextTotal = Object.values(next).reduce((a, b) => a + b, 0);
      setTotalTrials(nextTotal);
      setSpinNotice(`Percobaan ke-${nextTotal}: Terpilih ${chosen.label} – ${chosen.fullTitle}`);
      if (nextTotal === MAX_SPIN_TRIALS) {
        syncFrequencyToAnswers(next);
      }
      return next;
    });
  };

  // Handler RANDOMIZE 20 KALI (Menjalankan hingga tepat 20 kali percobaan dengan animasi bertahap cepat)
  const handleRandomizeTwenty = () => {
    if (isAutoSpinning) return;

    if (autoSpinTimerRef.current) {
      window.clearInterval(autoSpinTimerRef.current);
    }

    soundEngine.playGachaSpinSfx();
    setIsAutoSpinning(true);

    // Mulai dari kondisi bersih menuju 20 percobaan penuh agar total selalu = 20
    const runningStats: SimulationStats = { ...INITIAL_STATS };
    let step = 0;

    setStats(INITIAL_STATS);
    setTotalTrials(0);

    autoSpinTimerRef.current = window.setInterval(() => {
      step += 1;
      const idx = Math.floor(Math.random() * ALL_OUTFITS.length);
      const chosen = ALL_OUTFITS[idx];
      runningStats[chosen.key] += 1;

      const targetMod = (360 - idx * 60) % 360;
      setWheelAngle((prev) => {
        const currentBase = Math.floor(prev / 360) * 360;
        return currentBase + 360 + targetMod;
      });
      setSpinTop(chosen.top);
      setSpinBottom(chosen.bottom);
      setSpinPopKey((k) => k + 1);
      setStats({ ...runningStats });
      setTotalTrials(step);
      setSpinNotice(`Percobaan ke-${step}/20: ${chosen.label} (${chosen.fullTitle})`);

      if (step >= MAX_SPIN_TRIALS) {
        if (autoSpinTimerRef.current) {
          window.clearInterval(autoSpinTimerRef.current);
          autoSpinTimerRef.current = null;
        }
        setIsAutoSpinning(false);
        syncFrequencyToAnswers(runningStats);
        soundEngine.playSuccessChime();
        setSpinNotice('20 Percobaan selesai! Data Frekuensi (AG, S) telah tercatat pada tabel & Bagian 3.3.');
      }
    }, 85);
  };

  // Handler RESET DATA di Halaman 4
  const handleResetSpin = () => {
    if (autoSpinTimerRef.current) {
      window.clearInterval(autoSpinTimerRef.current);
      autoSpinTimerRef.current = null;
    }
    setIsAutoSpinning(false);
    soundEngine.playPopSfx();
    setStats(INITIAL_STATS);
    setTotalTrials(0);
    setWheelAngle(0);
    setSpinTop(null);
    setSpinBottom(null);
    setSpinPopKey((k) => k + 1);
    setSpinNotice('Data percobaan telah di-reset. Karakter kembali ke pakaian dasar.');
  };

  // Handler PERIKSA SEMUA JAWABAN
  const handleCheckAnswers = () => {
    const result = evaluateStudentAnswers(answers, savedOutfits.length);
    setValidation(result.validation);
    setFinalScore(result.score);
    setHasChecked(true);
    soundEngine.playSuccessChime();

    if (result.score >= 85) {
      setFeedbackBanner(
        `Luar Biasa! Skor Akhir Kelompokmu: ${result.score}/100 (${result.correctCount}/${result.totalGradable} poin benar). Kalian sangat memahami Peluang Busana Adat Palembang!`
      );
    } else if (result.score >= 65) {
      setFeedbackBanner(
        `Bagus! Skor Akhir Kelompokmu: ${result.score}/100 (${result.correctCount}/${result.totalGradable} poin benar). Periksa kembali kotak berwarna merah muda untuk menyempurnakan jawaban.`
      );
    } else {
      setFeedbackBanner(
        `Skor Akhir Kelompokmu: ${result.score}/100 (${result.correctCount}/${result.totalGradable} poin benar). Pastikan seluruh 6 sel Tabel Aktivitas 1 telah disimpan dan kotak merah diperbaiki!`
      );
    }
  };

  const toggleBgm = () => {
    const nowPlaying = soundEngine.toggleBgm();
    setBgmOn(nowPlaying);
  };

  const toggleSfx = () => {
    const next = !sfxOn;
    setSfxOn(next);
    soundEngine.setSfxEnabled(next);
    if (next) soundEngine.playPopSfx();
  };

  const scrollToPage = (pageNum: number) => {
    soundEngine.playPopSfx();
    const el = document.getElementById(`halaman-${pageNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handler Download PDF 4 Halaman A4 (Tangkapan Layar Utuh)
  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    soundEngine.playPopSfx();

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageIds = ['halaman-1', 'halaman-2', 'halaman-3', 'halaman-4'];

      for (let i = 0; i < pageIds.length; i++) {
        const el = document.getElementById(pageIds[i]);
        if (!el) continue;

        const dataUrl = await toJpeg(el, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#FFFDF7',
          width: 794,
          height: 1123,
          style: {
            margin: '0',
            boxShadow: 'none',
          },
        });

        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }
        pdf.addImage(dataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      const groupSlug = answers.groupName
        ? answers.groupName.trim().replace(/[^a-zA-Z0-9_-]/g, '_')
        : 'Kelas_VIII';
      pdf.save(`E-LKPD_Stylist_Studio_Palembang_Heritage_${groupSlug}.pdf`);
      soundEngine.playSuccessChime();
    } catch (err) {
      console.error('Gagal mengunduh PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen pb-14 select-none">
      {/* ==================== TOP FLOATING NAVIGATION & PROGRESS BAR ==================== */}
      <header className="no-print sticky top-0 z-50 bg-[#451A03] text-[#FEF3C7] border-b-4 border-[#F59E0B] shadow-lg px-4 py-2.5">
        <div className="max-w-[980px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Identitas Brand E-LKPD */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#881337] border-2 border-[#FBBF24] font-extrabold text-xs tracking-wide text-[#FEF3C7] shadow-sm">
              STYLIST STUDIO • PALEMBANG HERITAGE
            </span>
            <div className="hidden sm:flex items-center gap-2 bg-[#291811] px-2.5 py-1 rounded-md border border-[#92400E]">
              <span className="text-[11px] font-bold text-[#FDE68A]">Progres E-LKPD:</span>
              <div className="w-24 h-2.5 bg-[#451A03] rounded-full overflow-hidden border border-[#B45309]">
                <div
                  className="h-full bg-[#F59E0B] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[11px] font-extrabold text-[#FDE047]">{progressPct}%</span>
            </div>
          </div>

          {/* Navigasi 4 Halaman */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => scrollToPage(p)}
                className="px-2.5 py-1 rounded bg-[#7F1D1D] hover:bg-[#991B1B] text-[#FEF3C7] font-bold text-xs border border-[#F59E0B] transition cursor-pointer"
              >
                Hal. {p}
              </button>
            ))}
          </div>

          {/* Kontrol Audio & Download PDF */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              data-testid="btn-download-pdf-top"
              className={`px-3 py-1 rounded font-extrabold text-xs border-2 transition cursor-pointer ${
                isDownloadingPdf
                  ? 'bg-[#78350F] border-[#FDE68A] text-[#FEF3C7] opacity-80 cursor-wait'
                  : 'bg-[#F59E0B] hover:bg-[#D97706] border-[#FEF3C7] text-[#451A03]'
              }`}
            >
              {isDownloadingPdf ? 'Menyiapkan PDF...' : 'Download PDF'}
            </button>
            <button
              type="button"
              onClick={toggleBgm}
              className={`px-2.5 py-1 rounded font-bold text-xs border transition cursor-pointer ${
                bgmOn
                  ? 'bg-[#15803D] border-[#DCFCE7] text-white'
                  : 'bg-[#291811] border-[#92400E] text-[#FDE68A]'
              }`}
            >
              BGM: {bgmOn ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={toggleSfx}
              className={`px-2.5 py-1 rounded font-bold text-xs border transition cursor-pointer ${
                sfxOn
                  ? 'bg-[#9A3412] border-[#FDE68A] text-[#FEF3C7]'
                  : 'bg-[#291811] border-[#92400E] text-[#FDE68A]'
              }`}
            >
              SFX: {sfxOn ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== CONTAINER 4 HALAMAN KERTAS A4 ==================== */}
      <main className="pt-6 px-2 flex flex-col items-center">
        {/* ====================================================================
            HALAMAN 1: SAMPUL & IDENTITAS KELOMPOK
            ==================================================================== */}
        <section id="halaman-1" className="a4-page" aria-label="Halaman 1 Sampul dan Identitas">
          {/* Bingkai Ornamen Songket Palembang */}
          <div
            style={{
              position: 'absolute',
              left: '40px',
              top: '36px',
              width: '714px',
              height: '1051px',
              border: '3px solid #7F1D1D',
              borderRadius: '14px',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '47px',
              top: '43px',
              width: '700px',
              height: '1037px',
              border: '1.5px dashed #B45309',
              borderRadius: '10px',
              pointerEvents: 'none',
            }}
          />

          {/* Konten Area Kerja Aktif (X = 76px .. 718px | Lebar 642px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '54px',
              width: '642px',
              height: '1015px',
            }}
            className="flex flex-col justify-between"
          >
            {/* 1. Header Kurikulum & Judul Utama */}
            <div className="flex flex-col items-center text-center">
              <div className="px-5 py-1 rounded-md bg-[#7F1D1D] border-2 border-[#F59E0B] text-[#FEF3C7] text-[11px] font-extrabold tracking-wider uppercase shadow-sm">
                KURIKULUM MERDEKA • MATEMATIKA SMP/MTs FASE D KELAS VIII
              </div>

              <h1 className="mt-2 text-[25px] font-black tracking-tight text-[#451A03] leading-tight">
                LEMBAR KERJA PESERTA DIDIK (E-LKPD INTERAKTIF)
              </h1>
              <div className="text-[19px] font-black text-[#881337] tracking-wide">
                STYLIST STUDIO – PALEMBANG HERITAGE EDITION
              </div>

              {/* Kotak Topik, 3 Badge Materi, & Subjudul */}
              <div className="mt-2 w-full bg-[#FEF3C7] border-2 border-[#92400E] rounded-xl px-4 py-2 shadow-sm">
                <div className="text-[12.5px] font-extrabold text-[#7F1D1D] uppercase tracking-wide">
                  TOPIK: PELUANG TEORETIS, FREKUENSI RELATIF, &amp; FREKUENSI HARAPAN
                </div>

                {/* 3 Badge Materi Pembelajaran */}
                <div className="mt-1.5 flex items-center justify-center gap-2">
                  <span className="px-3 py-0.5 rounded bg-[#881337] text-[#FEF3C7] border border-[#F59E0B] text-[11px] font-extrabold">
                    1. Peluang Teoretis
                  </span>
                  <span className="px-3 py-0.5 rounded bg-[#9A3412] text-[#FEF3C7] border border-[#F59E0B] text-[11px] font-extrabold">
                    2. Frekuensi Relatif
                  </span>
                  <span className="px-3 py-0.5 rounded bg-[#451A03] text-[#FDE047] border border-[#F59E0B] text-[11px] font-extrabold">
                    3. Frekuensi Harapan
                  </span>
                </div>

                <div className="mt-1 text-[12.5px] font-bold text-[#92400E]">
                  Eksplorasi Matematika melalui Busana Adat Sumatera Selatan (Alokasi: 4 JP)
                </div>
              </div>
            </div>

            {/* 2. Panggung Butik Busana Adat Palembang (Animasi Berganti 6 Pasangan Setiap 1 Detik) */}
            <div className="w-full bg-[#FFFBEB] border-[3px] border-[#78350F] rounded-2xl overflow-hidden shadow-md">
              <TumpalBorderSvg width={636} height={15} />

              <div className="relative h-[300px] px-4 py-2 flex items-center justify-between bg-[#FFFDF7]">
                {/* Ornamen Interior Butik Palembang di Latar Belakang */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 642 300"
                  fill="none"
                >
                  {/* Dinding Krem Gading dengan Panel Ukiran Kayu Palembang */}
                  <rect x="0" y="0" width="642" height="236" fill="#FFFBEB" />
                  {[36, 116, 196, 446, 526, 606].map((x) => (
                    <line key={x} x1={x} y1="0" x2={x} y2="236" stroke="#FDE68A" strokeWidth="8" />
                  ))}
                  {/* Gebyok / Lengkung Ukiran Emas Palembang di Tengah */}
                  <path
                    d="M206 236 V54 C206 14, 436 14, 436 54 V236 Z"
                    fill="#7F1D1D"
                    stroke="#451A03"
                    strokeWidth="3"
                  />
                  <path
                    d="M216 236 V58 C216 24, 426 24, 426 58 V236 Z"
                    fill="#FFFDF7"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                  />
                  {/* Lis Dinding Songket & Lantai Kayu Jati */}
                  <rect x="0" y="224" width="642" height="14" fill="#9A3412" stroke="#451A03" strokeWidth="2" />
                  <rect x="0" y="238" width="642" height="62" fill="#FDE68A" />
                  <line x1="0" y1="258" x2="642" y2="258" stroke="#D97706" strokeWidth="1.5" />
                  <line x1="0" y1="278" x2="642" y2="278" stroke="#D97706" strokeWidth="1.5" />
                  {/* Tirai Maroon Keemasan Kiri & Kanan */}
                  <path d="M0 0 H54 C46 58, 24 98, 0 124 Z" fill="#881337" stroke="#451A03" strokeWidth="2.2" />
                  <path d="M642 0 H588 C596 58, 618 98, 642 124 Z" fill="#881337" stroke="#451A03" strokeWidth="2.2" />
                </svg>

                {/* Kiri: Daftar 3 Pilihan Atasan Adat */}
                <div className="relative z-10 w-[184px] bg-[#FFFBEB] border-2 border-[#78350F] rounded-xl p-2 shadow-sm">
                  <div className="text-[10.5px] font-black text-[#7F1D1D] uppercase tracking-wider border-b border-[#D97706] pb-1 mb-1.5 text-center">
                    3 Pilihan Atasan Adat
                  </div>
                  <div className="space-y-1.5">
                    {TOP_OPTIONS.map((t) => {
                      const active = currentCoverOutfit.top === t.code;
                      return (
                        <div
                          key={t.code}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-left transition-all ${
                            active
                              ? 'bg-[#881337] text-[#FEF3C7] border-[#FBBF24] shadow-sm'
                              : 'bg-[#FFFDF7] text-[#451A03] border-[#D97706]'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center font-black text-[10px] shrink-0 ${
                              active ? 'bg-[#FBBF24] text-[#451A03]' : 'bg-[#FEF3C7] text-[#7F1D1D]'
                            }`}
                          >
                            {t.code}
                          </span>
                          <div className="leading-tight">
                            <div className="text-[10.5px] font-extrabold">{t.shortName}</div>
                            <div
                              className={`text-[8.5px] font-semibold ${
                                active ? 'text-[#FDE68A]' : 'text-[#78350F]'
                              }`}
                            >
                              {t.headpieceNote}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tengah: Karakter Chibi Perempuan Berganti 6 Pasangan Otomatis Setiap 1 Detik */}
                <div className="relative z-10 flex flex-col items-center justify-center w-[220px]">
                  <div
                    data-testid="cover-outfit-badge"
                    className="mb-0.5 px-3 py-0.5 rounded-md bg-[#451A03] border-2 border-[#FBBF24] text-[#FEF3C7] text-[10.5px] font-extrabold shadow-sm whitespace-nowrap"
                  >
                    Peragaan {coverIndex + 1}/6: {currentCoverOutfit.label}
                  </div>

                  <PalembangChibiCharacterSvg
                    top={currentCoverOutfit.top}
                    bottom={currentCoverOutfit.bottom}
                    width={162}
                    height={224}
                  />

                  <div className="mt-0.5 px-2.5 py-0.5 rounded bg-[#FEF3C7] border border-[#92400E] text-[#7F1D1D] text-[10px] font-extrabold text-center whitespace-nowrap">
                    {currentCoverOutfit.fullTitle}
                  </div>
                </div>

                {/* Kanan: Daftar 2 Pilihan Bawahan Kain Tradisional + Info Ruang Sampel */}
                <div className="relative z-10 w-[184px] bg-[#FFFBEB] border-2 border-[#78350F] rounded-xl p-2 shadow-sm">
                  <div className="text-[10.5px] font-black text-[#7F1D1D] uppercase tracking-wider border-b border-[#D97706] pb-1 mb-1.5 text-center">
                    2 Pilihan Bawahan Kain
                  </div>
                  <div className="space-y-1.5">
                    {BOTTOM_OPTIONS.map((b) => {
                      const active = currentCoverOutfit.bottom === b.code;
                      return (
                        <div
                          key={b.code}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-left transition-all ${
                            active
                              ? 'bg-[#9A3412] text-[#FEF3C7] border-[#FBBF24] shadow-sm'
                              : 'bg-[#FFFDF7] text-[#451A03] border-[#D97706]'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center font-black text-[10px] shrink-0 ${
                              active ? 'bg-[#FBBF24] text-[#451A03]' : 'bg-[#FEF3C7] text-[#7F1D1D]'
                            }`}
                          >
                            {b.code}
                          </span>
                          <div className="leading-tight">
                            <div className="text-[10.5px] font-extrabold">{b.shortName}</div>
                            <div
                              className={`text-[8.5px] font-semibold ${
                                active ? 'text-[#FDE68A]' : 'text-[#78350F]'
                              }`}
                            >
                              {b.subtitle}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-[#D97706] text-center">
                    <div className="text-[10px] font-extrabold text-[#451A03]">
                      Total Kombinasi Busana:
                    </div>
                    <div className="text-[12px] font-black text-[#881337]">
                      3 Atasan × 2 Bawahan = 6 Set
                    </div>
                  </div>
                </div>
              </div>

              <TumpalBorderSvg width={636} height={15} />
            </div>

            {/* 3. Kartu Identitas Kelompok & Kelas */}
            <div className="w-full bg-[#FFFDF7] border-[2.5px] border-[#78350F] rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#7F1D1D] border-b-2 border-[#F59E0B] py-1.5 px-4 text-center">
                <h2 className="text-[13.5px] font-extrabold text-[#FEF3C7] tracking-wider uppercase">
                  IDENTITAS KELOMPOK &amp; KELAS
                </h2>
              </div>

              <div className="p-3.5 space-y-2 text-[12.5px]">
                <div className="grid grid-cols-[150px_12px_1fr] items-center">
                  <label className="font-extrabold text-[#451A03]">Nama Kelompok</label>
                  <span className="font-bold text-[#451A03]">:</span>
                  <input
                    type="text"
                    value={answers.groupName}
                    onChange={(e) => updateAnswer('groupName', e.target.value)}
                    placeholder="Contoh: Kelompok Sriwijaya / Ampera"
                    className="student-input px-3 py-1 text-[12.5px] w-full"
                  />
                </div>

                <div className="grid grid-cols-[150px_12px_1fr] items-center">
                  <label className="font-extrabold text-[#451A03]">Kelas / Semester</label>
                  <span className="font-bold text-[#451A03]">:</span>
                  <input
                    type="text"
                    value={answers.classSemester}
                    onChange={(e) => updateAnswer('classSemester', e.target.value)}
                    placeholder="VIII (Delapan) / Genap"
                    className="student-input px-3 py-1 text-[12.5px] w-full"
                  />
                </div>

                <div className="pt-0.5">
                  <div className="font-extrabold text-[#451A03] mb-1">
                    Anggota Kelompok (Nama Lengkap &amp; Nomor Absen):
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {(['member1', 'member2', 'member3', 'member4'] as const).map((field, idx) => (
                      <div key={field} className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-[#881337] text-[#FEF3C7] font-extrabold text-[11px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={answers[field]}
                          onChange={(e) => updateAnswer(field, e.target.value)}
                          placeholder={`Nama Anggota ${idx + 1}...`}
                          className="student-input px-2.5 py-1 text-[12px] w-full"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-[#881337] text-[#FEF3C7] font-extrabold text-[11px] flex items-center justify-center shrink-0">
                      5
                    </span>
                    <input
                      type="text"
                      value={answers.member5}
                      onChange={(e) => updateAnswer('member5', e.target.value)}
                      placeholder="Nama Anggota 5 (Opsional)..."
                      className="student-input px-2.5 py-1 text-[12px] w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Footer Halaman 1 */}
            <div className="pt-1 border-t-2 border-[#B45309] flex items-center justify-between text-[11.5px] font-bold text-[#78350F]">
              <span>E-LKPD Matematika SMP/MTs Kelas VIII – Stylist Studio (Palembang Heritage)</span>
              <span className="px-2.5 py-0.5 rounded bg-[#FEF3C7] border border-[#92400E] text-[#7F1D1D] font-extrabold">
                Halaman 1 dari 4
              </span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            HALAMAN 2: PETUNJUK, CAPAIAN PEMBELAJARAN, & APERSEPSI
            (Tanpa Bagian "C. Informasi Pendukung")
            ==================================================================== */}
        <section id="halaman-2" className="a4-page" aria-label="Halaman 2 Petunjuk Capaian dan Apersepsi">
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '52px',
              width: '642px',
              height: '1019px',
            }}
            className="flex flex-col justify-between"
          >
            {/* Header Strip Halaman 2 */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b-[3px] border-[#7F1D1D]">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9A3412]">
                    PENGANTAR &amp; APERSEPSI MATERI
                  </span>
                  <h2 className="text-[18px] font-black text-[#451A03]">
                    PETUNJUK PENGGUNAAN, CAPAIAN PEMBELAJARAN, &amp; APERSEPSI
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-md bg-[#7F1D1D] text-[#FEF3C7] border border-[#F59E0B] text-xs font-extrabold">
                  Hal. 2 / 4
                </span>
              </div>

              {/* A. PETUNJUK PENGGUNAAN E-LKPD (6 Poin Ringkas & Jelas) */}
              <div className="mt-3.5 bg-[#FFFBEB] border-2 border-[#92400E] rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#881337] px-4 py-1.5 border-b-2 border-[#F59E0B] flex items-center justify-between">
                  <h3 className="text-[13.5px] font-extrabold text-[#FEF3C7] tracking-wide">
                    A. PETUNJUK PENGGUNAAN E-LKPD
                  </h3>
                  <span className="text-[10.5px] font-bold text-[#FDE68A]">
                    6 Langkah Pengerjaan
                  </span>
                </div>
                <div className="p-3.5 grid grid-cols-1 gap-2 text-[12.5px] text-[#291811]">
                  {[
                    'Isi identitas kelompok dan nama anggota pada Halaman 1 dengan lengkap.',
                    'Bacalah setiap instruksi dan permasalahan kontekstual secara berurutan bersama anggota kelompokmu.',
                    'Pada Halaman 3, klik pilihan kartu Atasan (AG, AP, BH) dan Bawahan (S, J), lalu klik tombol SIMPAN SET PAKAIAN untuk mengisi Tabel Aktivitas 1.',
                    'Ketik jawaban pada setiap kotak input yang tersedia berdasarkan hasil pengamatan kelompokmu.',
                    'Pada Halaman 4, gunakan tombol SPIN 1 KALI atau RANDOMIZE 20 KALI untuk melakukan eksperimen 20 percobaan pemasangan pakaian adat secara acak.',
                    'Klik tombol PERIKSA SEMUA JAWABAN di akhir Halaman 4 untuk melihat skor evaluasi dan unduh hasil pekerjaan dalam format PDF.',
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#7F1D1D] text-[#FEF3C7] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-snug font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* B. CAPAIAN & TUJUAN PEMBELAJARAN (Tanpa Bagian C Informasi Pendukung) */}
              <div className="mt-3.5 bg-[#FFFDF7] border-2 border-[#78350F] rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#451A03] px-4 py-1.5 border-b-2 border-[#F59E0B]">
                  <h3 className="text-[13.5px] font-extrabold text-[#FEF3C7] tracking-wide">
                    B. CAPAIAN &amp; TUJUAN PEMBELAJARAN (FASE D KELAS VIII)
                  </h3>
                </div>
                <div className="p-3.5 space-y-2.5 text-[12.5px] text-[#291811]">
                  <div className="bg-[#FEF3C7] border border-[#D97706] rounded-lg p-2.5">
                    <div className="font-extrabold text-[#7F1D1D] text-[12px] uppercase">
                      Capaian Pembelajaran (Elemen Analisis Data dan Peluang):
                    </div>
                    <p className="mt-1 leading-relaxed font-medium text-[#451A03]">
                      Peserta didik dapat menjelaskan dan menggunakan pengertian peluang, frekuensi relatif, dan frekuensi harapan satu kejadian pada suatu percobaan sederhana untuk menyelesaikan masalah kontekstual.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-0.5">
                    <div className="bg-[#FFFBEB] border border-[#B45309] rounded-lg p-2.5">
                      <div className="text-[11px] font-black text-[#881337] uppercase">
                        1. Peluang Teoretis
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-[#451A03]">
                        Menentukan ruang sampel <span className="math-var">S</span>, titik sampel <span className="math-var">n(S)</span>, dan peluang teoretis <span className="math-var">P(A)</span> dari kombinasi busana adat Palembang.
                      </p>
                    </div>
                    <div className="bg-[#FFFBEB] border border-[#B45309] rounded-lg p-2.5">
                      <div className="text-[11px] font-black text-[#9A3412] uppercase">
                        2. Frekuensi Harapan
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-[#451A03]">
                        Menghitung frekuensi harapan <span className="math-var">F_h</span> munculnya suatu pasangan busana pada <span className="math-var">N = 20</span> kali percobaan.
                      </p>
                    </div>
                    <div className="bg-[#FFFBEB] border border-[#B45309] rounded-lg p-2.5">
                      <div className="text-[11px] font-black text-[#451A03] uppercase">
                        3. Frekuensi Relatif
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-[#451A03]">
                        Menghitung frekuensi relatif <span className="math-var">F_r</span> dari simulasi Spin 20 percobaan dan membandingkannya dengan peluang teoretis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* C. APERSEPSI: MENGINGAT KEMBALI MATERI PRASYARAT */}
              <div className="mt-3.5 bg-[#FFFBEB] border-2 border-[#92400E] rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#9A3412] px-4 py-1.5 border-b-2 border-[#F59E0B] flex items-center justify-between">
                  <h3 className="text-[13.5px] font-extrabold text-[#FEF3C7] tracking-wide">
                    C. APERSEPSI – MENGINGAT KEMBALI PECAHAN &amp; PERKALIAN
                  </h3>
                  <span className="text-[10.5px] font-bold text-[#FDE68A]">
                    Materi Prasyarat Peluang
                  </span>
                </div>

                <div className="p-3.5 space-y-3 text-[12.5px] text-[#291811]">
                  <p className="leading-snug font-medium text-[#451A03]">
                    Sebelum bereksplorasi di Butik Digital Palembang Heritage, mari kita ingat kembali cara menuliskan <strong>pecahan bagian dari keseluruhan</strong> serta <strong>perkalian pecahan dengan bilangan bulat</strong>:
                  </p>

                  {/* Kartu Prasyarat 1 */}
                  <div className="bg-[#FFFDF7] border border-[#B45309] rounded-xl p-3 space-y-2">
                    <div className="font-extrabold text-[#7F1D1D] text-[12.5px]">
                      1. Menyatakan Bagian dari Keseluruhan dalam Bentuk Pecahan
                    </div>
                    <div className="text-[11.5px] text-[#78350F] bg-[#FEF3C7] px-2.5 py-1 rounded border border-[#D97706]">
                      <strong>Ingat:</strong> Nilai Pecahan = (Banyak pilihan yang dimaksud) / (Total seluruh pilihan yang tersedia).
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      <div className="flex items-center justify-between bg-[#FFFBEB] px-3 py-1.5 rounded-lg border border-[#D97706]">
                        <span className="text-[12px] font-semibold text-[#451A03]">
                          a. Memilih <strong>1 atasan</strong> (Aesan Gede) dari <strong>3 pilihan atasan adat</strong> yang tersedia:
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-bold">Pecahan =</span>
                          <span className="fraction-box">
                            <input
                              type="text"
                              value={answers.ap1_num1}
                              onChange={(e) => updateAnswer('ap1_num1', e.target.value)}
                              placeholder="..."
                              className={getFieldClass('ap1_num1', 'w-10 h-6 text-center text-xs')}
                            />
                            <span className="fraction-line" />
                            <input
                              type="text"
                              value={answers.ap1_den1}
                              onChange={(e) => updateAnswer('ap1_den1', e.target.value)}
                              placeholder="..."
                              className={getFieldClass('ap1_den1', 'w-10 h-6 text-center text-xs')}
                            />
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-[#FFFBEB] px-3 py-1.5 rounded-lg border border-[#D97706]">
                        <span className="text-[12px] font-semibold text-[#451A03]">
                          b. Memilih <strong>1 kain bawahan</strong> (Songket) dari <strong>2 pilihan kain bawahan</strong> yang tersedia:
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-bold">Pecahan =</span>
                          <span className="fraction-box">
                            <input
                              type="text"
                              value={answers.ap1_num2}
                              onChange={(e) => updateAnswer('ap1_num2', e.target.value)}
                              placeholder="..."
                              className={getFieldClass('ap1_num2', 'w-10 h-6 text-center text-xs')}
                            />
                            <span className="fraction-line" />
                            <input
                              type="text"
                              value={answers.ap1_den2}
                              onChange={(e) => updateAnswer('ap1_den2', e.target.value)}
                              placeholder="..."
                              className={getFieldClass('ap1_den2', 'w-10 h-6 text-center text-xs')}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kartu Prasyarat 2 */}
                  <div className="bg-[#FFFDF7] border border-[#B45309] rounded-xl p-3 space-y-2">
                    <div className="font-extrabold text-[#7F1D1D] text-[12.5px]">
                      2. Mengalikan Pecahan dengan Bilangan Bulat (Bekal Menghitung Frekuensi Harapan)
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-0.5">
                      <div className="flex items-center justify-between bg-[#FFFBEB] px-3 py-2 rounded-lg border border-[#D97706]">
                        <div className="text-[12px] font-bold text-[#451A03] flex items-center gap-1">
                          <span>a. Hasil dari</span>
                          <span className="fraction-box">
                            <span>1</span>
                            <span className="fraction-line" />
                            <span>4</span>
                          </span>
                          <span>× 20 =</span>
                        </div>
                        <input
                          type="text"
                          value={answers.ap2_res1}
                          onChange={(e) => updateAnswer('ap2_res1', e.target.value)}
                          placeholder="..."
                          className={getFieldClass('ap2_res1', 'w-14 h-7 text-center text-xs')}
                        />
                      </div>

                      <div className="flex items-center justify-between bg-[#FFFBEB] px-3 py-2 rounded-lg border border-[#D97706]">
                        <div className="text-[12px] font-bold text-[#451A03] flex items-center gap-1">
                          <span>b. Hasil dari</span>
                          <span className="fraction-box">
                            <span>1</span>
                            <span className="fraction-line" />
                            <span>5</span>
                          </span>
                          <span>× 20 =</span>
                        </div>
                        <input
                          type="text"
                          value={answers.ap2_res2}
                          onChange={(e) => updateAnswer('ap2_res2', e.target.value)}
                          placeholder="..."
                          className={getFieldClass('ap2_res2', 'w-14 h-7 text-center text-xs')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Halaman 2 */}
            <div className="pt-1 border-t-2 border-[#B45309] flex items-center justify-between text-[11.5px] font-bold text-[#78350F]">
              <span>E-LKPD Matematika SMP/MTs Kelas VIII – Stylist Studio (Palembang Heritage)</span>
              <span className="px-2.5 py-0.5 rounded bg-[#FEF3C7] border border-[#92400E] text-[#7F1D1D] font-extrabold">
                Halaman 2 dari 4
              </span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            HALAMAN 3: BUTIK DIGITAL, AKTIVITAS 1 (RUANG SAMPEL), & AKTIVITAS 2 (PELUANG TEORETIS)
            ==================================================================== */}
        <section id="halaman-3" className="a4-page" aria-label="Halaman 3 Butik Digital dan Aktivitas 1-2">
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '46px',
              width: '642px',
              height: '1030px',
            }}
            className="flex flex-col justify-between"
          >
            <div>
              {/* Header Strip Halaman 3 */}
              <div className="flex items-center justify-between pb-1.5 border-b-[3px] border-[#7F1D1D]">
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#9A3412]">
                    EKSPLORASI KONSEP 1 &amp; 2 • RUANG SAMPEL DAN PELUANG TEORETIS
                  </span>
                  <h2 className="text-[17.5px] font-black text-[#451A03]">
                    SIMULASI BUTIK DIGITAL BUSANA ADAT PALEMBANG
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-md bg-[#7F1D1D] text-[#FEF3C7] border border-[#F59E0B] text-xs font-extrabold">
                  Hal. 3 / 4
                </span>
              </div>

              {/* Instruksi Singkat */}
              <div className="mt-1.5 bg-[#FEF3C7] border-2 border-[#92400E] rounded-lg px-3 py-1.5 text-[11.5px] text-[#451A03] font-semibold leading-snug">
                <strong>Cara Kerja:</strong> Klik <strong>1 Atasan</strong> (<span className="font-extrabold text-[#881337]">AG, AP, BH</span>) dan <strong>1 Bawahan</strong> (<span className="font-extrabold text-[#9A3412]">S, J</span>) pada Lemari Butik di kiri, amati perubahan pakaian pada karakter di tengah, lalu klik <strong>SIMPAN SET PAKAIAN</strong> agar pasangan masuk ke <strong>Tabel Aktivitas 1</strong> di sebelah kanan!
              </div>

              {/* ==================== 3 AREA UTAMA BUTIK DIGITAL (KIRI - TENGAH - KANAN) ==================== */}
              <div className="mt-2 grid grid-cols-[190px_190px_236px] gap-1.5 bg-[#FFFBEB] border-2 border-[#78350F] rounded-xl p-1.5 shadow-sm">
                {/* AREA KIRI: LEMARI BUTIK (3 Kartu Atasan + 2 Kartu Bawahan) */}
                <div className="bg-[#FFFDF7] border-2 border-[#B45309] rounded-lg p-1.5 flex flex-col justify-between">
                  <div>
                    <div className="bg-[#7F1D1D] text-[#FEF3C7] text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2 rounded text-center">
                      PILIHAN ATASAN (3)
                    </div>
                    <div className="mt-1 space-y-1">
                      {TOP_OPTIONS.map((t, idx) => {
                        const isSelected = boutiqueTop === t.code;
                        return (
                          <button
                            key={t.code}
                            type="button"
                            data-testid={`card-top-${t.code}`}
                            onClick={() => handleSelectBoutiqueTop(t.code)}
                            className={`w-full flex items-center gap-1.5 p-1 rounded-lg border-2 text-left transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#FEF3C7] border-[#881337] shadow-sm'
                                : 'bg-[#FFFDF7] border-[#D97706] hover:bg-[#FFFBEB]'
                            }`}
                          >
                            <TopCardIllustrationSvg code={t.code} width={40} height={40} />
                            <div className="min-w-0 flex-1 leading-tight">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-black text-[#451A03]">
                                  {idx + 1}. {t.shortName}
                                </span>
                                <span
                                  className={`px-1 py-0.2 rounded text-[8.5px] font-black shrink-0 ${
                                    isSelected
                                      ? 'bg-[#881337] text-[#FEF3C7]'
                                      : 'bg-[#FDE68A] text-[#78350F]'
                                  }`}
                                >
                                  {t.code}
                                </span>
                              </div>
                              <div className="text-[8.5px] font-bold text-[#9A3412] leading-tight">
                                {t.subtitle}
                              </div>
                              <div className="text-[8px] font-semibold text-[#78350F] leading-tight">
                                + {t.headpieceNote}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-1.5 pt-1 border-t border-[#D97706]">
                    <div className="bg-[#9A3412] text-[#FEF3C7] text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2 rounded text-center">
                      PILIHAN BAWAHAN (2)
                    </div>
                    <div className="mt-1 space-y-1">
                      {BOTTOM_OPTIONS.map((b, idx) => {
                        const isSelected = boutiqueBottom === b.code;
                        return (
                          <button
                            key={b.code}
                            type="button"
                            data-testid={`card-bottom-${b.code}`}
                            onClick={() => handleSelectBoutiqueBottom(b.code)}
                            className={`w-full flex items-center gap-1.5 p-1 rounded-lg border-2 text-left transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#FEF3C7] border-[#9A3412] shadow-sm'
                                : 'bg-[#FFFDF7] border-[#D97706] hover:bg-[#FFFBEB]'
                            }`}
                          >
                            <BottomCardIllustrationSvg code={b.code} width={40} height={40} />
                            <div className="min-w-0 flex-1 leading-tight">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-black text-[#451A03]">
                                  {idx + 1}. {b.shortName}
                                </span>
                                <span
                                  className={`px-1 py-0.2 rounded text-[8.5px] font-black shrink-0 ${
                                    isSelected
                                      ? 'bg-[#9A3412] text-[#FEF3C7]'
                                      : 'bg-[#FDE68A] text-[#78350F]'
                                  }`}
                                >
                                  {b.code}
                                </span>
                              </div>
                              <div className="text-[8.5px] font-bold text-[#78350F] leading-tight">
                                {b.subtitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AREA TENGAH: PANGGUNG KARAKTER UTAMA + TOMBOL SIMPAN SET PAKAIAN */}
                <div className="bg-[#FFFDF7] border-2 border-[#B45309] rounded-lg p-1.5 flex flex-col items-center justify-between relative overflow-hidden">
                  <div className="w-full bg-[#451A03] text-[#FEF3C7] text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2 rounded text-center">
                    PERAGA BUSANA ADAT
                  </div>

                  {/* Status Pasangan yang Sedang Dipilih */}
                  <div
                    data-testid="boutique-selected-label"
                    className="mt-1 px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#92400E] text-[10px] font-extrabold text-[#7F1D1D] text-center"
                  >
                    {boutiqueTop || boutiqueBottom
                      ? `Pilihan: (${boutiqueTop ?? '?'}, ${boutiqueBottom ?? '?'})`
                      : 'Belum memilih pakaian'}
                  </div>

                  {/* Karakter Chibi Perempuan */}
                  <div key={boutiquePopKey} className="animate-chibi-pop my-0.5 flex items-center justify-center">
                    <PalembangChibiCharacterSvg
                      top={boutiqueTop}
                      bottom={boutiqueBottom}
                      width={144}
                      height={198}
                    />
                  </div>

                  {/* Pesan Notifikasi Simpan / Duplikat */}
                  <div
                    data-testid="save-outfit-notice"
                    className={`w-full min-h-[30px] px-1.5 py-0.5 rounded text-[9px] font-extrabold text-center flex items-center justify-center border ${
                      saveNotice
                        ? saveNotice.isError
                          ? 'bg-[#FEE2E2] border-[#B91C1C] text-[#7F1D1D]'
                          : 'bg-[#DCFCE7] border-[#15803D] text-[#14532D]'
                        : 'bg-[#FFFBEB] border-[#D97706] text-[#78350F]'
                    }`}
                  >
                    {saveNotice
                      ? saveNotice.text
                      : `Tersimpan: ${savedOutfits.length} / 6 kombinasi`}
                  </div>

                  {/* Tombol SIMPAN SET PAKAIAN */}
                  <button
                    type="button"
                    data-testid="btn-save-outfit"
                    onClick={handleSaveBoutiqueOutfit}
                    className="mt-1 w-full py-1.5 px-2 rounded-lg bg-[#881337] hover:bg-[#7F1D1D] active:translate-y-0.5 text-[#FEF3C7] border-2 border-[#FBBF24] font-black text-[10.5px] tracking-wide shadow cursor-pointer transition"
                  >
                    SIMPAN SET PAKAIAN
                  </button>
                </div>

                {/* AREA KANAN: TABEL AKTIVITAS 1 (3 ATASAN x 2 BAWAHAN) */}
                <div className="bg-[#FFFDF7] border-2 border-[#B45309] rounded-lg p-1.5 flex flex-col justify-between">
                  <div className="bg-[#7F1D1D] text-[#FEF3C7] text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2 rounded text-center">
                    TABEL AKTIVITAS 1 (RUANG SAMPEL)
                  </div>

                  <table className="mt-1 w-full border-collapse text-center table-fixed">
                    <thead>
                      <tr className="bg-[#FEF3C7] text-[#451A03] text-[9.5px] font-black">
                        <th className="w-[54px] border-2 border-[#78350F] py-1 px-0.5">
                          Atasan \ Bawahan
                        </th>
                        <th className="border-2 border-[#78350F] py-1 px-1">
                          Songket (S)
                        </th>
                        <th className="border-2 border-[#78350F] py-1 px-1">
                          Jumputan (J)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_OPTIONS.map((t) => (
                        <tr key={t.code}>
                          <td className="bg-[#FEF3C7] border-2 border-[#78350F] px-1 py-1 font-black text-[9.5px] text-[#7F1D1D] leading-tight">
                            <div>{t.shortName}</div>
                            <div className="text-[9px] text-[#92400E]">({t.code})</div>
                          </td>
                          {BOTTOM_OPTIONS.map((b) => {
                            const cellKey: OutfitKey = `${t.code},${b.code}`;
                            const isSaved = savedOutfits.includes(cellKey);
                            return (
                              <td
                                key={cellKey}
                                data-testid={`table-cell-${cellKey}`}
                                className={`border-2 border-[#78350F] p-0.5 h-[100px] align-middle transition ${
                                  isSaved ? 'bg-[#FFFBEB]' : 'bg-[#F5EBE1]'
                                }`}
                              >
                                {isSaved ? (
                                  <div className="flex flex-col items-center justify-center">
                                    <PalembangChibiCharacterSvg
                                      top={t.code}
                                      bottom={b.code}
                                      width={48}
                                      height={66}
                                      showShadow={false}
                                    />
                                    <span className="mt-0.5 px-1.5 py-0.2 rounded bg-[#881337] text-[#FEF3C7] text-[9px] font-black">
                                      ({t.code}, {b.code})
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-[#92400E]">
                                    <span className="text-[9.5px] font-extrabold">
                                      ({t.code}, {b.code})
                                    </span>
                                    <span className="text-[8px] font-semibold">
                                      Belum disimpan
                                    </span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-1 text-[9.5px] font-bold text-[#78350F] text-center bg-[#FEF3C7] py-0.5 px-1.5 rounded border border-[#D97706]">
                    Lengkap: <strong className="text-[#881337]">{savedOutfits.length} dari 6</strong> pasangan pakaian adat
                  </div>
                </div>
              </div>

              {/* ==================== PERTANYAAN AKTIVITAS 1: RUANG SAMPEL ==================== */}
              <div className="mt-2 bg-[#FFFDF7] border-2 border-[#78350F] rounded-xl p-2.5 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#D97706] pb-1 mb-1.5">
                  <h3 className="text-[12.5px] font-black text-[#7F1D1D] uppercase">
                    AKTIVITAS 1: MENEMUKAN RUANG SAMPEL DAN TITIK SAMPEL
                  </h3>
                  <span className="text-[10.5px] font-bold text-[#92400E]">
                    S = &#123;(AG,S), (AG,J), (AP,S), (AP,J), (BH,S), (BH,J)&#125;
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-[11.5px] text-[#451A03]">
                  <div className="flex items-center justify-between bg-[#FFFBEB] px-2.5 py-1.5 rounded-lg border border-[#D97706]">
                    <span className="font-semibold leading-tight">
                      1. Banyak seluruh pasangan pakaian adat yang mungkin terbentuk pada ruang sampel <span className="math-var font-bold">n(S)</span> adalah:
                    </span>
                    <input
                      type="text"
                      value={answers.act1_nS}
                      onChange={(e) => updateAnswer('act1_nS', e.target.value)}
                      placeholder="..."
                      className={getFieldClass('act1_nS', 'w-12 h-7 text-center text-xs shrink-0 ml-2')}
                    />
                  </div>

                  <div className="flex items-center justify-between bg-[#FFFBEB] px-2.5 py-1.5 rounded-lg border border-[#D97706]">
                    <span className="font-semibold leading-tight">
                      2. Misalkan kejadian <span className="math-var font-bold">A</span> adalah terpilihnya pasangan <strong>(AG, S)</strong> yaitu <em>Aesan Gede + Songket</em>, maka <span className="math-var font-bold">n(A)</span> =
                    </span>
                    <input
                      type="text"
                      value={answers.act1_nA}
                      onChange={(e) => updateAnswer('act1_nA', e.target.value)}
                      placeholder="..."
                      className={getFieldClass('act1_nA', 'w-12 h-7 text-center text-xs shrink-0 ml-2')}
                    />
                  </div>
                </div>
              </div>

              {/* ==================== AKTIVITAS 2: MENENTUKAN PELUANG TEORETIS ==================== */}
              <div className="mt-2 bg-[#FFFDF7] border-2 border-[#78350F] rounded-xl p-2.5 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#D97706] pb-1 mb-1.5">
                  <h3 className="text-[12.5px] font-black text-[#881337] uppercase">
                    AKTIVITAS 2: MENENTUKAN PELUANG TEORETIS SUATU KEJADIAN
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#B45309] text-[10.5px] font-extrabold text-[#7F1D1D]">
                    Rumus: <span className="math-var">P(A) = n(A) / n(S)</span>
                  </span>
                </div>

                <div className="grid grid-cols-[255px_1fr] gap-2.5 items-center text-[11.5px] text-[#451A03]">
                  {/* Perhitungan Pecahan P(A) */}
                  <div className="bg-[#FFFBEB] border border-[#D97706] rounded-lg px-3 py-1.5 flex items-center justify-between">
                    <div className="font-bold leading-tight">
                      <div>Peluang Teoretis</div>
                      <div className="text-[10.5px] text-[#9A3412]">Kejadian A = (AG, S):</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="math-var font-bold text-[13px]">P(A) =</span>
                      <span className="fraction-box">
                        <input
                          type="text"
                          value={answers.act2_num}
                          onChange={(e) => updateAnswer('act2_num', e.target.value)}
                          placeholder="n(A)"
                          className={getFieldClass('act2_num', 'w-11 h-6 text-center text-xs')}
                        />
                        <span className="fraction-line" />
                        <input
                          type="text"
                          value={answers.act2_den}
                          onChange={(e) => updateAnswer('act2_den', e.target.value)}
                          placeholder="n(S)"
                          className={getFieldClass('act2_den', 'w-11 h-6 text-center text-xs')}
                        />
                      </span>
                    </div>
                  </div>

                  {/* Pertanyaan Pemahaman Aktivitas 2 */}
                  <div className="bg-[#FFFBEB] border border-[#D97706] rounded-lg px-3 py-1.5">
                    <label className="block font-bold text-[11px] text-[#7F1D1D] mb-1">
                      Mengapa setiap kombinasi pakaian adat (AG,S), (AG,J), (AP,S), (AP,J), (BH,S), dan (BH,J) memiliki peluang teoretis yang sama besar?
                    </label>
                    <input
                      type="text"
                      value={answers.act2_reason}
                      onChange={(e) => updateAnswer('act2_reason', e.target.value)}
                      placeholder="Ketik alasanmu (misal: karena setiap pasangan berjumlah 1 dari 6 titik sampel yang sama kemungkinannya)..."
                      className={getFieldClass('act2_reason', 'w-full px-2.5 py-1 text-[11px]')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Halaman 3 */}
            <div className="pt-1 border-t-2 border-[#B45309] flex items-center justify-between text-[11.5px] font-bold text-[#78350F]">
              <span>E-LKPD Matematika SMP/MTs Kelas VIII – Stylist Studio (Palembang Heritage)</span>
              <span className="px-2.5 py-0.5 rounded bg-[#FEF3C7] border border-[#92400E] text-[#7F1D1D] font-extrabold">
                Halaman 3 dari 4
              </span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            HALAMAN 4: AKTIVITAS 3 (FREKUENSI HARAPAN, SIMULASI SPIN 20 PERCOBAAN,
            FREKUENSI RELATIF, & PERBANDINGAN) + EVALUASI SKOR AKHIR
            ==================================================================== */}
        <section id="halaman-4" className="a4-page" aria-label="Halaman 4 Simulasi Spin 20 Percobaan dan Evaluasi">
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '42px',
              width: '642px',
              height: '1038px',
            }}
            className="flex flex-col justify-between"
          >
            <div>
              {/* Header Strip Halaman 4 */}
              <div className="flex items-center justify-between pb-1.5 border-b-[3px] border-[#7F1D1D]">
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#9A3412]">
                    AKTIVITAS 3 • EKSPERIMEN 20 PERCOBAAN ACAK BUSANA ADAT
                  </span>
                  <h2 className="text-[17px] font-black text-[#451A03]">
                    FREKUENSI HARAPAN, SIMULASI SPIN 20 KALI, &amp; FREKUENSI RELATIF
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-md bg-[#7F1D1D] text-[#FEF3C7] border border-[#F59E0B] text-xs font-extrabold">
                  Hal. 4 / 4
                </span>
              </div>

              {/* ==================== BAGIAN 3.1 & 3.3 BERDAMPINGAN ATAU BERURUTAN RINGKAS ==================== */}
              {/* BAGIAN 3.1: MENGHITUNG FREKUENSI HARAPAN (N = 20) */}
              <div className="mt-2 bg-[#FFFDF7] border-2 border-[#78350F] rounded-xl px-3 py-2 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] font-black text-[#7F1D1D] uppercase whitespace-nowrap">
                    Bagian 3.1 – Menghitung Frekuensi Harapan (<span className="math-var">N = 20</span> Percobaan)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#B45309] text-[10.5px] font-extrabold text-[#451A03] whitespace-nowrap">
                    Rumus: <span className="math-var">F_h = N × P(A)</span>
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-2 bg-[#FFFBEB] border border-[#D97706] rounded-lg px-3 py-1.5 text-[11.5px]">
                  <span className="font-semibold text-[#451A03]">
                    Jika roda diputar sebanyak <strong>20 kali</strong> (<span className="math-var">N = 20</span>), frekuensi harapan munculnya pasangan <strong>(AG, S)</strong> adalah:
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="math-var font-bold">F_h =</span>
                    <input
                      type="text"
                      value={answers.act31_N}
                      onChange={(e) => updateAnswer('act31_N', e.target.value)}
                      className={getFieldClass('act31_N', 'w-9 h-6 text-center text-xs')}
                    />
                    <span className="font-bold">×</span>
                    <span className="fraction-box">
                      <input
                        type="text"
                        value={answers.act31_num}
                        onChange={(e) => updateAnswer('act31_num', e.target.value)}
                        placeholder="1"
                        className={getFieldClass('act31_num', 'w-9 h-6 text-center text-xs')}
                      />
                      <span className="fraction-line" />
                      <input
                        type="text"
                        value={answers.act31_den}
                        onChange={(e) => updateAnswer('act31_den', e.target.value)}
                        placeholder="6"
                        className={getFieldClass('act31_den', 'w-9 h-6 text-center text-xs')}
                      />
                    </span>
                    <span className="font-bold">=</span>
                    <input
                      type="text"
                      value={answers.act31_res}
                      onChange={(e) => updateAnswer('act31_res', e.target.value)}
                      placeholder="3,33"
                      className={getFieldClass('act31_res', 'w-14 h-6 text-center text-xs')}
                    />
                    <span className="text-[10px] font-bold text-[#78350F]">kali</span>
                  </div>
                </div>
              </div>

              {/* ==================== BAGIAN 3.2: EKSPERIMEN DIGITAL SPIN 20 PERCOBAAN (3 AREA) ==================== */}
              <div className="mt-2 bg-[#FFFBEB] border-2 border-[#78350F] rounded-xl p-2 shadow-sm">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[12px] font-black text-[#881337] uppercase">
                    Bagian 3.2 – Eksperimen Digital Roda Spin Busana Adat (20 Percobaan)
                  </span>
                  <span className="text-[10.5px] font-bold text-[#78350F]">
                    {spinNotice || 'Klik SPIN 1 KALI atau RANDOMIZE 20 KALI untuk menguji 20 putaran!'}
                  </span>
                </div>

                <div className="grid grid-cols-[172px_228px_214px] gap-2 items-stretch">
                  {/* AREA KIRI: KARAKTER CHIBI HASIL SPIN */}
                  <div className="bg-[#FFFDF7] border-2 border-[#B45309] rounded-lg p-1.5 flex flex-col items-center justify-between">
                    <div className="w-full bg-[#451A03] text-[#FEF3C7] text-[9.5px] font-extrabold uppercase py-0.5 px-2 rounded text-center">
                      KARAKTER HASIL SPIN
                    </div>

                    <div
                      data-testid="spin-result-badge"
                      className="mt-0.5 px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#92400E] text-[9.5px] font-extrabold text-[#7F1D1D] text-center"
                    >
                      {spinTop && spinBottom
                        ? `Terpilih: (${spinTop}, ${spinBottom})`
                        : 'Pakaian Dasar'}
                    </div>

                    <div key={spinPopKey} className="animate-chibi-pop flex items-center justify-center">
                      <PalembangChibiCharacterSvg
                        top={spinTop}
                        bottom={spinBottom}
                        width={126}
                        height={176}
                      />
                    </div>

                    <div className="w-full text-[9px] font-bold text-[#78350F] text-center bg-[#FFFBEB] py-0.5 px-1 rounded border border-[#D97706]">
                      {spinTop && spinBottom
                        ? ALL_OUTFITS.find((o) => o.key === `${spinTop},${spinBottom}`)?.fullTitle
                        : 'Menunggu putaran roda...'}
                    </div>
                  </div>

                  {/* AREA TENGAH: RODA SPIN 6 SEKTOR + 3 TOMBOL KONTROL */}
                  <div className="bg-[#FFFDF7] border-2 border-[#B45309] rounded-lg p-1.5 flex flex-col items-center justify-between">
                    <div className="w-full bg-[#881337] text-[#FEF3C7] text-[9.5px] font-extrabold uppercase py-0.5 px-2 rounded text-center">
                      RODA SPIN 6 PASANGAN ADAT
                    </div>

                    <div className="my-1 flex items-center justify-center">
                      <PalembangSpinWheelSvg angle={wheelAngle} size={166} />
                    </div>

                    {/* 3 Tombol Kontrol Simulasi */}
                    <div className="w-full space-y-1">
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          data-testid="btn-spin-1"
                          onClick={handleSpinOnce}
                          disabled={isAutoSpinning}
                          className="py-1 px-1.5 rounded bg-[#9A3412] hover:bg-[#7F1D1D] text-[#FEF3C7] border border-[#FBBF24] font-extrabold text-[10px] cursor-pointer transition disabled:opacity-50"
                        >
                          SPIN 1 KALI
                        </button>
                        <button
                          type="button"
                          data-testid="btn-reset-data"
                          onClick={handleResetSpin}
                          className="py-1 px-1.5 rounded bg-[#451A03] hover:bg-[#291811] text-[#FDE68A] border border-[#B45309] font-extrabold text-[10px] cursor-pointer transition"
                        >
                          RESET DATA
                        </button>
                      </div>
                      <button
                        type="button"
                        data-testid="btn-randomize-20"
                        onClick={handleRandomizeTwenty}
                        disabled={isAutoSpinning}
                        className="w-full py-1.5 px-2 rounded bg-[#F59E0B] hover:bg-[#D97706] text-[#451A03] border-2 border-[#78350F] font-black text-[10.5px] tracking-wide shadow-sm cursor-pointer transition disabled:opacity-60"
                      >
                        {isAutoSpinning ? 'MEMUTAR 20 KALI...' : 'RANDOMIZE 20 KALI'}
                      </button>
                    </div>
                  </div>

                  {/* AREA KANAN: TABEL STATISTIK REAL-TIME */}
                  <div className="bg-[#FFFDF7] border-2 border-[#B45309] rounded-lg p-1.5 flex flex-col justify-between">
                    <div className="bg-[#7F1D1D] text-[#FEF3C7] text-[9.5px] font-extrabold uppercase py-0.5 px-2 rounded text-center">
                      TABEL STATISTIK REAL-TIME
                    </div>

                    <table className="mt-1 w-full border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-[#FEF3C7] text-[#451A03] font-black">
                          <th className="border border-[#78350F] py-1 px-1.5 text-left">
                            Pasangan Pakaian
                          </th>
                          <th className="border border-[#78350F] py-1 px-1 text-center w-[68px]">
                            Frekuensi (k)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ALL_OUTFITS.map((item) => {
                          const isHighlighted = item.key === 'AG,S';
                          return (
                            <tr
                              key={item.key}
                              className={isHighlighted ? 'bg-[#FEF3C7] font-extrabold' : 'bg-[#FFFDF7]'}
                            >
                              <td className="border border-[#78350F] py-1 px-1.5 text-[#451A03]">
                                <span className="font-black text-[#881337]">{item.label}</span>{' '}
                                <span className="text-[8.5px] text-[#78350F]">{item.fullTitle}</span>
                              </td>
                              <td
                                data-testid={`stat-${item.key}`}
                                className="border border-[#78350F] py-1 px-1 text-center font-black text-[11px] text-[#7F1D1D]"
                              >
                                {stats[item.key]}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#451A03] text-[#FEF3C7] font-black">
                          <td className="border border-[#451A03] py-1 px-1.5">
                            Total Percobaan (N)
                          </td>
                          <td
                            data-testid="stat-total-trials"
                            className="border border-[#451A03] py-1 px-1 text-center text-[#FDE047] text-[11.5px]"
                          >
                            {totalTrials}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="mt-1 text-[8.5px] font-bold text-[#78350F] text-center">
                      Target Eksperimen: <strong>N = 20 Percobaan</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================== BAGIAN 3.3: MENGHITUNG FREKUENSI RELATIF (N = 20) ==================== */}
              <div className="mt-2 bg-[#FFFDF7] border-2 border-[#78350F] rounded-xl px-3 py-2 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] font-black text-[#9A3412] uppercase whitespace-nowrap">
                    Bagian 3.3 – Menghitung Frekuensi Relatif Hasil Percobaan (<span className="math-var">N = 20</span>)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#B45309] text-[10.5px] font-extrabold text-[#451A03] whitespace-nowrap">
                    Rumus: <span className="math-var">F_r = k / N</span>
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-2 bg-[#FFFBEB] border border-[#D97706] rounded-lg px-3 py-1.5 text-[11.5px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-[#451A03]">
                      Berdasarkan tabel di atas, pasangan <strong>(AG, S)</strong> muncul sebanyak <span className="math-var font-bold">k</span> =
                    </span>
                    <input
                      type="text"
                      value={answers.act33_k}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAnswers((prev) => ({
                          ...prev,
                          act33_k: val,
                          act33_num: val,
                        }));
                      }}
                      placeholder="k"
                      className={getFieldClass('act33_k', 'w-10 h-6 text-center text-xs')}
                    />
                    <span className="font-semibold text-[#451A03]">
                      kali dari <span className="math-var font-bold">N</span> =
                    </span>
                    <input
                      type="text"
                      value={answers.act33_N}
                      onChange={(e) => updateAnswer('act33_N', e.target.value)}
                      className={getFieldClass('act33_N', 'w-10 h-6 text-center text-xs')}
                    />
                    <span className="font-semibold text-[#451A03]">percobaan.</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="math-var font-bold">F_r =</span>
                    <span className="fraction-box">
                      <input
                        type="text"
                        value={answers.act33_num}
                        onChange={(e) => updateAnswer('act33_num', e.target.value)}
                        placeholder="k"
                        className={getFieldClass('act33_num', 'w-10 h-6 text-center text-xs')}
                      />
                      <span className="fraction-line" />
                      <input
                        type="text"
                        value={answers.act33_den}
                        onChange={(e) => updateAnswer('act33_den', e.target.value)}
                        placeholder="20"
                        className={getFieldClass('act33_den', 'w-10 h-6 text-center text-xs')}
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* ==================== BAGIAN 3.4: MEMBANDINGKAN HASIL PERCOBAAN ==================== */}
              <div className="mt-2 bg-[#FFFDF7] border-2 border-[#78350F] rounded-xl px-3 py-2 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11.5px] font-black text-[#451A03] uppercase">
                    Bagian 3.4 – Membandingkan Peluang Teoretis (<span className="math-var">P(A) = 1/6</span>) &amp; Frekuensi Relatif (<span className="math-var">F_r = k/20</span>)
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#451A03]">
                  <div className="grid grid-cols-[245px_1fr] items-center gap-2">
                    <label className="font-bold text-[#7F1D1D]">
                      1. Apakah ke-6 pasangan selalu muncul dengan jumlah sama?
                    </label>
                    <input
                      type="text"
                      value={answers.act34_q1}
                      onChange={(e) => updateAnswer('act34_q1', e.target.value)}
                      placeholder="Contoh: Tidak selalu sama, karena hasil putaran bervariasi..."
                      className={getFieldClass('act34_q1', 'px-2 py-1 text-[11px] w-full')}
                    />
                  </div>

                  <div className="grid grid-cols-[245px_1fr] items-center gap-2">
                    <label className="font-bold text-[#7F1D1D]">
                      2. Mengapa hasil percobaan berbeda dari frekuensi harapan?
                    </label>
                    <input
                      type="text"
                      value={answers.act34_q2}
                      onChange={(e) => updateAnswer('act34_q2', e.target.value)}
                      placeholder="Contoh: Karena frekuensi harapan adalah prediksi teoretis sedangkan percobaan bersifat acak..."
                      className={getFieldClass('act34_q2', 'px-2 py-1 text-[11px] w-full')}
                    />
                  </div>

                  <div className="grid grid-cols-[245px_1fr] items-center gap-2">
                    <label className="font-bold text-[#7F1D1D]">
                      3. Bagaimana hubungan <span className="math-var">P(A)</span>, <span className="math-var">F_h</span>, dan <span className="math-var">F_r</span>?
                    </label>
                    <input
                      type="text"
                      value={answers.act34_q3}
                      onChange={(e) => updateAnswer('act34_q3', e.target.value)}
                      placeholder="Contoh: Semakin banyak percobaan N dilakukan, nilai Fr akan semakin mendekati P(A)..."
                      className={getFieldClass('act34_q3', 'px-2 py-1 text-[11px] w-full')}
                    />
                  </div>
                </div>
              </div>

              {/* ==================== PANEL EVALUASI SKOR AKHIR & TOMBOL AKSI ==================== */}
              <div className="mt-2 bg-[#451A03] border-2 border-[#F59E0B] rounded-xl px-3.5 py-2 text-[#FEF3C7] shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      data-testid="final-score-box"
                      className="px-3 py-1 rounded-lg bg-[#881337] border-2 border-[#FBBF24] text-center shrink-0"
                    >
                      <div className="text-[9px] font-bold uppercase text-[#FDE68A]">Skor Akhir</div>
                      <div className="text-[18px] font-black text-[#FEF3C7] leading-none">
                        {hasChecked ? finalScore : '--'}/100
                      </div>
                    </div>
                    <div className="text-[10.5px] leading-snug text-[#FDE68A] max-w-[260px]">
                      {feedbackBanner ||
                        'Pastikan semua jawaban pada Halaman 2, 3, dan 4 serta 6 sel Tabel Aktivitas 1 telah terisi.'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      data-testid="btn-check-answers"
                      onClick={handleCheckAnswers}
                      className="px-3 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#451A03] border-2 border-[#FEF3C7] font-black text-[11px] cursor-pointer transition shadow"
                    >
                      PERIKSA SEMUA JAWABAN
                    </button>
                    <button
                      type="button"
                      data-testid="btn-download-pdf"
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf}
                      className="px-3 py-2 rounded-lg bg-[#881337] hover:bg-[#991B1B] text-[#FEF3C7] border-2 border-[#FBBF24] font-black text-[11px] cursor-pointer transition shadow disabled:opacity-60"
                    >
                      {isDownloadingPdf ? 'MENYIAPKAN PDF...' : 'DOWNLOAD PDF 4 HALAMAN'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Halaman 4 */}
            <div className="pt-1 border-t-2 border-[#B45309] flex items-center justify-between text-[11.5px] font-bold text-[#78350F]">
              <span>E-LKPD Matematika SMP/MTs Kelas VIII – Stylist Studio (Palembang Heritage)</span>
              <span className="px-2.5 py-0.5 rounded bg-[#FEF3C7] border border-[#92400E] text-[#7F1D1D] font-extrabold">
                Halaman 4 dari 4
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
