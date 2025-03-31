import { MiddlewareHandler } from "hono";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: (ctx: any) => Promise<any> | any;
  middleware?: MiddlewareHandler[]; // 👈 esta línea es la clave
}
