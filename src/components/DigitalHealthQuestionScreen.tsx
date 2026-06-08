import { useState, useEffect, useRef } from 'react';
import type { DhAnswers } from '../scales/types';
import { digitalHealthScale } from '../scales/digitalHealth/definition';
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, MOOD_ANSWER_OPTIONS } from '../scales/digitalHealth/phq9gad7';
import { ProgressBar } from './ProgressBar';
import styles from './DigitalHealthQuestionScreen.module.css';

export type QuestionSetType = 'ab' | 'phq9' | 'gad7';

type Props = {
  questionSet: QuestionSetType;
  initialAnswers?: DhAnswers;
  onSubmit: (answers: DhAnswers) => void;
  onBack: () => void;
};

const AB_QUESTION_IDS = digitalHealthScale.questions.map((q) => q.id);
const PHQ9_IDS = PHQ9_QUESTIONS.map((q) => q.id);
const GAD7_IDS = GAD7_QUESTIONS.map((q) => q.id);

const SECTION_A_IDS = digitalHealthScale.questions
  .filter((q) => q.sectionId === 'section_a')
  .map((q) => q.id);
const SECTION_B_IDS = digitalHealthScale.questions
  .filter((q) => q.sectionId === 'section_b')
  .map((q) => q.id);

function getRequiredIds(questionSet: QuestionSetType): string[] {
  if (questionSet === 'ab') return AB_QUESTION_IDS;
  if (questionSet === 'phq9') return PHQ9_IDS;
  return GAD7_IDS;
}

function getTitle(questionSet: QuestionSetType): string {
  if (questionSet === 'ab') return '端末使用・睡眠問診';
  if (questionSet === 'phq9') return 'PHQ-9（気分・うつ症状）';
  return 'GAD-7（不安症状）';
}

