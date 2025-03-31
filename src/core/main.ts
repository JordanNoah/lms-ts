// src/app.ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import { sequelize } from './database/sequelize';
import { defineAccessModels } from './access/model';
import { seedAccessControl } from './access/seed';

import { loadPluginPermissions } from './access/permissionLoader'; // si lo creas
import { loadCoreEvents, loadPluginEvents } from './events/eventLoader';
import { loadCoreModels, loadPluginModels } from './database/modelLoader';
import { loadCoreApis, loadPluginApis } from './http/apiLoader';

export default class Server {
  public async start() {
    const app = new Hono();

    // 🧬 1. Define modelos globales (core)
    defineAccessModels(sequelize);

    // 🗃️ 2. Carga modelos y sincroniza
    await loadCoreModels()
    await loadPluginModels()
    await sequelize.sync();

    // 🛡️ 3. Registra permisos de plugins (opcional, si usas permission-loader)
    if (loadPluginPermissions) await loadPluginPermissions();

    // 🔐 4. Asigna todos los permisos existentes al rol admin
    await seedAccessControl();

    // 📦 5. Carga eventos y rutas API de los plugins
    await loadCoreEvents();
    await loadPluginEvents();

    await loadCoreApis(app);
    await loadPluginApis(app);
    // 🚀 6. Inicia el servidor
    serve({ fetch: app.fetch, port: 3000 }, (info) => {
      console.log(`✅ Server started on http://localhost:${info.port}`);
    });
  }
}
