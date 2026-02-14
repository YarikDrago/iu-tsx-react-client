import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { Competition } from '@/pages/predictions/models/competition.models';

/* Download available football tournaments from the DB */
export async function getAvailablePredictions() {
  const data = (await universalFetchRequest(
    'tournaments',
    HTMLRequestMethods.GET,
    {}
  )) as Competition[];
  return data;
}
