import React, { useState } from 'react';
import {
  ShirtCode,
  PantsCode,
  SimulationStats,
  INITIAL_STATS,
  ALL_OUTFITS,
  StudentAnswers,
  INITIAL_ANSWERS,
  ValidationMap,
  evaluateStudentAnswers,
  calculateProgressPercentage,
  runRandomTrials,
} from './utils/lkpdLogic';
import { soundEngine } from './utils/soundEngine';
import { ShirtSvg, PantsSvg, ChibiCharacterSvg, SHIRT_COLORS, PANTS_COLORS } from './components/SvgAssets';

export default function App() {
  // Simulator State
  const [selectedShirt, setSelectedShirt] = useState<ShirtCode>('M');
  const [selectedPants, setSelectedPants] = useState<PantsCode>('P');
  const [popKey, setPopKey] = useState<number>(1);
  const [stats, setStats] = useState<SimulationStats>(INITIAL_STATS);
  const [totalTrials, setTotalTrials] = useState<number>(0);

  // Audio State
  const [bgmOn, setBgmOn] = useState<boolean>(false);
  const [sfxOn, setSfxOn] = useState<boolean>(true);

  // Student Worksheet Answers State
  const [answers, setAnswers] = useState<StudentAnswers>(INITIAL_ANSWERS);
  const [validation, setValidation] = useState<ValidationMap>({});
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [feedbackBanner, setFeedbackBanner] = useState<string>('');

  const progressPct = calculateProgressPercentage(answers);

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

  // Select Shirt or Pants manually
  const handleSelectShirt = (code: ShirtCode) => {
    setSelectedShirt(code);
    setPopKey((k) => k + 1);
    soundEngine.playPopSfx();
  };

  const handleSelectPants = (code: PantsCode) => {
    setSelectedPants(code);
    setPopKey((k) => k + 1);
    soundEngine.playPopSfx();
  };

  // Acak 1 Kali
  const handleRandomizeOne = () => {
    const idx = Math.floor(Math.random() * ALL_OUTFITS.length);
    const chosen = ALL_OUTFITS[idx];
    setSelectedShirt(chosen.shirt);
    setSelectedPants(chosen.pants);
    setPopKey((k) => k + 1);
    soundEngine.playPopSfx();

    setStats((prev) => {
      const next = { ...prev, [chosen.key]: prev[chosen.key] + 1 };
      const nextTotal = Object.values(next).reduce((a, b) => a + b, 0);
      setTotalTrials(nextTotal);
      if (nextTotal === 30) {
        const kVal = String(next['M,P']);
        setAnswers((ans) => ({
          ...ans,
          act32_k: kVal,
          act32_num: ans.act32_num || kVal,
        }));
      }
      return next;
    });
  };

  // Randomize 30 Kali
  const handleRandomizeThirty = () => {
    soundEngine.playGachaSpinSfx();
    const { stats: newStats, lastOutfit } = runRandomTrials(30);
    setSelectedShirt(lastOutfit.shirt);
    setSelectedPants(lastOutfit.pants);
    setPopKey((k) => k + 1);
    setStats(newStats);
    setTotalTrials(30);

    const kVal = String(newStats['M,P']);
    setAnswers((prev) => ({
      ...prev,
      act32_k: kVal,
      act32_num: kVal,
      act33_num: prev.act33_num || kVal,
      act33_mult: prev.act33_mult || kVal,
    }));
  };

  // Reset Data Simulator
  const handleResetSimulator = () => {
    soundEngine.playPopSfx();
    setStats(INITIAL_STATS);
    setTotalTrials(0);
    setSelectedShirt('M');
    setSelectedPants('P');
    setPopKey((k) => k + 1);
  };

  // Handle Manual Edit of k in Activity 3.2
  const handleChangeK = (val: string) => {
    setAnswers((prev) => ({
      ...prev,
      act32_k: val,
    }));
  };

  // Check All Answers & Play Score Sound
  const handleCheckAllAnswers = () => {
    const res = evaluateStudentAnswers(answers);
    setValidation(res.validation);
    setFinalScore(res.score);
    setHasChecked(true);
    soundEngine.playCheckAnswerSfx(res.score >= 75);

    if (res.score === 100) {
      setFeedbackBanner('Luar biasa! Seluruh jawaban tepat (Skor 100/100).');
    } else if (res.score >= 75) {
      setFeedbackBanner(
        `Bagus sekali! Skor ${res.score}/100 (${res.correctCount}/${res.totalGradable} benar).`
      );
    } else {
      setFeedbackBanner(
        `Skor: ${res.score}/100 (${res.correctCount}/${res.totalGradable} benar). Perbaiki kotak merah.`
      );
    }
  };

  // Toggle Audio Controls
  const handleToggleBgm = () => {
    const next = soundEngine.toggleBgm();
    setBgmOn(next);
  };

  const handleToggleSfx = () => {
    const next = soundEngine.toggleSfx();
    setSfxOn(next);
  };

  // Print A4
  const handlePrintA4 = () => {
    window.print();
  };

  const displayedK = answers.act32_k.trim() !== '' ? answers.act32_k.trim() : String(stats['M,P'] || 'k');

  return (
    <div className="min-h-screen relative">
      {/* Top Progress & Page Navigation Bar (Hidden when printing) */}
      <header
        className="no-print fixed top-0 left-0 right-0 z-40 bg-[#1E3A8A] text-white border-b-2 border-[#F472B6] shadow-md"
        style={{ height: '52px' }}
      >
        <div className="max-w-[1280px] mx-auto h-full px-4 flex items-center justify-between gap-4">
          {/* Brand & Progress */}
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-sm tracking-tight bg-[#EC4899] px-3 py-1 rounded-full border border-white whitespace-nowrap">
              STYLIST STUDIO VIII
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#FEF3C7] whitespace-nowrap">
                Progres Pengerjaan:
              </span>
              <div
                className="w-36 h-3.5 bg-slate-800 rounded-full overflow-hidden border border-[#93C5FD]"
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progres pengerjaan E-LKPD"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#FACC15] to-[#F472B6] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-[#FACC15] tabular-nums">
                {progressPct}%
              </span>
            </div>
          </div>

          {/* Quick Jump to 5 Pages */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold" aria-label="Navigasi Halaman">
            {[1, 2, 3, 4, 5].map((p) => (
              <a
                key={p}
                href={`#halaman-${p}`}
                className="px-2.5 py-1 rounded bg-[#2563EB] hover:bg-[#EC4899] text-white transition-colors whitespace-nowrap"
              >
                Hal. {p}
              </a>
            ))}
          </nav>

          {/* Floating Audio Bar in Top Right */}
          <div className="flex items-center gap-2 shrink-0" role="region" aria-label="Kontrol Audio">
            <button
              type="button"
              onClick={handleToggleBgm}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold border-2 border-white transition-colors cursor-pointer whitespace-nowrap ${
                bgmOn ? 'bg-[#16A34A] text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              Musik BGM: {bgmOn ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={handleToggleSfx}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold border-2 border-white transition-colors cursor-pointer whitespace-nowrap ${
                sfxOn ? 'bg-[#EC4899] text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              Efek Suara: {sfxOn ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </header>

      {/* Main 5-Page A4 Vertical Workspace */}
      <main className="lkpd-workspace">
        {/* ====================================================================
            HALAMAN 1: HALAMAN SAMPUL / COVER LKPD (794px x 1123px)
           ==================================================================== */}
        <section
          id="halaman-1"
          className="a4-page"
          aria-label="Halaman 1: Sampul E-LKPD"
        >
          {/* Bingkai Dekoratif Ganda (X=40px, Y=40px, W=714px, H=1043px, radius=18px) */}
          <div
            style={{
              position: 'absolute',
              left: '40px',
              top: '40px',
              width: '714px',
              height: '1043px',
              borderRadius: '18px',
              border: '3px solid #1E3A8A',
              padding: '6px',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                border: '2px dashed #F472B6',
              }}
            />
          </div>

          {/* 1. Pita Identitas Kurikulum (X = 197px, Y = 72px | Lebar 400px, Tinggi 36px) */}
          <div
            style={{
              position: 'absolute',
              left: '197px',
              top: '72px',
              width: '400px',
              height: '36px',
              backgroundColor: '#1E3A8A',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '13.3px',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}
          >
            KURIKULUM MERDEKA - FASE D SMP/MTs
          </div>

          {/* 2. Blok Judul Utama Cover (X = 76px, Y = 128px | Lebar 642px, Tinggi 85px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '128px',
              width: '642px',
              height: '85px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h1 className="cover-h1 m-0" style={{ color: '#0F172A' }}>
              LEMBAR KERJA PESERTA DIDIK
            </h1>
            <div className="cover-h1" style={{ color: '#EC4899' }}>
              (E-LKPD INTERAKTIF)
            </div>
          </div>

          {/* 3. Blok Subjudul Materi (X = 97px, Y = 222px | Lebar 600px, Tinggi 75px) */}
          <div
            style={{
              position: 'absolute',
              left: '97px',
              top: '222px',
              width: '600px',
              height: '75px',
              backgroundColor: '#FFFBEB',
              border: '2px solid #FBBF24',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '6px 12px',
            }}
          >
            <h2
              className="m-0 whitespace-nowrap"
              style={{
                fontSize: '15.2px',
                fontWeight: 800,
                lineHeight: 1.35,
                color: '#1E3A8A',
              }}
            >
              TOPIK: PELUANG TEORETIS, FREKUENSI RELATIF, &amp; FREKUENSI HARAPAN
            </h2>
            <div
              className="whitespace-nowrap"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#B45309',
                marginTop: '4px',
              }}
            >
              Petualangan Matematika di Butik Digital &apos;Stylist Studio&apos; (4 JP)
            </div>
          </div>

          {/* 4. Area Ilustrasi Sampul Lucu (X = 137px, Y = 315px | Lebar 520px, Tinggi 265px) */}
          <div
            style={{
              position: 'absolute',
              left: '137px',
              top: '315px',
              width: '520px',
              height: '265px',
              background: 'linear-gradient(180deg, #E0F2FE 0%, #FFFBEB 45%, #FDF2F8 100%)',
              border: '3px solid #1E293B',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Atap Kanopi Belang Pink-Putih */}
            <div
              className="boutique-canopy flex items-center justify-between px-3"
              style={{ width: '100%', height: '26px' }}
            >
              <span className="bg-[#3B4252] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-white">
                ♦ #GL2 STYLIST STUDIO
              </span>
              <span className="bg-[#EC4899] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-white">
                DRESS-UP MATH
              </span>
            </div>

            {/* Ilustrasi Sampul Gacha Life 2 Style: 3 Kemeja di Kiri, Gacha Chibi di Tengah, 2 Celana di Kanan + Balon P(B)=1/6 */}
            <div className="relative w-full h-[233px] flex items-center justify-between px-3">
              {/* Kiri: Gacha Customize Slot - 3 Kemeja (Merah, Biru, Kuning) */}
              <div
                style={{ width: '166px' }}
                className="flex flex-col items-center bg-[#4A4E69] border-2 border-[#1E293B] rounded-xl overflow-hidden shadow-sm"
              >
                <div className="w-full bg-[#3B3F58] text-white text-[10px] font-extrabold text-center py-1 border-b border-[#1E293B]">
                  UPPER: 3 KEMEJA (M, B, K)
                </div>
                <div className="flex items-center justify-center gap-1 p-1.5 bg-[#E0E7FF] w-full">
                  {(['M', 'B', 'K'] as ShirtCode[]).map((c) => (
                    <div
                      key={c}
                      className="flex flex-col items-center bg-white border border-[#4A4E69] rounded-lg p-0.5"
                    >
                      <ShirtSvg code={c} width={44} height={42} />
                      <span className="text-[9.5px] font-extrabold text-[#1E293B]">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tengah: Karakter Chibi Gacha Life 2 + Balon Teks P(B) = 1/6 */}
              <div className="relative flex flex-col items-center justify-center">
                {/* Balon Teks Lucu */}
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '-44px',
                    backgroundColor: '#FFFFFF',
                    border: '2.5px solid #1E293B',
                    borderRadius: '14px',
                    padding: '2px 8px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    color: '#1E3A8A',
                    boxShadow: '0 3px 0 #F472B6',
                    zIndex: 10,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span className="math-var">P(B)</span> = 1/6
                </div>
                <ChibiCharacterSvg shirt="M" pants="P" width={145} height={212} />
              </div>

              {/* Kanan: Gacha Customize Slot - 2 Celana (Putih, Hitam) */}
              <div
                style={{ width: '138px' }}
                className="flex flex-col items-center bg-[#4A4E69] border-2 border-[#1E293B] rounded-xl overflow-hidden shadow-sm"
              >
                <div className="w-full bg-[#3B3F58] text-white text-[10px] font-extrabold text-center py-1 border-b border-[#1E293B]">
                  LOWER: 2 CELANA (P, H)
                </div>
                <div className="flex items-center justify-center gap-1.5 p-1.5 bg-[#E0E7FF] w-full">
                  {(['P', 'H'] as PantsCode[]).map((c) => (
                    <div
                      key={c}
                      className="flex flex-col items-center bg-white border border-[#4A4E69] rounded-lg px-1.5 py-0.5"
                    >
                      <PantsSvg code={c} width={46} height={42} showHanger />
                      <span className="text-[9.5px] font-extrabold text-[#1E293B]">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Kotak Identitas Kelompok & Kelas (X = 117px, Y = 600px | Lebar 560px, Tinggi 380px) */}
          <div
            style={{
              position: 'absolute',
              left: '117px',
              top: '600px',
              width: '560px',
              height: '380px',
              backgroundColor: '#FFFFFF',
              border: '2.5px solid #1E3A8A',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            {/* Header Kotak (Tinggi 42px) */}
            <div
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: '#1E3A8A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              IDENTITAS KELOMPOK &amp; KELAS
            </div>
          </div>

          {/* Isi Formulir pada Koordinat Absolut Halaman 1 (Mulai dari X = 145px, lebar area 504px) */}
          {/* Baris 1 (Y = 660px) */}
          <div
            style={{
              position: 'absolute',
              left: '145px',
              top: '660px',
              width: '504px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#0F172A',
            }}
          >
            <label htmlFor="input-group-name" style={{ width: '155px' }}>
              Nama Kelompok
            </label>
            <span>:</span>
            <input
              id="input-group-name"
              type="text"
              maxLength={35}
              placeholder="Contoh: Kelompok 1 (Pascal)"
              value={answers.groupName}
              onChange={(e) => updateAnswer('groupName', e.target.value)}
              className="student-input left-align"
              style={{ width: '330px', height: '32px' }}
            />
          </div>

          {/* Baris 2 (Y = 702px) */}
          <div
            style={{
              position: 'absolute',
              left: '145px',
              top: '702px',
              width: '504px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#0F172A',
            }}
          >
            <label htmlFor="input-class-sem" style={{ width: '155px' }}>
              Kelas / Semester
            </label>
            <span>:</span>
            <input
              id="input-class-sem"
              type="text"
              maxLength={30}
              value={answers.classSemester}
              onChange={(e) => updateAnswer('classSemester', e.target.value)}
              className="student-input left-align"
              style={{ width: '330px', height: '32px' }}
            />
          </div>

          {/* Baris 3 (Y = 744px) */}
          <div
            style={{
              position: 'absolute',
              left: '145px',
              top: '744px',
              width: '504px',
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#1E3A8A',
            }}
          >
            Nama Anggota Kelompok (Beserta Nomor Presensi):
          </div>

          {/* Baris Anggota 1 (Y = 774px) */}
          <div
            style={{
              position: 'absolute',
              left: '145px',
              top: '774px',
              width: '504px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            <label htmlFor="member-1">1.</label>
            <input
              id="member-1"
              type="text"
              maxLength={48}
              placeholder="Nama Lengkap Anggota 1 (No. Presensi: ...)"
              value={answers.member1}
              onChange={(e) => updateAnswer('member1', e.target.value)}
              className="student-input left-align"
              style={{ width: '475px', height: '30px' }}
            />
          </div>

          {/* Baris Anggota 2 (Y = 812px) */}
          <div
            style={{
              position: 'absolute',
              left: '145px',
              top: '812px',
              width: '504px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            <label htmlFor="member-2">2.</label>
            <input
              id="member-2"
              type="text"
              maxLength={48}
              placeholder="Nama Lengkap Anggota 2 (No. Presensi: ...)"
              value={answers.member2}
              onChange={(e) => updateAnswer('member2', e.target.value)}
              className="student-input left-align"
              style={{ width: '475px', height: '30px' }}
            />
          </div>

          {/* Baris Anggota 3 (Y = 850px) */}
          <div
            style={{
              position: 'absolute',
              left: '145px',
              top: '850px',
              width: '504px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            <label htmlFor="member-3">3.</label>
            <input
              id="member-3"
              type="text"
              maxLength={48}
              placeholder="Nama Lengkap Anggota 3 (No. Presensi: ...)"
              value={answers.member3}
              onChange={(e) => updateAnswer('member3', e.target.value)}
              className="student-input left-align"
              style={{ width: '475px', height: '30px' }}
            />
          </div>

          {/* Baris Anggota 4 (Y = 888px) */}
          <div
            style={{
              position: 'absolute',
              left: '145px',
              top: '888px',
              width: '504px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            <label htmlFor="member-4">4.</label>
            <input
              id="member-4"
              type="text"
              maxLength={48}
              placeholder="Nama Lengkap Anggota 4 (No. Presensi: ...)"
              value={answers.member4}
              onChange={(e) => updateAnswer('member4', e.target.value)}
              className="student-input left-align"
              style={{ width: '475px', height: '30px' }}
            />
          </div>

          {/* Baris Anggota 5 (Y = 926px) */}
          <div
            style={{
              position: 'absolute',
              left: '145px',
              top: '926px',
              width: '504px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            <label htmlFor="member-5">5.</label>
            <input
              id="member-5"
              type="text"
              maxLength={48}
              placeholder="Nama Lengkap Anggota 5 (Opsional)"
              value={answers.member5}
              onChange={(e) => updateAnswer('member5', e.target.value)}
              className="student-input left-align"
              style={{ width: '475px', height: '30px' }}
            />
          </div>

          {/* 6. Footer Sampul (X = 76px, Y = 1005px | Lebar 642px, Tinggi 55px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '1005px',
              width: '642px',
              height: '55px',
              textAlign: 'center',
              fontSize: '13.3px',
              fontWeight: 600,
              color: '#475569',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              lineHeight: 1.45,
            }}
          >
            <div>MATA PELAJARAN MATEMATIKA - FASE D KELAS VIII SMP/MTs</div>
            <div>Berdasarkan CP SK Kepala BSKAP Nomor 046/H/KR/2025</div>
          </div>
        </section>

        {/* ====================================================================
            HALAMAN 2: PETUNJUK, CP & TP, RINGKASAN MATERI, & APERSEPSI
           ==================================================================== */}
        <section
          id="halaman-2"
          className="a4-page"
          aria-label="Halaman 2: Petunjuk, CP & TP, Materi, dan Apersepsi"
        >
          {/* 1. Running Header Halaman 2 (X = 76px, Y = 45px | Lebar 642px, Tinggi 32px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '45px',
              width: '642px',
              height: '32px',
              borderBottom: '2px solid #1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1E3A8A',
            }}
          >
            <span>E-LKPD MATEMATIKA KELAS VIII: STYLIST STUDIO</span>
            <span>Halaman 2 dari 5</span>
          </div>

          {/* 2. Kotak A: Petunjuk Penggunaan E-LKPD (X = 76px, Y = 90px | Lebar 642px, Tinggi 205px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '90px',
              width: '642px',
              height: '205px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '12px 16px',
              overflow: 'hidden',
            }}
          >
            <h3
              className="m-0 mb-1.5"
              style={{ fontSize: '15.5px', fontWeight: 700, color: '#1E3A8A' }}
            >
              A. PETUNJUK PENGGUNAAN E-LKPD
            </h3>
            <ol
              className="numbered-list m-0 pl-5 space-y-1"
              style={{ fontSize: '13.4px', lineHeight: 1.44, color: '#0F172A' }}
            >
              <li>Berdoalah terlebih dahulu sebelum memulai kegiatan pembelajaran ini.</li>
              <li>Tuliskan nama kelompok, kelas, dan nama anggota kelompok pada halaman sampul.</li>
              <li>Bacalah Capaian Pembelajaran dan Tujuan Pembelajaran dengan cermat.</li>
              <li>Gunakan simulator karakter Chibi &quot;Stylist Studio&quot; untuk eksplorasi data.</li>
              <li>Diskusikan setiap pertanyaan bersama anggota kelompokmu dan isilah kotak kuning.</li>
              <li>Periksa kembali seluruh jawabanmu sebelum menekan tombol evaluasi di halaman akhir.</li>
            </ol>
          </div>

          {/* 3. Kotak B: Capaian & Tujuan Pembelajaran (X = 76px, Y = 310px | Lebar 642px, Tinggi 245px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '310px',
              width: '642px',
              height: '245px',
              backgroundColor: '#EFF6FF',
              border: '1.5px solid #93C5FD',
              borderLeft: '5px solid #1E3A8A',
              borderRadius: '10px',
              padding: '12px 16px',
              overflow: 'hidden',
            }}
          >
            <h3
              className="m-0 mb-1.5"
              style={{ fontSize: '15.5px', fontWeight: 700, color: '#1E3A8A' }}
            >
              B. CAPAIAN &amp; TUJUAN PEMBELAJARAN
            </h3>
            <div style={{ fontSize: '12.9px', lineHeight: 1.44, color: '#0F172A' }}>
              <p className="m-0 mb-2">
                <strong className="text-[#1E3A8A]">Capaian Pembelajaran (SK BSKAP 046/H/KR/2025):</strong>{' '}
                &quot;Murid dapat menjelaskan dan menggunakan pengertian peluang dan frekuensi relatif untuk menentukan frekuensi harapan satu kejadian pada suatu percobaan sederhana (semua hasil percobaan dapat muncul secara merata).&quot;
              </p>
              <div className="space-y-1.5">
                <div>
                  <strong className="text-[#1E3A8A]">• TP.K1 (2 JP):</strong> Peserta didik dapat menjelaskan pengertian peluang teoretis dan menggunakannya untuk menentukan frekuensi harapan suatu kejadian pada percobaan sederhana dengan tepat.
                </div>
                <div>
                  <strong className="text-[#1E3A8A]">• TP.K2 (2 JP):</strong> Peserta didik dapat menjelaskan pengertian frekuensi relatif dan menggunakannya untuk memperkirakan frekuensi harapan serta membandingkannya terhadap nilai peluang teoretis pada percobaan sederhana.
                </div>
              </div>
            </div>
          </div>

          {/* 4. Kotak C: Informasi Pendukung / Ringkasan Materi Pokok (X = 76px, Y = 570px | Lebar 642px, Tinggi 240px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '570px',
              width: '642px',
              height: '240px',
              backgroundColor: '#FFFBEB',
              border: '2px solid #FBBF24',
              borderRadius: '10px',
              padding: '10px 16px',
              overflow: 'hidden',
            }}
          >
            <h3
              className="m-0 mb-1"
              style={{ fontSize: '15.5px', fontWeight: 700, color: '#92400E' }}
            >
              C. INFORMASI PENDUKUNG (RINGKASAN MATERI POKOK)
            </h3>
            <ol
              className="numbered-list m-0 pl-5 space-y-1"
              style={{ fontSize: '12.6px', lineHeight: 1.34, color: '#0F172A' }}
            >
              <li>
                <strong>Ruang Sampel (<span className="math-var">S</span>)</strong> adalah himpunan seluruh hasil yang mungkin muncul pada percobaan sederhana. Setiap anggota dari <span className="math-var">S</span> disebut <strong>Titik Sampel</strong>, dan banyak anggota ruang sampel dilambangkan dengan <span className="math-var">n(S)</span>.
              </li>
              <li>
                <strong>Peluang Teoretis <span className="math-var">P(A)</span></strong> adalah rasio banyaknya kejadian <span className="math-var">A</span> terhadap total anggota ruang sampel:{' '}
                <span className="math-var">P(A) = n(A) / n(S)</span> ={' '}
                <span className="fraction" style={{ fontSize: '11px', lineHeight: 1.02 }}>
                  <span className="num math-var" style={{ padding: '0 4px' }}>n(A)</span>
                  <span className="den math-var" style={{ padding: '0 4px' }}>n(S)</span>
                </span>.
              </li>
              <li>
                <strong>Frekuensi Relatif / Peluang Empiris (<span className="math-var">f_r</span>)</strong> adalah perbandingan kemunculan kejadian pada percobaan nyata (<span className="math-var">k</span>) terhadap banyak percobaan (<span className="math-var">N</span>):{' '}
                <span className="math-var">f_r = k / N</span> ={' '}
                <span className="fraction" style={{ fontSize: '11px', lineHeight: 1.02 }}>
                  <span className="num math-var" style={{ padding: '0 4px' }}>k</span>
                  <span className="den math-var" style={{ padding: '0 4px' }}>N</span>
                </span>.
              </li>
              <li>
                <strong>Frekuensi Harapan (<span className="math-var">F_h</span>)</strong> adalah estimasi banyaknya kejadian <span className="math-var">A</span> terjadi dalam <span className="math-var">N</span> kali percobaan:{' '}
                <span className="math-var">F_h = N × P(A)</span> atau <span className="math-var">F_h = N × f_r</span>.
              </li>
            </ol>
          </div>

          {/* 5. Kotak D: Apersepsi Materi Prasyarat (TP.P1 & TP.P2) (X = 76px, Y = 825px | Lebar 642px, Tinggi 220px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '825px',
              width: '642px',
              height: '220px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #2563EB',
              borderRadius: '10px',
              padding: '12px 16px',
              overflow: 'hidden',
            }}
          >
            <h3
              className="m-0 mb-2.5"
              style={{ fontSize: '15.5px', fontWeight: 700, color: '#2563EB' }}
            >
              D. APERSEPSI: MATERI PRASYARAT PECAHAN (TP.P1 &amp; TP.P2)
            </h3>

            {/* Baris 1 (TP.P1 - Menyederhanakan Pecahan) */}
            <div
              className="flex items-center gap-2 mb-3 bg-[#EFF6FF] px-3 py-1.5 rounded-lg whitespace-nowrap"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              <span>1. Sederhanakan pecahan biasa berikut:</span>
              <span className="fraction">
                <span className="num">2</span>
                <span className="den">6</span>
              </span>
              <span>=</span>
              <span className="fraction">
                <span className="num">
                  <input
                    type="text"
                    aria-label="Apersepsi 1 Pembilang 2/6"
                    value={answers.ap1_num1}
                    onChange={(e) => updateAnswer('ap1_num1', e.target.value)}
                    className={getFieldClass('ap1_num1')}
                    style={{ width: '42px', height: '25px' }}
                  />
                </span>
                <span className="den">
                  <input
                    type="text"
                    aria-label="Apersepsi 1 Penyebut 2/6"
                    value={answers.ap1_den1}
                    onChange={(e) => updateAnswer('ap1_den1', e.target.value)}
                    className={getFieldClass('ap1_den1')}
                    style={{ width: '42px', height: '25px' }}
                  />
                </span>
              </span>
              <span>dan</span>
              <span className="fraction">
                <span className="num">6</span>
                <span className="den">30</span>
              </span>
              <span>=</span>
              <span className="fraction">
                <span className="num">
                  <input
                    type="text"
                    aria-label="Apersepsi 1 Pembilang 6/30"
                    value={answers.ap1_num2}
                    onChange={(e) => updateAnswer('ap1_num2', e.target.value)}
                    className={getFieldClass('ap1_num2')}
                    style={{ width: '42px', height: '25px' }}
                  />
                </span>
                <span className="den">
                  <input
                    type="text"
                    aria-label="Apersepsi 1 Penyebut 6/30"
                    value={answers.ap1_den2}
                    onChange={(e) => updateAnswer('ap1_den2', e.target.value)}
                    className={getFieldClass('ap1_den2')}
                    style={{ width: '42px', height: '25px' }}
                  />
                </span>
              </span>
              <span>.</span>
            </div>

            {/* Baris 2 (TP.P2 - Perkalian Bilangan Bulat dan Pecahan) */}
            <div
              className="flex items-center gap-2 bg-[#EFF6FF] px-3 py-2 rounded-lg whitespace-nowrap"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              <span>2. Hitunglah hasil perkalian berikut:</span>
              <span>30 × (1/6) =</span>
              <input
                type="text"
                aria-label="Apersepsi 2 Hasil 30 x 1/6"
                value={answers.ap2_res1}
                onChange={(e) => updateAnswer('ap2_res1', e.target.value)}
                className={getFieldClass('ap2_res1')}
                style={{ width: '50px', height: '28px' }}
              />
              <span>dan 60 × (1/6) =</span>
              <input
                type="text"
                aria-label="Apersepsi 2 Hasil 60 x 1/6"
                value={answers.ap2_res2}
                onChange={(e) => updateAnswer('ap2_res2', e.target.value)}
                className={getFieldClass('ap2_res2')}
                style={{ width: '50px', height: '28px' }}
              />
              <span>.</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            HALAMAN 3: SIMULATOR CHIBI "STYLIST STUDIO", AKTIVITAS 1, & AKTIVITAS 2
           ==================================================================== */}
        <section
          id="halaman-3"
          className="a4-page"
          aria-label="Halaman 3: Simulator Stylist Studio, Aktivitas 1, dan Aktivitas 2"
        >
          {/* 1. Running Header Halaman 3 (X = 76px, Y = 45px | Lebar 642px, Tinggi 32px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '45px',
              width: '642px',
              height: '32px',
              borderBottom: '2px solid #1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1E3A8A',
            }}
          >
            <span>E-LKPD MATEMATIKA KELAS VIII: STYLIST STUDIO</span>
            <span>Halaman 3 dari 5</span>
          </div>

          {/* 2. Panel Simulator Interaktif "Stylist Studio" (X = 76px, Y = 88px | Lebar 642px, Tinggi 365px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '88px',
              width: '642px',
              height: '365px',
              background: 'linear-gradient(180deg, #E0F2FE 0%, #FFFBEB 50%, #FDF2F8 100%)',
              border: '3px solid #1E293B',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Atap Kanopi Butik Belang Pink-Putih setinggi 26px */}
            <div
              className="boutique-canopy flex items-center justify-center"
              style={{ width: '100%', height: '26px' }}
            >
              <span className="bg-[#1E3A8A] text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full border border-white">
                SIMULATOR INTERAKTIF: STYLIST STUDIO (#GL2 EDITION)
              </span>
            </div>

            {/* Area Kiri (X_rel = 14px, Lebar 215px): "LEMARI BUTIK" */}
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: '34px',
                width: '215px',
                height: '318px',
                backgroundColor: '#FBBF24',
                border: '2.5px solid #1E293B',
                borderRadius: '12px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
              }}
            >
              <div className="text-center text-[11.5px] font-extrabold text-white bg-[#4A4E69] py-1 rounded border border-[#1E293B]">
                LEMARI BUTIK (CUSTOMIZE)
              </div>

              {/* Rak Atas: 3 Tombol Gantungan SVG Kemeja M, B, K (Strictly fitted inside 198px width) */}
              <div className="bg-[#FFFBEB] border-2 border-[#1E293B] rounded-lg p-1">
                <div className="text-[10px] font-extrabold text-center text-[#92400E] mb-1">
                  Rak Atas: Pilih 1 dari 3 Kemeja
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(['M', 'B', 'K'] as ShirtCode[]).map((code) => {
                    const active = selectedShirt === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelectShirt(code)}
                        aria-label={`Pilih Kemeja ${SHIRT_COLORS[code].name} (${code})`}
                        className={`hanger-btn flex flex-col items-center justify-center py-1 px-0.5 rounded-lg border-2 cursor-pointer ${
                          active
                            ? 'bg-[#FCE7F3] border-[#EC4899] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <ShirtSvg code={code} width={44} height={42} />
                        <span className="text-[9.5px] font-extrabold text-[#0F172A] leading-tight whitespace-nowrap">
                          {SHIRT_COLORS[code].name} ({code})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rak Bawah: 2 Tombol SVG Celana P, H */}
              <div className="bg-[#FFFBEB] border-2 border-[#1E293B] rounded-lg p-1">
                <div className="text-[10px] font-extrabold text-center text-[#92400E] mb-1">
                  Rak Bawah: Pilih 1 dari 2 Celana
                </div>
                <div className="grid grid-cols-2 gap-1.5 px-2">
                  {(['P', 'H'] as PantsCode[]).map((code) => {
                    const active = selectedPants === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelectPants(code)}
                        aria-label={`Pilih Celana ${PANTS_COLORS[code].name} (${code})`}
                        className={`hanger-btn flex flex-col items-center justify-center py-1 px-1 rounded-lg border-2 cursor-pointer ${
                          active
                            ? 'bg-[#FCE7F3] border-[#EC4899] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <PantsSvg code={code} width={46} height={42} />
                        <span className="text-[9.5px] font-extrabold text-[#0F172A] leading-tight whitespace-nowrap">
                          {PANTS_COLORS[code].name} ({code})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Area Tengah (X_rel = 238px, Lebar 165px): "KARAKTER CHIBI" */}
            <div
              style={{
                position: 'absolute',
                left: '238px',
                top: '34px',
                width: '165px',
                height: '318px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 0',
              }}
            >
              <div className="text-center text-[11px] font-extrabold text-white bg-[#4A4E69] px-3 py-0.5 rounded-full border-2 border-[#1E293B] shadow-xs">
                KARAKTER CHIBI
              </div>

              <div className="flex items-center justify-center">
                <ChibiCharacterSvg
                  shirt={selectedShirt}
                  pants={selectedPants}
                  popKey={popKey}
                  width={154}
                  height={224}
                />
              </div>

              <div
                data-testid="current-outfit-label"
                className="bg-[#1E3A8A] text-white font-extrabold text-xs px-3.5 py-1 rounded-full border-2 border-[#1E293B] shadow-sm whitespace-nowrap"
              >
                Outfit: ({selectedShirt}, {selectedPants})
              </div>
            </div>

            {/* Area Kanan (X_rel = 412px, Lebar 216px): "MESIN GACHA RANDOMIZER" */}
            <div
              style={{
                position: 'absolute',
                left: '412px',
                top: '34px',
                width: '216px',
                height: '318px',
                backgroundColor: '#FFFFFF',
                border: '2.5px solid #1E293B',
                borderRadius: '12px',
                padding: '7px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
              }}
            >
              <div className="text-center text-[11px] font-extrabold text-white bg-[#1E3A8A] py-1 rounded border border-[#1E293B]">
                MESIN GACHA RANDOMIZER
              </div>

              {/* Tombol Kapsul 3D */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleRandomizeOne}
                    className="btn-gacha-1 flex-1 py-1 text-xs font-extrabold text-[#0F172A] cursor-pointer whitespace-nowrap"
                  >
                    Acak 1 Kali
                  </button>
                  <button
                    type="button"
                    onClick={handleResetSimulator}
                    className="btn-reset px-2 py-1 text-[11px] font-extrabold text-[#0F172A] cursor-pointer whitespace-nowrap"
                  >
                    Reset Data
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeThirty}
                  className="btn-gacha-30 w-full py-1 text-xs font-extrabold cursor-pointer whitespace-nowrap"
                >
                  Randomize 30 Kali
                </button>
              </div>

              {/* Tabel Statistik Real-Time (N = 30) */}
              <div className="border-2 border-[#1E293B] rounded-lg overflow-hidden">
                <div className="bg-[#EFF6FF] text-[#1E3A8A] text-[10.5px] font-extrabold text-center py-0.5 border-b border-[#1E293B] tabular-nums">
                  Tabel Statistik Real-Time (N = {totalTrials})
                </div>
                <table className="w-full text-[10.5px] border-collapse tabular-nums">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="py-0.5 px-2 text-left font-bold">Titik Sampel</th>
                      <th className="py-0.5 px-2 text-right font-bold">Frekuensi (k)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_OUTFITS.map((item) => {
                      const isTarget = item.key === 'M,P';
                      return (
                        <tr
                          key={item.key}
                          style={{
                            backgroundColor: isTarget ? '#FEF08A' : '#FFFFFF',
                            fontWeight: isTarget ? 800 : 600,
                          }}
                          className="border-b border-slate-200 last:border-b-0"
                        >
                          <td className="py-0.5 px-2">{item.label}</td>
                          <td
                            className="py-0.5 px-2 text-right"
                            data-testid={`stat-${item.key}`}
                          >
                            {stats[item.key]}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 3. Kotak Aktivitas 1: Mendaftar Ruang Sampel dengan Tabel Silang (TP.D1) (X = 76px, Y = 468px | Lebar 642px, Tinggi 325px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '468px',
              width: '642px',
              height: '325px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 16px',
              overflow: 'hidden',
            }}
          >
            <h3
              className="m-0 mb-1"
              style={{ fontSize: '15.8px', fontWeight: 700, color: '#1E3A8A' }}
            >
              1. AKTIVITAS 1: MENDAFTAR RUANG SAMPEL DENGAN TABEL SILANG (TP.D1)
            </h3>
            <p
              className="m-0 mb-2"
              style={{ fontSize: '13.2px', lineHeight: 1.38, color: '#0F172A' }}
            >
              Cobalah memasangkan 3 kemeja (M, B, K) dan 2 celana (P, H) pada karakter Chibi di atas, lalu lengkapi tabel silang berikut untuk mendaftar seluruh anggota ruang sampel <span className="math-var">S</span>!
            </p>

            {/* Tabel Silang 3x2 (Lebar 562px) */}
            <table
              style={{ width: '562px', margin: '0 auto 8px auto' }}
              className="border-2 border-[#1E3A8A] border-collapse text-center text-[13px]"
            >
              <thead>
                <tr className="bg-[#1E3A8A] text-white font-bold">
                  <th className="border border-[#93C5FD] py-1 px-3 w-[202px]">
                    Kemeja \ Celana
                  </th>
                  <th className="border border-[#93C5FD] py-1 px-3 w-[180px]">
                    Celana Putih (P)
                  </th>
                  <th className="border border-[#93C5FD] py-1 px-3 w-[180px]">
                    Celana Hitam (H)
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Baris Kemeja Merah (M) */}
                <tr>
                  <td className="border border-slate-300 py-1 px-3 font-bold bg-[#FFF1F2] text-left">
                    Kemeja Merah (M)
                  </td>
                  <td className="border border-slate-300 py-1 px-3 font-extrabold bg-[#FEF08A]">
                    (M, P)
                  </td>
                  <td className="border border-slate-300 py-1 px-3">
                    <input
                      type="text"
                      aria-label="Titik sampel Kemeja Merah dan Celana Hitam"
                      placeholder="(..., ...)"
                      value={answers.act1_MH}
                      onChange={(e) => updateAnswer('act1_MH', e.target.value)}
                      className={getFieldClass('act1_MH')}
                      style={{ width: '108px', height: '24px' }}
                    />
                  </td>
                </tr>
                {/* Baris Kemeja Biru (B) */}
                <tr>
                  <td className="border border-slate-300 py-1 px-3 font-bold bg-[#EFF6FF] text-left">
                    Kemeja Biru (B)
                  </td>
                  <td className="border border-slate-300 py-1 px-3">
                    <input
                      type="text"
                      aria-label="Titik sampel Kemeja Biru dan Celana Putih"
                      placeholder="(..., ...)"
                      value={answers.act1_BP}
                      onChange={(e) => updateAnswer('act1_BP', e.target.value)}
                      className={getFieldClass('act1_BP')}
                      style={{ width: '108px', height: '24px' }}
                    />
                  </td>
                  <td className="border border-slate-300 py-1 px-3 font-extrabold bg-slate-50">
                    (B, H)
                  </td>
                </tr>
                {/* Baris Kemeja Kuning (K) */}
                <tr>
                  <td className="border border-slate-300 py-1 px-3 font-bold bg-[#FEFCE8] text-left">
                    Kemeja Kuning (K)
                  </td>
                  <td className="border border-slate-300 py-1 px-3">
                    <input
                      type="text"
                      aria-label="Titik sampel Kemeja Kuning dan Celana Putih"
                      placeholder="(..., ...)"
                      value={answers.act1_KP}
                      onChange={(e) => updateAnswer('act1_KP', e.target.value)}
                      className={getFieldClass('act1_KP')}
                      style={{ width: '108px', height: '24px' }}
                    />
                  </td>
                  <td className="border border-slate-300 py-1 px-3">
                    <input
                      type="text"
                      aria-label="Titik sampel Kemeja Kuning dan Celana Hitam"
                      placeholder="(..., ...)"
                      value={answers.act1_KH}
                      onChange={(e) => updateAnswer('act1_KH', e.target.value)}
                      className={getFieldClass('act1_KH')}
                      style={{ width: '108px', height: '24px' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Isian di bawah tabel */}
            <div className="space-y-1 text-[13.4px] font-semibold">
              <div className="flex items-center gap-2">
                <span>• Banyak seluruh anggota ruang sampel adalah</span>
                <span className="math-var">n(S)</span>
                <span>=</span>
                <input
                  type="text"
                  aria-label="Banyak anggota ruang sampel n(S)"
                  value={answers.act1_nS}
                  onChange={(e) => updateAnswer('act1_nS', e.target.value)}
                  className={getFieldClass('act1_nS')}
                  style={{ width: '48px', height: '25px' }}
                />
                <span>pasangan pakaian.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  • Anggota Kejadian Kemeja Merah &amp; Celana Putih: <span className="math-var">B</span> = &#123;(M, P)&#125; &rarr; <span className="math-var">n(B)</span> =
                </span>
                <input
                  type="text"
                  aria-label="Banyak anggota kejadian n(B)"
                  value={answers.act1_nB}
                  onChange={(e) => updateAnswer('act1_nB', e.target.value)}
                  className={getFieldClass('act1_nB')}
                  style={{ width: '48px', height: '25px' }}
                />
                <span>.</span>
              </div>
            </div>
          </div>

          {/* 4. Kotak Aktivitas 2: Menentukan Peluang Teoretis (TP.D2) (X = 76px, Y = 808px | Lebar 642px, Tinggi 242px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '808px',
              width: '642px',
              height: '242px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '12px 16px',
              overflow: 'hidden',
            }}
          >
            <h3
              className="m-0 mb-1"
              style={{ fontSize: '15.8px', fontWeight: 700, color: '#1E3A8A' }}
            >
              2. AKTIVITAS 2: MENENTUKAN PELUANG TEORETIS P(B) (TP.D2)
            </h3>
            <p
              className="m-0 mb-2"
              style={{ fontSize: '13.4px', lineHeight: 1.42, color: '#0F172A' }}
            >
              Karena semua pasangan pakaian dapat muncul secara merata, tentukan nilai Peluang Teoretis terpilihnya pasangan Kemeja Merah dan Celana Putih atau <span className="math-var">P(B)</span>!
            </p>

            {/* Kotak Rumus Pecahan Vertikal (Latar #F1F5F9) */}
            <div
              className="flex items-center justify-center gap-3 py-1.5 px-4 rounded-xl mb-2"
              style={{ backgroundColor: '#F1F5F9', border: '1.5px solid #CBD5E1', fontSize: '14.5px', fontWeight: 700 }}
            >
              <span>
                Peluang Teoretis <span className="math-var">P(B)</span> =
              </span>
              <span className="fraction">
                <span className="num math-var">n(B)</span>
                <span className="den math-var">n(S)</span>
              </span>
              <span>=</span>
              <span className="fraction">
                <span className="num">
                  <input
                    type="text"
                    aria-label="Pembilang Peluang Teoretis P(B)"
                    value={answers.act2_num}
                    onChange={(e) => updateAnswer('act2_num', e.target.value)}
                    className={getFieldClass('act2_num')}
                    style={{ width: '48px', height: '24px' }}
                  />
                </span>
                <span className="den">
                  <input
                    type="text"
                    aria-label="Penyebut Peluang Teoretis P(B)"
                    value={answers.act2_den}
                    onChange={(e) => updateAnswer('act2_den', e.target.value)}
                    className={getFieldClass('act2_den')}
                    style={{ width: '48px', height: '24px' }}
                  />
                </span>
              </span>
            </div>

            {/* Kalimat Pemahaman */}
            <div style={{ fontSize: '13.4px', lineHeight: 1.55, fontWeight: 600 }}>
              Pengertian peluang teoretis adalah rasio banyaknya titik sampel kejadian{' '}
              <select
                aria-label="Dropdown Pengertian Peluang Teoretis 1"
                value={answers.act2_drop1}
                onChange={(e) => updateAnswer('act2_drop1', e.target.value)}
                className={getFieldClass('act2_drop1')}
                style={{ width: '92px', height: '26px', padding: '0 4px' }}
              >
                <option value="">-- Pilih --</option>
                <option value="n(B)">n(B)</option>
                <option value="n(S)">n(S)</option>
                <option value="N">N</option>
              </select>{' '}
              terhadap total anggota ruang sampel{' '}
              <select
                aria-label="Dropdown Pengertian Peluang Teoretis 2"
                value={answers.act2_drop2}
                onChange={(e) => updateAnswer('act2_drop2', e.target.value)}
                className={getFieldClass('act2_drop2')}
                style={{ width: '92px', height: '26px', padding: '0 4px' }}
              >
                <option value="">-- Pilih --</option>
                <option value="n(B)">n(B)</option>
                <option value="n(S)">n(S)</option>
                <option value="k">k</option>
              </select>
              .
            </div>
          </div>
        </section>

        {/* ====================================================================
            HALAMAN 4: AKTIVITAS 3 (BAGIAN 3.1 S.D. 3.4) & KESIMPULAN
           ==================================================================== */}
        <section
          id="halaman-4"
          className="a4-page"
          aria-label="Halaman 4: Aktivitas 3 Frekuensi Harapan & Frekuensi Relatif"
        >
          {/* 1. Running Header Halaman 4 (X = 76px, Y = 45px | Lebar 642px, Tinggi 32px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '45px',
              width: '642px',
              height: '32px',
              borderBottom: '2px solid #1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1E3A8A',
            }}
          >
            <span>E-LKPD MATEMATIKA KELAS VIII: STYLIST STUDIO</span>
            <span>Halaman 4 dari 5</span>
          </div>

          {/* 2. Judul Utama Aktivitas 3 (X = 76px, Y = 88px) */}
          <h3
            className="activity-h3 m-0"
            style={{
              position: 'absolute',
              left: '76px',
              top: '88px',
              width: '642px',
              color: '#1E3A8A',
            }}
          >
            3. AKTIVITAS 3: FREKUENSI HARAPAN &amp; EKSPERIMEN FREKUENSI RELATIF
          </h3>

          {/* 3. Kotak Bagian 3.1: Perhitungan Frekuensi Harapan Teoretis (X = 76px, Y = 125px | Lebar 642px, Tinggi 175px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '125px',
              width: '642px',
              height: '175px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 16px',
              overflow: 'hidden',
            }}
          >
            <h4
              className="m-0 mb-1"
              style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}
            >
              Bagian 3.1: Perhitungan Frekuensi Harapan Teoretis
            </h4>
            <p
              className="m-0 mb-2"
              style={{ fontSize: '13.3px', lineHeight: 1.42, color: '#0F172A' }}
            >
              Target Kejadian <span className="math-var">B</span>: Pasangan Kemeja Merah (M) dan Celana Putih (P) dengan <span className="math-var">n(B)</span> = 1 dan <span className="math-var">n(S)</span> = 6, sehingga <span className="math-var">P(B)</span> = 1/6. Hitung nilai Frekuensi Harapan (<span className="math-var">F_h</span>) untuk <span className="math-var">N</span> = 30 kali percobaan:
            </p>
            <div
              className="flex items-center justify-center gap-2.5 py-1.5 px-4 rounded-xl"
              style={{ backgroundColor: '#F1F5F9', border: '1.5px solid #CBD5E1', fontSize: '14.5px', fontWeight: 700 }}
            >
              <span>
                <span className="math-var">F_h</span> = <span className="math-var">N</span> × <span className="math-var">P(B)</span> = 30 ×
              </span>
              <span>(</span>
              <span className="fraction">
                <span className="num">
                  <input
                    type="text"
                    aria-label="Bagian 3.1 Pembilang P(B)"
                    value={answers.act31_num}
                    onChange={(e) => updateAnswer('act31_num', e.target.value)}
                    className={getFieldClass('act31_num')}
                    style={{ width: '44px', height: '24px' }}
                  />
                </span>
                <span className="den">
                  <input
                    type="text"
                    aria-label="Bagian 3.1 Penyebut P(B)"
                    value={answers.act31_den}
                    onChange={(e) => updateAnswer('act31_den', e.target.value)}
                    className={getFieldClass('act31_den')}
                    style={{ width: '44px', height: '24px' }}
                  />
                </span>
              </span>
              <span>) =</span>
              <input
                type="text"
                aria-label="Bagian 3.1 Hasil Frekuensi Harapan"
                value={answers.act31_res}
                onChange={(e) => updateAnswer('act31_res', e.target.value)}
                className={getFieldClass('act31_res')}
                style={{ width: '54px', height: '28px' }}
              />
              <span>kali</span>
            </div>
          </div>

          {/* 4. Kotak Bagian 3.2: Eksperimen Digital (Pengumpulan Data Empiris) (X = 76px, Y = 312px | Lebar 642px, Tinggi 205px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '312px',
              width: '642px',
              height: '205px',
              backgroundColor: '#FDF2F8',
              border: '2px solid #EC4899',
              borderRadius: '12px',
              padding: '10px 14px',
              overflow: 'hidden',
            }}
          >
            <h4
              className="m-0 mb-1.5"
              style={{ fontSize: '15px', fontWeight: 700, color: '#9D174D' }}
            >
              Bagian 3.2: Eksperimen Digital (Pengumpulan Data Empiris)
            </h4>
            <div style={{ fontSize: '12.6px', lineHeight: 1.4, color: '#0F172A' }} className="space-y-1.5 mb-2">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span>
                  • Tekan tombol &apos;Randomize 30 Kali&apos; pada simulator (atau klik pintas
                </span>
                <button
                  type="button"
                  onClick={handleRandomizeThirty}
                  className="bg-[#EC4899] hover:bg-[#9D174D] text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-[#1E293B] cursor-pointer shadow-xs"
                >
                  Randomize 30 Kali Sekarang
                </button>
                <span>di sini)!</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold whitespace-nowrap">
                <span>
                  • Catat kemunculan aktual pasangan (M, P) dari <span className="math-var">N</span> = 30 kali percobaan: muncul sebanyak <span className="math-var">k</span> =
                </span>
                <input
                  type="text"
                  aria-label="Bagian 3.2 Nilai kemunculan aktual k"
                  value={answers.act32_k}
                  onChange={(e) => handleChangeK(e.target.value)}
                  className={getFieldClass('act32_k')}
                  style={{ width: '46px', height: '24px' }}
                />
                <span>kali.</span>
              </div>
            </div>

            {/* Kotak Rumus Frekuensi Relatif (f_r) */}
            <div
              className="flex items-center justify-center gap-2.5 py-1 px-4 rounded-xl bg-white border border-[#F472B6]"
              style={{ fontSize: '14.2px', fontWeight: 700 }}
            >
              <span>
                <span className="math-var">f_r</span> =
              </span>
              <span className="fraction">
                <span className="num math-var">k</span>
                <span className="den math-var">N</span>
              </span>
              <span>=</span>
              <span className="fraction">
                <span className="num">
                  <input
                    type="text"
                    aria-label="Bagian 3.2 Pembilang Frekuensi Relatif k"
                    value={answers.act32_num}
                    onChange={(e) => updateAnswer('act32_num', e.target.value)}
                    className={getFieldClass('act32_num')}
                    style={{ width: '46px', height: '23px' }}
                  />
                </span>
                <span className="den">30</span>
              </span>
            </div>
          </div>

          {/* 5. Kotak Bagian 3.3: Menentukan Frekuensi Harapan Menggunakan Frekuensi Relatif (f_r) (X = 76px, Y = 530px | Lebar 642px, Tinggi 185px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '530px',
              width: '642px',
              height: '185px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 16px',
              overflow: 'hidden',
            }}
          >
            <h4
              className="m-0 mb-1"
              style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}
            >
              Bagian 3.3: Menentukan Frekuensi Harapan Menggunakan Frekuensi Relatif (<span className="math-var">f_r</span>)
            </h4>
            <p
              className="m-0 mb-2"
              style={{ fontSize: '13.3px', lineHeight: 1.42, color: '#0F172A' }}
            >
              Gunakan nilai <span className="math-var">f_r</span> yang didapat pada Bagian 3.2 untuk memprediksi kemunculan pasangan (M, P) jika percobaan diperbesar menjadi <span className="math-var">N</span> = 120 kali:
            </p>
            <div
              className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl whitespace-nowrap"
              style={{ backgroundColor: '#F1F5F9', border: '1.5px solid #CBD5E1', fontSize: '14.2px', fontWeight: 700 }}
            >
              <span>
                <span className="math-var">F_h</span>(empiris) = <span className="math-var">N</span> × <span className="math-var">f_r</span> = 120 × (
              </span>
              <span className="fraction">
                <span className="num">
                  <input
                    type="text"
                    aria-label="Bagian 3.3 Pembilang k"
                    value={answers.act33_num}
                    onChange={(e) => updateAnswer('act33_num', e.target.value)}
                    className={getFieldClass('act33_num')}
                    style={{ width: '46px', height: '24px' }}
                  />
                </span>
                <span className="den">30</span>
              </span>
              <span>) = 4 ×</span>
              <input
                type="text"
                aria-label="Bagian 3.3 Pengali nilai k"
                value={answers.act33_mult}
                onChange={(e) => updateAnswer('act33_mult', e.target.value)}
                className={getFieldClass('act33_mult')}
                style={{ width: '46px', height: '26px' }}
              />
              <span>=</span>
              <input
                type="text"
                aria-label="Bagian 3.3 Hasil 4k"
                value={answers.act33_res}
                onChange={(e) => updateAnswer('act33_res', e.target.value)}
                className={getFieldClass('act33_res')}
                style={{ width: '54px', height: '26px' }}
              />
              <span>kali</span>
            </div>
          </div>

          {/* 6. Kotak Bagian 3.4: Perbandingan, Refleksi Konseptual, & Kesimpulan Terbimbing (X = 76px, Y = 728px | Lebar 642px, Tinggi 325px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '728px',
              width: '642px',
              height: '325px',
              backgroundColor: '#EFF6FF',
              border: '2px solid #2563EB',
              borderRadius: '12px',
              padding: '12px 15px',
              overflow: 'hidden',
            }}
          >
            <h4
              className="m-0 mb-1.5"
              style={{ fontSize: '15px', fontWeight: 700, color: '#1E3A8A' }}
            >
              Bagian 3.4: Perbandingan dan Refleksi Konseptual
            </h4>

            <div className="space-y-2" style={{ fontSize: '13px', lineHeight: 1.48, color: '#0F172A' }}>
              <div className="bg-white px-3 py-1 rounded-lg border border-[#93C5FD] font-semibold">
                • Bandingkan pecahan Frekuensi Relatifmu (
                <span className="font-extrabold text-[#EC4899]">{displayedK}/30</span>
                ) dengan Peluang Teoretis 1/6 (5/30)!
              </div>

              <div>
                <strong>• Kesimpulan Terbimbing 1:</strong> Jumlah seluruh pasangan outfit yang mungkin dibentuk dinamakan{' '}
                <select
                  aria-label="Kesimpulan Terbimbing 1 Dropdown 1"
                  value={answers.act34_drop1}
                  onChange={(e) => updateAnswer('act34_drop1', e.target.value)}
                  className={getFieldClass('act34_drop1')}
                  style={{ width: '160px', height: '25px', padding: '0 4px', fontSize: '12.5px' }}
                >
                  <option value="">-- Pilih Konsep --</option>
                  <option value="ruang sampel (S)">ruang sampel (S)</option>
                  <option value="titik sampel">titik sampel</option>
                  <option value="kejadian acak">kejadian acak</option>
                </select>{' '}
                dengan banyak anggota{' '}
                <select
                  aria-label="Kesimpulan Terbimbing 1 Dropdown 2"
                  value={answers.act34_drop2}
                  onChange={(e) => updateAnswer('act34_drop2', e.target.value)}
                  className={getFieldClass('act34_drop2')}
                  style={{ width: '85px', height: '25px', padding: '0 4px', fontSize: '12.5px' }}
                >
                  <option value="">-- Pilih --</option>
                  <option value="n(S)">n(S)</option>
                  <option value="n(B)">n(B)</option>
                  <option value="N">N</option>
                </select>
                .
              </div>

              <div>
                <strong>• Kesimpulan Terbimbing 2:</strong> Perbandingan kemunculan kejadian pada percobaan nyata (<span className="math-var">k</span>) terhadap banyak percobaan (<span className="math-var">N</span>) dinamakan{' '}
                <select
                  aria-label="Kesimpulan Terbimbing 2 Dropdown"
                  value={answers.act34_drop3}
                  onChange={(e) => updateAnswer('act34_drop3', e.target.value)}
                  className={getFieldClass('act34_drop3')}
                  style={{ width: '190px', height: '25px', padding: '0 4px', fontSize: '12.5px' }}
                >
                  <option value="">-- Pilih Konsep --</option>
                  <option value="Frekuensi Relatif (f_r)">Frekuensi Relatif (f_r)</option>
                  <option value="Peluang Teoretis P(B)">Peluang Teoretis P(B)</option>
                  <option value="Ruang Sampel (S)">Ruang Sampel (S)</option>
                </select>
                .
              </div>

              <div>
                <strong>• Kesimpulan Terbimbing 3:</strong> Semakin banyak percobaan (<span className="math-var">N</span>) dilakukan, nilai Frekuensi Relatif (<span className="math-var">f_r</span>) akan semakin mendekati nilai{' '}
                <select
                  aria-label="Kesimpulan Terbimbing 3 Dropdown 1"
                  value={answers.act34_drop4}
                  onChange={(e) => updateAnswer('act34_drop4', e.target.value)}
                  className={getFieldClass('act34_drop4')}
                  style={{ width: '180px', height: '25px', padding: '0 4px', fontSize: '12.5px' }}
                >
                  <option value="">-- Pilih Konsep --</option>
                  <option value="Peluang Teoretis P(B)">Peluang Teoretis P(B)</option>
                  <option value="Titik Sampel">Titik Sampel</option>
                  <option value="Banyak Percobaan N">Banyak Percobaan N</option>
                </select>
                , dan keduanya dapat digunakan untuk menentukan{' '}
                <select
                  aria-label="Kesimpulan Terbimbing 3 Dropdown 2"
                  value={answers.act34_drop5}
                  onChange={(e) => updateAnswer('act34_drop5', e.target.value)}
                  className={getFieldClass('act34_drop5')}
                  style={{ width: '190px', height: '25px', padding: '0 4px', fontSize: '12.5px' }}
                >
                  <option value="">-- Pilih Konsep --</option>
                  <option value="Frekuensi Harapan (F_h)">Frekuensi Harapan (F_h)</option>
                  <option value="Ruang Sampel (S)">Ruang Sampel (S)</option>
                  <option value="Titik Sampel">Titik Sampel</option>
                </select>
                .
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            HALAMAN 5: INSTRUMEN EVALUASI PEMAHAMAN (TAHAP 3) & PENILAIAN GURU
           ==================================================================== */}
        <section
          id="halaman-5"
          className="a4-page"
          aria-label="Halaman 5: Instrumen Evaluasi Pemahaman & Penilaian Guru"
        >
          {/* 1. Running Header Halaman 5 (X = 76px, Y = 45px | Lebar 642px, Tinggi 32px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '45px',
              width: '642px',
              height: '32px',
              borderBottom: '2px solid #1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1E3A8A',
            }}
          >
            <span>E-LKPD MATEMATIKA KELAS VIII: STYLIST STUDIO</span>
            <span>Halaman 5 dari 5</span>
          </div>

          {/* 2. Header Bagian Evaluasi (X = 76px, Y = 88px | Lebar 642px, Tinggi 50px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '88px',
              width: '642px',
              height: '50px',
              backgroundColor: '#1E3A8A',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '16.5px',
              fontWeight: 700,
            }}
          >
            4. INSTRUMEN SOAL EVALUASI PER TP (TP.K1 &amp; TP.K2)
          </div>

          {/* 3. Soal 1 (TP.K1 - Pilihan Ganda, X = 76px, Y = 150px | Lebar 642px, Tinggi 175px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '150px',
              width: '642px',
              height: '175px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 16px',
              overflow: 'hidden',
            }}
          >
            <p
              className="m-0 mb-2"
              style={{ fontSize: '13.3px', lineHeight: 1.42, fontWeight: 600 }}
            >
              1. <strong>[TP.K1]</strong> Disajikan data 3 kemeja (Merah, Biru, Kuning) dan 2 celana (Putih, Hitam) pada Stylist Studio. Jika dilakukan 60 kali percobaan acak, maka peluang teoretis <span className="math-var">P(A)</span> dan Frekuensi Harapan <span className="math-var">F_h</span> munculnya pasangan Kemeja Merah dan Celana Putih adalah ....
            </p>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              {[
                { opt: 'A', text: 'P(A) = 1/5 dan F_h = 12 kali' },
                { opt: 'B', text: 'P(A) = 1/6 dan F_h = 10 kali' },
                { opt: 'C', text: 'P(A) = 2/6 dan F_h = 20 kali' },
                { opt: 'D', text: 'P(A) = 1/6 dan F_h = 30 kali' },
              ].map((item) => {
                const selected = answers.eval1_choice === item.opt;
                const isCorrect = hasChecked && selected && validation.eval1_choice;
                const isWrong = hasChecked && selected && !validation.eval1_choice;
                return (
                  <label
                    key={item.opt}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 cursor-pointer font-semibold ${
                      isCorrect
                        ? 'bg-[#DCFCE7] border-[#16A34A] text-[#15803D]'
                        : isWrong
                        ? 'bg-[#FEE2E2] border-[#DC2626] text-[#B91C1C]'
                        : selected
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1E3A8A]'
                        : 'bg-[#FEFCE8] border-dashed border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eval1_choice"
                      value={item.opt}
                      checked={selected}
                      onChange={() => updateAnswer('eval1_choice', item.opt)}
                    />
                    <span>
                      ({item.opt}) {item.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. Soal 2 (TP.K1 - Uraian Singkat, X = 76px, Y = 338px | Lebar 642px, Tinggi 160px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '338px',
              width: '642px',
              height: '160px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 16px',
              overflow: 'hidden',
            }}
          >
            <p
              className="m-0 mb-2"
              style={{ fontSize: '13.3px', lineHeight: 1.42, fontWeight: 600 }}
            >
              2. <strong>[TP.K1]</strong> Pada simulasi acak 3 kemeja (Merah, Biru, Kuning) dan 2 celana (Putih, Hitam), tentukan Frekuensi Harapan (<span className="math-var">F_h</span>) terambilnya pasangan pakaian yang menggunakan Kemeja Merah jika dilakukan 90 kali percobaan!
            </p>
            <div
              className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-[#F1F5F9] border border-slate-300 whitespace-nowrap"
              style={{ fontSize: '12.2px', fontWeight: 700 }}
            >
              <span>
                Titik sampel Kemeja Merah = &#123;(M,P), (M,H)&#125; sehingga <span className="math-var">P(A)</span> = 2/6 &rarr; <span className="math-var">F_h</span> = 90 × (
              </span>
              <span className="fraction">
                <span className="num">
                  <input
                    type="text"
                    aria-label="Soal 2 Pembilang P(A)"
                    value={answers.eval2_num}
                    onChange={(e) => updateAnswer('eval2_num', e.target.value)}
                    className={getFieldClass('eval2_num')}
                    style={{ width: '38px', height: '22px' }}
                  />
                </span>
                <span className="den">
                  <input
                    type="text"
                    aria-label="Soal 2 Penyebut P(A)"
                    value={answers.eval2_den}
                    onChange={(e) => updateAnswer('eval2_den', e.target.value)}
                    className={getFieldClass('eval2_den')}
                    style={{ width: '38px', height: '22px' }}
                  />
                </span>
              </span>
              <span>) =</span>
              <input
                type="text"
                aria-label="Soal 2 Hasil F_h"
                value={answers.eval2_res}
                onChange={(e) => updateAnswer('eval2_res', e.target.value)}
                className={getFieldClass('eval2_res')}
                style={{ width: '46px', height: '25px' }}
              />
              <span>kali.</span>
            </div>
          </div>

          {/* 5. Soal 3 (TP.K2 - Pilihan Ganda, X = 76px, Y = 510px | Lebar 642px, Tinggi 165px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '510px',
              width: '642px',
              height: '165px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 16px',
              overflow: 'hidden',
            }}
          >
            <p
              className="m-0 mb-2"
              style={{ fontSize: '13.3px', lineHeight: 1.42, fontWeight: 600 }}
            >
              3. <strong>[TP.K2]</strong> Dari hasil eksperimen menekan tombol randomize sebanyak 30 kali, tercatat pasangan Kemeja Merah dan Celana Putih muncul sebanyak 6 kali. Nilai Frekuensi Relatif (<span className="math-var">f_r</span>) beserta bentuk sederhananya adalah ....
            </p>
            <div className="grid grid-cols-4 gap-2 text-[13px]">
              {[
                { opt: 'A', text: '1/6' },
                { opt: 'B', text: '6/36' },
                { opt: 'C', text: '6/30 = 1/5' },
                { opt: 'D', text: '5/30 = 1/6' },
              ].map((item) => {
                const selected = answers.eval3_choice === item.opt;
                const isCorrect = hasChecked && selected && validation.eval3_choice;
                const isWrong = hasChecked && selected && !validation.eval3_choice;
                return (
                  <label
                    key={item.opt}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border-2 cursor-pointer font-semibold ${
                      isCorrect
                        ? 'bg-[#DCFCE7] border-[#16A34A] text-[#15803D]'
                        : isWrong
                        ? 'bg-[#FEE2E2] border-[#DC2626] text-[#B91C1C]'
                        : selected
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#1E3A8A]'
                        : 'bg-[#FEFCE8] border-dashed border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eval3_choice"
                      value={item.opt}
                      checked={selected}
                      onChange={() => updateAnswer('eval3_choice', item.opt)}
                    />
                    <span>
                      ({item.opt}) {item.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 6. Soal 4 (TP.K2 - Uraian Terbuka, X = 76px, Y = 688px | Lebar 642px, Tinggi 205px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '688px',
              width: '642px',
              height: '205px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #CBD5E1',
              borderRadius: '12px',
              padding: '10px 16px',
              overflow: 'hidden',
            }}
          >
            <p
              className="m-0 mb-1.5"
              style={{ fontSize: '13px', lineHeight: 1.38, fontWeight: 600 }}
            >
              4. <strong>[TP.K2]</strong> Berdasarkan data <span className="math-var">f_r</span> = 6/30 = 1/5 pada Soal 3, prediksilah kemunculan kejadian tersebut untuk <span className="math-var">N</span> = 150 kali percobaan, lalu jelaskan analisis keterdekatannya dengan peluang teoretis!
            </p>

            {/* Baris Hitung Single-Line */}
            <div
              className="flex items-center justify-center gap-1 mb-2 bg-[#F1F5F9] px-2 py-1.5 rounded-lg border border-slate-300 whitespace-nowrap"
              style={{ fontSize: '11.3px', fontWeight: 700 }}
            >
              <span>
                Estimasi <span className="math-var">F_h</span>(empiris) = 150 × (
              </span>
              <input
                type="text"
                aria-label="Soal 4 Pembilang f_r"
                value={answers.eval4_num}
                onChange={(e) => updateAnswer('eval4_num', e.target.value)}
                className={getFieldClass('eval4_num')}
                style={{ width: '32px', height: '21px', fontSize: '12px' }}
              />
              <span>/</span>
              <input
                type="text"
                aria-label="Soal 4 Penyebut f_r"
                value={answers.eval4_den}
                onChange={(e) => updateAnswer('eval4_den', e.target.value)}
                className={getFieldClass('eval4_den')}
                style={{ width: '34px', height: '21px', fontSize: '12px' }}
              />
              <span>) =</span>
              <input
                type="text"
                aria-label="Soal 4 Hasil F_h empiris"
                value={answers.eval4_resEmp}
                onChange={(e) => updateAnswer('eval4_resEmp', e.target.value)}
                className={getFieldClass('eval4_resEmp')}
                style={{ width: '36px', height: '21px', fontSize: '12px' }}
              />
              <span>
                kali (sedangkan <span className="math-var">F_h</span> teoretis = 150 × 1/6 =
              </span>
              <input
                type="text"
                aria-label="Soal 4 Hasil F_h teoretis"
                value={answers.eval4_resTheo}
                onChange={(e) => updateAnswer('eval4_resTheo', e.target.value)}
                className={getFieldClass('eval4_resTheo')}
                style={{ width: '36px', height: '21px', fontSize: '12px' }}
              />
              <span>kali).</span>
            </div>

            {/* Kotak Textarea Analisis (Lebar 602px, Tinggi 55px) */}
            <textarea
              aria-label="Soal 4 Analisis Perbandingan"
              placeholder="Tuliskan analisis perbandingan dan apa yang terjadi jika percobaan diperbanyak..."
              value={answers.eval4_analysis}
              onChange={(e) => updateAnswer('eval4_analysis', e.target.value)}
              className={getFieldClass('eval4_analysis', 'left-align py-1')}
              style={{
                width: '602px',
                height: '55px',
                resize: 'none',
                fontSize: '12.8px',
                lineHeight: 1.35,
              }}
            />
          </div>

          {/* 7. Panel Skor, Paraf Guru, & Tombol Cetak A4 (X = 76px, Y = 908px | Lebar 642px, Tinggi 145px) */}
          <div
            style={{
              position: 'absolute',
              left: '76px',
              top: '908px',
              width: '642px',
              height: '145px',
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'space-between',
            }}
          >
            {/* Kotak Skor & Paraf (Kiri, Lebar 290px) */}
            <div
              style={{
                width: '290px',
                backgroundColor: '#FFFBEB',
                border: '2.5px solid #1E3A8A',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                data-testid="final-score-box"
                className="text-center py-2 rounded-lg bg-white border-2 border-[#1E3A8A] font-extrabold text-base text-[#1E3A8A] tabular-nums"
              >
                SKOR AKHIR: [ {finalScore} / 100 ]
              </div>
              {feedbackBanner && (
                <div className="text-[11px] font-bold text-center text-[#15803D] leading-tight">
                  {feedbackBanner}
                </div>
              )}
              <div className="text-sm font-bold text-[#0F172A] pt-1">
                Paraf Guru: ....................
              </div>
            </div>

            {/* Tombol Aksi (Kanan, Lebar 330px) */}
            <div
              style={{
                width: '330px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <button
                type="button"
                onClick={handleCheckAllAnswers}
                style={{
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  border: '2.5px solid #1E293B',
                  boxShadow: '0 4px 0 #15803D',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '13.5px',
                }}
                className="cursor-pointer hover:brightness-105 active:translate-y-0.5 transition-all"
              >
                Periksa Semua Jawaban &amp; Mainkan Suara Skor
              </button>

              <button
                type="button"
                onClick={handlePrintA4}
                style={{
                  backgroundColor: '#1E3A8A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  border: '2.5px solid #1E293B',
                  boxShadow: '0 4px 0 #0F172A',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '13.5px',
                }}
                className="cursor-pointer hover:brightness-110 active:translate-y-0.5 transition-all"
              >
                Cetak / Simpan PDF 5 Halaman A4
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
