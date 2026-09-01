import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { LanguageDto } from '@/function/api/getLanguages';
import { UserVocabularyItemDto } from '@/function/api/vocabulary';

import * as styles from './Vocabulary.module.scss';

type DeleteVocabularyItemModalProps = {
  item: UserVocabularyItemDto;
  languages: LanguageDto[];
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteVocabularyItemModal = ({
  item,
  languages,
  onCancel,
  onConfirm,
}: DeleteVocabularyItemModalProps) => {
  const portalRoot = useMemo(() => document.getElementById('modal-root') ?? document.body, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const getWordForLanguage = (languageId: number) =>
    item.concept.words.find((word) => word.languageId === languageId)?.text ?? '';

  const getLanguageCode = (languageId: number) =>
    languages.find((language) => language.id === languageId)?.code ?? String(languageId);

  const source = getWordForLanguage(item.sourceLanguageId);
  const target = getWordForLanguage(item.targetLanguageId);

  const content = (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <section
        className={styles.confirmModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="deleteVocabularyItemTitle"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="deleteVocabularyItemTitle">Delete word?</h2>
        <div className={styles.confirmWords}>
          <span>{getLanguageCode(item.sourceLanguageId)}</span>
          <strong>{source}</strong>
          <span>{getLanguageCode(item.targetLanguageId)}</span>
          <strong>{target}</strong>
        </div>
        <p>This card will be removed from your library and practice.</p>
        <div className={styles.confirmActions}>
          <button type="button" className={styles.confirmCancel} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.confirmDelete} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </section>
    </div>
  );

  return createPortal(content, portalRoot);
};

export default DeleteVocabularyItemModal;
