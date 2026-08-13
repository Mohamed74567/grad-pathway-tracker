import { readFile, writeFile, mkdir } from 'node:fs/promises';

const inputPath = '/home/ubuntu/upload/PHDUniTracker.html';
const outputDir = '/home/ubuntu/grad-pathway-tracker/data/audits';
const html = await readFile(inputPath, 'utf8');
const startMarker = 'const initialUniversities = [';
const start = html.indexOf(startMarker);
const end = html.indexOf('\n            ];', start);

if (start < 0 || end < 0) {
  throw new Error('Could not locate the legacy initialUniversities data block.');
}

const dataBlock = html.slice(start + startMarker.length, end);
const objects = dataBlock.match(/\{[^{}]*\}/g) ?? [];
const records = objects.map((objectText) => {
  const record = {};
  for (const match of objectText.matchAll(/(\w+):\s*"((?:\\.|[^"\\])*)"/g)) {
    record[match[1]] = match[2].replaceAll('\\"', '"').replaceAll('\\\\', '\\');
  }
  const idMatch = objectText.match(/id:\s*(\d+)/);
  if (idMatch) record.id = Number(idMatch[1]);
  return record;
}).filter((record) => record.university && record.program);

const normalize = (value = '') => value
  .toLowerCase()
  .replaceAll('&', 'and')
  .replace(/\b(university|institute|college|of|the|at|and)\b/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const duplicates = records.reduce((groups, record) => {
  const key = `${normalize(record.university)}|${normalize(record.program)}`;
  groups.set(key, [...(groups.get(key) ?? []), record.id]);
  return groups;
}, new Map());

const report = {
  source: inputPath,
  parsedAt: new Date().toISOString(),
  recordCount: records.length,
  records,
  emptyWebsiteIds: records.filter((record) => !record.website?.trim()).map((record) => record.id),
  nonOfficialWebsiteIds: records.filter((record) => /grok\.com|chatgpt\.com/i.test(record.website ?? '')).map((record) => record.id),
  duplicateGroups: [...duplicates.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => ({ key, ids })),
  stateHints: [...new Set(records.map((record) => record.university))].sort(),
};

await mkdir(outputDir, { recursive: true });
await writeFile(`${outputDir}/legacy-tracker-inventory.json`, JSON.stringify(report, null, 2));
await writeFile(`${outputDir}/legacy-tracker-programs.csv`, [
  'id,university,program,website,deadline,notes',
  ...records.map((record) => [record.id, record.university, record.program, record.website, record.deadline, record.notes]
    .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')),
].join('\n'));

console.log(JSON.stringify({
  recordCount: report.recordCount,
  emptyWebsiteIds: report.emptyWebsiteIds,
  nonOfficialWebsiteIds: report.nonOfficialWebsiteIds,
  duplicateGroups: report.duplicateGroups,
}, null, 2));
