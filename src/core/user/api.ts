import { PluginAPI } from '@/core/http/pluginApi';
import UserService from './service';
import PaginationDto from '@/shared/pagination.dto';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod'
import UserDto from './dto/user.dto';

const userSchema = z.object({
  names: z.string().min(3).max(50),
  surnames: z.string().min(3).max(50),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(50),
});

const userPlugin: PluginAPI = {
  prefix: '/user',
  routes: [
    {
      method: 'POST',
      path: '/list',
      handler: async (c) => {
        try {
          const { page, limit, sorting, search } = await c.req.json();
          const paginationDto = new PaginationDto(limit, page, sorting, search)
          const users = await new UserService().getPagination(paginationDto);
          return c.json(users);
        } catch (error: any) {
          return c.json({ error: error.message }, 500);
        }
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
    },
    {
      method: 'POST',
      path: '/',
      middleware: [zValidator('json', userSchema)],
      handler: async (c) => {
        try {
          const [error, userDto] = UserDto.postCreate(await c.req.json())
          if (error) return c.json({ error }, 400);
          const user = await new UserService().createUser(userDto!);
          return c.json(user, 201);
        } catch (error: any) {
          return c.json({ error: error.message }, 500);
        }
      }
    },
    {
      method: 'GET',
      path: '/:id',
      handler: async (c) => {
        const id = Number(c.req.param('id'))
    
        if (isNaN(id)) {
          return c.json({ error: 'ID inválido' }, 400)
        }
    
        try {
          const user = await new UserService().getUserById(id)
          if (!user) return c.json({ error: 'Usuario no encontrado' }, 404)
    
          return c.json(user)
        } catch (error: any) {
          return c.json({ error: error.message }, 500)
        }
      }
    }
  ]
};

export default userPlugin;
