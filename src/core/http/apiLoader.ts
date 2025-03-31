import path from 'path';
import fs from 'fs/promises';
import { Hono } from 'hono';
import type { PluginAPI } from '@/core/http/pluginApi';
import { Dirent } from 'fs';

export async function loadCoreApis(app: Hono) {
  const pluginDir = path.join(__dirname, '..');
  const entries = await fs.readdir(pluginDir, { withFileTypes: true });
  await loadFunction(pluginDir, entries, app);  
}

export async function loadPluginApis(app: Hono) {
  const pluginDir = path.join(__dirname, '..', '..', 'plugin');
  const entries = await fs.readdir(pluginDir, { withFileTypes: true });
  await loadFunction(pluginDir, entries, app);
}

async function loadFunction(pluginDir: string, entries: Dirent[], app: Hono) {
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const pluginName = entry.name;
    const apiPath = path.join(pluginDir, pluginName, 'api.ts');

    if (!(await fileExists(apiPath))) continue;

    try {
      const mod = await import(apiPath);
      const plugin: PluginAPI = mod.default;

      if (!plugin || typeof plugin !== 'object' || !plugin.prefix || !plugin.routes) {
        console.warn(`⚠️  El plugin "${pluginName}" no tiene estructura válida PluginAPI`);
        continue;
      }

      const router = new Hono();

      for (const route of plugin.routes) {
        const method = route.method.toLowerCase();
        const middleware = route.middleware || [];

        // @ts-ignore
        router[method](route.path, ...middleware, route.handler);
      }

      app.route(plugin.prefix, router);
      console.log(`🚀 API montada desde plugin "${pluginName}" en ruta "${plugin.prefix}"`);
    } catch (err: any) {
      console.warn(`⚠️  Error al cargar API de plugin "${pluginName}": ${err.message}`);
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