export function DigitalHealthQuestionScreen({
  questionSet,
  initialAnswers,
  onSubmit,
  onBack,
}: Props) {
  const [answers, setAnswers] = useState<DhAnswers>(initialAnswers ?? {});
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const requiredIds = getRequiredIds(questionSet);
  const missingIds = requiredIds.filter((id) => !(id in answers));
  const canSubmit = missingIds.length === 0;
  const answeredCount = requiredIds.filter((id) => id in answers).length;

  const setAnswer = (id: string, value: number | string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(answers);
  };

  return (
    <div className={styles.container} ref={topRef}>
      <div className={styles.header}>
        <div className={styles.topRow}>
          <button className={styles.backBtn} onClick={onBack}>
            ← 戻る
          </button>
          <h1 className={styles.title}>{getTitle(questionSet)}</h1>
        </div>
        <ProgressBar current={answeredCount} total={requiredIds.length} />
      </div>

      {/* A+B問診 */}
      {questionSet === 'ab' && (
        <>
          <div className={styles.scaleGuide}>
            各質問について、最も当てはまる選択肢を選んでください。
          </div>

          {/* セクションA */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>A</span>
              <h2 className={styles.sectionTitle}>端末使用状況</h2>
            </div>
            <p className={styles.sectionDesc}>昨日1日の端末使用について回答してください</p>
            <div className={styles.questionList}>
              {digitalHealthScale.questions
                .filter((q) => SECTION_A_IDS.includes(q.id))
                .map((q, idx) => {
                  const val = answers[q.id];
                  const answered = q.id in answers;
                  const missing = missingIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      id={`q-${q.id}`}
                      className={`${styles.questionCard} ${answered ? styles.answered : ''} ${missing && !canSubmit ? styles.missing : ''}`}
                    >
                      <p className={styles.questionText}>
                        <span className={styles.questionNum}>A{idx + 1}</span>
                        {q.text}
                      </p>
                      <div className={styles.optionList}>
                        {q.options?.map((opt) => (
                          <button
                            key={String(opt.value)}
                            type="button"
                            className={`${styles.optionButton} ${val === opt.value ? styles.selectedOption : ''}`}
                            onClick={() => setAnswer(q.id, opt.value)}
                          >
                            <span className={styles.optionValue}>{String(opt.value)}</span>
                            <span className={styles.optionLabel}>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* セクションB */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>B</span>
              <h2 className={styles.sectionTitle}>睡眠の状態</h2>
            </div>
            <p className={styles.sectionDesc}>昨夜から今朝の睡眠について回答してください</p>
            <div className={styles.questionList}>
              {digitalHealthScale.questions
                .filter((q) => SECTION_B_IDS.includes(q.id))
                .map((q, idx) => {
                  const val = answers[q.id];
                  const answered = q.id in answers;
                  const missing = missingIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      id={`q-${q.id}`}
                      className={`${styles.questionCard} ${answered ? styles.answered : ''} ${missing && !canSubmit ? styles.missing : ''}`}
                    >
                      <p className={styles.questionText}>
                        <span className={styles.questionNum}>B{idx + 1}</span>
                        {q.text}
                      </p>
                      {q.type === 'scale_5' ? (
                        <div className={styles.scale5Grid}>
                          {q.options?.map((opt) => (
                            <button
                              key={String(opt.value)}
                              type="button"
                              className={`${styles.scale5Button} ${val === opt.value ? styles.selectedOption : ''}`}
                              onClick={() => setAnswer(q.id, opt.value)}
                            >
                              <span className={styles.scale5Num}>{String(opt.value)}</span>
                              <span className={styles.scale5LabelText}>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.optionList}>
                          {q.options?.map((opt) => (
                            <button
                              key={String(opt.value)}
                              type="button"
                              className={`${styles.optionButton} ${val === opt.value ? styles.selectedOption : ''}`}
                              onClick={() => setAnswer(q.id, opt.value)}
                            >
                              <span className={styles.optionValue}>{opt.label ? String(opt.value) : ''}</span>
                              <span className={styles.optionLabel}>{opt.label || String(opt.value)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        </>
      )}

      {/* PHQ-9 */}
      {questionSet === 'phq9' && (
        <>
          <div className={styles.moodGuide}>
            <p>この2週間、次のような問題が何日くらいありましたか？</p>
            <div className={styles.moodGuideRow}>
              {MOOD_ANSWER_OPTIONS.map((o) => (
                <span key={o.value} className={styles.moodGuideItem}>
                  <strong>{o.value}</strong>：{o.label}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.p9Warning}>
            <p className={styles.p9WarningTitle}>回答前にお読みください</p>
            <p>
              P9（最後の質問）は「死」や「自傷」に関する内容を含みます。
              ご自身の状態を正直に教えてください。回答内容は担当医師のみが確認します。
            </p>
          </div>

          <section className={styles.section}>
            <div className={styles.questionList}>
              {PHQ9_QUESTIONS.map((q, idx) => {
                const val = answers[q.id];
                const answered = q.id in answers;
                const missing = missingIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    id={`q-${q.id}`}
                    className={`${styles.questionCard} ${answered ? styles.answered : ''} ${missing && !canSubmit ? styles.missing : ''}`}
                  >
                    <p className={styles.questionText}>
                      <span className={styles.questionNum}>P{idx + 1}</span>
                      {q.text}
                    </p>
                    <div className={styles.optionList}>
                      {MOOD_ANSWER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`${styles.optionButton} ${val === opt.value ? styles.selectedOption : ''}`}
                          onClick={() => setAnswer(q.id, opt.value)}
                        >
                          <span className={styles.optionValue}>{opt.value}</span>
                          <span className={styles.optionLabel}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* GAD-7 */}
      {questionSet === 'gad7' && (
        <>
          <div className={styles.moodGuide}>
            <p>この2週間、次のような問題が何日くらいありましたか？</p>
            <div className={styles.moodGuideRow}>
              {MOOD_ANSWER_OPTIONS.map((o) => (
                <span key={o.value} className={styles.moodGuideItem}>
                  <strong>{o.value}</strong>：{o.label}
                </span>
              ))}
            </div>
          </div>

          <section className={styles.section}>
            <div className={styles.questionList}>
              {GAD7_QUESTIONS.map((q, idx) => {
                const val = answers[q.id];
                const answered = q.id in answers;
                const missing = missingIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    id={`q-${q.id}`}
                    className={`${styles.questionCard} ${answered ? styles.answered : ''} ${missing && !canSubmit ? styles.missing : ''}`}
                  >
                    <p className={styles.questionText}>
                      <span className={styles.questionNum}>G{idx + 1}</span>
                      {q.text}
                    </p>
                    <div className={styles.optionList}>
                      {MOOD_ANSWER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`${styles.optionButton} ${val === opt.value ? styles.selectedOption : ''}`}
                          onClick={() => setAnswer(q.id, opt.value)}
                        >
                          <span className={styles.optionValue}>{opt.value}</span>
                          <span className={styles.optionLabel}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* 送信エリア */}
      <div className={styles.submitArea}>
        {!canSubmit && answeredCount > 0 && (
          <div className={styles.missingWarning}>
            <p>未回答の項目が {missingIds.length} つあります。すべての項目に回答してください。</p>
            <button
              className={styles.jumpButton}
              onClick={() => {
                const id = missingIds[0];
                document.getElementById(`q-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              未回答箇所へ移動
            </button>
          </div>
        )}
        <button
          className={`${styles.submitButton} ${!canSubmit ? styles.submitDisabled : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          回答を確定してレポートを作成する →
        </button>
      </div>
    </div>
  );
}
