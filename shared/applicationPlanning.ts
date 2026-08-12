export type DatedDeadline = { deadlineDate: Date | string | null };

export function dateTimestamp(value: Date | string | null | undefined) {
  if (!value) return null;
  const timestamp = new Date(String(value)).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function orderNextActions<T extends { nextAction?: string | null; deadlines: DatedDeadline[] }>(items: T[]) {
  return items
    .filter(item => Boolean(item.nextAction?.trim()))
    .sort((a, b) => {
      const aDeadline = Math.min(...a.deadlines.map(deadline => dateTimestamp(deadline.deadlineDate) ?? Number.MAX_SAFE_INTEGER));
      const bDeadline = Math.min(...b.deadlines.map(deadline => dateTimestamp(deadline.deadlineDate) ?? Number.MAX_SAFE_INTEGER));
      return aDeadline - bDeadline;
    });
}

export function initialCalendarMonth(firstDeadline: Date | string | null | undefined, fallback = new Date()) {
  const source = dateTimestamp(firstDeadline) ? new Date(String(firstDeadline)) : fallback;
  return new Date(source.getFullYear(), source.getMonth(), 1);
}

export type AdmissionSnapshotInput = {
  deadline?: string | null;
  applicationFeeDisplay?: string | null;
  grePolicy?: string | null;
  englishTestPolicy?: string | null;
  duolingoPolicy?: string | null;
  funding?: string | null;
  acceptanceRate?: string | number | null;
};

export function admissionSnapshotPresence(input: AdmissionSnapshotInput) {
  return {
    deadline: Boolean(input.deadline),
    applicationFee: Boolean(input.applicationFeeDisplay),
    gre: Boolean(input.grePolicy),
    englishTest: Boolean(input.englishTestPolicy),
    duolingo: Boolean(input.duolingoPolicy),
    funding: Boolean(input.funding),
    acceptanceRate: input.acceptanceRate !== null && input.acceptanceRate !== undefined && input.acceptanceRate !== "",
  };
}
