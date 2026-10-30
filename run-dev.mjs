import { spawn } from 'child_process';
import path from 'path';

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[32m%s\x1b[0m', '   🏙️  SmartCity 360 — Starting Development Environment');
console.log('\x1b[36m%s\x1b[0m', '=====================================================');

// Start backend server
const serverProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('server'),
  stdio: 'inherit',
  shell: true,
});

// Start frontend client
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('client'),
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\nShutting down SmartCity 360 processes...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
