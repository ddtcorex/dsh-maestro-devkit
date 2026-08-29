import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const KNOWN_SERVICES = ['tools', 'connection', 'slots', 'sessions'];

function parseBracketList(text: string, marker: RegExp): string[] {
  const match = text.match(marker);
  if (!match) throw new Error(`pattern not found: ${marker}`);
  return match[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

describe('inject consistency (regression: be2d395 harness/host incident, 2026-08-29)', () => {
  const patchYaml = fs.readFileSync(path.join(ROOT, 'cordis.patch.yml'), 'utf8');
  const hostSource = fs.readFileSync(path.join(ROOT, 'src/host/index.ts'), 'utf8');
  const clientSource = fs.readFileSync(path.join(ROOT, 'src/client/index.tsx'), 'utf8');

  it('cordis.patch.yml inject matches src/host/index.ts exported inject', () => {
    const patchInject = parseBracketList(patchYaml, /inject:\s*\[([^\]]*)\]/);
    const hostInject = parseBracketList(hostSource, /export const inject\s*=\s*\[([^\]]*)\]/);
    expect(patchInject).toEqual(hostInject);
  });

  it('every host inject entry is a known Cordis service', () => {
    const hostInject = parseBracketList(hostSource, /export const inject\s*=\s*\[([^\]]*)\]/);
    for (const service of hostInject) {
      expect(KNOWN_SERVICES).toContain(service);
    }
  });

  it('every client inject entry is a known Cordis service', () => {
    const clientInject = parseBracketList(clientSource, /export const inject\s*=\s*\[([^\]]*)\]/);
    for (const service of clientInject) {
      expect(KNOWN_SERVICES).toContain(service);
    }
  });
});
