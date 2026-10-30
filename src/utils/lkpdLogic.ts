export type TopCode = 'AG' | 'AP' | 'BH';
export type BottomCode = 'S' | 'J';
export type OutfitKey = `${TopCode},${BottomCode}`;

export interface TopOptionMeta {
  code: TopCode;
  name: string;
  shortName: string;
  subtitle: string;
  headpieceNote: string;
  accentColor: string;
  bgTone: string;
}

export interface BottomOptionMeta {
  code: BottomCode;
  name: string;
  shortName: string;
  subtitle: string;
  accentColor: string;
  bgTone: string;
}

export const TOP_OPTIONS: TopOptionMeta[] = [
  {
    code: 'AG',
    name: 'Baju Aesan Gede',
    shortName: 'Aesan Gede',
    subtitle: 'Maroon Keemasan & Teratai Dada',
    headpieceNote: 'Sanggul Malang & Mahkota Karsuhun',
    accentColor: '#881337',
    bgTone: '#FEF3C7',
  },
  {
    code: 'AP',
    name: 'Baju Aesan Paksangko',
    shortName: 'Aesan Paksangko',
    subtitle: 'Kurung Merah Bata Bertabur Bintang Emas',
    headpieceNote: 'Mahkota Paksangko & Kembang Goyang',
    accentColor: '#9A3412',
    bgTone: '#FFFBEB',
  },
  {
    code: 'BH',
    name: 'Baju Kurung Beludru Hitam',
    shortName: 'Beludru Hitam',
    subtitle: 'Beludru Hitam Sulam Benang Emas',
    headpieceNote: 'Sanggul Palembang & Tusuk Emas Sederhana',
    accentColor: '#292524',
    bgTone: '#FEF3C7',
  },
];

export const BOTTOM_OPTIONS: BottomOptionMeta[] = [
  {
    code: 'S',
    name: 'Kain Songket Palembang',
    shortName: 'Songket Palembang',
    subtitle: 'Tenun Maroon Benang Emas Motif Tumpal',
    accentColor: '#7F1D1D',
    bgTone: '#FEF3C7',
  },
  {
    code: 'J',
    name: 'Kain Tenun Jumputan Palembang',
    shortName: 'Jumputan Palembang',
    subtitle: 'Motif Ikat Celup Titik Tujuh & Belah Ketupat',
    accentColor: '#B45309',
    bgTone: '#FFFBEB',
  },
];

export interface SimulationStats {
  'AG,S': number;
  'AG,J': number;
  'AP,S': number;
  'AP,J': number;
  'BH,S': number;
  'BH,J': number;
}

export const INITIAL_STATS: SimulationStats = {
  'AG,S': 0,
  'AG,J': 0,
  'AP,S': 0,
  'AP,J': 0,
  'BH,S': 0,
  'BH,J': 0,
};

export const ALL_OUTFITS: Array<{
  top: TopCode;
  bottom: BottomCode;
  key: OutfitKey;
  label: string;
  fullTitle: string;
}> = [
  { top: 'AG', bottom: 'S', key: 'AG,S', label: '(AG, S)', fullTitle: 'Aesan Gede + Songket' },
  { top: 'AG', bottom: 'J', key: 'AG,J', label: '(AG, J)', fullTitle: 'Aesan Gede + Jumputan' },
  { top: 'AP', bottom: 'S', key: 'AP,S', label: '(AP, S)', fullTitle: 'Aesan Paksangko + Songket' },
  { top: 'AP', bottom: 'J', key: 'AP,J', label: '(AP, J)', fullTitle: 'Aesan Paksangko + Jumputan' },
  { top: 'BH', bottom: 'S', key: 'BH,S', label: '(BH, S)', fullTitle: 'Beludru Hitam + Songket' },
  { top: 'BH', bottom: 'J', key: 'BH,J', label: '(BH, J)', fullTitle: 'Beludru Hitam + Jumputan' },
];

export const MAX_SPIN_TRIALS = 20;

export interface SaveOutfitResult {
  savedOutfits: OutfitKey[];
  isDuplicate: boolean;
  message: string;
}

export function saveOutfitCombination(
  currentSaved: OutfitKey[],
  top: TopCode | null,
  bottom: BottomCode | null
): SaveOutfitResult {
  if (!top || !bottom) {
    return {
      savedOutfits: currentSaved,
      isDuplicate: false,
      message: 'Pilih 1 atasan dan 1 bawahan terlebih dahulu sebelum menyimpan!',
    };
  }
  const key: OutfitKey = `${top},${bottom}`;
  if (currentSaved.includes(key)) {
    return {
      savedOutfits: currentSaved,
      isDuplicate: true,
      message: 'Pasangan pakaian ini sudah kamu pilih!',
    };
  }
  return {
    savedOutfits: [...currentSaved, key],
    isDuplicate: false,
    message: `Pasangan (${top}, ${bottom}) berhasil disimpan ke tabel Aktivitas 1!`,
  };
}

