import { LanguageDto } from '@/function/api/getLanguages';
import { UserVocabularyItemDto } from '@/function/api/vocabulary';

import * as styles from './Vocabulary.module.scss';

type LearningCardProps = {
  item: UserVocabularyItemDto;
  languages: LanguageDto[];
  isAdmin: boolean;
};

const LearningCard = ({ item, languages, isAdmin }: LearningCardProps) => {
  const getWordForLanguage = (languageId: number) =>
    item.concept.words.find((word) => word.languageId === languageId)?.text ?? '';

  const getLanguageLabel = (languageId: number) => {
    const language = languages.find((language) => language.id === languageId);
    return language ? `${language.name} (${language.code})` : String(languageId);
  };

  const source = getWordForLanguage(item.sourceLanguageId);
  const target = getWordForLanguage(item.targetLanguageId);

  return (
    <article className={styles.item}>
      <div className={styles.itemContent}>
        <div className={styles.words}>
          <p>{source}</p>
          <span>to</span>
          <p>{target}</p>
        </div>
        <div className={styles.meta}>
          <span>{getLanguageLabel(item.sourceLanguageId)}</span>
          <span>{getLanguageLabel(item.targetLanguageId)}</span>
          {isAdmin && <span className={styles.adminMeta}>concept: {item.concept.status}</span>}
        </div>
      </div>
    </article>
  );
};

export default LearningCard;
