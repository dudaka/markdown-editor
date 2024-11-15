const { Menu, shell, app, ipcMain, BrowserWindow } = require('electron');

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

const menu = Menu.buildFromTemplate(template);
module.exports = menu;