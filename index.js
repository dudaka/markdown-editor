const { app, BrowserWindow, ipcMain, Menu } = require('electron/main');
const path = require('node:path')
const menu = require('./menu');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.loadFile('index.html');
};

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

Menu.setApplicationMenu(menu);