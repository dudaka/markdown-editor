const { Menu, shell, ipcMain, BrowserWindow } = require('electron');

const template = [
    {
        label: 'Format',
        submenu: [
            {
                label: 'Toggle Bold',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send(
                        'editor-event',
                        'toggle-bold'
                    );
                }
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'About Editor Component',
                click() {
                    shell.openExternal('https://simplemde.com')
                }
            }
        ]
    },
    
]

if (process.env.DEBUG) {
    template.push({

        label: 'Debugging',
        submenu: [
            {
                role: 'toggleDevTools',
                label: 'Dev Tools'
            },
            {
                type: 'separator'
            },
            {
                role: 'reload',
                accelerator: 'Alt+R'
            }
        ]

    })
}

const menu = Menu.buildFromTemplate(template);

ipcMain.on('editor-reply', (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});

module.exports = menu;