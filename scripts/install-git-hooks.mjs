import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const gitDir = join(process.cwd(), '.git');
if (!existsSync(gitDir)) {
    process.exit(0);
}

const hooksDir = join(gitDir, 'hooks');
mkdirSync(hooksDir, { recursive: true });

const hookPath = join(hooksDir, 'pre-commit');
/**
 * Hook portable Windows/macOS/Linux :
 * - Git Bash exécute le shebang ; `node` lance verify via shell npm.cmd sous Windows.
 * - `git rev-parse` garantit le cwd dépôt (GUI / worktrees).
 */
const hook = `#!/bin/sh
set -e
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
# verify ~1-2 min (lint + format + tokens + tests) — do not interrupt
exec node ./scripts/run-pre-commit.mjs
`;

writeFileSync(hookPath, hook, { encoding: 'utf8' });
try {
    chmodSync(hookPath, 0o755);
} catch {
    // Windows : chmod optionnel
}
