import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { LanguageDto } from '@/function/api/getLanguages';
import { CreateVocabularyItemPayload, UserVocabularyItemDto } from '@/function/api/vocabulary';
import {
  ImageUploadCropper,
  ImageUploadCropperResult,
} from '@/shared/components/ImageUploadCropper';

import * as styles from './Vocabulary.module.scss';

type VocabularyItemFormMode = 'create' | 'edit';
const MAX_IMAGE_FILE_SIZE_MB = 2;

export type VocabularyItemFormSubmitPayload = CreateVocabularyItemPayload & {
  imageFile?: File;
  removeImage?: boolean;
};

type VocabularyItemFormModalProps = {
  mode: VocabularyItemFormMode;
  item?: UserVocabularyItemDto;
  languages: LanguageDto[];
  initialSourceLanguageId?: number;
  initialTargetLanguageId?: number;
  onCancel: () => void;
  onSave: (payload: VocabularyItemFormSubmitPayload) => Promise<void>;
};

const VocabularyItemFormModal = ({
  mode,
  item,
  languages,
  initialSourceLanguageId,
  initialTargetLanguageId,
  onCancel,
  onSave,
}: VocabularyItemFormModalProps) => {
  const portalRoot = useMemo(() => document.getElementById('modal-root') ?? document.body, []);
  const getWordForLanguage = (languageId: number) =>
    item?.concept.words.find((word) => word.languageId === languageId)?.text ?? '';
  const defaultSourceLanguageId =
    initialSourceLanguageId ?? item?.sourceLanguageId ?? languages[0]?.id;
  const defaultTargetLanguageId =
    initialTargetLanguageId ??
    item?.targetLanguageId ??
    languages.find((language) => language.id !== defaultSourceLanguageId)?.id;

  const [sourceLanguageId, setSourceLanguageId] = useState(String(defaultSourceLanguageId ?? ''));
  const [targetLanguageId, setTargetLanguageId] = useState(String(defaultTargetLanguageId ?? ''));
  const [sourceText, setSourceText] = useState(
    item ? getWordForLanguage(item.sourceLanguageId) : ''
  );
  const [targetText, setTargetText] = useState(
    item ? getWordForLanguage(item.targetLanguageId) : ''
  );
  const [imageResult, setImageResult] = useState<ImageUploadCropperResult | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [formError, setFormError] = useState('');
  const primaryImage =
    item?.concept.images.find((image) => image.isPrimary && image.imageUrl) ??
    item?.concept.images.find((image) => image.imageUrl);
  const canEditImage = mode === 'create' || item?.concept.status === 'private';

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

    if (!nextSourceLanguageId || !nextTargetLanguageId) {
      setFormError('Choose From and To languages');
      return;
    }

    if (nextSourceLanguageId === nextTargetLanguageId) {
      setFormError('From and To languages must be different');
      return;
    }

    if (!nextSourceText || !nextTargetText) {
      setFormError('Both fields are required');
      return;
    }

    if (imageResult && imageResult.file.size > MAX_IMAGE_FILE_SIZE_MB * 1024 * 1024) {
      setFormError(`Final image must be ${MAX_IMAGE_FILE_SIZE_MB} MB or smaller`);
      return;
    }

    setFormError('');
    await onSave({
      sourceLanguageId: nextSourceLanguageId,
      targetLanguageId: nextTargetLanguageId,
      sourceText: nextSourceText,
      targetText: nextTargetText,
      imageFile: imageResult?.file,
      removeImage: !imageResult && shouldRemoveImage,
    });
  }

  const content = (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <section
        className={`${styles.confirmModal} ${styles.formModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vocabularyItemFormTitle"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="vocabularyItemFormTitle">{mode === 'create' ? 'Add word' : 'Edit word'}</h2>
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
            <label className={styles.textField}>
              <span>From</span>
              <textarea
                value={sourceText}
                placeholder="Input word or phrase..."
                maxLength={255}
                required
                rows={3}
                onChange={(event) => setSourceText(event.target.value)}
              />
            </label>
            <label className={styles.textField}>
              <span>To</span>
              <textarea
                value={targetText}
                placeholder="Input word or phrase..."
                maxLength={255}
                required
                rows={3}
                onChange={(event) => setTargetText(event.target.value)}
              />
            </label>
          </div>
          {canEditImage && (
            <section className={styles.imageFormSection} aria-label="Word image">
              <div className={styles.imageFormHeader}>
                <h3>Image</h3>
                {primaryImage && !imageResult && !shouldRemoveImage && (
                  <button
                    type="button"
                    className={styles.imageRemoveButton}
                    onClick={() => setShouldRemoveImage(true)}
                  >
                    Remove image
                  </button>
                )}
              </div>
              {primaryImage?.imageUrl && !imageResult && !shouldRemoveImage && (
                <img
                  className={styles.currentImagePreview}
                  src={primaryImage.imageUrl}
                  alt=""
                  loading="lazy"
                />
              )}
              {shouldRemoveImage && !imageResult && (
                <p className={styles.imageStateMessage}>Image will be removed after saving.</p>
              )}
              <ImageUploadCropper
                label="image"
                maxOriginalFileSizeMb={8}
                onChange={(result) => {
                  setImageResult(result);
                  if (result) setShouldRemoveImage(false);
                }}
              />
              {imageResult && (
                <img
                  className={styles.currentImagePreview}
                  src={imageResult.previewUrl}
                  alt=""
                  loading="lazy"
                />
              )}
            </section>
          )}
          {formError && <p className={styles.modalError}>{formError}</p>}
          <div className={styles.confirmActions}>
            <button type="button" className={styles.confirmCancel} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.confirmSave}>
              {mode === 'create' ? 'Add word' : 'Save'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );

  return createPortal(content, portalRoot);
};

export default VocabularyItemFormModal;
