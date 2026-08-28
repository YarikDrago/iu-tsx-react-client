import { LanguageDto } from '@/function/api/getLanguages';
import { UserVocabularyItemDto } from '@/function/api/vocabulary';

import * as styles from './Vocabulary.module.scss';

type PracticeCardProps = {
  item?: UserVocabularyItemDto;
  languages: LanguageDto[];
  isAnswerVisible: boolean;
  currentIndex: number;
  totalCount: number;
  againCount: number;
  knowCount: number;
  onReveal: () => void;
  onAgain: () => void;
  onKnow: () => void;
  onRestart: () => void;
  onShuffle: () => void;
};

const PracticeCard = ({
  item,
  languages,
  isAnswerVisible,
  currentIndex,
  totalCount,
  againCount,
  knowCount,
  onReveal,
  onAgain,
  onKnow,
  onRestart,
  onShuffle,
}: PracticeCardProps) => {
  const getLanguageLabel = (languageId: number) => {
    const language = languages.find((language) => language.id === languageId);
    return language ? `${language.name} (${language.code})` : String(languageId);
  };

  const getWordForLanguage = (languageId: number) =>
    item?.concept.words.find((word) => word.languageId === languageId)?.text ?? '';

  if (!item) {
    const isComplete = totalCount > 0;

    return (
      <section className={styles.practicePanel}>
        <div className={styles.practiceEmptyState}>
          <p>{isComplete ? 'Practice complete.' : 'No active cards for this direction yet.'}</p>
          {isComplete && (
            <div className={styles.practiceStats}>
              <span>Know: {knowCount}</span>
              <span>Again: {againCount}</span>
            </div>
          )}
          <div className={styles.practiceActions}>
            <button
              type="button"
              className={styles.practiceAction}
              disabled={!isComplete}
              onClick={onRestart}
            >
              Restart
            </button>
            <button
              type="button"
              className={styles.practiceAction}
              disabled={!isComplete}
              onClick={onShuffle}
            >
              Shuffle
            </button>
          </div>
        </div>
      </section>
    );
  }

  const fromText = getWordForLanguage(item.sourceLanguageId);
  const toText = getWordForLanguage(item.targetLanguageId);

  return (
    <section className={styles.practicePanel}>
      <div className={styles.practiceHeader}>
        <span>
          {currentIndex + 1} / {totalCount}
        </span>
        <span>Know: {knowCount}</span>
        <span>Again: {againCount}</span>
      </div>

      <button type="button" className={styles.practiceCard} onClick={onReveal}>
        <span className={styles.practiceLabel}>
          From ({getLanguageLabel(item.sourceLanguageId)})
        </span>
        <strong>{fromText}</strong>
        {isAnswerVisible ? (
          <span className={styles.practiceAnswer}>
            <span>To ({getLanguageLabel(item.targetLanguageId)})</span>
            <strong>{toText}</strong>
          </span>
        ) : (
          <span className={styles.practiceHint}>Reveal answer</span>
        )}
      </button>

      <div className={styles.practiceActions}>
        <button type="button" className={styles.practiceAction} onClick={onShuffle}>
          Shuffle
        </button>
        <button type="button" className={styles.practiceAction} onClick={onRestart}>
          Restart
        </button>
        <button
          type="button"
          className={`${styles.practiceAction} ${styles.practiceAgain}`}
          disabled={!isAnswerVisible}
          onClick={onAgain}
        >
          Again
        </button>
        <button
          type="button"
          className={`${styles.practiceAction} ${styles.practiceKnow}`}
          disabled={!isAnswerVisible}
          onClick={onKnow}
        >
          Know
        </button>
      </div>
    </section>
  );
};

export default PracticeCard;
