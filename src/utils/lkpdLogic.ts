export type ShirtCode = 'M' | 'B' | 'K';
export type PantsCode = 'P' | 'H';
export type OutfitKey = `${ShirtCode},${PantsCode}`;

export interface SimulationStats {
  'M,P': number;
  'M,H': number;
  'B,P': number;
  'B,H': number;
  'K,P': number;
  'K,H': number;
}

export const INITIAL_STATS: SimulationStats = {
  'M,P': 0,
  'M,H': 0,
  'B,P': 0,
  'B,H': 0,
  'K,P': 0,
  'K,H': 0,
};

export const ALL_OUTFITS: Array<{ shirt: ShirtCode; pants: PantsCode; key: OutfitKey; label: string }> = [
  { shirt: 'M', pants: 'P', key: 'M,P', label: '(M, P)' },
  { shirt: 'M', pants: 'H', key: 'M,H', label: '(M, H)' },
  { shirt: 'B', pants: 'P', key: 'B,P', label: '(B, P)' },
  { shirt: 'B', pants: 'H', key: 'B,H', label: '(B, H)' },
  { shirt: 'K', pants: 'P', key: 'K,P', label: '(K, P)' },
  { shirt: 'K', pants: 'H', key: 'K,H', label: '(K, H)' },
];

export interface StudentAnswers {
  // Page 1 Identity (tracked for progress, not graded wrong)
  groupName: string;
  classSemester: string;
  member1: string;
  member2: string;
  member3: string;
  member4: string;
  member5: string;

  // Page 2 Apersepsi (TP.P1 & TP.P2)
  ap1_num1: string; // 1
  ap1_den1: string; // 3
  ap1_num2: string; // 1
  ap1_den2: string; // 5
  ap2_res1: string; // 5
  ap2_res2: string; // 10

  // Page 3 Aktivitas 1 (TP.D1)
  act1_MH: string; // (M, H)
  act1_BP: string; // (B, P)
  act1_KP: string; // (K, P)
  act1_KH: string; // (K, H)
  act1_nS: string; // 6
  act1_nB: string; // 1

  // Page 3 Aktivitas 2 (TP.D2)
  act2_num: string; // 1
  act2_den: string; // 6
  act2_drop1: string; // n(B)
  act2_drop2: string; // n(S)

  // Page 4 Aktivitas 3.1
  act31_num: string; // 1
  act31_den: string; // 6
  act31_res: string; // 5

  // Page 4 Aktivitas 3.2
  act32_k: string; // dynamic k (0..30, default e.g. from simulator)
  act32_num: string; // equals k

  // Page 4 Aktivitas 3.3
  act33_num: string; // equals k
  act33_mult: string; // equals k
  act33_res: string; // equals 4 * k

  // Page 4 Aktivitas 3.4
  act34_drop1: string; // ruang sampel (S)
  act34_drop2: string; // n(S)
  act34_drop3: string; // Frekuensi Relatif (f_r)
  act34_drop4: string; // Peluang Teoretis P(B)
  act34_drop5: string; // Frekuensi Harapan (F_h)

  // Page 5 Evaluasi
  eval1_choice: string; // B
  eval2_num: string; // 2
  eval2_den: string; // 6
  eval2_res: string; // 30
  eval3_choice: string; // C
  eval4_num: string; // 6
  eval4_den: string; // 30
  eval4_resEmp: string; // 30
  eval4_resTheo: string; // 25
  eval4_analysis: string; // non-empty text
}

export const INITIAL_ANSWERS: StudentAnswers = {
  groupName: '',
  classSemester: 'VIII (Delapan) - A / Genap',
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

  act1_MH: '',
  act1_BP: '',
  act1_KP: '',
  act1_KH: '',
  act1_nS: '',
  act1_nB: '',

  act2_num: '',
  act2_den: '',
  act2_drop1: '',
  act2_drop2: '',

  act31_num: '',
  act31_den: '',
  act31_res: '',

  act32_k: '',
  act32_num: '',

  act33_num: '',
  act33_mult: '',
  act33_res: '',

  act34_drop1: '',
  act34_drop2: '',
  act34_drop3: '',
  act34_drop4: '',
  act34_drop5: '',

  eval1_choice: '',
  eval2_num: '',
  eval2_den: '',
  eval2_res: '',
  eval3_choice: '',
  eval4_num: '',
  eval4_den: '',
  eval4_resEmp: '',
  eval4_resTheo: '',
  eval4_analysis: '',
};

