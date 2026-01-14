import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Get a list of modified files from commit
const changedFiles = execSync('git diff --cached --name-only', {
  encoding: 'utf-8',
})
  .trim()
  .split('\n')
  .filter((file) => file.match(/\.(js|jsx|ts|tsx|css|scss)$/) && file.trim() !== '');

// Filter out deleted files
const existingFiles = changedFiles.filter((file) => fs.existsSync(path.resolve(file)));

if (existingFiles.length > 0) {
  const prettierCmd = `prettier --write ${existingFiles.join(' ')}`;
  try {
    execSync(prettierCmd, { stdio: 'inherit' });
  } catch {
    console.error('Prettier check failed');
    process.exit(1);
  }
} else {
  console.log('No files to lint');
}
