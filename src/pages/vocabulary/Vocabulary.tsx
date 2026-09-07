import React, { useCallback, useEffect, useMemo, useState } from 'react';

import appData from '@/app.data';
import { getLanguages, LanguageDto } from '@/function/api/getLanguages';
import {
  createVocabularyItem,
  CreateVocabularyItemPayload,
  deleteVocabularyItem,
  getVocabularyItems,
  updateVocabularyItem,
  updateVocabularyItemContent,
  UserVocabularyItemDto,
  VisibleUserVocabularyItemStatus,
} from '@/function/api/vocabulary';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { USER_ROLES } from '@/shared/constants/userRoles';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import DeleteVocabularyItemModal from './DeleteVocabularyItemModal';
import LearningCard from './LearningCard';
import PracticeCard from './PracticeCard';
import * as styles from './Vocabulary.module.scss';
import VocabularyItemFormModal from './VocabularyItemFormModal';

const DEFAULT_STATUS: VisibleUserVocabularyItemStatus = 'active';
const DEFAULT_SOURCE_LANGUAGE_CODE = 'ru';
const DEFAULT_TARGET_LANGUAGE_CODE = 'en';
type VocabularyMode = 'library' | 'practice';
type VocabularyStatusFilter = VisibleUserVocabularyItemStatus | 'all';

const shuffleVocabularyItems = (items: UserVocabularyItemDto[]) => {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
};

