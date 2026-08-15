import mysql from 'mysql2/promise';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required');

const connection = await mysql.createConnection(databaseUrl);
const [rows] = await connection.query(`
  SELECT slug, universityName, programName, officialUrl, applicationUrl
  FROM programs
  WHERE isPublished = TRUE
  ORDER BY state, universityName, programName
`);
await connection.end();

const urlRecords = new Map();
for (const row of rows) {
  for (const field of ['officialUrl', 'applicationUrl']) {
    const url = row[field];
    if (!url) continue;
    if (!urlRecords.has(url)) urlRecords.set(url, { url, references: [] });
    urlRecords.get(url).references.push({ slug: row.slug, field, universityName: row.universityName, programName: row.programName });
  }
}

const timeoutMs = 5000;
async function inspect(record) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response = await fetch(record.url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'GradPathway-LinkAudit/1.0 (+personal research workspace)' },
    });
    let method = 'HEAD';
    if (response.status === 405 || response.status === 403 || response.status === 501) {
      response = await fetch(record.url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'GradPathway-LinkAudit/1.0 (+personal research workspace)' },
      });
      method = 'GET';
    }
    return {
      ...record,
      status: response.status,
      finalUrl: response.url,
      redirected: response.url !== record.url,
      method,
      contentType: response.headers.get('content-type') || null,
    };
  } catch (error) {
    return { ...record, status: null, finalUrl: null, redirected: false, method: null, error: error.name === 'AbortError' ? `timeout after ${timeoutMs}ms` : String(error.message || error) };
  } finally {
    clearTimeout(timeout);
  }
}

const offset = Math.max(0, Number.parseInt(process.env.AUDIT_OFFSET || '0', 10) || 0);
const limit = Math.max(1, Math.min(30, Number.parseInt(process.env.AUDIT_LIMIT || '20', 10) || 20));
const records = [...urlRecords.values()].slice(offset, offset + limit);
const results = [];
const concurrency = 8;
let cursor = 0;
async function worker() {
  while (cursor < records.length) {
    const current = records[cursor++];
    results.push(await inspect(current));
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));

const candidates = results.filter((result) => result.status === null || result.status >= 400);
const redirects = results.filter((result) => result.status !== null && result.status < 400 && result.redirected);
console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  offset,
  batchSize: results.length,
  totalUniqueUrls: urlRecords.size,
  failedOrErrored: candidates.length,
  redirects: redirects.length,
  candidates,
  redirects: redirects.slice(0, 120),
}, null, 2));
