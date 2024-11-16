const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
  editorEventRegister: (callback) => {
    ipcRenderer.on('editor-event', (event, arg) => {   
      event.sender.send('editor-reply', `Received ${arg}`); 
      callback(arg);
    });
  },
  loadEventRegister: (callback) => {
    ipcRenderer.on('load', (event, content) => {
      if (content) {
        callback(content);
      }
    });
  },
  sendEventToEditor: (event, arg) => {
    ipcRenderer.send(event, arg);
  },
});



ipcRenderer.send('editor-reply', 'Page Loaded');