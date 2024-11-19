const { app, BrowserWindow, ipcMain, Menu } = require('electron/main');
const path = require('node:path')
const menu = require('./menu');
// const { updateElectronApp, UpdateSourceType } = require('update-electron-app')

// updateElectronApp({
//   updateSource: {
//     type: UpdateSourceType.ElectronPublicUpdateService,
//     repo: 'https://github.com/dudaka/markdown-editor.git'
//   },
//   updateInterval: '1 hour',
//   logger: require('electron-log')
// })
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
log.transports.file.level = 'info';
autoUpdater.logger = log;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.loadFile('index.html');

  // Check for updates when the app is ready
  autoUpdater.checkForUpdatesAndNotify();
};

// Auto-updater event listeners
autoUpdater.on('update-available', () => {
  log.info('Update available');
  // mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded');
  // mainWindow.webContents.send('update_downloaded');
});

app.whenReady().then(() => {
  ipcMain.handle('ping', async (event, arg) => {
    console.log('ping');
    return 'pong';
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('restart_app', () => {
  // autoUpdater.quitAndInstall();
});

Menu.setApplicationMenu(menu);