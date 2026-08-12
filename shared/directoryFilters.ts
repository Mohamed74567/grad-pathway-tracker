export type AcceptanceRange = "all" | "under10" | "10to30" | "30plus";
export type DirectoryDeadline = { deadlineDate: Date | string | null };

export function matchesDirectorySupplementalFilters(
  program: { acceptanceRate: string | number | null; deadlines?: DirectoryDeadline[] },
  filters: { acceptanceRange: AcceptanceRange; deadlineWindowDays?: number },
  now = new Date(),
): boolean {
  const rate = program.acceptanceRate === null ? null : Number(program.acceptanceRate);
  const validRate = rate !== null && !Number.isNaN(rate);
  const acceptanceMatch = filters.acceptanceRange === "all"
    || (filters.acceptanceRange === "under10" && validRate && rate < 10)
    || (filters.acceptanceRange === "10to30" && validRate && rate >= 10 && rate <= 30)
    || (filters.acceptanceRange === "30plus" && validRate && rate > 30);
  if (!acceptanceMatch) return false;
  if (!filters.deadlineWindowDays) return true;
  const ceiling = new Date(now);
  ceiling.setDate(ceiling.getDate() + filters.deadlineWindowDays);
  return (program.deadlines ?? []).some(deadline => {
    if (!deadline.deadlineDate) return false;
    const date = typeof deadline.deadlineDate === "string" ? new Date(`${deadline.deadlineDate}T00:00:00`) : deadline.deadlineDate;
    return !Number.isNaN(date.getTime()) && date >= now && date <= ceiling;
  });
}
