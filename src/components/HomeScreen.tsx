import styles from './HomeScreen.module.css';

type Props = {
  onSelectScale: (scaleId: string) => void;
};

export function HomeScreen({ onSelectScale }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>問診ツールを選択してください</h1>
        <p className={styles.subtitle}>受付スタッフの案内に従って、該当する問診を選んでください。</p>
      </div>

      <div className={styles.scaleList}>
        <button
          className={styles.scaleButton}
          onClick={() => onSelectScale('ent_mood_anxiety_life_impact')}
        >
          <span className={styles.scaleName}>症状と生活支障の整理シート</span>
          <span className={styles.scaleDesc}>
            めまい・耳鳴り・のどの違和感などの症状と、日常生活への影響を整理します
          </span>
          <span className={styles.scaleArrow}>→</span>
        </button>

        <button
          className={styles.scaleButton}
          onClick={() => onSelectScale('digital_health')}
        >
          <span className={styles.scaleName}>デジタル健康問診</span>
          <span className={styles.scaleDesc}>
            端末使用・睡眠・気分・不安に関する状態を整理します（PHQ-9 / GAD-7 含む）
          </span>
          <span className={styles.scaleArrow}>→</span>
        </button>

        <div className={styles.scaleButtonDisabled}>
          <span className={styles.scaleName}>PPPD症状整理シート</span>
          <span className={styles.scaleDesc}>準備中</span>
        </div>

        <div className={styles.scaleButtonDisabled}>
          <span className={styles.scaleName}>耳鳴り生活支障シート</span>
          <span className={styles.scaleDesc}>準備中</span>
        </div>

        <div className={styles.scaleButtonDisabled}>
          <span className={styles.scaleName}>聴覚過敏チェック</span>
          <span className={styles.scaleDesc}>準備中</span>
        </div>
      </div>
    </div>
  );
}
