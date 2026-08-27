import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Resolve target URL for frontend capture/HMR.
 * - env DSH_FRONTEND_URL wins
 * - explicit string passthrough (not auto/local/tunnel)
 * - local → http://127.0.0.1:3080
 * - tunnel/auto → try ~/.dsh/maestro/settings.json remote.tunnelUrl else local
 */
export async function resolveTargetUrl(input?: string | null): Promise<string> {
  if (process.env.DSH_FRONTEND_URL) return process.env.DSH_FRONTEND_URL;
  if (input && input !== 'auto' && input !== 'local' && input !== 'tunnel') return input;
  if (input === 'local') return 'http://127.0.0.1:3080';
  if (input === 'tunnel' || input === 'auto' || !input) {
    try {
      const p = path.join(os.homedir(), '.dsh', 'maestro', 'settings.json');
      if (fs.existsSync(p)) {
        const j = JSON.parse(fs.readFileSync(p, 'utf8'));
        const t = (j as any)?.['dsh-maestro-remote']?.tunnelUrl || (j as any)?.remote?.tunnelUrl || (j as any)?.['dsh-maestro-devkit']?.targetUrl;
        if (t && typeof t === 'string' && t.startsWith('http')) return t;
      }
    } catch {}
    return 'http://127.0.0.1:3080';
  }
  return 'http://127.0.0.1:3080';
}
