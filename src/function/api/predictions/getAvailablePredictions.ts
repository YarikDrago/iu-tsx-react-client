import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { Predictions } from '@/pages/predictions/Predictions';

/* Download available football tournaments from the DB */
export async function getAvailablePredictions() {
  const data = (await universalFetchRequest(
    'tournaments',
    HTMLRequestMethods.GET,
    {}
  )) as Predictions[];
  return data;
}
