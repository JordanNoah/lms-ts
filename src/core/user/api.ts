import { PluginAPI } from '@/core/http/pluginApi';
import { sequelize } from '@/core/database/sequelize';
import UserService from './service';

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
    },
    {
      method: 'POST',
      path: '/admin',
      handler: async (c) => {
        try {
          const user = await new UserService().createAdmin()
          return c.json(user);
        } catch (error: any) {
          return c.json({ error: error.message }, 500);
        }
      }
    }
  ]
};

export default userPlugin;
