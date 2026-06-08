import { useState } from 'react';
import type { DigitalHealthScoreResult } from '../scales/digitalHealth/scoring';
import type { DhAnswers } from '../scales/types';
import { DigitalHealthPatientReport } from './DigitalHealthPatientReport';
import { DigitalHealthDoctorReport } from './DigitalHealthDoctorReport';
import { printDhPatientReport, printDhDoctorReport } from '../utils/print';
import { exportDhPatientPDF, exportDhDoctorPDF } from '../utils/pdf';
import styles from './DigitalHealthResultScreen.module.css';

type Tab = 'patient' | 'doctor';

type Props = {
  sessionType: string;
  createdAt: string;
  abScore?: DigitalHealthScoreResult;
  abAnswers?: DhAnswers;
  phq9Score?: { total: number; p9Alert: boolean };
  phq9Answers?: Record<string, number>;
  gad7Score?: { total: number };
  gad7Answers?: Record<string, number>;
  showContinueButton?: boolean;
  onContinue?: () => void;
  onReset: () => void;
};

export function DigitalHealthResultScreen({
  sessionType,
  createdAt,
  abScore,
  abAnswers,
  phq9Score,
  phq9Answers,
  gad7Score,
  gad7Answers,
  showContinueButton,
  onContinue,
  onReset,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('patient');
  const [pdfLoading, setPdfLoading] = useState(false);

  const p9Alert = phq9Score?.p9Alert ?? false;

  async function handlePDF(type: Tab) {
    setPdfLoading(true);
    try {
      if (type === 'patient') {
        await exportDhPatientPDF();
      } else {
        await exportDhDoctorPDF();
      }
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>デジタル健康問診レポート</h1>
        <p className={styles.hint}>以下のレポートを印刷またはPDFとして保存してください。</p>
      </div>

      {/* A+Bのみ完了時の続きボタン（P9アラートがある場合は非表示） */}
      {showContinueButton && onContinue && !p9Alert && (
        <button className={styles.continueButton} onClick={onContinue}>
          PHQ-9・GAD-7も続けて行う →
        </button>
      )}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'patient' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('patient')}
        >
          患者用レポート
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'doctor' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('doctor')}
        >
          医師用サマリー
        </button>
      </div>

      <div className={styles.actionBar}>
        <button
          className={styles.printButton}
          onClick={() =>
            activeTab === 'patient' ? printDhPatientReport() : printDhDoctorReport()
          }
        >
          {activeTab === 'patient' ? '患者用を印刷' : '医師用を印刷'}
        </button>
        <button
          className={styles.pdfButton}
          onClick={() => handlePDF(activeTab)}
          disabled={pdfLoading}
        >
          {pdfLoading
            ? '作成中...'
            : `${activeTab === 'patient' ? '患者用PDF' : '医師用PDF'}を作成`}
        </button>
        <button className={styles.resetButton} onClick={onReset}>
          ← 最初に戻る
        </button>
      </div>

      <div className={styles.reportWrapper}>
        <div style={{ display: activeTab === 'patient' ? 'block' : 'none' }}>
          <DigitalHealthPatientReport
            createdAt={createdAt}
            abScore={abScore}
            abAnswers={abAnswers}
            phq9Score={phq9Score}
            phq9Answers={phq9Answers}
            gad7Score={gad7Score}
            gad7Answers={gad7Answers}
          />
        </div>
        <div style={{ display: activeTab === 'doctor' ? 'block' : 'none' }}>
          <DigitalHealthDoctorReport
            sessionType={sessionType}
            createdAt={createdAt}
            abScore={abScore}
            abAnswers={abAnswers}
            phq9Score={phq9Score}
            phq9Answers={phq9Answers}
            gad7Score={gad7Score}
            gad7Answers={gad7Answers}
          />
        </div>
      </div>

      <div className={styles.bottomActions}>
        <button
          className={styles.printButton}
          onClick={() =>
            activeTab === 'patient' ? printDhPatientReport() : printDhDoctorReport()
          }
        >
          {activeTab === 'patient' ? '患者用を印刷' : '医師用を印刷'}
        </button>
        <button
          className={styles.pdfButton}
          onClick={() => handlePDF(activeTab)}
          disabled={pdfLoading}
        >
          {pdfLoading
            ? '作成中...'
            : `${activeTab === 'patient' ? '患者用PDF' : '医師用PDF'}を作成`}
        </button>
        <button className={styles.resetButton} onClick={onReset}>
          ← 最初に戻る
        </button>
      </div>
    </div>
  );
}
