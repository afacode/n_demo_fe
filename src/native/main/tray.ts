import { Menu, Tray, app } from 'electron'
import { resolve } from 'node:path'

export function createTray(window: any): void {
  const path = resolve(__dirname, './logo.png')
  const tray = new Tray(path)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'exit',
      role: 'quit',
      click: () => {
        window.quit()
      }
    },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip(app.name)
  tray.setContextMenu(contextMenu)

  tray.on('right-click', () => {

  })
}
