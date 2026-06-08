import type { DigitalHealthScoreResult } from '../scales/digitalHealth/scoring';
import {
  getOptionLabel,
  formatSleepDuration,
  getPatientAMessages,
  getPatientBMessages,
  getPatientPhq9Messages,
  getPatientPhq9Message,
  getPatientGad7Messages,
  getPatientGad7Message,
} from '../scales/digitalHealth/report';
import type { DhAnswers } from '../scales/types';
import styles from './DigitalHealthPatientReport.module.css';

type Props = {
  createdAt: string;
  abScore?: DigitalHealthScoreResult;
  abAnswers?: DhAnswers;
  phq9Score?: { total: number; p9Alert: boolean };
  phq9Answers?: Record<string, number>;
  gad7Score?: { total: number };
  gad7Answers?: Record<string, number>;
};

export function DigitalHealthPatientReport({
  createdAt,
  abScore,
  abAnswers,
  phq9Score,
  phq9Answers,
  gad7Score,
  gad7Answers,
}: Props) {
  const aMessages = abScore ? getPatientAMessages(abScore.aFlags) : [];
  const bMessages = abScore ? getPatientBMessages(abScore.bFlags) : [];
  const phq9Messages = phq9Score && phq9Score.total >= 5 && phq9Answers
    ? getPatientPhq9Messages(phq9Answers) : [];
  const gad7Messages = gad7Score && gad7Score.total >= 5 && gad7Answers
    ? getPatientGad7Messages(gad7Answers) : [];

  return (
    <div className={styles.page} id="dh-patient-report">
      <div className={styles.titleArea}>
        <h1 className={styles.mainTitle}>デジタル健康問診レポート</h1>
        <p className={styles.subtitle}>診察内容をわかりやすく共有するための補助資料です</p>
        <p className={styles.date}>実施日時：{createdAt}</p>
      </div>

      <div className={styles.disclaimer}>
        このレポートは、問診票の回答をもとに状態を整理したものです。
        病名を確定するものではありません。診断や治療方針は、診察・検査・経過を含めて医師が総合的に判断します。
      </div>

      {/* P9アラート（最優先表示） */}
      {phq9Score?.p9Alert && (
        <div className={styles.p9Alert}>
          <p className={styles.p9AlertTitle}>重要なお知らせ</p>
          <div className={styles.p9AlertBody}>
            <p>一部の回答について、医師への確認が必要です。</p>
            <p>
              次回診察を待たず、できるだけ早めに医師またはスタッフに直接お声がけください。
            </p>
            <div className={styles.p9AlertContact}>
              <p>院内でお声がけが難しい場合：</p>
              <p>
                <strong>こころの健康相談統一ダイヤル：0570-064-556</strong>
                <br />
                （毎日 16時〜21時）
              </p>
            </div>
            <p className={styles.p9AlertEmergency}>緊急の場合：119番または近くのスタッフへ</p>
          </div>
        </div>
      )}

      {/* 端末使用まとめ */}
      {abScore && abAnswers && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>今日の端末使用まとめ</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>合計使用時間</span>
              <span className={styles.summaryValue}>{getOptionLabel('a1', abAnswers.a1)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>動画視聴</span>
              <span className={styles.summaryValue}>{getOptionLabel('a2', abAnswers.a2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>就寝前の使用</span>
              <span className={styles.summaryValue}>{getOptionLabel('a4', abAnswers.a4)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>デジタル疲労感</span>
              <span className={styles.summaryValue}>{getOptionLabel('a8', abAnswers.a8)}</span>
            </div>
          </div>
          {aMessages.length > 0 ? (
            <div className={styles.noticeBox}>
              <ul className={styles.commentList}>
                {aMessages.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
              <p className={styles.consultNote}>今日の診察でお伝えください。</p>
            </div>
          ) : (
            <div className={styles.goodBox}>
              昨日の端末使用は、特に気になる点は見られませんでした。
            </div>
          )}
        </section>
      )}

      {/* 睡眠まとめ */}
      {abScore && abAnswers && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>今日の睡眠まとめ</h2>
          <div className={styles.summaryGrid}>
            {abScore.bEstimatedSleep !== null && (
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>推定睡眠時間</span>
                <span className={styles.summaryValue}>{formatSleepDuration(abScore.bEstimatedSleep)}</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>入眠まで</span>
              <span className={styles.summaryValue}>{getOptionLabel('b2', abAnswers.b2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>熟眠感</span>
              <span className={styles.summaryValue}>{String(abAnswers.b5)} / 5</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>睡眠への満足度</span>
              <span className={styles.summaryValue}>{String(abAnswers.b7)} / 5</span>
            </div>
          </div>
          {bMessages.length > 0 ? (
            <div className={styles.noticeBox}>
              <ul className={styles.commentList}>
                {bMessages.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
              <p className={styles.consultNote}>今日の診察でお伝えください。</p>
            </div>
          ) : (
            <div className={styles.goodBox}>
              昨夜の睡眠は、特に気になる点は見られませんでした。
            </div>
          )}
        </section>
      )}

      {/* PHQ-9 患者メッセージ */}
      {phq9Score && !phq9Score.p9Alert && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>気分・うつ症状について</h2>
          {phq9Messages.length > 0 ? (
            <div className={styles.noticeBox}>
              <ul className={styles.commentList}>
                {phq9Messages.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
              <p className={styles.consultNote}>今日の診察でお伝えください。</p>
            </div>
          ) : (
            <div className={styles.goodBox}>
              {getPatientPhq9Message(phq9Score.total)}
            </div>
          )}
        </section>
      )}

      {/* GAD-7 患者メッセージ */}
      {gad7Score && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>不安症状について</h2>
          {gad7Messages.length > 0 ? (
            <div className={styles.noticeBox}>
              <ul className={styles.commentList}>
                {gad7Messages.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
              <p className={styles.consultNote}>今日の診察でお伝えください。</p>
            </div>
          ) : (
            <div className={styles.goodBox}>
              {getPatientGad7Message(gad7Score.total)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
