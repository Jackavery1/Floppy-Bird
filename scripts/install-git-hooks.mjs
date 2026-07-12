import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const gitDir = join(process.cwd(), '.git');
if (!existsSync(gitDir)) {
    process.exit(0);
}

const hooksDir = join(gitDir, 'hooks');
mkdirSync(hooksDir, { recursive: true });

const hookPath = join(hooksDir, 'pre-commit');
const hook = `#!/bin/sh
npm run verify
`;

writeFileSync(hookPath, hook, 'utf8');
try {
    chmodSync(hookPath, 0o755);
} catch {
    // Windows : chmod optionnel
}
