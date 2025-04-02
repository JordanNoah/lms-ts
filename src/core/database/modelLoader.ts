import fs from 'fs/promises';
import path from 'path';
import { sequelize } from './sequelize';
import { Dirent } from 'fs';

export async function loadCoreModels() {
  const coreDir = path.join(__dirname, '..');
  const entries = await fs.readdir(coreDir, { withFileTypes: true });
  await loadModelFolders(coreDir, entries);
}

export async function loadPluginModels() {
  const pluginDir = path.join(__dirname, '..', '..', 'plugin');
  const entries = await fs.readdir(pluginDir, { withFileTypes: true });
  await loadModelFolders(pluginDir, entries);
}

async function loadModelFolders(baseDir: string, entries: Dirent[]) {
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    
    const modelDir = path.join(baseDir, entry.name, 'model');
    const modelFiles = await getModelFiles(modelDir);

    // 1. Cargar todos los modelos (*.model.ts)
    for (const file of modelFiles) {
      try {
        await import(file); // Ejecuta Model.init()
        console.log(`🧬 Modelo cargado desde ${entry.name}/model/${path.basename(file)}`);
      } catch (err: any) {
        console.warn(`⚠️  Error al cargar modelo "${file}": ${err.message}`);
      }
    }

    // 2. Ejecutar index.ts para definir relaciones
    const indexPath = path.join(modelDir, 'index.ts');
    if (await fileExists(indexPath)) {
      try {
        await import(indexPath);
        console.log(`🔗 Relaciones definidas en ${entry.name}/model/index.ts`);
      } catch (err: any) {
        console.warn(`⚠️  Error al ejecutar relaciones de "${entry.name}": ${err.message}`);
      }
    }
  }
}

async function getModelFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    return files
      .filter((f) =>
        f.isFile() &&
        f.name.endsWith('.ts') &&
        f.name !== 'index.ts'
      )
      .map((f) => path.join(dir, f.name));
  } catch {
    return []; // Si no existe la carpeta, retorna vacío
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
