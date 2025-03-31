import { RouteDefinition } from './route';

export interface PluginAPI {
  prefix: string;
  routes: RouteDefinition[];
}
