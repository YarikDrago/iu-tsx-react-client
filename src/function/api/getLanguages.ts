import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export interface LanguageDto {
  id: number;
  code: string;
  name: string;
}

export async function getLanguages(): Promise<LanguageDto[]> {
  return await universalFetchRequest<LanguageDto[]>('languages', HTMLRequestMethods.GET, {});
}
