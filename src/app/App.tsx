import { useState, useCallback } from 'react';
import type { Answers, AnswerValue, ScoreResult } from '../scales/types';
import { computeScore } from '../scales/entMoodAnxietyLifeImpact/scoring';
import { HomeScreen } from '../components/HomeScreen';
import { IntroScreen } from '../components/IntroScreen';
import { QuestionScreen } from '../components/QuestionScreen';
import { ResultScreen } from '../components/ResultScreen';
import { DigitalHealthApp } from '../components/DigitalHealthApp';

type ActiveScale = 'ent' | 'digital_health' | null;
type EntScreen = 'intro' | 'question' | 'result';

export function App() {
  const [activeScale, setActiveScale] = useState<ActiveScale>(null);
  const [entScreen, setEntScreen] = useState<EntScreen>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<ScoreResult | null>(null);

  const handleSelectScale = useCallback((scaleId: string) => {
    if (scaleId === 'digital_health') {
      setActiveScale('digital_health');
    } else {
      setActiveScale('ent');
      setEntScreen('intro');
    }
  }, []);

  const handleEntStart = useCallback(() => {
    setEntScreen('question');
  }, []);

  const handleAnswer = useCallback((questionId: string, value: AnswerValue | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleEntSubmit = useCallback(() => {
    const scoreResult = computeScore(answers);
    setResult(scoreResult);
    setEntScreen('result');
    window.scrollTo(0, 0);
  }, [answers]);

  const handleEntReset = useCallback(() => {
    setAnswers({});
    setResult(null);
    setActiveScale(null);
    window.scrollTo(0, 0);
  }, []);

  const handleDhBack = useCallback(() => {
    setActiveScale(null);
    window.scrollTo(0, 0);
  }, []);

  // ホーム画面
  if (activeScale === null) {
    return <HomeScreen onSelectScale={handleSelectScale} />;
  }

  // デジタル健康問診フロー（自己完結コンポーネント）
  if (activeScale === 'digital_health') {
    return <DigitalHealthApp onBack={handleDhBack} />;
  }

  // 耳鼻科スコアフロー（既存）
  if (entScreen === 'intro') {
    return (
      <IntroScreen
        onStart={handleEntStart}
        onBack={() => setActiveScale(null)}
      />
    );
  }

  if (entScreen === 'question') {
    return (
      <QuestionScreen
        answers={answers}
        onAnswer={handleAnswer}
        onSubmit={handleEntSubmit}
        onBack={() => setEntScreen('intro')}
      />
    );
  }

  if (entScreen === 'result' && result) {
    return <ResultScreen result={result} onReset={handleEntReset} />;
  }

  return null;
}
