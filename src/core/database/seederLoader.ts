import fs from 'fs/promises';
import path from 'path';

export async function loadAllSeeders() {
  const seedFiles: string[] = [];

  // Recolectar seeders del core
  seedFiles.push(...await collectSeedFiles(path.join(__dirname, '..')));

  // Recolectar seeders de plugins
  seedFiles.push(...await collectSeedFiles(path.join(__dirname, '..', '..', 'plugin')));

  // Separar los que contienen "permission" en el nombre
  const permissionSeeders = seedFiles.filter(f => f.toLowerCase().includes('permission'));
  const otherSeeders = seedFiles.filter(f => !f.toLowerCase().includes('permission'));

  // Ejecutar en orden
  for (const file of [...permissionSeeders, ...otherSeeders]) {
    await runSeeder(file);
  }
}

async function collectSeedFiles(baseDir: string): Promise<string[]> {
  const result: string[] = [];
  const entries = await fs.readdir(baseDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const seedDir = path.join(baseDir, entry.name, 'seed');
    if (!(await folderExists(seedDir))) continue;

    const files = await fs.readdir(seedDir);
    const seeds = files
      .filter(f => f.endsWith('.seed.ts'))
      .map(f => path.join(seedDir, f));

    result.push(...seeds);
  }

  return result;
}

async function runSeeder(filePath: string) {
  try {
    const module = await import(filePath);
    if (typeof module.default === 'function') {
      await module.default();
      console.log(`🌱 Seeder ejecutado: ${path.relative(process.cwd(), filePath)}`);
    } else {
      console.warn(`⚠️ ${filePath} no exporta una función default`);
    }
  } catch (err: any) {
    console.error(`❌ Error en seeder ${filePath}: ${err.message}`);
  }
}

async function folderExists(dir: string): Promise<boolean> {
  try {
    await fs.access(dir);
    return true;
  } catch {
    return false;
  }
}
