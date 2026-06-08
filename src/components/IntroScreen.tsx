import styles from './IntroScreen.module.css';

type Props = {
  onStart: () => void;
  onBack: () => void;
};

export function IntroScreen({ onStart, onBack }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>はじめにお読みください</h1>

        <div className={styles.section}>
          <p className={styles.intro}>
            この問診は、症状や生活上の困りごとを整理し、診察で相談しやすくするためのものです。
          </p>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📋</span>
            <span>
              <strong>診断ツールではありません</strong>
              <br />
              病名を確定するものではありません。診断や治療方針は、診察・検査・経過を含めて医師が総合的に判断します。
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🔒</span>
            <span>
              <strong>個人情報は入力しません</strong>
              <br />
              氏名・生年月日・住所などの個人情報は入力不要です。
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🗑️</span>
            <span>
              <strong>回答内容は保存されません</strong>
              <br />
              回答はこの画面上にのみ表示され、どこにも記録・送信されません。
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🖨️</span>
            <span>
              <strong>結果は印刷できます</strong>
              <br />
              結果画面から、患者用・医師用のレポートを印刷またはPDF保存できます。
            </span>
          </div>
        </div>

        <div className={styles.questionCount}>
          <p>全部で <strong>34問</strong>（うち5問は「はい・いいえ」でお答えください）</p>
        </div>

        <div className={styles.buttons}>
          <button className={styles.backButton} onClick={onBack}>
            ← 戻る
          </button>
          <button className={styles.startButton} onClick={onStart}>
            開始する →
          </button>
        </div>
      </div>
    </div>
  );
}