export interface StudentAnswers {
  // Halaman 1: Identitas Kelompok & Kelas
  groupName: string;
  classSemester: string;
  member1: string;
  member2: string;
  member3: string;
  member4: string;
  member5: string;

  // Halaman 2: Apersepsi (Pecahan & Perkalian Pecahan)
  ap1_num1: string; // 1
  ap1_den1: string; // 3
  ap1_num2: string; // 1
  ap1_den2: string; // 2
  ap2_res1: string; // 5 (1/4 x 20)
  ap2_res2: string; // 4 (1/5 x 20)

  // Halaman 3: Aktivitas 1 (Menemukan Ruang Sampel)
  act1_nS: string; // 6
  act1_nA: string; // 1

  // Halaman 3: Aktivitas 2 (Menentukan Peluang Teoretis)
  act2_num: string; // 1
  act2_den: string; // 6
  act2_reason: string; // Pemahaman mengapa setiap kombinasi memiliki peluang sama (1/6)

  // Halaman 4: Bagian 3.1 (Menghitung Frekuensi Harapan N = 20)
  act31_N: string; // 20
  act31_num: string; // 1
  act31_den: string; // 6
  act31_res: string; // 20/6 atau 10/3 atau 3,33

  // Halaman 4: Bagian 3.3 (Menghitung Frekuensi Relatif N = 20)
  act33_k: string; // Frekuensi hasil percobaan untuk (AG, S)
  act33_N: string; // 20
  act33_num: string; // sama dengan k
  act33_den: string; // 20

  // Halaman 4: Bagian 3.4 (Membandingkan Hasil Percobaan)
  act34_q1: string; // Apakah setiap pasangan selalu muncul dengan jumlah yang sama?
  act34_q2: string; // Mengapa hasil percobaan dapat berbeda dari frekuensi harapan?
  act34_q3: string; // Hubungan peluang teoretis, frekuensi harapan, dan frekuensi relatif
}

export const INITIAL_ANSWERS: StudentAnswers = {
  groupName: '',
  classSemester: 'VIII (Delapan) / Genap',
  member1: '',
  member2: '',
  member3: '',
  member4: '',
  member5: '',

  ap1_num1: '',
  ap1_den1: '',
  ap1_num2: '',
  ap1_den2: '',
  ap2_res1: '',
  ap2_res2: '',

  act1_nS: '',
  act1_nA: '',

  act2_num: '',
  act2_den: '',
  act2_reason: '',

  act31_N: '20',
  act31_num: '',
  act31_den: '',
  act31_res: '',

  act33_k: '',
  act33_N: '20',
  act33_num: '',
  act33_den: '20',

  act34_q1: '',
  act34_q2: '',
  act34_q3: '',
};

export type ValidationMap = Partial<Record<keyof StudentAnswers, boolean>>;

export interface EvaluationResult {
  validation: ValidationMap;
  correctCount: number;
  totalGradable: number;
  score: number;
  savedCountBonus: number;
}

function norm(val: string): string {
  return val.trim().replace(/\s+/g, '').toLowerCase();
}

function isExpectedFreqValid(val: string): boolean {
  const cleaned = norm(val).replace(',', '.');
  if (!cleaned) return false;
  if (
    cleaned === '20/6' ||
    cleaned === '10/3' ||
    cleaned === '3.3' ||
    cleaned === '3.33' ||
    cleaned === '3.333' ||
    cleaned === '31/3' ||
    cleaned === '3' ||
    cleaned === '3atau4'
  ) {
    return true;
  }
  const num = Number(cleaned);
  return Number.isFinite(num) && Math.abs(num - 20 / 6) <= 0.35;
}

