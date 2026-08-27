export async function skillsAction(opts: { action: string; skill?: string }, ctx: any) {
  if (opts.action === 'list') return { skills: ['govard-toolbox','maestro-skills'], action: 'list' };
  if (opts.action === 'scaffold') return { created: `skills/${opts.skill}/SKILL.md`, action: 'scaffold' };
  return { action: opts.action, skill: opts.skill, status: 'scaffold' };
}
