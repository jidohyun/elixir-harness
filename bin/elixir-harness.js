#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PACKAGE_ROOT = path.resolve(__dirname, '..');

const TEMPLATE_ENTRIES = [
  'AGENTS.md',
  'config.yml',
  'architecture',
  'status',
  'spec',
  'rules',
  'knowledge',
  'framework',
  'design',
  'issues',
  'qa',
  'tasks',
];

function printHelp() {
  console.log(`elixir-harness

Usage:
  elixir-harness init [target] [options]

Arguments:
  target                 Project directory to initialize. Defaults to current directory.

Options:
  --dir <name>           Harness directory name. Defaults to .code_my_spec.
  --force                Overwrite an existing harness directory.
  --dry-run              Show what would be copied without writing files.
  -h, --help             Show this help.

Examples:
  elixir-harness init
  elixir-harness init ./my_phoenix_app
  elixir-harness init ./my_phoenix_app --dir .code_my_spec
  npx @jidohyun/elixir-harness init
`);
}

function parseArgs(argv) {
  const args = [...argv];
  const opts = {
    command: args.shift(),
    target: '.',
    harnessDir: '.code_my_spec',
    force: false,
    dryRun: false,
  };

  if (!opts.command || opts.command === '-h' || opts.command === '--help') {
    opts.help = true;
    return opts;
  }

  if (opts.command !== 'init') {
    throw new Error(`Unknown command: ${opts.command}`);
  }

  while (args.length > 0) {
    const arg = args.shift();

    if (arg === '--force') {
      opts.force = true;
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--dir') {
      const value = args.shift();
      if (!value) throw new Error('--dir requires a value');
      opts.harnessDir = value;
    } else if (arg === '-h' || arg === '--help') {
      opts.help = true;
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      opts.target = arg;
    }
  }

  return opts;
}

function isNonEmptyDirectory(dir) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory() && fs.readdirSync(dir).length > 0;
}

function copyEntry(src, dest, dryRun) {
  const stat = fs.statSync(src);

  if (dryRun) {
    console.log(`[dry-run] copy ${path.relative(PACKAGE_ROOT, src)} -> ${dest}`);
    return;
  }

  if (stat.isDirectory()) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function initHarness(opts) {
  const targetDir = path.resolve(process.cwd(), opts.target);
  const outDir = path.resolve(targetDir, opts.harnessDir);

  if (!fs.existsSync(targetDir)) {
    if (opts.dryRun) {
      console.log(`[dry-run] create target directory ${targetDir}`);
    } else {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  }

  if (isNonEmptyDirectory(outDir) && !opts.force) {
    throw new Error(
      `Harness directory already exists and is not empty: ${outDir}\n` +
        'Use --force to overwrite it.'
    );
  }

  if (!opts.dryRun) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const entry of TEMPLATE_ENTRIES) {
    const src = path.join(PACKAGE_ROOT, entry);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(outDir, entry);
    copyEntry(src, dest, opts.dryRun);
  }

  console.log(`Elixir harness initialized at ${outDir}`);
  console.log('Next steps:');
  console.log(`  1. Read ${path.join(opts.harnessDir, 'AGENTS.md')}`);
  console.log(`  2. Fill in ${path.join(opts.harnessDir, 'architecture/overview.md')}`);
  console.log(`  3. Add specs under ${path.join(opts.harnessDir, 'spec/')}`);
}

function main() {
  try {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) {
      printHelp();
      return;
    }
    initHarness(opts);
  } catch (error) {
    console.error(`error: ${error.message}`);
    console.error('Run `elixir-harness --help` for usage.');
    process.exit(1);
  }
}

main();
