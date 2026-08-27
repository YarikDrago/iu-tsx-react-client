import React, { FormEvent, useCallback, useEffect, useState } from 'react';

import appData from '@/app.data';
import { getLanguages, LanguageDto } from '@/function/api/getLanguages';
import {
  createVocabularyItem,
  getVocabularyItems,
  UserVocabularyItemDto,
  UserVocabularyItemStatus,
} from '@/function/api/vocabulary';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import LearningCard from './LearningCard';
import * as styles from './Vocabulary.module.scss';

const DEFAULT_STATUS: UserVocabularyItemStatus = 'active';
const DEFAULT_SOURCE_LANGUAGE_CODE = 'ru';
const DEFAULT_TARGET_LANGUAGE_CODE = 'en';

const Vocabulary = () => {
  const { ready } = useRequireAccessToken();
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [items, setItems] = useState<UserVocabularyItemDto[]>([]);
  const [sourceLanguageId, setSourceLanguageId] = useState<string>('');
  const [targetLanguageId, setTargetLanguageId] = useState<string>('');
  const [status, setStatus] = useState<UserVocabularyItemStatus>(DEFAULT_STATUS);
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const isAdmin = appData.role.includes('admin');

  const selectedSourceLanguageId = sourceLanguageId ? Number(sourceLanguageId) : undefined;
  const selectedTargetLanguageId = targetLanguageId ? Number(targetLanguageId) : undefined;

  const loadItems = useCallback(async () => {
    try {
      setError('');
      appData.showLoader();
      const data = await getVocabularyItems({
        sourceLanguageId: selectedSourceLanguageId,
        targetLanguageId: selectedTargetLanguageId,
        status,
      });
      setItems(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }, [selectedSourceLanguageId, selectedTargetLanguageId, status]);

  useEffect(() => {
    if (!ready) return;

    const load = async () => {
      try {
        setError('');
        appData.showLoader();
        const data = await getLanguages();
        setLanguages(data);

        const first = data[0];
        const second = data.find((language) => language.id !== first?.id);

        setSourceLanguageId(
          String(
            data.find((language) => language.code === DEFAULT_SOURCE_LANGUAGE_CODE)?.id ??
              first?.id ??
              ''
          )
        );
        setTargetLanguageId(
          String(
            data.find((language) => language.code === DEFAULT_TARGET_LANGUAGE_CODE)?.id ??
              second?.id ??
              ''
          )
        );
      } catch (e) {
        setError((e as Error).message);
      } finally {
        appData.hideLoader();
      }
    };

    void load();
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    void loadItems();
  }, [ready, loadItems]);

  async function handleSaveLearningCard(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedSourceLanguageId || !selectedTargetLanguageId) {
      setError('Choose From and To languages');
      return;
    }

    if (selectedSourceLanguageId === selectedTargetLanguageId) {
      setError('From and To languages must be different');
      return;
    }

    try {
      setError('');
      setMsg('');
      appData.showLoader();
      await createVocabularyItem({
        sourceLanguageId: selectedSourceLanguageId,
        targetLanguageId: selectedTargetLanguageId,
        sourceText,
        targetText,
      });
      setSourceText('');
      setTargetText('');
      setMsg('Vocabulary item added');
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <article className={styles.vocabulary}>
      <Breadcrumbs items={[routes.home, routes.vocabulary]} />
      {ready ? (
        <>
          <section className={styles.toolbar}>
            <div className={styles.field}>
              <label htmlFor="sourceLanguage">From language</label>
              <select
                id="sourceLanguage"
                value={sourceLanguageId}
                onChange={(event) => setSourceLanguageId(event.target.value)}
              >
                {languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name} ({language.code})
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="targetLanguage">To language</label>
              <select
                id="targetLanguage"
                value={targetLanguageId}
                onChange={(event) => setTargetLanguageId(event.target.value)}
              >
                {languages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name} ({language.code})
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="itemStatus">Status</label>
              <select
                id="itemStatus"
                value={status}
                onChange={(event) => setStatus(event.target.value as UserVocabularyItemStatus)}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </section>

          <form className={styles.form} onSubmit={handleSaveLearningCard}>
            <div className={styles.formGrid}>
              <label>
                <span>From</span>
                <input
                  value={sourceText}
                  onChange={(event) => setSourceText(event.target.value)}
                  placeholder="Input word or phrase..."
                  maxLength={255}
                  required
                />
              </label>
              <label>
                <span>To</span>
                <input
                  value={targetText}
                  onChange={(event) => setTargetText(event.target.value)}
                  placeholder="Input word or phrase..."
                  maxLength={255}
                  required
                />
              </label>
            </div>
            <button className="primary" type="submit">
              Add word
            </button>
          </form>

          {msg && <p className={styles.message}>{msg}</p>}
          {error && <p className={styles.error}>{error}</p>}

          <section className={styles.items}>
            {items.length === 0 ? (
              <p className={styles.empty}>No vocabulary items yet.</p>
            ) : (
              items.map((item) => (
                <LearningCard key={item.id} item={item} languages={languages} isAdmin={isAdmin} />
              ))
            )}
          </section>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </article>
  );
};

export default Vocabulary;
