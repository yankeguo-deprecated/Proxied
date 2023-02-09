// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, Menu} = require('electron')
const path = require('path')

const isMac = process.platform === 'darwin'

function createWelcomeWindow() {
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 500,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "welcome.preload.js")
        }
    })

    mainWindow.loadFile('welcome.html')
}

function createMenu() {

    const template = [
        ...(isMac ? [{role: 'appMenu'}] : []),
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Window',
                    accelerator: 'CmdOrCtrl+N',
                    click() {
                        createWelcomeWindow()
                    }
                },
                {type: 'separator'},
                (isMac ? {role: 'close'} : {role: 'quit'})
            ]
        },
        {role: 'editMenu'},
        {role: 'viewMenu'},
        {role: 'windowMenu'},
    ]

    return Menu.buildFromTemplate(template)
}

Menu.setApplicationMenu(createMenu())

app.whenReady().then(() => {
    createWelcomeWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWelcomeWindow()
        }
    })

    ipcMain.on("open-website", function (e, options) {
        const window = new BrowserWindow({
            width: 800,
            height: 600,
        })
        window.webContents.session.setProxy(options.proxyOptions).then(function () {
            window.loadURL(options.url)
        }).catch(function (err) {
        })
    });
})

app.on('window-all-closed', () => {
    if (!isMac) app.quit()
})
