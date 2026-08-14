import { readFileSync, writeFileSync } from "node:fs";

/** Doc order mirrors the reading path: overview first, then subsystems. */
const SOURCES = [
  "README.md",
  "docs/architecture.md",
  "docs/web-app.md",
  "docs/cli.md",
  "docs/fit-format.md",
  "docs/track-cleaning.md",
  "docs/power-estimation.md",
  "docs/ftp-estimation.md",
  "docs/history-storage.md",
  "docs/theme.md",
];

const parts = SOURCES.map(
  (path) => `<!-- source: ${path} -->\n\n${readFileSync(path, "utf8").trim()}`,
);
writeFileSync(
  "dist/llms-full.txt",
  `# ReFit — full documentation for LLMs\n\n` +
    `> Generated at build time from README.md and docs/*.md of https://github.com/dmitrytarassov/refit\n\n` +
    `${parts.join("\n\n---\n\n")}\n`,
);