export function evaluateStudentAnswers(
  answers: StudentAnswers,
  savedOutfitsCount: number = 0
): EvaluationResult {
  const validation: ValidationMap = {};

  // Halaman 2: Apersepsi
  validation.ap1_num1 = norm(answers.ap1_num1) === '1';
  validation.ap1_den1 = norm(answers.ap1_den1) === '3';
  validation.ap1_num2 = norm(answers.ap1_num2) === '1';
  validation.ap1_den2 = norm(answers.ap1_den2) === '2';
  validation.ap2_res1 = norm(answers.ap2_res1) === '5';
  validation.ap2_res2 = norm(answers.ap2_res2) === '4';

  // Halaman 3: Aktivitas 1 & 2
  validation.act1_nS = norm(answers.act1_nS) === '6';
  validation.act1_nA = norm(answers.act1_nA) === '1';

  validation.act2_num = norm(answers.act2_num) === '1';
  validation.act2_den = norm(answers.act2_den) === '6';
  validation.act2_reason = answers.act2_reason.trim().length >= 5;

  // Halaman 4: Bagian 3.1 (Frekuensi Harapan N = 20)
  validation.act31_N = norm(answers.act31_N) === '20';
  validation.act31_num = norm(answers.act31_num) === '1';
  validation.act31_den = norm(answers.act31_den) === '6';
  validation.act31_res = isExpectedFreqValid(answers.act31_res);

  // Halaman 4: Bagian 3.3 (Frekuensi Relatif N = 20)
  const kTrim = norm(answers.act33_k);
  const kNum = kTrim !== '' ? Number(kTrim) : NaN;
  const kValid = Number.isInteger(kNum) && kNum >= 0 && kNum <= MAX_SPIN_TRIALS;

  validation.act33_k = kValid;
  validation.act33_N = norm(answers.act33_N) === '20';
  validation.act33_num = kValid && norm(answers.act33_num) === String(kNum);
  validation.act33_den = norm(answers.act33_den) === '20';

  // Halaman 4: Bagian 3.4 (Refleksi Perbandingan)
  validation.act34_q1 = answers.act34_q1.trim().length >= 3;
  validation.act34_q2 = answers.act34_q2.trim().length >= 5;
  validation.act34_q3 = answers.act34_q3.trim().length >= 5;

  const keys = Object.keys(validation) as Array<keyof StudentAnswers>;
  const fieldCorrect = keys.filter((k) => validation[k] === true).length;

  // Include 6 points for completing the 6 cells in Tabel Aktivitas 1
  const clampedSaved = Math.max(0, Math.min(6, savedOutfitsCount));
  const totalGradable = keys.length + 6;
  const correctCount = fieldCorrect + clampedSaved;
  const score = Math.round((correctCount / totalGradable) * 100);

  return {
    validation,
    correctCount,
    totalGradable,
    score,
    savedCountBonus: clampedSaved,
  };
}

export function calculateProgressPercentage(
  answers: StudentAnswers,
  savedOutfitsCount: number = 0
): number {
  const trackedKeys: Array<keyof StudentAnswers> = [
    'groupName',
    'member1',
    'ap1_num1',
    'ap1_den1',
    'ap1_num2',
    'ap1_den2',
    'ap2_res1',
    'ap2_res2',
    'act1_nS',
    'act1_nA',
    'act2_num',
    'act2_den',
    'act2_reason',
    'act31_N',
    'act31_num',
    'act31_den',
    'act31_res',
    'act33_k',
    'act33_num',
    'act34_q1',
    'act34_q2',
    'act34_q3',
  ];

  const filledFields = trackedKeys.filter((k) => answers[k].trim().length > 0).length;
  const clampedSaved = Math.max(0, Math.min(6, savedOutfitsCount));
  return Math.round(((filledFields + clampedSaved) / (trackedKeys.length + 6)) * 100);
}

export function runRandomTrials(
  trials: number = MAX_SPIN_TRIALS,
  rng: () => number = Math.random
): {
  stats: SimulationStats;
  lastOutfit: { top: TopCode; bottom: BottomCode; key: OutfitKey };
  sequence: Array<{ top: TopCode; bottom: BottomCode; key: OutfitKey }>;
} {
  const stats: SimulationStats = { ...INITIAL_STATS };
  const sequence: Array<{ top: TopCode; bottom: BottomCode; key: OutfitKey }> = [];
  let lastOutfit = ALL_OUTFITS[0];

  for (let i = 0; i < trials; i++) {
    const idx = Math.min(ALL_OUTFITS.length - 1, Math.floor(rng() * ALL_OUTFITS.length));
    const chosen = ALL_OUTFITS[idx];
    stats[chosen.key] += 1;
    lastOutfit = chosen;
    sequence.push({ top: chosen.top, bottom: chosen.bottom, key: chosen.key });
  }

  return {
    stats,
    lastOutfit: { top: lastOutfit.top, bottom: lastOutfit.bottom, key: lastOutfit.key },
    sequence,
  };
}
