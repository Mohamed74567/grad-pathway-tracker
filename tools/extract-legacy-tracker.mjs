import { readFile, writeFile } from "node:fs/promises";

const sourcePath = "/home/ubuntu/upload/PHDUniTracker.html";
const outputPath = "/home/ubuntu/legacy-tracker-import.sql";
const html = await readFile(sourcePath, "utf8");
const block = html.match(/const initialUniversities = \[(?<rows>[\s\S]*?)\n\s*\];/);

if (!block?.groups?.rows) throw new Error("Could not locate initialUniversities in the uploaded tracker.");

const field = (row, name) => {
  const match = row.match(new RegExp(`${name}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  return match ? JSON.parse(`"${match[1]}"`) : "";
};

const quote = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const rows = [...block.groups.rows.matchAll(/\{\s*id:\s*(?<id>\d+),[\s\S]*?\s*\}/g)].map(match => {
  const row = match[0];
  return {
    id: Number(match.groups.id),
    university: field(row, "university"),
    program: field(row, "program"),
    website: field(row, "website"),
    deadline: field(row, "deadline"),
    notes: field(row, "notes"),
    appStatus: field(row, "appStatus"),
    result: field(row, "result"),
  };
});

if (rows.length !== 86) throw new Error(`Expected 86 uploaded rows, found ${rows.length}.`);

const values = rows.map(row => `(${row.id}, ${quote(row.university)}, ${quote(row.program)}, ${row.website ? quote(row.website) : "NULL"}, ${row.deadline ? quote(row.deadline) : "NULL"}, ${row.notes ? quote(row.notes) : "NULL"}, ${quote(row.appStatus)}, ${quote(row.result)}, false)`).join(",\n");
const sql = `INSERT INTO legacyApplicationRecords (legacyId, universityName, programName, legacyWebsite, legacyDeadline, notes, sourceApplicationStatus, sourceResult, isVerifiedDirectoryFact) VALUES\n${values}\nON DUPLICATE KEY UPDATE universityName=VALUES(universityName), programName=VALUES(programName), legacyWebsite=VALUES(legacyWebsite), legacyDeadline=VALUES(legacyDeadline), notes=VALUES(notes), sourceApplicationStatus=VALUES(sourceApplicationStatus), sourceResult=VALUES(sourceResult), isVerifiedDirectoryFact=false, updatedAt=NOW();\n`;

await writeFile(outputPath, sql, "utf8");
console.log(`Prepared ${rows.length} legacy rows in ${outputPath}`);
