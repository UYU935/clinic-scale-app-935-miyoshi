import type { ScoreResult } from '../scales/types';
import { entMoodAnxietyLifeImpactDefinition } from '../scales/entMoodAnxietyLifeImpact/definition';
import styles from './PatientReport.module.css';

type Props = {
  result: ScoreResult;
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  A: '症状そのものによる負担の程度を示します。',
  B: '症状への注意や再発不安がどの程度高まりやすいかを示します。',
  C: '体調不良の持続により、気分や意欲に影響が出ている可能性を示します。',
  D: '外出、移動、仕事、家事などを控える傾向を示します。',
  E: '睡眠不足、疲労、気圧、画面作業などの影響を示します。',
  F: '症状の仕組みや対処法について、説明や支援を必要としている程度を示します。',
};

function getLevelColor(level: string): string {
  switch (level) {
    case '軽め':
    case '目立ちにくい':
      return '#4caf50';
    case '中等度':
    case 'やや目立つ':
      return '#ff9800';
    case '目立つ':
    case '強い':
      return '#f44336';
    case '強く目立つ':
      return '#b71c1c';
    default:
      return '#777';
  }
}

export function PatientReport({ result }: Props) {
  const sections = entMoodAnxietyLifeImpactDefinition.sections.filter((s) => s.id !== 'S');

  return (
    <div className={styles.page} id="patient-report">
      <div className={styles.titleArea}>
        <h1 className={styles.mainTitle}>症状と生活支障の整理レポート</h1>
        <p className={styles.subtitle}>診察内容をわかりやすく共有するための補助資料です</p>
        <p className={styles.date}>実施日時：{result.createdAt}</p>
      </div>

      <div className={styles.disclaimer}>
        <p>
          このレポートは、問診票の回答をもとに、症状の背景や生活上の困りごとを整理したものです。
        </p>
        <p>
          病名を確定するものではありません。診断や治療方針は、診察・検査・経過を含めて医師が総合的に判断します。
        </p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>今回みられた傾向</h2>
        <div className={styles.scoreList}>
          {result.sectionScores.map((ss) => {
            const sec = sections.find((s) => s.id === ss.sectionId);
            if (!sec) return null;
            return (
              <div key={ss.sectionId} className={styles.scoreRow}>
                <div className={styles.scoreLeft}>
                  <span className={styles.scoreName}>{sec.title}</span>
                  <span className={styles.scoreDesc}>{SECTION_DESCRIPTIONS[ss.sectionId]}</span>
                </div>
                <div className={styles.scoreRight}>
                  <span
                    className={styles.levelBadge}
                    style={{ borderColor: getLevelColor(ss.level), color: getLevelColor(ss.level) }}
                  >
                    {ss.level}傾向
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>医師からの見立て</h2>
        {result.tags.length === 0 ? (
          <div className={styles.noTagBox}>
            <p>
              今回の回答では、特定の領域に大きな偏りは目立ちませんでした。
            </p>
            <p>
              診察・検査結果とあわせて、症状の原因や今後の対応を確認していきます。
            </p>
          </div>
        ) : (
          <div className={styles.tagList}>
            {result.tags.map((tag) => (
              <div key={tag.id} className={styles.tagItem}>
                <p className={styles.tagLabel}>● {tag.label}</p>
                <p className={styles.tagText}>{tag.patientText}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>今日から意識するとよいこと</h2>
        <ol className={styles.tipsList}>
          <li>症状をゼロにしようと焦りすぎない</li>
          <li>症状が出る場面や悪化しやすい条件を記録する</li>
          <li>睡眠不足、疲労、画面作業との関係を見る</li>
          <li>避けている行動を一気に戻さず、段階的に試す</li>
          <li>不安が強いときは、症状の仕組みを理解することも治療の一部になる</li>
        </ol>
      </section>

      <section className={styles.cautionSection}>
        <h2 className={styles.cautionTitle}>次のような症状がある場合は、早めに医師へ相談してください</h2>
        <ul className={styles.cautionList}>
          <li>急な聞こえの低下</li>
          <li>激しい頭痛</li>
          <li>ろれつが回らない</li>
          <li>手足のしびれや麻痺</li>
          <li>意識が遠のく</li>
          <li>生活が大きく崩れるほどの不眠や気分の落ち込み</li>
          <li>消えてしまいたい、死にたいと思うほどつらい</li>
        </ul>
      </section>
    </div>
  );
}
