export interface HostMessage {
  type: string;
  payload?: Record<string, unknown>;
  source?: string;
}

export class HostBridge {
  private listeners = new Set<(message: HostMessage) => void>();

  async isPlugin(): Promise<boolean> {
    return window.parent !== window;
  }

  async notifyReady(): Promise<void> {
    this.postMessage({
      type: "helios.plugin.ready",
      payload: {
        plugin: "setup-manager",
        path: window.location.pathname,
      },
      source: "helios-setup-manager",
    });
  }

  async setContext(context: Record<string, unknown>): Promise<void> {
    this.postMessage({
      type: "helios.plugin.context",
      payload: context,
      source: "helios-setup-manager",
    });
  }

  async openRoute(route: string): Promise<void> {
    this.postMessage({
      type: "helios.plugin.route",
      payload: { route },
      source: "helios-setup-manager",
    });
  }

  subscribe(listener: (message: HostMessage) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  listen(): () => void {
    const handler = (event: MessageEvent<HostMessage>) => {
      const message = event.data;
      if (!message || typeof message !== "object" || !("type" in message)) {
        return;
      }

      this.listeners.forEach((listener) => listener(message));
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }

  private postMessage(message: HostMessage): void {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, "*");
    }
  }
}

export const host = new HostBridge();
