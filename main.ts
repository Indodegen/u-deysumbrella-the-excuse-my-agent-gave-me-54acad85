import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The Excuse My Agent Gave Me — program/v1 entrypoint.
// Writes the single-line excuse to /output/entry.txt, byte-identical
// to the entry.txt shipped in this repository. The entry file is
// resolved through import.meta.url, never a bare relative path, so the
// grader can run this from any working directory.
const here = dirname(fileURLToPath(import.meta.url));
const entry = readFileSync(join(here, "entry.txt"));

// Gate self-check: the sealed scorer only judges UTF-8 text of 1–200
// characters that is not only whitespace, on a single line. Fail loudly
// instead of shipping an entry the gate would refuse.
const text = entry.toString("utf8");
if (text.length < 1 || text.length > 200 || text.trim().length === 0) {
  throw new Error(`entry.txt fails the gate: ${text.length} characters`);
}
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry.txt fails the gate: entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), entry);
