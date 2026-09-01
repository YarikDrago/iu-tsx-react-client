import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export type UserVocabularyItemStatus = 'active' | 'archived' | 'deleted';
export type VisibleUserVocabularyItemStatus = Exclude<UserVocabularyItemStatus, 'deleted'>;
export type ConceptStatus = 'private' | 'pending' | 'verified' | 'rejected' | 'merged';

export interface VocabularyWordDto {
  id: number;
  languageId: number;
  text: string;
}

export interface VocabularyImageDto {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface UserVocabularyItemDto {
  id: number;
  userId: number;
  conceptId: number;
  sourceLanguageId: number;
  targetLanguageId: number;
  status: UserVocabularyItemStatus;
  concept: {
    id: number;
    status: ConceptStatus;
    primaryWordId: number | null;
    words: VocabularyWordDto[];
    images: VocabularyImageDto[];
  };
}

export interface CreateVocabularyItemPayload {
  sourceLanguageId: number;
  targetLanguageId: number;
  sourceText: string;
  targetText: string;
}

export interface UpdateVocabularyItemPayload {
  status: VisibleUserVocabularyItemStatus;
}

export interface UpdateVocabularyItemContentPayload {
  sourceLanguageId: number;
  targetLanguageId: number;
  sourceText: string;
  targetText: string;
}

export interface GetVocabularyItemsQuery {
  sourceLanguageId?: number;
  targetLanguageId?: number;
  status?: VisibleUserVocabularyItemStatus;
}

function toQueryString(query: GetVocabularyItemsQuery) {
  const params = new URLSearchParams();

  if (query.sourceLanguageId !== undefined) {
    params.set('sourceLanguageId', String(query.sourceLanguageId));
  }

  if (query.targetLanguageId !== undefined) {
    params.set('targetLanguageId', String(query.targetLanguageId));
  }

  if (query.status !== undefined) {
    params.set('status', query.status);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export async function getVocabularyItems(query: GetVocabularyItemsQuery = {}) {
  return await universalFetchRequest<UserVocabularyItemDto[]>(
    `vocabulary/my-items${toQueryString(query)}`,
    HTMLRequestMethods.GET,
    {}
  );
}

export async function createVocabularyItem(payload: CreateVocabularyItemPayload) {
  return await universalFetchRequest<UserVocabularyItemDto>(
    'vocabulary/my-items',
    HTMLRequestMethods.POST,
    payload
  );
}

export async function updateVocabularyItem(itemId: number, payload: UpdateVocabularyItemPayload) {
  return await universalFetchRequest<UserVocabularyItemDto>(
    `vocabulary/my-items/${itemId}`,
    HTMLRequestMethods.PATCH,
    payload
  );
}

export async function deleteVocabularyItem(itemId: number) {
  return await universalFetchRequest<UserVocabularyItemDto>(
    `vocabulary/my-items/${itemId}`,
    HTMLRequestMethods.DELETE,
    {}
  );
}

export async function updateVocabularyItemContent(
  itemId: number,
  payload: UpdateVocabularyItemContentPayload
) {
  return await universalFetchRequest<UserVocabularyItemDto>(
    `vocabulary/my-items/${itemId}/content`,
    HTMLRequestMethods.PATCH,
    payload
  );
}
