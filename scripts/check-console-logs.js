#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔍 Checking for console.log statements...');

try {
  // Get staged files
  const stagedFiles = execSync(
    'git diff --cached --name-only --diff-filter=ACM',
    { 
      cwd: path.join(__dirname, '..'), 
      encoding: 'utf8',
      shell: true 
    }
  ).trim().split('\n').filter(Boolean);

  // Filter for JS/TS files, excluding node_modules and scripts folders
  const jsFiles = stagedFiles.filter(file => 
    /\.(js|jsx|ts|tsx)$/.test(file) && 
    !file.startsWith('node_modules/') &&
    !file.startsWith('scripts/') &&
    fs.existsSync(path.join(__dirname, '..', file))
  );

  const filesWithConsoleLog = [];

  // Check each file for console.log
  for (const file of jsFiles) {
    const filePath = path.join(__dirname, '..', file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (/console\.log/.test(content)) {
        filesWithConsoleLog.push(file);
      }
    } catch (err) {
      console.warn(`Warning: Could not read file ${file}`);
    }
  }

  if (filesWithConsoleLog.length > 0) {
    console.error('❌ Found console.log statements in staged files:');
    filesWithConsoleLog.forEach(file => console.error(`  - ${file}`));
    console.error('');
    console.error('Please remove console.log statements before committing.');
    console.error('You can use console.warn, console.error, or a proper logging library instead.');
    process.exit(1);
  }

  console.log('✅ No console.log statements found in staged files');
} catch (error) {
  console.error('Error checking for console.log statements:', error.message);
  process.exit(1);
}