import fs from "node:fs";
import path from "node:path";

const inputPath = "/home/ubuntu/upload/PHDUniTracker.html";
const outputPath = path.resolve("data/research/legacy-program-inventory.json");
const lines = fs.readFileSync(inputPath, "utf8").split(/\r?\n/);
const recordPattern = /\{ id: (\d+), university: "([^"]+)", program: "([^"]+)", website: "([^"]*)", deadline: "([^"]+)", notes: "([^"]*)"/;

const records = lines
  .map((line) => line.match(recordPattern))
  .filter(Boolean)
  .map((match) => ({
    legacyId: Number(match[1]),
    university: match[2],
    program: match[3],
    website: match[4] || null,
    deadline: match[5] || null,
    notes: match[6] || null,
  }));

fs.writeFileSync(outputPath, `${JSON.stringify(records, null, 2)}\n`);
console.log(JSON.stringify({ count: records.length, outputPath, records }, null, 2));
