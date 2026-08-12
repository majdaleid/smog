import { contextBridge, ipcRenderer } from 'electron'

/**
 * Surface exposed to the renderer as `window.smog`. Everything goes through the
 * context bridge with contextIsolation enabled.
 */
const smog = {
  settings: {
    get: (): Promise<unknown> => ipcRenderer.invoke('settings:get'),
    set: (patch: Record<string, unknown>): Promise<unknown> =>
      ipcRenderer.invoke('settings:set', patch ?? {})
  },
  window: {
    hide: (): Promise<void> => ipcRenderer.invoke('window:hide')
  },
  app: {
    quit: (): Promise<void> => ipcRenderer.invoke('app:quit')
  },
  onShortcut: (cb: (name: 'toggle' | 'ask' | 'listen') => void): void => {
    ipcRenderer.on('shortcut:ask', () => cb('ask'))
    ipcRenderer.on('shortcut:listen', () => cb('listen'))
    ipcRenderer.on('shortcut:toggle', () => cb('toggle'))
  },
  onOpenSettings: (cb: () => void): void => {
    ipcRenderer.on('tray:settings', () => cb())
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('smog', smog)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (defined in the dts when context isolation is off)
  window.smog = smog
}
