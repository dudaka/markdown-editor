const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
  editorEventRegister: (callback) => {
    ipcRenderer.on('editor-event', (event, arg) => {   
      event.sender.send('editor-reply', `Received ${arg}`); 
      if (arg === 'toggle-bold') {
        callback(arg);
      }
    });
  }
});

ipcRenderer.send('editor-reply', 'Page Loaded');