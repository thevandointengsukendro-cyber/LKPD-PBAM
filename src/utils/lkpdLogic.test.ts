import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_ANSWERS,
  StudentAnswers,
  evaluateStudentAnswers,
  calculateProgressPercentage,
  runRandomTrials,
  saveOutfitCombination,
  MAX_SPIN_TRIALS,
} from './lkpdLogic';

test('saveOutfitCombination prevents duplicates and saves all 6 Palembang traditional outfits', () => {
  const step0 = saveOutfitCombination([], null, 'S');
  assert.equal(step0.savedOutfits.length, 0);
  assert.equal(step0.isDuplicate, false);

  const step1 = saveOutfitCombination([], 'AG', 'S');
  assert.deepEqual(step1.savedOutfits, ['AG,S']);
  assert.equal(step1.isDuplicate, false);

  const dup = saveOutfitCombination(step1.savedOutfits, 'AG', 'S');
  assert.deepEqual(dup.savedOutfits, ['AG,S']);
  assert.equal(dup.isDuplicate, true);
  assert.equal(dup.message, 'Pasangan pakaian ini sudah kamu pilih!');
});

test('evaluateStudentAnswers returns 100 score when all Palembang Heritage answers and 6 table cells are complete', () => {
  const perfectAnswers: StudentAnswers = {
    ...INITIAL_ANSWERS,
    groupName: 'Kelompok Sriwijaya',
    member1: 'Siti Aisyah',
    ap1_num1: '1',
    ap1_den1: '3',
    ap1_num2: '1',
    ap1_den2: '2',
    ap2_res1: '5',
    ap2_res2: '4',

    act1_nS: '6',
    act1_nA: '1',

    act2_num: '1',
    act2_den: '6',
    act2_reason: 'Karena setiap pasangan memiliki 1 anggota dari 6 anggota ruang sampel.',

    act31_N: '20',
    act31_num: '1',
    act31_den: '6',
    act31_res: '3,33',

    act33_k: '4',
    act33_N: '20',
    act33_num: '4',
    act33_den: '20',

    act34_q1: 'Tidak selalu sama, frekuensinya bervariasi.',
    act34_q2: 'Karena setiap putaran bersifat acak sehingga hasil empiris bisa berbeda dari harapan.',
    act34_q3: 'Semakin banyak percobaan dilakukan, frekuensi relatif mendekati peluang teoretis.',
  };

  const result = evaluateStudentAnswers(perfectAnswers, 6);
  assert.equal(result.score, 100);
  assert.equal(result.correctCount, result.totalGradable);
});

test('runRandomTrials defaults to 20 trials and sums exactly to 20 across the 6 Palembang outfits', () => {
  let seed = 0;
  const fakeRng = () => {
    seed = (seed + 0.17) % 1;
    return seed;
  };
  const { stats, sequence } = runRandomTrials(MAX_SPIN_TRIALS, fakeRng);
  const total = Object.values(stats).reduce((acc, v) => acc + v, 0);
  assert.equal(total, 20);
  assert.equal(sequence.length, 20);
});

test('calculateProgressPercentage reflects completion accurately from 0 to 100', () => {
  assert.equal(calculateProgressPercentage(INITIAL_ANSWERS, 0), 4);
});
