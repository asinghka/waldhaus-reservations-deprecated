const { ipcRenderer, contextBridge } = require('electron');

// Expose safe methods to renderer (React)
contextBridge.exposeInMainWorld('electron', {
    getReservations: () => ipcRenderer.invoke('getReservations'),
    saveReservation: (reservation) => ipcRenderer.invoke('saveReservations', reservation)
})