/**
 * Normalizes a sample point string like " ( m , h ) " or "M,H" into "(M, H)"
 */
export function normalizePairInput(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^\(?([MBK]),([PH])\)?$/);
  if (match) {
    return `(${match[1]}, ${match[2]})`;
  }
  return raw.trim();
}

export function normalizeNumericInput(raw: string): string {
  return raw.trim();
}

export type ValidationMap = Partial<Record<keyof StudentAnswers, boolean>>;

export interface EvaluationResult {
  validation: ValidationMap;
  correctCount: number;
  totalGradable: number;
  score: number; // 0 to 100
}

/**
 * Evaluates all gradable fields in StudentAnswers.
 * Dynamic empirical fields on Page 4 (3.2 & 3.3) are validated consistently
 * against the student's recorded k value (where 0 <= k <= 30).
 */
export function evaluateStudentAnswers(answers: StudentAnswers): EvaluationResult {
  const v: ValidationMap = {};

  // Page 2 Apersepsi (6 items)
  v.ap1_num1 = normalizeNumericInput(answers.ap1_num1) === '1';
  v.ap1_den1 = normalizeNumericInput(answers.ap1_den1) === '3';
  v.ap1_num2 = normalizeNumericInput(answers.ap1_num2) === '1';
  v.ap1_den2 = normalizeNumericInput(answers.ap1_den2) === '5';
  v.ap2_res1 = normalizeNumericInput(answers.ap2_res1) === '5';
  v.ap2_res2 = normalizeNumericInput(answers.ap2_res2) === '10';

  // Page 3 Aktivitas 1 (6 items)
  v.act1_MH = normalizePairInput(answers.act1_MH) === '(M, H)';
  v.act1_BP = normalizePairInput(answers.act1_BP) === '(B, P)';
  v.act1_KP = normalizePairInput(answers.act1_KP) === '(K, P)';
  v.act1_KH = normalizePairInput(answers.act1_KH) === '(K, H)';
  v.act1_nS = normalizeNumericInput(answers.act1_nS) === '6';
  v.act1_nB = normalizeNumericInput(answers.act1_nB) === '1';

  // Page 3 Aktivitas 2 (4 items)
  v.act2_num = normalizeNumericInput(answers.act2_num) === '1';
  v.act2_den = normalizeNumericInput(answers.act2_den) === '6';
  v.act2_drop1 = answers.act2_drop1 === 'n(B)';
  v.act2_drop2 = answers.act2_drop2 === 'n(S)';

  // Page 4 Aktivitas 3.1 (3 items)
  v.act31_num = normalizeNumericInput(answers.act31_num) === '1';
  v.act31_den = normalizeNumericInput(answers.act31_den) === '6';
  v.act31_res = normalizeNumericInput(answers.act31_res) === '5';

  // Page 4 Aktivitas 3.2 & 3.3 (5 items based on k)
  const kStr = normalizeNumericInput(answers.act32_k);
  const kNum = Number(kStr);
  const isValidK = kStr !== '' && Number.isInteger(kNum) && kNum >= 0 && kNum <= 30;
  v.act32_k = isValidK;
  v.act32_num = isValidK && normalizeNumericInput(answers.act32_num) === String(kNum);
  v.act33_num = isValidK && normalizeNumericInput(answers.act33_num) === String(kNum);
  v.act33_mult = isValidK && normalizeNumericInput(answers.act33_mult) === String(kNum);
  v.act33_res = isValidK && normalizeNumericInput(answers.act33_res) === String(4 * kNum);

  // Page 4 Aktivitas 3.4 (5 items)
  v.act34_drop1 = answers.act34_drop1 === 'ruang sampel (S)';
  v.act34_drop2 = answers.act34_drop2 === 'n(S)';
  v.act34_drop3 = answers.act34_drop3 === 'Frekuensi Relatif (f_r)';
  v.act34_drop4 = answers.act34_drop4 === 'Peluang Teoretis P(B)';
  v.act34_drop5 = answers.act34_drop5 === 'Frekuensi Harapan (F_h)';

  // Page 5 Evaluasi (10 items)
  v.eval1_choice = answers.eval1_choice === 'B';
  const e2n = normalizeNumericInput(answers.eval2_num);
  const e2d = normalizeNumericInput(answers.eval2_den);
  const e2PairOk = (e2n === '2' && e2d === '6') || (e2n === '1' && e2d === '3');
  v.eval2_num = e2PairOk ? true : e2n === '2';
  v.eval2_den = e2PairOk ? true : e2d === '6';
  v.eval2_res = normalizeNumericInput(answers.eval2_res) === '30';

  v.eval3_choice = answers.eval3_choice === 'C';

  const e4n = normalizeNumericInput(answers.eval4_num);
  const e4d = normalizeNumericInput(answers.eval4_den);
  const e4PairOk = (e4n === '6' && e4d === '30') || (e4n === '1' && e4d === '5');
  v.eval4_num = e4PairOk ? true : e4n === '6';
  v.eval4_den = e4PairOk ? true : e4d === '30';
  v.eval4_resEmp = normalizeNumericInput(answers.eval4_resEmp) === '30';
  v.eval4_resTheo = normalizeNumericInput(answers.eval4_resTheo) === '25';
  v.eval4_analysis = answers.eval4_analysis.trim().length >= 8;

  const keys = Object.keys(v) as Array<keyof ValidationMap>;
  const totalGradable = keys.length;
  const correctCount = keys.filter((k) => v[k] === true).length;
  const score = Math.round((correctCount / totalGradable) * 100);

  return {
    validation: v,
    correctCount,
    totalGradable,
    score,
  };
}

