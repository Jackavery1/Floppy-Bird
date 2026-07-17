import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['run', 'verify'], {
    stdio: 'inherit',
    shell: true,
    env: process.env,
});

process.exit(result.status === null ? 1 : result.status);
