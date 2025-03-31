import { MiddlewareHandler } from 'hono';
import { verify } from 'jsonwebtoken';
import { roleHasPermission, roleHasAnyPermission } from './service';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

/**
 * Middleware que requiere autenticación con token JWT
 */
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = verify(token, JWT_SECRET) as any;

    if (!payload?.role) {
      return c.json({ error: 'Role not found in token' }, 403);
    }

    // Puedes guardar el payload en el contexto
    c.set('user', payload);
    await next();
  } catch (err) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};

/**
 * Middleware para requerir un permiso específico
 */
export function requirePermission(permission: string): MiddlewareHandler {
  return async (c, next) => {
    const user = c.get('user');
    if (!user?.role) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allowed = await roleHasPermission(user.role, permission);
    if (!allowed) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await next();
  };
}

/**
 * Middleware para requerir al menos uno de varios permisos
 */
export function requireAnyPermission(permissions: string[]): MiddlewareHandler {
  return async (c, next) => {
    const user = c.get('user');
    if (!user?.role) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allowed = await roleHasAnyPermission(user.role, permissions);
    if (!allowed) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await next();
  };
}
