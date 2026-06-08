import { useState, useCallback } from 'react';
import type { DhAnswers } from '../scales/types';
import type { DigitalHealthScoreResult } from '../scales/digitalHealth/scoring';
import { calculateDigitalHealthScore } from '../scales/digitalHealth/scoring';
import { calculatePHQ9, calculateGAD7 } from '../scales/digitalHealth/phq9gad7';
import { saveScaleRecord, triggerP9Alert, isStorageEnabled } from '../storage/storageService';
import { DigitalHealthQuestionScreen } from './DigitalHealthQuestionScreen';
import { DigitalHealthResultScreen } from './DigitalHealthResultScreen';
import styles from './DigitalHealthApp.module.css';

export type DhSessionType =
  | 'digital_sleep'
  | 'digital_sleep_with_phq_gad'
  | 'phq9'
  | 'gad7'
  | 'phq9_gad7';

type DhPhase =
  | 'intro'
  | 'submenu'
  | 'ab_questions'
  | 'phq9_questions'
  | 'gad7_questions'
  | 'ab_result'
  | 'result';

type Props = { onBack: () => void };

function formatNow(): string {
  return new Date().toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function sessionLabel(type: DhSessionType): string {
  switch (type) {
    case 'digital_sleep': return '端末使用・睡眠問診（A+B）';
    case 'digital_sleep_with_phq_gad': return '端末使用・睡眠 + PHQ-9 + GAD-7';
    case 'phq9': return 'PHQ-9（気分・うつ症状）';
    case 'gad7': return 'GAD-7（不安症状）';
    case 'phq9_gad7': return 'PHQ-9 + GAD-7 セット';
  }
}

export function DigitalHealthApp({ onBack }: Props) {
  const [phase, setPhase] = useState<DhPhase>('intro');
  const [sessionType, setSessionType] = useState<DhSessionType>('digital_sleep');
  const [createdAt] = useState(formatNow);

  const [abAnswers, setAbAnswers] = useState<DhAnswers>({});
  const [phq9Answers, setPhq9Answers] = useState<Record<string, number>>({});
  const [gad7Answers, setGad7Answers] = useState<Record<string, number>>({});

  const [abScore, setAbScore] = useState<DigitalHealthScoreResult | null>(null);
  const [phq9Score, setPhq9Score] = useState<{ total: number; p9Alert: boolean } | null>(null);
  const [gad7Score, setGad7Score] = useState<{ total: number } | null>(null);

  const [recordId, setRecordId] = useState<string | null>(null);

  const handleSelectSession = useCallback((type: DhSessionType) => {
    setSessionType(type);
    if (type === 'gad7') {
      setPhase('gad7_questions');
    } else if (type === 'phq9' || type === 'phq9_gad7') {
      setPhase('phq9_questions');
    } else {
      setPhase('ab_questions');
    }
  }, []);

  const handleAbSubmit = useCallback(
    async (answers: DhAnswers) => {
      setAbAnswers(answers);
      const score = calculateDigitalHealthScore(answers as Parameters<typeof calculateDigitalHealthScore>[0]);
      setAbScore(score);

      if (isStorageEnabled) {
        const result = await saveScaleRecord({
          session_type: sessionType,
          recorded_date: new Date().toISOString().slice(0, 10),
          a1: Number(answers.a1), a2: Number(answers.a2), a3: Number(answers.a3),
          a4: Number(answers.a4), a5: Number(answers.a5), a6: Number(answers.a6),
          a7: Number(answers.a7), a8: Number(answers.a8),
          a_total: score.aTotal,
          a_flags: score.aFlags,
          b1_time: String(answers.b1), b2: Number(answers.b2),
          b3_time: String(answers.b3), b4: Number(answers.b4),
          b5: Number(answers.b5), b6: Number(answers.b6), b7: Number(answers.b7),
          b_estimated_sleep: score.bEstimatedSleep ?? undefined,
          b_discomfort: score.bDiscomfort,
          b_flags: score.bFlags,
        });
        if (result.id) setRecordId(result.id);
      }

      if (sessionType === 'digital_sleep') {
        setPhase('ab_result');
      } else {
        setPhase('phq9_questions');
      }
      window.scrollTo(0, 0);
    },
    [sessionType]
  );

  const handlePhq9Submit = useCallback(
    async (answers: DhAnswers) => {
      const numAnswers = answers as Record<string, number>;
      setPhq9Answers(numAnswers);
      const score = calculatePHQ9(numAnswers);
      setPhq9Score(score);

      if (score.p9Alert && isStorageEnabled && recordId) {
        await triggerP9Alert(recordId, numAnswers['p9'] ?? 0);
      }

      if (sessionType === 'phq9') {
        setPhase('result');
      } else {
        setPhase('gad7_questions');
      }
      window.scrollTo(0, 0);
    },
    [sessionType, recordId]
  );

  const handleGad7Submit = useCallback((answers: DhAnswers) => {
    const numAnswers = answers as Record<string, number>;
    setGad7Answers(numAnswers);
    setGad7Score(calculateGAD7(numAnswers));
    setPhase('result');
    window.scrollTo(0, 0);
  }, []);

  const handleReset = useCallback(() => {
    setPhase('intro');
    setSessionType('digital_sleep');
    setAbAnswers({});
    setPhq9Answers({});
    setGad7Answers({});
    setAbScore(null);
    setPhq9Score(null);
    setGad7Score(null);
    setRecordId(null);
  }, []);

  // --- イントロ画面 ---
  if (phase === 'intro') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>デジタル健康問診</h1>

          <p className={styles.intro}>
            スマートフォン・SNS・AIツール等のデジタル環境が、睡眠や気分にどのように影響しているかを整理するための問診です。
          </p>

          <div className={styles.infoBox}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📋</span>
              <span>
                <strong>診断ツールではありません</strong>
                <br />
                病名を確定するものではありません。診断や治療方針は医師が総合的に判断します。
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🔒</span>
              <span>
                <strong>個人情報は入力しません</strong>
                <br />
                氏名・生年月日などの個人情報は入力不要です。
              </span>
            </div>
            {isStorageEnabled ? (
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>💾</span>
                <span>
                  <strong>回答内容が保存されます</strong>
                  <br />
                  今回の回答は院内システムに記録されます。担当医師のみが閲覧できます。
                </span>
              </div>
            ) : (
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🗑️</span>
                <span>
                  <strong>回答内容は保存されません</strong>
                  <br />
                  回答はこの画面上にのみ表示され、どこにも記録・送信されません。
                </span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🖨️</span>
              <span>
                <strong>結果は印刷できます</strong>
                <br />
                結果画面から患者用・医師用レポートを印刷またはPDF保存できます。
              </span>
            </div>
          </div>

          <div className={styles.buttons}>
            <button className={styles.backButton} onClick={onBack}>
              ← 戻る
            </button>
            <button className={styles.startButton} onClick={() => setPhase('submenu')}>
              次へ →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- サブメニュー ---
  if (phase === 'submenu') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>実施する問診を選択してください</h1>
          <p className={styles.subtitle}>受付スタッフの案内に従って選んでください。</p>

          <div className={styles.menuList}>
            <button
              className={styles.menuButton}
              onClick={() => handleSelectSession('digital_sleep')}
            >
              <span className={styles.menuName}>端末使用・睡眠問診（A+B）</span>
              <span className={styles.menuDesc}>
                昨日の端末使用時間・睡眠状態を整理します（全15問）
              </span>
              <span className={styles.menuButtonArrow}>→</span>
            </button>

            <hr className={styles.menuDivider} />

            <button
              className={styles.menuButton}
              onClick={() => handleSelectSession('phq9')}
            >
              <span className={styles.menuName}>PHQ-9（気分・うつ症状）</span>
              <span className={styles.menuDesc}>気分や意欲に関する9問</span>
              <span className={styles.menuButtonArrow}>→</span>
            </button>

            <button
              className={styles.menuButton}
              onClick={() => handleSelectSession('gad7')}
            >
              <span className={styles.menuName}>GAD-7（不安症状）</span>
              <span className={styles.menuDesc}>不安や緊張に関する7問</span>
              <span className={styles.menuButtonArrow}>→</span>
            </button>

            <button
              className={styles.menuButton}
              onClick={() => handleSelectSession('phq9_gad7')}
            >
              <span className={styles.menuName}>PHQ-9 + GAD-7 セット</span>
              <span className={styles.menuDesc}>気分・不安の両方を実施（全16問）</span>
              <span className={styles.menuButtonArrow}>→</span>
            </button>

            <hr className={styles.menuDivider} />

            <button
              className={styles.menuButton}
              onClick={() => handleSelectSession('digital_sleep_with_phq_gad')}
            >
              <span className={styles.menuName}>端末使用・睡眠 ＋ PHQ-9 + GAD-7（全部）</span>
              <span className={styles.menuDesc}>すべてをまとめて実施します（全31問）</span>
              <span className={styles.menuButtonArrow}>→</span>
            </button>
          </div>

          <div className={styles.buttons}>
            <button className={styles.backButton} onClick={() => setPhase('intro')}>
              ← 戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- A+B 質問 ---
  if (phase === 'ab_questions') {
    return (
      <DigitalHealthQuestionScreen
        questionSet="ab"
        initialAnswers={Object.keys(abAnswers).length > 0 ? abAnswers : undefined}
        onSubmit={handleAbSubmit}
        onBack={() => setPhase('submenu')}
      />
    );
  }

  // --- PHQ-9 質問 ---
  if (phase === 'phq9_questions') {
    const backTarget: DhPhase = abScore ? 'ab_questions' : 'submenu';
    return (
      <DigitalHealthQuestionScreen
        questionSet="phq9"
        initialAnswers={Object.keys(phq9Answers).length > 0 ? phq9Answers : undefined}
        onSubmit={handlePhq9Submit}
        onBack={() => setPhase(backTarget)}
      />
    );
  }

  // --- GAD-7 質問 ---
  if (phase === 'gad7_questions') {
    const backTarget: DhPhase = phq9Score ? 'phq9_questions' : 'submenu';
    return (
      <DigitalHealthQuestionScreen
        questionSet="gad7"
        initialAnswers={Object.keys(gad7Answers).length > 0 ? gad7Answers : undefined}
        onSubmit={handleGad7Submit}
        onBack={() => setPhase(backTarget)}
      />
    );
  }

  // --- A+B 中間結果（digital_sleep のみ） ---
  if (phase === 'ab_result' && abScore) {
    return (
      <DigitalHealthResultScreen
        sessionType={sessionLabel(sessionType)}
        createdAt={createdAt}
        abScore={abScore}
        abAnswers={abAnswers}
        showContinueButton
        onContinue={() => setPhase('phq9_questions')}
        onReset={handleReset}
      />
    );
  }

  // --- 最終結果 ---
  if (phase === 'result') {
    return (
      <DigitalHealthResultScreen
        sessionType={sessionLabel(sessionType)}
        createdAt={createdAt}
        abScore={abScore ?? undefined}
        abAnswers={Object.keys(abAnswers).length > 0 ? abAnswers : undefined}
        phq9Score={phq9Score ?? undefined}
        phq9Answers={Object.keys(phq9Answers).length > 0 ? phq9Answers : undefined}
        gad7Score={gad7Score ?? undefined}
        gad7Answers={Object.keys(gad7Answers).length > 0 ? gad7Answers : undefined}
        onReset={handleReset}
      />
    );
  }

  return null;
}
