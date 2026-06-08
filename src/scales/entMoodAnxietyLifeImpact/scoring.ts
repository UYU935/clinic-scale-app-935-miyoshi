import type { Answers, ScoreResult, SectionScore, TagResult, SafetyAlert } from '../types';
import { entMoodAnxietyLifeImpactDefinition } from './definition';
import { formatDateTime } from '../../utils/date';

function getSectionLevel(sectionId: string, score: number): string {
  if (sectionId === 'A') {
    if (score <= 3) return '軽め';
    if (score <= 7) return '中等度';
    return '強い';
  }
  // B〜F
  if (score <= 4) return '目立ちにくい';
  if (score <= 8) return 'やや目立つ';
  if (score <= 12) return '目立つ';
  return '強く目立つ';
}

function computeSectionScores(answers: Answers): Record<string, number> {
  const scores: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  const scaleQuestions = entMoodAnxietyLifeImpactDefinition.questions.filter(
    (q) => q.type === 'scale'
  );
  for (const q of scaleQuestions) {
    const val = answers[q.id];
    if (typeof val === 'number') {
      scores[q.sectionId] = (scores[q.sectionId] ?? 0) + val;
    }
  }
  return scores;
}

function computeTags(scores: Record<string, number>): TagResult[] {
  const tags: TagResult[] = [];

  if (scores['B'] >= 9 && scores['D'] >= 5) {
    tags.push({
      id: 'anxiety_avoidance',
      label: '不安・警戒優位型',
      patientText:
        '症状そのものに加えて、「また起きたらどうしよう」という警戒や、症状が出そうな場面を避ける傾向がみられます。これは珍しい反応ではありませんが、続くと生活範囲が狭くなり、症状への注意がさらに強まることがあります。',
    });
  }

  if (scores['C'] >= 9 && ((scores['A'] ?? 0) >= 4 || (scores['D'] ?? 0) >= 5)) {
    tags.push({
      id: 'mood_decline',
      label: '気分・意欲低下型',
      patientText:
        '症状が続くことで、気分の沈みや意欲の低下が出ている可能性があります。これは「気の持ちよう」という意味ではなく、体調不良が続いたときに起こりやすい二次的な反応として整理できます。',
    });
  }

  if (scores['E'] >= 9) {
    tags.push({
      id: 'body_condition',
      label: '身体コンディション影響型',
      patientText:
        '睡眠不足、疲労、気圧、画面作業、首や肩のこりなど、体のコンディションによって症状が変動しやすい傾向がみられます。生活リズムや負荷の調整が、症状コントロールの一部になる可能性があります。',
    });
  }

  if (scores['D'] >= 9 && scores['B'] >= 9) {
    tags.push({
      id: 'avoidance_expansion',
      label: '回避拡大型',
      patientText:
        '症状を避けようとする行動が増え、生活範囲が狭くなっている可能性があります。無理に我慢する必要はありませんが、避け続けることで症状への警戒が強まることもあるため、段階的な慣らし方を検討します。',
    });
  }

  if (scores['F'] >= 9) {
    tags.push({
      id: 'explanation_need',
      label: '説明ニーズ高値型',
      patientText:
        '症状の仕組みや今後の見通しについて、詳しい説明を必要としている傾向があります。検査結果だけでなく、生活上の対処法や再発時の対応を整理することが安心につながる可能性があります。',
    });
  }

  return tags;
}

function computeSafetyAlerts(answers: Answers): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];

  const safetyDefs: { id: string; label: string; severity: SafetyAlert['severity'] }[] = [
    { id: 'S1', label: '自傷関連', severity: 'urgent' },
    { id: 'S2', label: '生活破綻レベル', severity: 'warning' },
    { id: 'S3', label: '強い発作・救急不安', severity: 'warning' },
    { id: 'S4', label: '急性神経・急性難聴症状', severity: 'urgent' },
    { id: 'S5', label: '周囲からの異変指摘', severity: 'notice' },
  ];

  for (const def of safetyDefs) {
    const val = answers[def.id];
    const isPositive = val === true;
    let message = '';
    if (def.id === 'S1' && isPositive) {
      message = '要確認：自傷念慮に関する回答があります。診察時に必ず確認してください。';
    } else if (def.id === 'S4' && isPositive) {
      message =
        '要確認：急性神経症状または急性難聴を疑う回答があります。診察時に必ず確認してください。';
    }
    alerts.push({ id: def.id, label: def.label, isPositive, message, severity: def.severity });
  }

  return alerts;
}

export function computeScore(answers: Answers): ScoreResult {
  const rawScores = computeSectionScores(answers);

  const sectionScores: SectionScore[] = entMoodAnxietyLifeImpactDefinition.sections
    .filter((s) => s.id !== 'S')
    .map((section) => {
      const raw = rawScores[section.id] ?? 0;
      return {
        sectionId: section.id,
        rawScore: raw,
        maxScore: section.maxScore,
        level: getSectionLevel(section.id, raw),
      };
    });

  return {
    scaleId: entMoodAnxietyLifeImpactDefinition.id,
    createdAt: formatDateTime(new Date()),
    sectionScores,
    tags: computeTags(rawScores),
    safetyAlerts: computeSafetyAlerts(answers),
  };
}

export function validateAnswers(answers: Answers): string[] {
  const missing: string[] = [];
  for (const q of entMoodAnxietyLifeImpactDefinition.questions) {
    if (!(q.id in answers)) {
      missing.push(q.id);
    }
  }
  return missing;
}
