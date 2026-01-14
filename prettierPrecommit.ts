import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Get a list of modified files from commit
const changedFiles = execSync('git diff --cached --name-only', {
  encoding: 'utf-8',
})
  .trim()
  .split('\n')
  .filter((file) => file.trim() !== '')
  .filter((file) => file.match(/\.(js|jsx|ts|tsx|css|scss)$/));

// Filter out deleted files
const existingFiles = changedFiles.filter((file) => fs.existsSync(path.resolve(file)));

if (existingFiles.length > 0) {
  console.log(`Checking ${existingFiles.length} file(s) with Prettier...`);

  const filesArg = existingFiles.map((f) => `"${f}"`).join(' ');

  // First, try to check
  const prettierCheckCmd = `prettier --check ${filesArg}`;
  try {
    execSync(prettierCheckCmd, { stdio: 'pipe' });
    console.log('✅ Prettier check passed');
  } catch {
    // If check failed, auto-fix and re-stage
    console.log('⚠️  Formatting issues found. Auto-fixing...');
    try {
      execSync(`prettier --write ${filesArg}`, { stdio: 'inherit' });
      execSync(`git add ${filesArg}`, { stdio: 'inherit' });
      console.log('✅ Files formatted and re-staged');
    } catch (fixError) {
      console.error('❌ Failed to format files');
      process.exit(1);
    }
  }
} else {
  console.log('No files to check');
}
