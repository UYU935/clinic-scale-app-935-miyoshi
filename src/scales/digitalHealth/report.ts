import { digitalHealthScale } from './definition';

export function getOptionLabel(questionId: string, value: number | string): string {
  const q = digitalHealthScale.questions.find((q) => q.id === questionId);
  if (!q?.options) return String(value);
  const opt = q.options.find((o) => o.value === value);
  return opt?.label ?? String(value);
}

export function formatSleepDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `約${h}時間` : `約${h}時間${m}分`;
}

// 端末使用フラグ → 患者向け箇条書きメッセージ
export function getPatientAMessages(aFlags: string[]): string[] {
  const messages: string[] = [];
  if (aFlags.includes('FLAG_A_TOTAL_USE'))
    messages.push('端末の合計使用時間が長めでした（4時間以上）。');
  if (aFlags.includes('FLAG_A_VIDEO'))
    messages.push('動画視聴が多めでした。');
  if (aFlags.includes('FLAG_A_BEDTIME'))
    messages.push('就寝前にスマホをかなり使っていました。画面の光が眠気を妨げることがあります。');
  if (aFlags.includes('FLAG_A_CONTROL'))
    messages.push('気づくと予定より長く使っていることが何度かありました。');
  if (aFlags.includes('FLAG_A_FATIGUE'))
    messages.push('頭の疲れや情報過多を感じていたようです。');
  return messages;
}

// 睡眠フラグ → 患者向け箇条書きメッセージ
export function getPatientBMessages(bFlags: string[]): string[] {
  const messages: string[] = [];
  if (bFlags.includes('FLAG_B_SHORT'))
    messages.push('睡眠時間が短めでした（目安：6時間）。疲労感や集中力の低下につながることがあります。');
  if (bFlags.includes('FLAG_B_LATENCY'))
    messages.push('寝つくまでに時間がかかっていました。就寝前の端末使用が影響することがあります。');
  if (bFlags.includes('FLAG_B_PHASE_LATE'))
    messages.push('就床時刻が遅めでした。起床時刻を一定に保つと体内時計が整いやすくなります。');
  if (bFlags.includes('FLAG_B_WAKEUP'))
    messages.push('夜中に目が覚めることが多かったようです。');
  if (bFlags.includes('FLAG_B_QUALITY'))
    messages.push('熟眠感・睡眠への満足感がやや低い回答でした。');
  if (bFlags.includes('FLAG_B_DAYTIME'))
    messages.push('日中に強い眠気があり、活動に影響が出ていたようです。');
  return messages;
}

// PHQ-9: スコアが気になる範囲のときに表示する箇条書きメッセージ（p9は別途アラート処理）
export function getPatientPhq9Messages(answers: Record<string, number>): string[] {
  const msgs: string[] = [];
  if ((answers.p1 ?? 0) >= 1) msgs.push('気分の落ち込みを感じることがあったようです。');
  if ((answers.p2 ?? 0) >= 1) msgs.push('物事への興味や楽しみが感じにくくなっていたようです。');
  if ((answers.p3 ?? 0) >= 1) msgs.push('睡眠の困りごと（寝つき・途中で目が覚める・眠りすぎ）がありました。');
  if ((answers.p4 ?? 0) >= 1) msgs.push('疲れやすさや気力の低下を感じていたようです。');
  if ((answers.p5 ?? 0) >= 1) msgs.push('食欲の変化（減少または増加）がありました。');
  if ((answers.p6 ?? 0) >= 1) msgs.push('自分を責めたり、申し訳なさを感じることがありました。');
  if ((answers.p7 ?? 0) >= 1) msgs.push('集中することが難しい状態でした。');
  if ((answers.p8 ?? 0) >= 1) msgs.push('動作や話し方の変化、またはイライラ感がありました。');
  return msgs;
}

// GAD-7: 箇条書きメッセージ
export function getPatientGad7Messages(answers: Record<string, number>): string[] {
  const msgs: string[] = [];
  if ((answers.g1 ?? 0) >= 1) msgs.push('緊張感や不安を感じることがあったようです。');
  if ((answers.g2 ?? 0) >= 1) msgs.push('心配事がなかなか頭から離れない状態でした。');
  if ((answers.g3 ?? 0) >= 1) msgs.push('いろいろなことを心配しすぎてしまう傾向がありました。');
  if ((answers.g4 ?? 0) >= 1) msgs.push('リラックスするのが難しい状態でした。');
  if ((answers.g5 ?? 0) >= 1) msgs.push('じっとしていられないような落ち着きのなさがありました。');
  if ((answers.g6 ?? 0) >= 1) msgs.push('イライラしたり怒りっぽくなることがありました。');
  if ((answers.g7 ?? 0) >= 1) msgs.push('何か悪いことが起こりそうな恐怖感を感じていたようです。');
  return msgs;
}

export function getPatientPhq9Message(total: number): string {
  if (total <= 4) return '現在、気分の面で特に気になる傾向は見られませんでした。';
  return '';
}

export function getPatientGad7Message(total: number): string {
  if (total <= 4) return '現在、不安の面で特に気になる傾向は見られませんでした。';
  return '';
}

export function getPhq9Severity(total: number): string {
  if (total <= 4) return '最小限';
  if (total <= 9) return '軽度';
  if (total <= 14) return '中等度';
  if (total <= 19) return '中等度〜重度';
  return '重度';
}

export function getGad7Severity(total: number): string {
  if (total <= 4) return '最小限';
  if (total <= 9) return '軽度';
  if (total <= 14) return '中等度';
  return '重度';
}

export const FLAG_LABELS: Record<string, string> = {
  FLAG_A_TOTAL_USE: '総使用時間長（4〜6時間以上）',
  FLAG_A_VIDEO: '動画視聴過多（1〜2時間以上）',
  FLAG_A_BEDTIME: '就寝前使用あり',
  FLAG_A_CONTROL: '使用コントロール困難',
  FLAG_A_FATIGUE: 'デジタル疲労感強',
  FLAG_B_LATENCY: '入眠潜時延長（30分以上）',
  FLAG_B_SHORT: '睡眠時間短縮（6時間未満）',
  FLAG_B_PHASE_LATE: '睡眠相後退（就床2時以降）',
  FLAG_B_WAKEUP: '中途覚醒（2回以上）',
  FLAG_B_QUALITY: '熟眠感・満足度低下',
  FLAG_B_DAYTIME: '日中過眠（活動に支障）',
};
