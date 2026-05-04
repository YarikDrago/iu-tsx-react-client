export function formatLocalDDMMYY_HHMM(
  isoUtcString: string | null,
  isShort: boolean = true
): string {
  if (!isoUtcString) return 'null';

  const d = new Date(isoUtcString);
  if (Number.isNaN(d.getTime())) return 'NaN';

  const parts = new Intl.DateTimeFormat('en-GB', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    // Set timeZone of the system
  }).formatToParts(d);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  /* Format: YYYY-MM-DD HH:MM */
  let res = `${get('day')}-${get('month')}-${get('year')}`;
  if (!isShort) res += ` ${get('hour')}:${get('minute')}`;
  return res;
}
