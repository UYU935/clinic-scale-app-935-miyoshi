import { useEffect, useRef } from 'react';
import type { Answers, AnswerValue } from '../scales/types';
import { entMoodAnxietyLifeImpactDefinition } from '../scales/entMoodAnxietyLifeImpact/definition';
import { validateAnswers } from '../scales/entMoodAnxietyLifeImpact/scoring';
import { ProgressBar } from './ProgressBar';
import { ScaleAnswerButtons, YesNoAnswerButtons } from './AnswerButtons';
import styles from './QuestionScreen.module.css';

type Props = {
  answers: Answers;
  onAnswer: (questionId: string, value: AnswerValue | boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
};

const { questions, sections } = entMoodAnxietyLifeImpactDefinition;
const scaleQuestions = questions.filter((q) => q.type === 'scale');
const safetyQuestions = questions.filter((q) => q.type === 'yes_no');
const totalAnswerable = questions.length;

export function QuestionScreen({ answers, onAnswer, onSubmit, onBack }: Props) {
  const answeredCount = Object.keys(answers).length;
  const missingIds = validateAnswers(answers);
  const canSubmit = missingIds.length === 0;

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const getSectionTitle = (sectionId: string) =>
    sections.find((s) => s.id === sectionId)?.title ?? sectionId;

  // Group scale questions by section
  const scaleSections = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className={styles.container} ref={topRef}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>← 戻る</button>
        <h1 className={styles.title}>症状と生活支障の整理シート</h1>
        <ProgressBar current={answeredCount} total={totalAnswerable} />
      </div>

      <div className={styles.scaleGuide}>
        <p>各質問について、当てはまる程度を選んでください。</p>
        <div className={styles.scaleRow}>
          <span><strong>0</strong>：ほとんどない</span>
          <span><strong>1</strong>：少しある</span>
          <span><strong>2</strong>：しばしばある</span>
          <span><strong>3</strong>：とても強い／かなり困っている</span>
        </div>
      </div>

      {scaleSections.map((secId) => {
        const sectionQs = scaleQuestions.filter((q) => q.sectionId === secId);
        const section = sections.find((s) => s.id === secId);
        return (
          <section key={secId} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>{secId}</span>
              <h2 className={styles.sectionTitle}>{getSectionTitle(secId)}</h2>
            </div>
            {section?.description && (
              <p className={styles.sectionDesc}>{section.description}</p>
            )}
            <div className={styles.questionList}>
              {sectionQs.map((q, idx) => {
                const val = answers[q.id];
                const answered = q.id in answers;
                const isMissing = missingIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    id={`q-${q.id}`}
                    className={`${styles.questionCard} ${answered ? styles.answered : ''} ${isMissing && !canSubmit ? styles.missing : ''}`}
                  >
                    <p className={styles.questionText}>
                      <span className={styles.questionNum}>{secId}{idx + 1}</span>
                      {q.text}
                    </p>
                    <ScaleAnswerButtons
                      selected={typeof val === 'number' ? (val as AnswerValue) : undefined}
                      onChange={(v) => onAnswer(q.id, v)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Safety items */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={`${styles.sectionBadge} ${styles.safetyBadge}`}>確認</span>
          <h2 className={styles.sectionTitle}>以下の項目についてお答えください</h2>
        </div>
        <p className={styles.sectionDesc}>
          「はい」または「いいえ」でお答えください。診察の参考にします。
        </p>
        <div className={styles.questionList}>
          {safetyQuestions.map((q, idx) => {
            const val = answers[q.id];
            const answered = q.id in answers;
            const isMissing = missingIds.includes(q.id);
            return (
              <div
                key={q.id}
                id={`q-${q.id}`}
                className={`${styles.questionCard} ${answered ? styles.answered : ''} ${isMissing && !canSubmit ? styles.missing : ''}`}
              >
                <p className={styles.questionText}>
                  <span className={styles.questionNum}>確認{idx + 1}</span>
                  {q.text}
                </p>
                <YesNoAnswerButtons
                  selected={typeof val === 'boolean' ? val : undefined}
                  onChange={(v) => onAnswer(q.id, v)}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Submit area */}
      <div className={styles.submitArea}>
        {!canSubmit && answeredCount > 0 && (
          <div className={styles.missingWarning}>
            <p>未回答の項目が {missingIds.length} つあります。すべての項目に回答してください。</p>
            <button
              className={styles.jumpButton}
              onClick={() => {
                const firstMissing = missingIds[0];
                document.getElementById(`q-${firstMissing}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              未回答箇所へ移動
            </button>
          </div>
        )}
        <button
          className={`${styles.submitButton} ${!canSubmit ? styles.submitDisabled : ''}`}
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          スコアを集計してレポートを作成する →
        </button>
      </div>
    </div>
  );
}
