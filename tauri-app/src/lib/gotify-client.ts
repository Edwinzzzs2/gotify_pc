import type { Config, ConnectionStatus, MessageItem } from "./types";

type Listener<T> = (payload: T) => void;

export class BrowserGotifyClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private connected = false;
  private config: Config | null = null;
  private reconnectDelay = 5000;
  private intentionalDisconnect = false;
  private lastErrorMessage = "";
  private seenMessageIds = new Set<number>();
  private seenMessageKeys = new Map<string, number>();
  private duplicateWindowMs = 1500;
  private statusListeners = new Set<Listener<ConnectionStatus>>();
  private messageListeners = new Set<Listener<MessageItem>>();

  onStatus(listener: Listener<ConnectionStatus>) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  onMessage(listener: Listener<MessageItem>) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  isConnected() {
    return this.connected;
  }

  start(config: Config) {
    this.clearReconnect();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.config = {
      ...config,
      serverUrl: String(config.serverUrl || "").trim(),
      clientToken: String(config.clientToken || "").trim(),
    };
    this.intentionalDisconnect = false;
    this.lastErrorMessage = "";
    this.connect();
  }

  stop() {
    this.intentionalDisconnect = true;
    this.clearReconnect();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
    }
    this.ws = null;
    this.setConnected(false, "已断开连接");
  }

  private connect() {
    if (!this.config?.serverUrl || !this.config?.clientToken) {
      this.setConnected(false, "未配置服务器地址或客户端令牌");
      return;
    }
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }
    this.setConnected(false, "正在连接...");
    const wsUrl = this.buildWsUrl(this.config.serverUrl, this.config.clientToken);
    try {
      const socket = new WebSocket(wsUrl);
      this.ws = socket;
      socket.addEventListener("open", () => {
        if (this.ws !== socket) {
          return;
        }
        this.lastErrorMessage = "";
        this.reconnectDelay = 5000;
        this.setConnected(true, "已连接");
      });
      socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(String(event.data || ""));
          if (typeof data === "object" && data) {
            const normalized = this.normalizeMessage(data as Record<string, unknown>);
            if (this.isDuplicate(normalized)) {
              return;
            }
            this.messageListeners.forEach((listener) => listener(normalized));
          }
        } catch {
          // ignore malformed messages
        }
      });
      socket.addEventListener("error", () => {
        if (this.ws !== socket) {
          return;
        }
        this.lastErrorMessage = "连接异常";
        this.setConnected(false, this.lastErrorMessage);
      });
      socket.addEventListener("close", (event) => {
        if (this.ws === socket) {
          this.ws = null;
        }
        const closeText = event.reason ? `连接已断开: ${event.code} ${event.reason}` : `连接已断开: ${event.code}`;
        const statusText = this.lastErrorMessage ? `${closeText} (${this.lastErrorMessage})` : closeText;
        this.setConnected(false, statusText);
        if (!this.intentionalDisconnect && this.config?.enableReconnect) {
          this.scheduleReconnect();
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      this.setConnected(false, `连接失败: ${message}`);
      if (!this.intentionalDisconnect && this.config?.enableReconnect) {
        this.scheduleReconnect();
      }
    }
  }

  private buildWsUrl(serverUrl: string, token: string) {
    const normalized = serverUrl.trim().replace(/\/+$/, "");
    if (normalized.startsWith("https://")) {
      return `${normalized.replace("https://", "wss://")}/stream?token=${encodeURIComponent(token)}`;
    }
    if (normalized.startsWith("http://")) {
      return `${normalized.replace("http://", "ws://")}/stream?token=${encodeURIComponent(token)}`;
    }
    return `ws://${normalized}/stream?token=${encodeURIComponent(token)}`;
  }

  private setConnected(connected: boolean, status: string) {
    this.connected = connected;
    this.statusListeners.forEach((listener) => listener({ connected, status }));
  }

  private scheduleReconnect() {
    this.clearReconnect();
    this.statusListeners.forEach((listener) =>
      listener({ connected: false, status: `重连中，${Math.floor(this.reconnectDelay / 1000)} 秒后重试` })
    );
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay + 1000, 30000);
      this.connect();
    }, this.reconnectDelay);
  }

  private clearReconnect() {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private normalizeMessage(message: Record<string, unknown>): MessageItem {
    return {
      id: Number(message.id || Date.now()),
      appid: Number(message.appid || 0),
      title: String(message.title || "新通知"),
      message: String(message.message || ""),
      priority: Number(message.priority || 0),
      date: (message.date as string | number | undefined) || new Date().toISOString(),
    };
  }

  private isDuplicate(message: MessageItem) {
    const now = Date.now();
    const messageId = Number(message.id || 0);
    if (Number.isFinite(messageId) && messageId > 0) {
      if (this.seenMessageIds.has(messageId)) {
        return true;
      }
      this.seenMessageIds.add(messageId);
      if (this.seenMessageIds.size > 5000) {
        this.seenMessageIds.clear();
        this.seenMessageIds.add(messageId);
      }
    }

    const key = `${Number(message.appid || 0)}|${String(message.title || "")}|${String(message.message || "")}`;
    const previousTime = this.seenMessageKeys.get(key);
    this.seenMessageKeys.set(key, now);
    if (this.seenMessageKeys.size > 500) {
      for (const [cacheKey, time] of this.seenMessageKeys.entries()) {
        if (now - time > this.duplicateWindowMs) {
          this.seenMessageKeys.delete(cacheKey);
        }
      }
    }
    return Boolean(previousTime && now - previousTime < this.duplicateWindowMs);
  }
}
