import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export interface HealthResponse {
  status: 'ok' | 'error';
  database: 'up' | 'down';
}

export async function checkHealth(): Promise<HealthResponse> {
  return await universalFetchRequest<HealthResponse>(
    'health',
    HTMLRequestMethods.GET,
    {},
    {
      skipAutoRefresh: true,
    }
  );
}
