import { useState } from 'react';
import type { ScoreResult } from '../scales/types';
import { PatientReport } from './PatientReport';
import { DoctorReport } from './DoctorReport';
import { printPatientReport, printDoctorReport } from '../utils/print';
import { exportPatientPDF, exportDoctorPDF } from '../utils/pdf';
import styles from './ResultScreen.module.css';

type Props = {
  result: ScoreResult;
  onReset: () => void;
};

type Tab = 'patient' | 'doctor';

export function ResultScreen({ result, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('patient');
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handlePDF(type: Tab) {
    setPdfLoading(true);
    try {
      if (type === 'patient') {
        await exportPatientPDF();
      } else {
        await exportDoctorPDF();
      }
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>問診レポート</h1>
        <p className={styles.hint}>以下のレポートを印刷またはPDFとして保存してください。</p>
      </div>

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
          onClick={() => activeTab === 'patient' ? printPatientReport() : printDoctorReport()}
        >
          🖨️ {activeTab === 'patient' ? '患者用を印刷' : '医師用を印刷'}
        </button>
        <button
          className={styles.pdfButton}
          onClick={() => handlePDF(activeTab)}
          disabled={pdfLoading}
        >
          {pdfLoading ? '作成中...' : `📄 ${activeTab === 'patient' ? '患者用PDF' : '医師用PDF'}を作成`}
        </button>
        <button className={styles.resetButton} onClick={onReset}>
          ← 最初に戻る
        </button>
      </div>

      <div className={styles.reportWrapper}>
        <div style={{ display: activeTab === 'patient' ? 'block' : 'none' }}>
          <PatientReport result={result} />
        </div>
        <div style={{ display: activeTab === 'doctor' ? 'block' : 'none' }}>
          <DoctorReport result={result} />
        </div>
      </div>

      <div className={styles.bottomActions}>
        <button
          className={styles.printButton}
          onClick={() => activeTab === 'patient' ? printPatientReport() : printDoctorReport()}
        >
          🖨️ {activeTab === 'patient' ? '患者用を印刷' : '医師用を印刷'}
        </button>
        <button
          className={styles.pdfButton}
          onClick={() => handlePDF(activeTab)}
          disabled={pdfLoading}
        >
          {pdfLoading ? '作成中...' : `📄 ${activeTab === 'patient' ? '患者用PDF' : '医師用PDF'}を作成`}
        </button>
        <button className={styles.resetButton} onClick={onReset}>
          ← 最初に戻る
        </button>
      </div>
    </div>
  );
}
