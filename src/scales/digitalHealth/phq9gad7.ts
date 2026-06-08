// PHQ-9問診項目
export const PHQ9_QUESTIONS = [
  { id: 'p1', text: '気分が沈んだり、憂うつな気持ちになったりすることがある' },
  { id: 'p2', text: '物事に対してほとんど興味がわかない、または楽しめない' },
  { id: 'p3', text: '寝つきが悪い、途中で目が覚める、または逆に眠りすぎる' },
  { id: 'p4', text: '疲れた感じがする、または気力がない' },
  { id: 'p5', text: '食欲がない、または食べすぎる' },
  { id: 'p6', text: '自分はダメな人間だ、または家族に申し訳ないと感じる' },
  { id: 'p7', text: '新聞を読んだりテレビを見たりする際に集中できない' },
  { id: 'p8', text: '他の人が気づくくらい、動作や話し方が遅くなった、またはイライラして落ち着かない' },
  { id: 'p9', text: '死んだほうがましだ、または自分を傷つけることを考えた', isSafetyItem: true },
] as const;

// GAD-7問診項目
export const GAD7_QUESTIONS = [
  { id: 'g1', text: '緊張感、不安感、またはびくびくした感じがある' },
  { id: 'g2', text: '心配することをやめられない、またはコントロールできない' },
  { id: 'g3', text: 'いろいろなことを心配しすぎる' },
  { id: 'g4', text: 'リラックスするのが難しい' },
  { id: 'g5', text: 'じっとしていられないくらい落ち着かない' },
  { id: 'g6', text: 'イライラしたり怒りっぽくなったりする' },
  { id: 'g7', text: '何か恐ろしいことが起こりそうな感じがある' },
] as const;

// スコア選択肢（共通）
export const MOOD_ANSWER_OPTIONS = [
  { value: 0, label: '全くない' },
  { value: 1, label: '数日' },
  { value: 2, label: '半分以上の日' },
  { value: 3, label: 'ほぼ毎日' },
] as const;

export function calculatePHQ9(answers: Record<string, number>): {
  total: number;
  p9Alert: boolean;
} {
  const total = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9']
    .reduce((sum, id) => sum + (answers[id] ?? 0), 0);
  const p9Alert = (answers['p9'] ?? 0) >= 1;
  return { total, p9Alert };
}

export function calculateGAD7(answers: Record<string, number>): { total: number } {
  const total = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7']
    .reduce((sum, id) => sum + (answers[id] ?? 0), 0);
  return { total };
}
