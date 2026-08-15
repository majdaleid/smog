import { app, shell, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { getSettings, setSettings } from './store'
import { createTrayIcon } from './icon'
import type { Settings } from '../shared/types'
import appIcon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function sendToRenderer(channel: string, ...args: unknown[]): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args)
  }
}

function toggleWindow(): void {
  if (!mainWindow) return
  if (mainWindow.isVisible() && mainWindow.isFocused()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

function createWindow(): void {
  const workArea = screen.getPrimaryDisplay().workArea
  const winW = 400
  const winH = 620
  const x = Math.max(workArea.x, workArea.x + workArea.width - winW - 24)
  const y = Math.max(workArea.y, workArea.y + 24)

  mainWindow = new BrowserWindow({
    width: winW,
    height: winH,
    minWidth: 340,
    minHeight: 420,
    x,
    y,
    transparent: true,
    frame: false,
    resizable: true,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    show: false,
    autoHideMenuBar: true,
    icon: appIcon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.setAlwaysOnTop(true, 'floating')
  mainWindow.on('ready-to-show', () => mainWindow?.show())

  // Open external links in the system browser, never inside the overlay.
  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url)
    return { action: 'deny' }
  })
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const devUrl = process.env['ELECTRON_RENDERER_URL']
    if (is.dev && devUrl && url.startsWith(devUrl)) return
    if (url.startsWith('file:')) return
    event.preventDefault()
    void shell.openExternal(url)
  })

  // HMR / load: use the vite dev server URL in dev, else the built file.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerShortcuts(): void {
  // Toggle window show/hide.
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    toggleWindow()
  })

  // Show + focus the Ask box.
  globalShortcut.register('CommandOrControl+Shift+A', () => {
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    }
    sendToRenderer('shortcut:ask')
  })

  // Toggle listening.
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    if (mainWindow && !mainWindow.isVisible()) mainWindow.show()
    sendToRenderer('shortcut:listen')
  })
}

function createTray(): void {
  tray = new Tray(createTrayIcon(16))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show / Hide', click: (): void => toggleWindow() },
    {
      label: 'Settings',
      click: (): void => {
        mainWindow?.show()
        mainWindow?.focus()
        sendToRenderer('tray:settings')
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: (): void => app.quit()
    }
  ])
  tray.setToolTip('smog')
  tray.setContextMenu(contextMenu)
  tray.on('click', (): void => toggleWindow())
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.smog.desktop')

  // Default open/close DevTools shortcuts + ignore reload in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC handlers ----------------------------------------------------------
  ipcMain.handle('settings:get', (): Settings => getSettings())
  ipcMain.handle('settings:set', (_e, patch): Settings => setSettings(patch ?? {}))
  ipcMain.handle('window:hide', (): void => {
    mainWindow?.hide()
  })
  ipcMain.handle('app:quit', (): void => app.quit())

  // Window + tray + shortcuts --------------------------------------------
  createWindow()
  createTray()
  registerShortcuts()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else mainWindow?.show()
  })
})

// Closing the window quits the app (MVP choice). Re-opening uses the tray
// while the app is still running, but the X intentionally exits smog.
app.on('window-all-closed', () => {
  app.quit()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
