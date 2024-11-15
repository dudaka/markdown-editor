const { 
    Menu, 
    app, 
    ipcMain, 
    BrowserWindow, 
    globalShortcut,
    dialog
} = require('electron');
const fs = require('fs');

const template = [
    {
        // role: 'help',
        // submenu: [
        //     {
        //         label: 'Abou Editor Component',
        //         click: async () => {
        //             await shell.openExternal('https://simplemde.com');
        //         }
        //     }
        // ]

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
        console.log('Saving the file');
        const window = BrowserWindow.getFocusedWindow();
        window.webContents.send('editor-event', 'save');
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