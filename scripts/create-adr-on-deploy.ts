import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get deploy info from environment variables (set by GitHub Actions)
const branch = process.env.GITHUB_REF?.replace('refs/heads/', '') || 'unknown-branch';
const actor = process.env.GITHUB_ACTOR || 'unknown-actor';
const commit = process.env.GITHUB_SHA || 'unknown-commit';
const repo = process.env.GITHUB_REPOSITORY || 'unknown-repo';
const runId = process.env.GITHUB_RUN_ID || '';
const runUrl = repo && runId ? `https://github.com/${repo}/actions/runs/${runId}` : '';

const now = new Date();
const pad = (n: number) => n.toString().padStart(2, '0');
const timestamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
const dateStr = now.toISOString().replace('T', ' ').replace('Z', ' UTC');

const filename = `ADR-${timestamp}.md`;
const adrDir = path.join(__dirname, '../docs/adr');
const adrPath = path.join(adrDir, filename);

const content = `# [ADR-${timestamp}] Automated Deploy Record

- **Status:** Accepted
- **Date:** ${dateStr}
- **Context:**
  - Automated ADR for deploy on branch \`