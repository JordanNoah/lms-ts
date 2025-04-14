import { MiddlewareHandler } from 'hono'
import { verify } from 'hono/jwt'
import AuthService from './service'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const auth = c.req.header('authorization')
  const token = auth?.split(' ')[1]

  if (!token) return c.json({ error: 'Token requerido' }, 401)
  if (AuthService.isTokenBlacklisted(token)) {
    return c.json({ error: 'Token revocado (logout)' }, 401)
  }

  try {
    const payload = await verify(token, JWT_SECRET)
    c.set('user', payload)
    await next()
  } catch {
    return c.json({ error: 'Token inválido' }, 401)
  }
}
