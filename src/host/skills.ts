import fs from 'node:fs';
import path from 'node:path';

function cwdFrom(ctx: any): string {
  return ctx?.exec?.agent?.session?.header?.cwd ?? process.cwd();
}

export async function skillsAction(opts: { action: string; skill?: string }, ctx: any) {
  const cwd = cwdFrom(ctx);
  const skillsDir = path.join(cwd, 'skills');

  if (opts.action === 'list') {
    if (!fs.existsSync(skillsDir)) return { skills: [], action: 'list' };
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    const skills = entries
      .filter((e) => e.isDirectory() && fs.existsSync(path.join(skillsDir, e.name, 'SKILL.md')))
      .map((e) => e.name);
    return { skills, action: 'list' };
  }

  if (opts.action === 'scaffold') {
    const name = opts.skill ?? 'new-skill';
    const dir = path.join(skillsDir, name);
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, 'SKILL.md');
    fs.writeFileSync(
      filePath,
      `# ${name}\n\nDescribe when this skill should be used and what it does.\n`,
    );
    return { created: filePath, action: 'scaffold' };
  }

  return { action: opts.action, skill: opts.skill, status: 'unsupported action' };
}
