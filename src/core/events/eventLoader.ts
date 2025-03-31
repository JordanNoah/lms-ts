import path from 'path';
import fs from 'fs/promises';
import { Dirent } from 'fs';

export async function loadCoreEvents() {
  const pluginDir = path.join(__dirname, '..');
  const entries = await fs.readdir(pluginDir, { withFileTypes: true });
  await loadFunction(pluginDir, entries);  
}

export async function loadPluginEvents() {
  const pluginDir = path.join(__dirname, '..', '..', 'plugin');
  const entries = await fs.readdir(pluginDir, { withFileTypes: true });
  await loadFunction(pluginDir, entries);
}

async function loadFunction(pluginDir: string, entries: Dirent[]) {
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const eventPath = path.join(pluginDir, entry.name, 'event.ts');
    try {
      if (await fileExists(eventPath)) {
        await import(eventPath);
        console.log(`📡 Handlers cargados desde plugin "${entry.name}"`);
      }
    } catch (err: any) {
      console.warn(`⚠️  Error al cargar eventos de plugin "${entry.name}": ${err.message}`);
    }
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
