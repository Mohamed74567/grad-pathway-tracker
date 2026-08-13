import mysql from 'mysql2/promise';
import { mkdir, writeFile } from 'node:fs/promises';

const outputPath = '/home/ubuntu/grad-pathway-tracker/data/audits/published-link-health.json';
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [programs] = await connection.execute(`
  SELECT id, slug, universityName, programName, degreeType, officialUrl, applicationUrl
  FROM programs
  WHERE isPublished = true
  ORDER BY universityName, degreeType, programName
`);
await connection.end();

const timeoutMs = 12_000;
const limit = 8;
let nextIndex = 0;

async function inspectUrl(url) {
  if (!url) return { status: 'missing', httpStatus: null, finalUrl: null };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'GradPathway-Directory-Audit/1.0 (+source-verification)' },
    });
    return {
      status: response.ok ? 'ok' : 'http-error',
      httpStatus: response.status,
      finalUrl: response.url,
    };
  } catch (error) {
    return {
      status: error?.name === 'AbortError' ? 'timeout' : 'network-error',
      httpStatus: null,
      finalUrl: null,
      error: String(error?.message ?? error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

const targets = programs.flatMap((program) => [
  { ...program, linkType: 'official', url: program.officialUrl },
  { ...program, linkType: 'application', url: program.applicationUrl },
]);

const results = [];
await Promise.all(Array.from({ length: limit }, async () => {
  while (nextIndex < targets.length) {
    const target = targets[nextIndex++];
    results.push({ ...target, ...(await inspectUrl(target.url)) });
  }
}));

const summary = {
  generatedAt: new Date().toISOString(),
  targetCount: results.length,
  healthyCount: results.filter((result) => result.status === 'ok').length,
  issueCount: results.filter((result) => result.status !== 'ok').length,
  issues: results.filter((result) => result.status !== 'ok'),
};

await mkdir('/home/ubuntu/grad-pathway-tracker/data/audits', { recursive: true });
await writeFile(outputPath, JSON.stringify({ summary, results }, null, 2));
console.log(JSON.stringify(summary, null, 2));
