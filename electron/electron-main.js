import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const db = new Database('./database.sqlite')

db.prepare(`
    CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date DATE NOT NULL,
        count INTEGER NOT NULL,
        contact TEXT,
        notes TEXT,
        deleted BOOLEAN DEFAULT FALSE
    )
`).run()

// Set up IPC for database interactions
ipcMain.handle('getReservations', () => {
    return db.prepare('SELECT * FROM reservations').all()
})

ipcMain.handle('saveReservations', (event, reservation) => {
    const { id, name, date, count, contact, notes, deleted } = reservation
    const stringDate = new Date(date).toString();

    let query
    if (id) {
        query = `
            UPDATE reservations
            SET name = ?, date = ?, count = ?, contact = ?, notes = ?, deleted = ?
            WHERE id = ?;
        `
        const stmt = db.prepare(query)

        stmt.run(name, stringDate, count, contact, notes, deleted, id)
    } else {
        query = `INSERT INTO reservations (name, date, count, contact, notes, deleted) VALUES (?, ?, ?, ?, ?, ?)`
        const stmt = db.prepare(query)
        stmt.run(name, stringDate, count, contact, notes, deleted)
    }

    return { message: 'Reservation saved/updated successfully!' }
})

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        }
    })

    mainWindow.maximize()
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
    mainWindow.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})