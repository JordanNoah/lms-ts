import { DomainEvent } from './domainEvent';

type EventHandler = (event: DomainEvent) => void | Promise<void>;

export class EventBus {
  private listeners = new Map<string, EventHandler[]>();

  /**
   * Registra un listener para un tipo de evento
   */
  on(eventName: string, handler: EventHandler) {
    const handlers = this.listeners.get(eventName) || [];
    this.listeners.set(eventName, [...handlers, handler]);
  }

  /**
   * Emite un evento (creando una instancia de DomainEvent)
   */
  async emit(eventName: string, data: Record<string, any>): Promise<void> {
    const handlers = this.listeners.get(eventName) || [];
    const event = new DomainEvent(eventName, data);

    for (const handler of handlers) {
      await handler(event);
    }
  }
}

export const eventBus = new EventBus();
