// gta6-clipper-01, entry #2 — hand-in program.
//
// The entry itself is the public YouTube Short named in VIDEO.json.
// This program is the hand-in: it reads VIDEO.json from the repository
// root (beside this file), checks that its "url" really is a YouTube
// video address, and copies the file unchanged into the output
// directory so the grader can read it back.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const videoFile = join(repoRoot, "VIDEO.json");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The two YouTube address shapes this bounty accepts: a Shorts URL or
// a youtu.be short link, each carrying an 11-character video id.
const SHORTS_URL = /^https:\/\/(www\.)?youtube\.com\/shorts\/[A-Za-z0-9_-]{11}(\?.*)?$/;
const SHORT_LINK = /^https:\/\/youtu\.be\/[A-Za-z0-9_-]{11}(\?.*)?$/;

function isYouTubeVideoUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return SHORTS_URL.test(value) || SHORT_LINK.test(value);
}

function main(): void {
  const raw = readFileSync(videoFile, "utf8");

  let parsed: { url?: unknown };
  try {
    parsed = JSON.parse(raw) as { url?: unknown };
  } catch {
    throw new Error("VIDEO.json is not valid JSON");
  }

  if (!isYouTubeVideoUrl(parsed.url)) {
    throw new Error(
      "VIDEO.json \"url\" is not a YouTube video address: " + String(parsed.url),
    );
  }

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, "VIDEO.json"), raw);
  console.log("handed in VIDEO.json for " + String(parsed.url));
}

main();
