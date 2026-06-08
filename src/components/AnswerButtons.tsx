import type { AnswerValue } from '../scales/types';
import styles from './AnswerButtons.module.css';

const SCALE_OPTIONS: { value: AnswerValue; label: string; shortLabel: string }[] = [
  { value: 0, label: 'ほとんどない', shortLabel: '0' },
  { value: 1, label: '少しある', shortLabel: '1' },
  { value: 2, label: 'しばしばある', shortLabel: '2' },
  { value: 3, label: 'とても強い／かなり困っている', shortLabel: '3' },
];

type ScaleProps = {
  selected: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

export function ScaleAnswerButtons({ selected, onChange }: ScaleProps) {
  return (
    <div className={styles.scaleGrid}>
      {SCALE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`${styles.scaleButton} ${selected === opt.value ? styles.selected : ''}`}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          <span className={styles.scaleValue}>{opt.shortLabel}</span>
          <span className={styles.scaleLabel}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

type YesNoProps = {
  selected: boolean | undefined;
  onChange: (value: boolean) => void;
};

export function YesNoAnswerButtons({ selected, onChange }: YesNoProps) {
  return (
    <div className={styles.yesNoGrid}>
      <button
        className={`${styles.yesButton} ${selected === true ? styles.selectedYes : ''}`}
        onClick={() => onChange(true)}
        type="button"
      >
        はい
      </button>
      <button
        className={`${styles.noButton} ${selected === false ? styles.selectedNo : ''}`}
        onClick={() => onChange(false)}
        type="button"
      >
        いいえ
      </button>
    </div>
  );
}
