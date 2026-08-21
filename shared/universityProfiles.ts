export type UniversityDegreePath = {
  id: number;
  universityName: string;
  degreeType: "phd" | "masters";
  programName: string;
};

export type GroupedUniversityProfile<T extends UniversityDegreePath> = {
  universityName: string;
  programs: T[];
};

export function groupUniversityProfiles<T extends UniversityDegreePath>(allPrograms: T[], visibleProgramIds: Set<number>): GroupedUniversityProfile<T>[] {
  const profiles = new Map<string, T[]>();
  allPrograms.forEach(program => {
    const paths = profiles.get(program.universityName) ?? [];
    paths.push(program);
    profiles.set(program.universityName, paths);
  });

  return Array.from(profiles.entries())
    .filter(([, paths]) => paths.some(path => visibleProgramIds.has(path.id)))
    .map(([universityName, programs]) => ({ universityName, programs }))
    .sort((a, b) => a.universityName.localeCompare(b.universityName));
}
