// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const createWelcomeWindow = () => {
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
    if (process.platform !== 'darwin') app.quit()
})
