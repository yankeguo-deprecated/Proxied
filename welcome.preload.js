const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openWebsite: (options) => ipcRenderer.send('open-website', options)
})