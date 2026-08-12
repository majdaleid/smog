import type { Settings } from '../shared/types'

export interface SmogAPI {
  settings: {
    get: () => Promise<Settings>
    set: (patch: Partial<Settings>) => Promise<Settings>
  }
  window: { hide: () => Promise<void> }
  app: { quit: () => Promise<void> }
  onShortcut: (cb: (name: 'toggle' | 'ask' | 'listen') => void) => void
  onOpenSettings: (cb: () => void) => void
}

declare global {
  interface Window {
    smog: SmogAPI
  }
}
