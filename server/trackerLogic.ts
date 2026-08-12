export const APP_STATUSES = ["researching", "applied", "interview", "offer", "accepted", "rejected"] as const;
export type ApplicationStatus = (typeof APP_STATUSES)[number];

export function isValidApplicationStatus(value: string): value is ApplicationStatus {
  return APP_STATUSES.includes(value as ApplicationStatus);
}

export function getDeadlineUrgency(deadline: Date | string | null, now = new Date()): "red" | "yellow" | "green" | "past" | "unknown" {
  if (!deadline) return "unknown";
  const target = typeof deadline === "string" ? new Date(`${deadline}T00:00:00`) : deadline;
  if (Number.isNaN(target.getTime())) return "unknown";
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.ceil((target.getTime() - now.getTime()) / msPerDay);
  if (days < 0) return "past";
  if (days < 30) return "red";
  if (days < 60) return "yellow";
  return "green";
}

export function calculateCompletionRate(documents: Array<{ isComplete: boolean }>): number {
  if (documents.length === 0) return 0;
  return Math.round((documents.filter(document => document.isComplete).length / documents.length) * 100);
}

export function canCreateRecommender(existingCount: number): boolean {
  return existingCount < 3;
}
