import fs from 'fs/promises';
import path from 'path';

export async function loadPluginPermissions() {
  const pluginDir = path.join(__dirname, '..', '..', 'plugin');
  const entries = await fs.readdir(pluginDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const pluginName = entry.name;
    const permissionPath = path.join(pluginDir, pluginName, 'permissions.ts');

    // ✅ Comprobamos si el archivo existe ANTES de hacer import
    const fileExists = await fileExistsAsync(permissionPath);
    if (!fileExists) continue;

    try {
      const mod = await import(permissionPath);
      if (typeof mod.registerPermissions === 'function') {
        await mod.registerPermissions();
        console.log(`🔐 Permisos cargados desde plugin "${pluginName}"`);
      }
    } catch (err: any) {
      console.warn(`⚠️ Error al ejecutar permisos en plugin "${pluginName}": ${err.message}`);
    }
  }
}

async function fileExistsAsync(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
