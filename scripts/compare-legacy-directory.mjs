import { readFile, writeFile, mkdir } from 'node:fs/promises';
import mysql from 'mysql2/promise';

const inventoryPath = '/home/ubuntu/grad-pathway-tracker/data/audits/legacy-tracker-inventory.json';
const outputPath = '/home/ubuntu/grad-pathway-tracker/data/audits/legacy-directory-coverage.json';

const normalize = (value = '') => value
  .toLowerCase()
  .replaceAll('saint louise', 'saint louis')
  .replaceAll('ut southwestern medical center', 'university texas southwestern')
  .replaceAll('uc san diego', 'university california san diego')
  .replaceAll('njit university', 'new jersey institute technology')
  .replaceAll('university texas arlington', 'university texas at arlington')
  .replaceAll('university texas dallas', 'university texas at dallas')
  .replaceAll('university texas austin', 'university texas at austin')
  .replaceAll('georgia tech and emory university', 'georgia tech emory')
  .replace(/\b(university|institute|college|of|the|at|and)\b/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const tokenSet = (value) => new Set(normalize(value).split(' ').filter(Boolean));
const overlap = (left, right) => {
  const a = tokenSet(left);
  const b = tokenSet(right);
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / Math.max(a.size, b.size, 1);
};

const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [programs] = await connection.execute(`
  SELECT universityName, programName, degreeType, slug, officialUrl, applicationUrl,
    applicationFeeDisplay, grePolicy, englishTestPolicy, duolingoPolicy, fundingStatus, campusImageUrl
  FROM programs
  WHERE isPublished = true
`);
await connection.end();

const comparison = inventory.records.map((legacy) => {
  const exact = programs.filter((program) => normalize(program.universityName) === normalize(legacy.university));
  const candidates = exact.length > 0
    ? exact
    : programs
      .map((program) => ({ program, score: overlap(legacy.university, program.universityName) }))
      .filter(({ score }) => score >= 0.66)
      .sort((a, b) => b.score - a.score)
      .map(({ program }) => program);

  const phdCandidates = candidates.filter((program) => program.degreeType === 'phd');
  const matched = phdCandidates.length > 0 ? phdCandidates : candidates;
  return {
    legacy,
    matchStatus: matched.length > 0 ? (exact.length > 0 ? 'published-university-match' : 'possible-university-match') : 'not-published',
    publishedMatches: matched,
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  legacyRecordCount: comparison.length,
  uniqueLegacyUniversityCount: new Set(inventory.records.map((record) => normalize(record.university))).size,
  publishedUniversityMatches: comparison.filter((entry) => entry.matchStatus === 'published-university-match').length,
  possibleUniversityMatches: comparison.filter((entry) => entry.matchStatus === 'possible-university-match').length,
  notPublished: comparison.filter((entry) => entry.matchStatus === 'not-published').map((entry) => entry.legacy),
  linkRepairSeeds: comparison.filter((entry) => !entry.legacy.website || /grok\.com|chatgpt\.com/i.test(entry.legacy.website)),
  duplicatesInLegacy: inventory.duplicateGroups,
  comparison,
};

await mkdir('/home/ubuntu/grad-pathway-tracker/data/audits', { recursive: true });
await writeFile(outputPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  legacyRecordCount: report.legacyRecordCount,
  uniqueLegacyUniversityCount: report.uniqueLegacyUniversityCount,
  publishedUniversityMatches: report.publishedUniversityMatches,
  possibleUniversityMatches: report.possibleUniversityMatches,
  notPublishedCount: report.notPublished.length,
  linkRepairSeedIds: report.linkRepairSeeds.map((entry) => entry.legacy.id),
}, null, 2));
