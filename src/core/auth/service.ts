import { sign } from 'hono/jwt'
import UserService from '../user/service'
import { LoginEntity } from './entities'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

// Blacklist en memoria (se puede pasar a Redis luego)
const tokenBlacklist = new Set<string>()

export default class AuthService {
  /**
   * Inicia sesión sin encriptación (solo para desarrollo)
   */
  static async login(identifier: string, password: string): Promise<LoginEntity> {
    const user = await new UserService().getByUsername(identifier)

    if (!user) throw new Error('Usuario no encontrado')

    if (user.password !== password) {
      throw new Error('Contraseña incorrecta')
    }

    const token = await sign(
      {
        sub: user.id.toString(),
        username: user.username,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 // ⏱ exp en segundos
      },
      JWT_SECRET,        // 🔑 clave secreta
      'HS256'            // 🔒 algoritmo (opcional, pero válido aquí)
    )


    const permissions: string[] = user.roles
      .flatMap(role => role.permissions?.map(p => p.abbreviation) || [])

    const uniquePermissions = [...new Set(permissions)]

    return new LoginEntity(token, uniquePermissions, user, user.roles.map(role => role.shortName))
  }

  /**
   * Marca un token como revocado
   */
  static async logout(token: string): Promise<void> {
    tokenBlacklist.add(token)
  }

  /**
   * Verifica si un token fue revocado
   */
  static isTokenBlacklisted(token: string): boolean {
    return tokenBlacklist.has(token)
  }
}
