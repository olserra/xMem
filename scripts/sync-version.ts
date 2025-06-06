import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkgPath = resolve(__dirname, '../package.json');
const versionFilePath = resolve(__dirname, '../src/version.ts');

interface PackageJson {
  version: string;
}

try {
  // Read package.json and parse version
  const pkgRaw = readFileSync(pkgPath, 'utf8');
  const pkg: PackageJson = JSON.parse(pkgRaw);
  const version = pkg.version;

  // Prepare formatted TypeScript content
  const content = `// This file is auto-generated by scripts/sync-version.ts\n\n` +
    `/**\n * Current version of the app (from package.json)\n */\n` +
    `export const version = '${version}';\n`;

  // Write to src/version.ts
  writeFileSync(versionFilePath, content);
  console.log(`Synced version ${version} to src/version.ts`);
} catch (err) {
  console.error('Failed to sync version:', err);
  process.exit(1);
} 