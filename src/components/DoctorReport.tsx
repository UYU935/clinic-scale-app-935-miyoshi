import type { ScoreResult } from '../scales/types';
import { entMoodAnxietyLifeImpactDefinition } from '../scales/entMoodAnxietyLifeImpact/definition';
import styles from './DoctorReport.module.css';

type Props = {
  result: ScoreResult;
};

const SECTION_TITLES: Record<string, string> = {
  A: '症状負担',
  B: '不安・警戒',
  C: '気分・意欲',
  D: '回避・生活制限',
  E: '睡眠・疲労',
  F: '説明・支援ニーズ',
};

export function DoctorReport({ result }: Props) {
  const sections = entMoodAnxietyLifeImpactDefinition.sections.filter((s) => s.id !== 'S');
  const urgentAlerts = result.safetyAlerts.filter((a) => a.isPositive && a.severity === 'urgent');
  const hasS1 = result.safetyAlerts.find((a) => a.id === 'S1')?.isPositive ?? false;
  const hasS4 = result.safetyAlerts.find((a) => a.id === 'S4')?.isPositive ?? false;

  return (
    <div className={styles.page} id="doctor-report">
      <div className={styles.titleArea}>
        <h1 className={styles.mainTitle}>医師用サマリー</h1>
        <p className={styles.subtitle}>{entMoodAnxietyLifeImpactDefinition.internalName}</p>
        <p className={styles.date}>実施日時：{result.createdAt}</p>
      </div>

      {/* Urgent alerts at top */}
      {hasS1 && (
        <div className={styles.alertUrgent}>
          ⚠️ 要確認：自傷念慮に関する回答があります。診察時に必ず確認してください。
        </div>
      )}
      {hasS4 && (
        <div className={styles.alertUrgent}>
          ⚠️ 要確認：急性神経症状または急性難聴を疑う回答があります。診察時に必ず確認してください。
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>スコアサマリー</h2>
        <table className={styles.scoreTable}>
          <thead>
            <tr>
              <th>領域</th>
              <th>得点</th>
              <th>満点</th>
              <th>判定</th>
            </tr>
          </thead>
          <tbody>
            {result.sectionScores.map((ss) => {
              const sec = sections.find((s) => s.id === ss.sectionId);
              if (!sec) return null;
              return (
                <tr key={ss.sectionId}>
                  <td>
                    <strong>{ss.sectionId}</strong>　{SECTION_TITLES[ss.sectionId]}
                  </td>
                  <td className={styles.scoreVal}>{ss.rawScore}</td>
                  <td className={styles.scoreMax}>{ss.maxScore}</td>
                  <td>
                    <span className={`${styles.levelChip} ${styles['level_' + ss.sectionId + '_' + ss.level.replace(/\s/g, '_')]}`}>
                      {ss.level}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>自動判定タグ</h2>
        {result.tags.length === 0 ? (
          <p className={styles.noTag}>今回の回答では、判定タグに該当する組み合わせはありませんでした。</p>
        ) : (
          <ul className={styles.tagList}>
            {result.tags.map((tag) => (
              <li key={tag.id} className={styles.tagItem}>
                <span className={styles.tagBullet}>●</span> {tag.label}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>医師確認アラート（S項目）</h2>
        <table className={styles.alertTable}>
          <tbody>
            {result.safetyAlerts.map((alert) => (
              <tr
                key={alert.id}
                className={alert.isPositive && alert.severity === 'urgent' ? styles.rowUrgent : alert.isPositive ? styles.rowWarning : ''}
              >
                <td className={styles.alertId}>{alert.id}</td>
                <td className={styles.alertLabel}>{alert.label}</td>
                <td className={`${styles.alertResult} ${alert.isPositive ? styles.positive : styles.negative}`}>
                  {alert.isPositive ? 'あり ⚠️' : 'なし'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {urgentAlerts.length > 0 && (
          <div className={styles.urgentNote}>
            上記の「あり」の項目は、診察時に必ず確認してください。
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>患者向け自動コメント（参考）</h2>
        {result.tags.length === 0 ? (
          <p className={styles.noTag}>—</p>
        ) : (
          <div className={styles.tagComments}>
            {result.tags.map((tag) => (
              <div key={tag.id} className={styles.tagComment}>
                <p className={styles.tagCommentLabel}>{tag.label}</p>
                <p className={styles.tagCommentText}>{tag.patientText}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className={styles.footer}>
        このサマリーは院内問診補助ツールの出力です。診断を確定するものではありません。
      </div>
    </div>
  );
}
