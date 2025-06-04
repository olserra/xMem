import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

(async () => {
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
  - Automated ADR for deploy on branch \`${branch}\` by \`${actor}\`, commit \`${commit}\`.
  - [View GitHub Actions Run](${runUrl})
- **Decision:**
  - Deployed to branch \`${branch}\`.
- **Consequences:**
  - Production updated with latest changes from commit \`${commit}\`.
- **Related:**
  - [Commit on GitHub](https://github.com/${repo}/commit/${commit})
`;

  if (!fs.existsSync(adrDir)) {
    fs.mkdirSync(adrDir, { recursive: true });
  }

  if (fs.existsSync(adrPath)) {
    console.log(`ADR already exists for this timestamp: ${adrPath}`);
    process.exit(0);
  }

  fs.writeFileSync(adrPath, content, 'utf8');
  console.log(`ADR created: ${adrPath}`);
})();
