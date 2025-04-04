// src/app.ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import { sequelize } from './database/sequelize';
import { loadPluginPermissions } from './access/permissionLoader'; // si lo creas
import { loadCoreEvents, loadPluginEvents } from './events/eventLoader';
import { loadCoreModels, loadPluginModels } from './database/modelLoader';
import { loadCoreApis, loadPluginApis } from './http/apiLoader';
import { loadAllSeeders } from './database/seederLoader';
import UserService from './user/service';

export default class Server {
  public async start() {
    const app = new Hono();    

    // 🗃️ 2. Carga modelos y sincroniza
    await loadCoreModels()
    await loadPluginModels()
    await sequelize.sync({force: false});
    await loadAllSeeders(); // Carga seeders del core y plugins

    // 🛡️ 3. Registra permisos de plugins (opcional, si usas permission-loader)
    if (loadPluginPermissions) await loadPluginPermissions();

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


  public async obligatoryToFunction() {
    // Esto es necesario para que la app funcione correctamente
    // 1.- Tiene que haber un usuario con rol admin en la base de datos
    let role = await new UserService().getRoleByShortName("admin")
    if (!role) {
      throw new Error("✖️ Admin role not found")
    }
    const adminUser = await new UserService().getRoleById(role.id)
    if (!adminUser) {
      throw new Error("✖️ Admin user not found")
    } 
  }
}
