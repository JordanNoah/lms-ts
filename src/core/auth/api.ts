import { PluginAPI } from '@/core/http/pluginApi'
import AuthService from './service'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { authMiddleware } from './middleware'
import { Context } from 'hono'
import UserService from '../user/service'

const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1)
})

const authRoutes: PluginAPI = {
  prefix: '/auth',
  routes: [
    {
      method: 'POST',
      path: '/login',
      middleware: [zValidator('json', loginSchema)],
      handler: async (c) => {
        const { identifier, password } = await c.req.json()

        try {
          const token = await AuthService.login(identifier, password)
          return c.json(token)
        } catch (err: any) {
          return c.json({ error: err.message }, 401)
        }
      }
    },
    {
      method: 'POST',
      path: '/logout',
      handler: async (c) => {
        const authHeader = c.req.header('authorization')
        const token = authHeader?.split(' ')[1]

        if (!token) return c.json({ error: 'Token no proporcionado' }, 400)

        await AuthService.logout(token)
        return c.json({ message: 'Sesión cerrada correctamente' })
      }
    },
    {
      method: 'GET',
      path: '/me',
      middleware: [authMiddleware],
      handler: async (c: Context) => {
        const userout = c.get('user')

        const user = await new UserService().getByUsername(userout.username)
        
        if (!user) return c.json({ error: 'Usuario no encontrado' }, 404)
        return c.json({
          user: user,
          roles: user.roles.map((role) => role.shortName),
          permissions: user.roles.flatMap((role) => role.permissions)
        }, 200);
      }
    }
  ]
}

export default authRoutes
