type EventHandler = (...args: any[]) => void;

export class EventBus {
  private listeners: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  off(event: string, handler: EventHandler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(handler => handler(...args));
  }
}

export const eventBus = new EventBus();
