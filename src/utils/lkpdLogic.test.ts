import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_ANSWERS,
  normalizePairInput,
  evaluateStudentAnswers,
  calculateProgressPercentage,
  runRandomTrials,
  StudentAnswers,
} from './lkpdLogic';

test('normalizePairInput handles spaces, lowercase, and missing parentheses', () => {
  assert.equal(normalizePairInput('(M, H)'), '(M, H)');
  assert.equal(normalizePairInput('(m,h)'), '(M, H)');
  assert.equal(normalizePairInput(' b , p '), '(B, P)');
  assert.equal(normalizePairInput('(K, P)'), '(K, P)');
});

test('runRandomTrials generates exact count sum across 6 sample points', () => {
  const { stats, lastOutfit } = runRandomTrials(30);
  const total = Object.values(stats).reduce((acc, v) => acc + v, 0);
  assert.equal(total, 30);
  assert.ok(['M,P', 'M,H', 'B,P', 'B,H', 'K,P', 'K,H'].includes(lastOutfit.key));
});

test('evaluateStudentAnswers gives 100 score when all answers are correct', () => {
  const perfectAnswers: StudentAnswers = {
    ...INITIAL_ANSWERS,
    groupName: 'Kelompok 1 (Pascal)',
    member1: 'Budi Santoso (05)',
    ap1_num1: '1',
    ap1_den1: '3',
    ap1_num2: '1',
    ap1_den2: '5',
    ap2_res1: '5',
    ap2_res2: '10',
    act1_MH: '(M, H)',
    act1_BP: '(B, P)',
    act1_KP: '(K, P)',
    act1_KH: '(K, H)',
    act1_nS: '6',
    act1_nB: '1',
    act2_num: '1',
    act2_den: '6',
    act2_drop1: 'n(B)',
    act2_drop2: 'n(S)',
    act31_num: '1',
    act31_den: '6',
    act31_res: '5',
    act32_k: '6',
    act32_num: '6',
    act33_num: '6',
    act33_mult: '6',
    act33_res: '24',
    act34_drop1: 'ruang sampel (S)',
    act34_drop2: 'n(S)',
    act34_drop3: 'Frekuensi Relatif (f_r)',
    act34_drop4: 'Peluang Teoretis P(B)',
    act34_drop5: 'Frekuensi Harapan (F_h)',
    eval1_choice: 'B',
    eval2_num: '2',
    eval2_den: '6',
    eval2_res: '30',
    eval3_choice: 'C',
    eval4_num: '6',
    eval4_den: '30',
    eval4_resEmp: '30',
    eval4_resTheo: '25',
    eval4_analysis: 'Frekuensi relatif 6/30 mendekati peluang teoretis 5/30 dan semakin dekat jika N diperbanyak.',
  };

  const result = evaluateStudentAnswers(perfectAnswers);
  assert.equal(result.score, 100);
  assert.equal(result.correctCount, result.totalGradable);
  assert.equal(calculateProgressPercentage(perfectAnswers), 100);
});

test('evaluateStudentAnswers validates dynamic empirical k = 5 -> 4k = 20 accurately', () => {
  const answers: StudentAnswers = {
    ...INITIAL_ANSWERS,
    act32_k: '5',
    act32_num: '5',
    act33_num: '5',
    act33_mult: '5',
    act33_res: '20',
  };
  const result = evaluateStudentAnswers(answers);
  assert.equal(result.validation.act32_k, true);
  assert.equal(result.validation.act32_num, true);
  assert.equal(result.validation.act33_num, true);
  assert.equal(result.validation.act33_mult, true);
  assert.equal(result.validation.act33_res, true);
});
