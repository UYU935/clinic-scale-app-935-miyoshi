export type DigitalHealthAnswers = {
  a1: number; a2: number; a3: number; a4: number;
  a5: number; a6: number; a7: number; a8: number;
  b1: string; // 時刻文字列 "HH:MM"
  b2: number; b3: string; b4: number;
  b5: number; b6: number; b7: number;
};

export type DigitalHealthScoreResult = {
  aTotal: number;
  aFlags: string[];
  b1Time: string;
  b3Time: string;
  bEstimatedSleep: number | null; // 分
  bDiscomfort: number;
  bFlags: string[];
};

// 入眠潜時変換（B2スコア → 分）
const latencyMinutes: Record<number, number> = {
  0: 5, 1: 10, 2: 22, 3: 45, 4: 75,
};

// 時刻文字列 → 分（午前0時からの経過分）
const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export function calculateDigitalHealthScore(
  answers: DigitalHealthAnswers
): DigitalHealthScoreResult {
  // セクションA
  const aTotal =
    answers.a1 + answers.a2 + answers.a3 + answers.a4 +
    answers.a5 + answers.a6 + answers.a7 + answers.a8;

  const aFlags: string[] = [];
  if (answers.a1 >= 4) aFlags.push('FLAG_A_TOTAL_USE');
  if (answers.a2 >= 3) aFlags.push('FLAG_A_VIDEO');
  if (answers.a4 >= 2) aFlags.push('FLAG_A_BEDTIME');
  if (answers.a6 >= 2) aFlags.push('FLAG_A_CONTROL');
  if (answers.a8 >= 2) aFlags.push('FLAG_A_FATIGUE');

  // セクションB：睡眠時間算出
  let b1Min = timeToMinutes(answers.b1);
  const b3Min = timeToMinutes(answers.b3);
  // 日をまたぐ補正（就床が深夜0〜12時の場合）
  if (b1Min >= 0 && b1Min < 12 * 60) b1Min += 24 * 60;
  const sleepMin =
    b3Min + (b3Min < b1Min ? 24 * 60 : 0) - b1Min - (latencyMinutes[answers.b2] ?? 0);
  const bEstimatedSleep = sleepMin > 0 ? sleepMin : null;

  const bDiscomfort =
    answers.b2 +
    answers.b4 +
    (6 - answers.b5) +
    answers.b6 +
    (6 - answers.b7);

  const bFlags: string[] = [];
  if (answers.b2 >= 3) bFlags.push('FLAG_B_LATENCY');
  if (bEstimatedSleep !== null && bEstimatedSleep < 360) bFlags.push('FLAG_B_SHORT');
  if (timeToMinutes(answers.b1) >= timeToMinutes('01:30')) bFlags.push('FLAG_B_PHASE_LATE');
  if (answers.b4 >= 2) bFlags.push('FLAG_B_WAKEUP');
  if (answers.b5 <= 2 || answers.b7 <= 2) bFlags.push('FLAG_B_QUALITY');
  if (answers.b6 >= 2) bFlags.push('FLAG_B_DAYTIME');

  return {
    aTotal, aFlags,
    b1Time: answers.b1, b3Time: answers.b3,
    bEstimatedSleep, bDiscomfort, bFlags,
  };
}
