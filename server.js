const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    const sqlContent = fs.readFileSync('./database.sql', 'utf8');
    const commands = sqlContent.split(';').filter(cmd => cmd.trim());
    
    commands.forEach(command => {
        db.run(command, (err) => {
            if (err) console.log('SQL ошибка:', err.message);
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/employees', (req, res) => {
    db.all("SELECT * FROM employees", (err, rows) => {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/departments', (req, res) => {
    db.all("SELECT * FROM departments", (err, rows) => {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('✅ Сервер запущен на http://localhost:3000');
});