const Vocabulary = () => {
  const { ready } = useRequireAccessToken();
  const [mode, setMode] = useState<VocabularyMode>('library');
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [items, setItems] = useState<UserVocabularyItemDto[]>([]);
  const [sourceLanguageId, setSourceLanguageId] = useState<string>('');
  const [targetLanguageId, setTargetLanguageId] = useState<string>('');
  const [status, setStatus] = useState<VocabularyStatusFilter>(DEFAULT_STATUS);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [practiceQueue, setPracticeQueue] = useState<UserVocabularyItemDto[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [isPracticeAnswerVisible, setIsPracticeAnswerVisible] = useState(false);
  const [practiceStats, setPracticeStats] = useState({ again: 0, know: 0 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [itemPendingDelete, setItemPendingDelete] = useState<UserVocabularyItemDto | null>(null);
  const [itemPendingEdit, setItemPendingEdit] = useState<UserVocabularyItemDto | null>(null);
  const isAdmin = appData.role.includes(USER_ROLES.Admin);

  const selectedSourceLanguageId = sourceLanguageId ? Number(sourceLanguageId) : undefined;
  const selectedTargetLanguageId = targetLanguageId ? Number(targetLanguageId) : undefined;
  const selectedStatus = mode === 'practice' ? DEFAULT_STATUS : status;
  const practiceItems = useMemo(() => items.filter((item) => item.status === 'active'), [items]);
  const currentPracticeItem = practiceQueue[practiceIndex];

  const loadItems = useCallback(async () => {
    try {
      setError('');
      appData.showLoader();
      const data = await getVocabularyItems({
        sourceLanguageId: selectedSourceLanguageId,
        targetLanguageId: selectedTargetLanguageId,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
      });
      setItems(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }, [selectedSourceLanguageId, selectedTargetLanguageId, selectedStatus]);

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

  const restartPractice = useCallback(
    (shouldShuffle = false) => {
      setPracticeQueue(shouldShuffle ? shuffleVocabularyItems(practiceItems) : practiceItems);
      setPracticeIndex(0);
      setIsPracticeAnswerVisible(false);
      setPracticeStats({ again: 0, know: 0 });
    },
    [practiceItems]
  );

  useEffect(() => {
    if (mode !== 'practice') return;

    restartPractice(false);
  }, [mode, restartPractice]);

  async function handleVocabularyItemCreate(payload: CreateVocabularyItemPayload) {
    try {
      setError('');
      setMsg('');
      appData.showLoader();
      await createVocabularyItem(payload);
      setIsCreateModalOpen(false);
      setMsg('Vocabulary item added');
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  async function handleVocabularyItemStatusChange(
    itemId: number,
    nextStatus: VisibleUserVocabularyItemStatus
  ) {
    try {
      setError('');
      setMsg('');
      appData.showLoader();
      await updateVocabularyItem(itemId, { status: nextStatus });
      setMsg(nextStatus === 'archived' ? 'Vocabulary item archived' : 'Vocabulary item restored');
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  async function handleVocabularyItemDelete() {
    if (!itemPendingDelete) return;

    try {
      setError('');
      setMsg('');
      appData.showLoader();
      await deleteVocabularyItem(itemPendingDelete.id);
      setItemPendingDelete(null);
      setMsg('Vocabulary item deleted');
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  async function handleVocabularyItemContentSave(payload: CreateVocabularyItemPayload) {
    if (!itemPendingEdit) return;

    try {
      setError('');
      setMsg('');
      appData.showLoader();
      await updateVocabularyItemContent(itemPendingEdit.id, payload);
      setItemPendingEdit(null);
      setMsg('Vocabulary item updated');
      await loadItems();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  function handlePracticeAnswer(answer: 'again' | 'know') {
    if (!currentPracticeItem) return;

    setPracticeStats((currentStats) => ({
      ...currentStats,
      [answer]: currentStats[answer] + 1,
    }));
    setIsPracticeAnswerVisible(false);

    if (answer === 'again') {
      if (practiceIndex >= practiceQueue.length - 1) return;

      setPracticeQueue((currentQueue) => {
        const nextQueue = [...currentQueue];
        const [currentItem] = nextQueue.splice(practiceIndex, 1);
        if (currentItem) {
          nextQueue.push(currentItem);
        }
        return nextQueue;
      });
      return;
    }

    setPracticeIndex((currentIndex) => currentIndex + 1);
  }

  function handleModeChange(nextMode: VocabularyMode) {
    setMode(nextMode);
    setIsCreateModalOpen(false);
    setItemPendingDelete(null);
    setItemPendingEdit(null);
    setError('');
    setMsg('');
  }

  return (
    <article className={styles.vocabulary}>
      <Breadcrumbs items={[routes.home, routes.vocabulary]} />
      {ready ? (
        <>
          <div className={styles.modeSwitch} role="tablist" aria-label="Vocabulary mode">
            <button
              type="button"
              role="tab"
              className={`${styles.modeButton} ${
                mode === 'library' ? styles.modeButtonActive : ''
              }`}
              aria-selected={mode === 'library'}
              onClick={() => handleModeChange('library')}
            >
              Library
            </button>
            <button
              type="button"
              role="tab"
              className={`${styles.modeButton} ${
                mode === 'practice' ? styles.modeButtonActive : ''
              }`}
              aria-selected={mode === 'practice'}
              onClick={() => handleModeChange('practice')}
            >
              Practice
            </button>
          </div>

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
            {mode === 'library' && (
              <div className={styles.field}>
                <label htmlFor="itemStatus">Status</label>
                <select
                  id="itemStatus"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as VocabularyStatusFilter)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            )}
          </section>

          {msg && <p className={styles.message}>{msg}</p>}
          {error && <p className={styles.error}>{error}</p>}

          {mode === 'library' ? (
            <>
              <section className={styles.libraryActions}>
                <button
                  className="primary"
                  type="button"
                  onClick={() => {
                    setItemPendingEdit(null);
                    setItemPendingDelete(null);
                    setIsCreateModalOpen(true);
                  }}
                >
                  Add word
                </button>
              </section>

              <section className={styles.items}>
                {items.length === 0 ? (
                  <p className={styles.empty}>No vocabulary items yet.</p>
                ) : (
                  items.map((item) => (
                    <LearningCard
                      key={item.id}
                      item={item}
                      languages={languages}
                      isAdmin={isAdmin}
                      onStatusChange={handleVocabularyItemStatusChange}
                      onEdit={() => {
                        setIsCreateModalOpen(false);
                        setItemPendingDelete(null);
                        setItemPendingEdit(item);
                      }}
                      onDelete={() => {
                        setIsCreateModalOpen(false);
                        setItemPendingEdit(null);
                        setItemPendingDelete(item);
                      }}
                    />
                  ))
                )}
              </section>
            </>
          ) : (
            <PracticeCard
              item={currentPracticeItem}
              languages={languages}
              isAnswerVisible={isPracticeAnswerVisible}
              currentIndex={practiceIndex}
              totalCount={practiceQueue.length}
              againCount={practiceStats.again}
              knowCount={practiceStats.know}
              onReveal={() => setIsPracticeAnswerVisible(true)}
              onAgain={() => handlePracticeAnswer('again')}
              onKnow={() => handlePracticeAnswer('know')}
              onRestart={() => restartPractice(false)}
              onShuffle={() => restartPractice(true)}
            />
          )}
          {itemPendingDelete && (
            <DeleteVocabularyItemModal
              item={itemPendingDelete}
              languages={languages}
              onCancel={() => setItemPendingDelete(null)}
              onConfirm={handleVocabularyItemDelete}
            />
          )}
          {itemPendingEdit && (
            <VocabularyItemFormModal
              mode="edit"
              item={itemPendingEdit}
              languages={languages}
              onCancel={() => setItemPendingEdit(null)}
              onSave={handleVocabularyItemContentSave}
            />
          )}
          {isCreateModalOpen && (
            <VocabularyItemFormModal
              mode="create"
              languages={languages}
              initialSourceLanguageId={selectedSourceLanguageId}
              initialTargetLanguageId={selectedTargetLanguageId}
              onCancel={() => setIsCreateModalOpen(false)}
              onSave={handleVocabularyItemCreate}
            />
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </article>
  );
};

export default Vocabulary;
