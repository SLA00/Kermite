/* eslint-disable */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('debugConfig', {
  isDevelopment: false,
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  ...ipcRenderer,
  on: ipcRenderer.on.bind(ipcRenderer),
  removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
});

contextBridge.exposeInMainWorld('process', {
  env: { NODE_ENV: 'development' },
});
