import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
app.use(cors());
app.use(express.json()); // Allows the server to handle JSON requests

const db = new Database('./database.sqlite');

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
`).run();

app.get('/reservations', (req, res) => {
    const rows = db.prepare('SELECT * FROM reservations').all();
    res.json(rows);
});

// POST route for saving reservation
app.post('/reservations', (req, res) => {
    const { id, name, date, count, contact, notes, deleted } = req.body;

    let query

    if (id) {
        query = `
            UPDATE reservations
            SET name = ?, date = ?, count = ?, contact = ?, notes = ?, deleted = ?
            WHERE id = ?;
        `;

        const stmt = db.prepare(query);

        try {
            stmt.run(name, date, count, contact, notes, deleted, id);
            res.status(201).json({ message: 'Reservation updated successfully!' });
        } catch (err) {
            res.status(500).json({ message: 'Error updating reservation', error: err.message });
        }
    } else {
        query = `INSERT INTO reservations (name, date, count, contact, notes, deleted) VALUES (?, ?, ?, ?, ?, ?)`;

        const stmt = db.prepare(query);

        try {
            stmt.run(name, date, count, contact, notes, deleted);
            res.status(201).json({ message: 'Reservation saved successfully!' });
        } catch (err) {
            res.status(500).json({ message: 'Error saving reservation', error: err.message });
        }
    }

});

app.listen(3001, () => {
    console.log('Backend is running on http://localhost:3001');
});