/**
 * Calculates completion percentage (0..100) across gradable fields + group name.
 */
export function calculateProgressPercentage(answers: StudentAnswers): number {
  const trackedKeys: Array<keyof StudentAnswers> = [
    'groupName',
    'member1',
    'ap1_num1',
    'ap1_den1',
    'ap1_num2',
    'ap1_den2',
    'ap2_res1',
    'ap2_res2',
    'act1_MH',
    'act1_BP',
    'act1_KP',
    'act1_KH',
    'act1_nS',
    'act1_nB',
    'act2_num',
    'act2_den',
    'act2_drop1',
    'act2_drop2',
    'act31_num',
    'act31_den',
    'act31_res',
    'act32_k',
    'act32_num',
    'act33_num',
    'act33_mult',
    'act33_res',
    'act34_drop1',
    'act34_drop2',
    'act34_drop3',
    'act34_drop4',
    'act34_drop5',
    'eval1_choice',
    'eval2_num',
    'eval2_den',
    'eval2_res',
    'eval3_choice',
    'eval4_num',
    'eval4_den',
    'eval4_resEmp',
    'eval4_resTheo',
    'eval4_analysis',
  ];

  const filled = trackedKeys.filter((k) => answers[k].trim() !== '').length;
  return Math.round((filled / trackedKeys.length) * 100);
}

/**
 * Runs N random outfit trials and returns the resulting frequency distribution
 * and the last chosen outfit.
 */
export function runRandomTrials(
  count: number,
  rng: () => number = Math.random
): { stats: SimulationStats; lastOutfit: { shirt: ShirtCode; pants: PantsCode; key: OutfitKey } } {
  const stats: SimulationStats = { ...INITIAL_STATS };
  let lastOutfit = ALL_OUTFITS[0];

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * ALL_OUTFITS.length) % ALL_OUTFITS.length;
    lastOutfit = ALL_OUTFITS[idx];
    stats[lastOutfit.key] += 1;
  }

  return { stats, lastOutfit };
}
