const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gotifyAPI", {
  getConfig: () => ipcRenderer.invoke("config:get"),
  saveConfig: (config) => ipcRenderer.invoke("config:save", config),
  getMessages: () => ipcRenderer.invoke("messages:get"),
  clearMessages: () => ipcRenderer.invoke("messages:clear"),
  getApplications: () => ipcRenderer.invoke("applications:get"),
  testConnection: (payload) => ipcRenderer.invoke("connection:test", payload),
  toggleConnection: () => ipcRenderer.invoke("connection:toggle"),
  getConnectionStatus: () => ipcRenderer.invoke("connection:getStatus"),
  getStoragePath: () => ipcRenderer.invoke("storage:getPath"),
  pickStoragePath: () => ipcRenderer.invoke("storage:pickPath"),
  setStoragePath: (nextPath) => ipcRenderer.invoke("storage:setPath", nextPath),
  onConnectionStatus: (callback) => {
    const listener = (_, payload) => callback(payload);
    ipcRenderer.on("connection-status", listener);
    return () => ipcRenderer.removeListener("connection-status", listener);
  },
  onNewMessage: (callback) => {
    const listener = (_, payload) => callback(payload);
    ipcRenderer.on("new-message", listener);
    return () => ipcRenderer.removeListener("new-message", listener);
  },
  onOpenSettings: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("open-settings", listener);
    return () => ipcRenderer.removeListener("open-settings", listener);
  },
  onMessagesCleared: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("messages-cleared", listener);
    return () => ipcRenderer.removeListener("messages-cleared", listener);
  }
});
