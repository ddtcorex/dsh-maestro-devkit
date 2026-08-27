#!/usr/bin/env node
// Minimal client builder for scaffold — real esbuild in Phase 1
import fs from 'node:fs';
const out = 'lib/client.js';
fs.mkdirSync('lib', { recursive: true });
fs.writeFileSync(out, `// scaffold client bundle — real build in Phase 1\nexport function apply(){}\n`);
console.log(`wrote ${out} (scaffold)`);
