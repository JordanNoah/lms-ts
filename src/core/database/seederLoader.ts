import fs from 'fs/promises';
import path from 'path';

export async function loadSeeders() {
  // Cargar seeders del core
  await loadSeedFiles(path.join(__dirname, '..')); // src/core

  // Cargar seeders de plugins
  await loadSeedFiles(path.join(__dirname, '..', '..', 'plugin'));
}

async function loadSeedFiles(baseDir: string) {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const seedPath = path.join(baseDir, entry.name, 'seed.ts');
    try {
      const fileExists = await exists(seedPath);
      if (!fileExists) continue;

      const module = await import(seedPath);
      if (typeof module.default === 'function') {
        await module.default(); // ✅ ejecuta el seeder por defecto
        console.log(`🌱 Seeder ejecutado: ${entry.name}`);
      }
    } catch (err: any) {
      console.warn(`⚠️ Error en seeder "${entry.name}": ${err.message}`);
    }
  }
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
