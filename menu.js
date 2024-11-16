const { 
    Menu, 
    app, 
    ipcMain, 
    BrowserWindow, 
    globalShortcut,
    dialog
} = require('electron');
const fs = require('fs');

function saveFile() {
    console.log('Saving the file');
    
    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send('editor-event', 'save');
}

function loadFile() {
    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Pick a markdown file',
        filters: [
            {
                name: 'Markdown files',
                extensions: ['md']
            },
            {
                name: 'Text files',
                extensions: ['txt']
            }
        ]
    };

    dialog.showOpenDialog(window, options).then((file) => {      
        if (file && file.filePaths.length > 0) {
            filename = file.filePaths[0];
            const content = fs.readFileSync(filename).toString();
            window.webContents.send('load', content);

        }
    });
}

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    loadFile();
                }
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => {
                    saveFile();
                }
            }
        ]
    },
    {
        label: 'Format',
        submenu: [
            {
                label: 'Toggle Bold',
                click: async () => {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('editor-event', 'toggle-bold');
                }
            }
        ]
    },
];

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })
}

if (process.env.DEBUG) {
    template.push({
        label: 'Debugging',
        submenu: [
            {
                label: 'Dev Tools',
                role: 'toggleDevTools'
            },
            {
                type: 'separator'
            },
            {
                role: 'reload',
                accelerator: 'Alt+R'
            }
        ]
    });
};

ipcMain.on('editor-reply', (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});


app.on('ready', () => {
    globalShortcut.register('CommandOrControl+S', () => {
        saveFile();
    });

    globalShortcut.register('CommandOrControl+O', () => {
        loadFile();
    });
});

ipcMain.on('save', (event, arg) => {
    console.log('Save file event received');
    console.log(arg);

    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save Markdown File',
        filters: [
            {
                name: 'MyFile',
                extensions: ['md']
            }
        ]
    };

    dialog.showSaveDialog(window, options).then((file) => {
        if (file) {
            filename = file.filePath;
            fs.writeFileSync(filename, arg);
        }
    });
});

const menu = Menu.buildFromTemplate(template);
module.exports = menu;