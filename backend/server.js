import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
app.use(cors());
app.use(express.json()); // Allows the server to handle JSON requests

const db = new Database('./database.sqlite');

// TODO: vorbestellung, anmerkungen, tischnummer
db.prepare(`
    CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        date TEXT,
        time TEXT,
        count INTEGER,
        contact TEXT
    )
`).run();

app.get('/reservations', (req, res) => {
    const rows = db.prepare('SELECT * FROM reservations').all();
    res.json(rows);
});

// POST route for saving reservation
app.post('/reservations', (req, res) => {
    const { name, date, time, count, contact } = req.body;

    const query = `INSERT INTO reservations (name, date, time, count, contact) VALUES (?, ?, ?, ?, ?)`;
    const stmt = db.prepare(query);

    try {
        stmt.run(name, date, time, count, contact);
        console.log('Reservation saved successfully.');
        res.status(201).json({ message: 'Reservation saved successfully!' });
    } catch (err) {
        console.error('Error saving reservation:', err);
        res.status(500).json({ message: 'Error saving reservation', error: err.message });
    }
});

app.listen(3001, () => {
    console.log('Backend is running on http://localhost:3001');
});