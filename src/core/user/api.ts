import { PluginAPI } from '@/core/http/pluginApi';
import { sequelize } from '@/core/database/sequelize';

const User = sequelize.models.User;

const userPlugin: PluginAPI = {
  prefix: '/user',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: async (c) => {
        const users = await User.findAll();
        return c.json(users);
      }
    }
  ]
};

export default userPlugin;
