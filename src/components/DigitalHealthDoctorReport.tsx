import type { DigitalHealthScoreResult } from '../scales/digitalHealth/scoring';
import {
  formatSleepDuration,
  getPhq9Severity,
  getGad7Severity,
  FLAG_LABELS,
} from '../scales/digitalHealth/report';
import type { DhAnswers } from '../scales/types';
import styles from './DigitalHealthDoctorReport.module.css';

type Props = {
  sessionType: string;
  createdAt: string;
  abScore?: DigitalHealthScoreResult;
  abAnswers?: DhAnswers;
  phq9Score?: { total: number; p9Alert: boolean };
  phq9Answers?: Record<string, number>;
  gad7Score?: { total: number };
  gad7Answers?: Record<string, number>;
};

function severityClass(severity: string): string {
  switch (severity) {
    case '最小限': return styles.sev0;
    case '軽度': return styles.sev1;
    case '中等度': return styles.sev2;
    case '中等度〜重度': return styles.sev3;
    case '重度': return styles.sev4;
    default: return '';
  }
}

export function DigitalHealthDoctorReport({
  sessionType,
  createdAt,
  abScore,
  abAnswers,
  phq9Score,
  phq9Answers,
  gad7Score,
  gad7Answers,
}: Props) {
  const phq9Severity = phq9Score ? getPhq9Severity(phq9Score.total) : null;
  const gad7Severity = gad7Score ? getGad7Severity(gad7Score.total) : null;

  return (
    <div className={styles.page} id="dh-doctor-report">
      <div className={styles.titleArea}>
        <h1 className={styles.mainTitle}>医師用サマリー（デジタル健康問診）</h1>
        <p className={styles.subtitle}>セッション種別：{sessionType}</p>
        <p className={styles.date}>実施日時：{createdAt}</p>
      </div>

      {/* P9 緊急バナー */}
      {phq9Score?.p9Alert && (
        <div className={styles.p9UrgentBanner}>
          ⚠️ 要確認：PHQ-9 P9（希死念慮・自傷）に陽性回答あり。診察時に必ず確認してください。
        </div>
      )}

      {/* セクションA */}
      {abScore && abAnswers && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>■ 端末使用（A） — 合計スコア：{abScore.aTotal} / 30</h2>
          <table className={styles.scoreTable}>
            <thead>
              <tr>
                <th>項目</th>
                <th>値</th>
                <th>項目</th>
                <th>値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A1 総使用時間</td>
                <td>{String(abAnswers.a1)}点</td>
                <td>A2 動画視聴</td>
                <td>{String(abAnswers.a2)}点</td>
              </tr>
              <tr>
                <td>A3 SNS使用</td>
                <td>{String(abAnswers.a3)}点</td>
                <td>A4 就寝前使用</td>
                <td>{String(abAnswers.a4)}点</td>
              </tr>
              <tr>
                <td>A5 オフ時間確保</td>
                <td>{String(abAnswers.a5)}点</td>
                <td>A6 使用コントロール</td>
                <td>{String(abAnswers.a6)}点</td>
              </tr>
              <tr>
                <td>A7 AI使用</td>
                <td>{String(abAnswers.a7)}点</td>
                <td>A8 デジタル疲労感</td>
                <td>{String(abAnswers.a8)}点</td>
              </tr>
            </tbody>
          </table>
          {abScore.aFlags.length > 0 ? (
            <div className={styles.flagList}>
              {abScore.aFlags.map((f) => (
                <span key={f} className={styles.flagChip}>{FLAG_LABELS[f] ?? f}</span>
              ))}
            </div>
          ) : (
            <p className={styles.noFlag}>フラグなし</p>
          )}
        </section>
      )}

      {/* セクションB */}
      {abScore && abAnswers && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            ■ 睡眠（B） — 不満足スコア：{abScore.bDiscomfort} / 20
          </h2>
          <table className={styles.scoreTable}>
            <thead>
              <tr>
                <th>項目</th>
                <th>値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>就床時刻</td>
                <td>{abScore.b1Time}</td>
              </tr>
              <tr>
                <td>起床時刻</td>
                <td>{abScore.b3Time}</td>
              </tr>
              <tr>
                <td>推定睡眠時間</td>
                <td>
                  {abScore.bEstimatedSleep !== null
                    ? `${abScore.bEstimatedSleep}分（${formatSleepDuration(abScore.bEstimatedSleep)}）`
                    : '算出不可'}
                </td>
              </tr>
              <tr>
                <td>B2 入眠潜時</td>
                <td>{String(abAnswers.b2)}点</td>
              </tr>
              <tr>
                <td>B4 中途覚醒</td>
                <td>{String(abAnswers.b4)}点</td>
              </tr>
              <tr>
                <td>B5 熟眠感</td>
                <td>{String(abAnswers.b5)} / 5</td>
              </tr>
              <tr>
                <td>B6 日中過眠</td>
                <td>{String(abAnswers.b6)}点</td>
              </tr>
              <tr>
                <td>B7 睡眠満足度</td>
                <td>{String(abAnswers.b7)} / 5</td>
              </tr>
            </tbody>
          </table>
          {abScore.bFlags.length > 0 ? (
            <div className={styles.flagList}>
              {abScore.bFlags.map((f) => (
                <span key={f} className={styles.flagChip}>{FLAG_LABELS[f] ?? f}</span>
              ))}
            </div>
          ) : (
            <p className={styles.noFlag}>フラグなし</p>
          )}
        </section>
      )}

      {/* PHQ-9 */}
      {phq9Score && phq9Answers && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            ■ PHQ-9 — 合計：{phq9Score.total} / 27
            <span className={`${styles.severityChip} ${severityClass(phq9Severity!)}`}>
              {phq9Severity}
            </span>
          </h2>
          <table className={styles.scoreTable}>
            <thead>
              <tr>
                <th>項目</th>
                <th>値</th>
                <th>項目</th>
                <th>値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>P1</td><td>{phq9Answers.p1 ?? '-'}</td>
                <td>P2</td><td>{phq9Answers.p2 ?? '-'}</td>
              </tr>
              <tr>
                <td>P3</td><td>{phq9Answers.p3 ?? '-'}</td>
                <td>P4</td><td>{phq9Answers.p4 ?? '-'}</td>
              </tr>
              <tr>
                <td>P5</td><td>{phq9Answers.p5 ?? '-'}</td>
                <td>P6</td><td>{phq9Answers.p6 ?? '-'}</td>
              </tr>
              <tr>
                <td>P7</td><td>{phq9Answers.p7 ?? '-'}</td>
                <td>P8</td><td>{phq9Answers.p8 ?? '-'}</td>
              </tr>
              <tr className={phq9Score.p9Alert ? styles.p9AlertRow : undefined}>
                <td>P9（希死念慮）</td>
                <td className={phq9Score.p9Alert ? styles.p9AlertCell : undefined}>
                  {phq9Answers.p9 ?? '-'}
                  {phq9Score.p9Alert && ' ⚠️'}
                </td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* GAD-7 */}
      {gad7Score && gad7Answers && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            ■ GAD-7 — 合計：{gad7Score.total} / 21
            <span className={`${styles.severityChip} ${severityClass(gad7Severity!)}`}>
              {gad7Severity}
            </span>
          </h2>
          <table className={styles.scoreTable}>
            <thead>
              <tr>
                <th>項目</th>
                <th>値</th>
                <th>項目</th>
                <th>値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>G1</td><td>{gad7Answers.g1 ?? '-'}</td>
                <td>G2</td><td>{gad7Answers.g2 ?? '-'}</td>
              </tr>
              <tr>
                <td>G3</td><td>{gad7Answers.g3 ?? '-'}</td>
                <td>G4</td><td>{gad7Answers.g4 ?? '-'}</td>
              </tr>
              <tr>
                <td>G5</td><td>{gad7Answers.g5 ?? '-'}</td>
                <td>G6</td><td>{gad7Answers.g6 ?? '-'}</td>
              </tr>
              <tr>
                <td>G7</td><td>{gad7Answers.g7 ?? '-'}</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </section>
      )}

      <div className={styles.footer}>
        このサマリーは院内問診補助ツールの出力です。診断を確定するものではありません。
      </div>
    </div>
  );
}
