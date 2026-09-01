import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { LanguageDto } from '@/function/api/getLanguages';
import {
  UpdateVocabularyItemContentPayload,
  UserVocabularyItemDto,
} from '@/function/api/vocabulary';

import * as styles from './Vocabulary.module.scss';

type EditVocabularyItemModalProps = {
  item: UserVocabularyItemDto;
  languages: LanguageDto[];
  onCancel: () => void;
  onSave: (payload: UpdateVocabularyItemContentPayload) => Promise<void>;
};

const EditVocabularyItemModal = ({
  item,
  languages,
  onCancel,
  onSave,
}: EditVocabularyItemModalProps) => {
  const portalRoot = useMemo(() => document.getElementById('modal-root') ?? document.body, []);
  const getWordForLanguage = (languageId: number) =>
    item.concept.words.find((word) => word.languageId === languageId)?.text ?? '';

  const [sourceLanguageId, setSourceLanguageId] = useState(String(item.sourceLanguageId));
  const [targetLanguageId, setTargetLanguageId] = useState(String(item.targetLanguageId));
  const [sourceText, setSourceText] = useState(getWordForLanguage(item.sourceLanguageId));
  const [targetText, setTargetText] = useState(getWordForLanguage(item.targetLanguageId));
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextSourceLanguageId = Number(sourceLanguageId);
    const nextTargetLanguageId = Number(targetLanguageId);
    const nextSourceText = sourceText.trim();
    const nextTargetText = targetText.trim();

    if (nextSourceLanguageId === nextTargetLanguageId) {
      setFormError('From and To languages must be different');
      return;
    }

    if (!nextSourceText || !nextTargetText) {
      setFormError('Both fields are required');
      return;
    }

    setFormError('');
    await onSave({
      sourceLanguageId: nextSourceLanguageId,
      targetLanguageId: nextTargetLanguageId,
      sourceText: nextSourceText,
      targetText: nextTargetText,
    });
  }

  const content = (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <section
        className={styles.confirmModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editVocabularyItemTitle"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="editVocabularyItemTitle">Edit word</h2>
        <form className={styles.editForm} onSubmit={handleSubmit}>
          <div className={styles.editGrid}>
            <label>
              <span>From language</span>
              <select
                value={sourceLanguageId}
                onChange={(event) => setSourceLanguageId(event.target.value)}
              >
                {languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name} ({language.code})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>To language</span>
              <select
                value={targetLanguageId}
                onChange={(event) => setTargetLanguageId(event.target.value)}
              >
                {languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name} ({language.code})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>From</span>
              <input
                value={sourceText}
                maxLength={255}
                required
                onChange={(event) => setSourceText(event.target.value)}
              />
            </label>
            <label>
              <span>To</span>
              <input
                value={targetText}
                maxLength={255}
                required
                onChange={(event) => setTargetText(event.target.value)}
              />
            </label>
          </div>
          {formError && <p className={styles.modalError}>{formError}</p>}
          <div className={styles.confirmActions}>
            <button type="button" className={styles.confirmCancel} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.confirmSave}>
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  );

  return createPortal(content, portalRoot);
};

export default EditVocabularyItemModal;
