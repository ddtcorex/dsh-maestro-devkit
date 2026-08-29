import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { skillsAction } from '../src/host/skills.js';

describe('devkit_skills', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devkit-skills-'));
    fs.mkdirSync(path.join(tmpDir, 'skills', 'existing-skill'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'skills', 'existing-skill', 'SKILL.md'), '# existing-skill\n');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('list finds real SKILL.md directories under cwd', async () => {
    const ctx = { exec: { agent: { session: { header: { cwd: tmpDir } } } } };
    const r = await skillsAction({ action: 'list' }, ctx);
    expect(r.skills).toContain('existing-skill');
  });

  it('list returns empty array when no skills/ directory exists', async () => {
    const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devkit-skills-empty-'));
    const ctx = { exec: { agent: { session: { header: { cwd: emptyDir } } } } };
    const r = await skillsAction({ action: 'list' }, ctx);
    expect(r.skills).toEqual([]);
    fs.rmSync(emptyDir, { recursive: true, force: true });
  });

  it('scaffold writes a real SKILL.md file', async () => {
    const ctx = { exec: { agent: { session: { header: { cwd: tmpDir } } } } };
    const r = await skillsAction({ action: 'scaffold', skill: 'new-skill' }, ctx);
    const written = path.join(tmpDir, 'skills', 'new-skill', 'SKILL.md');
    expect(fs.existsSync(written)).toBe(true);
    expect(fs.readFileSync(written, 'utf8')).toContain('new-skill');
    expect(r.created).toBe(written);
  });
});
