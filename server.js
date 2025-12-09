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
    const { month, year } = req.query;
    
    if (!month || !year) {
        return res.status(400).json({ error: 'Требуются параметры month и year' });
    }
    
    const query = `
        SELECT e.*, 
               m.worked_hours,
               m.overtime_hours,
               m.bonus,
               m.one_time_payment
        FROM employees e
        LEFT JOIN monthly_data m ON e.id = m.employee_id 
            AND m.month = ? AND m.year = ?
        ORDER BY e.id
    `;
    
    db.all(query, [month, year], (err, rows) => {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).json({ error: err.message });
        }
        
        const employeesWithDefaults = rows.map(emp => {
            if (!emp.worked_hours) {
                return {
                    ...emp,
                    worked_hours: 160,
                    overtime_hours: 0,
                    bonus: 0,
                    one_time_payment: 0
                };
            }
            return emp;
        });
        
        res.json(employeesWithDefaults);
    });
});

app.get('/employees/all', (req, res) => {
    db.all("SELECT * FROM employees ORDER BY id", (err, rows) => {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/departments', (req, res) => {
    db.all("SELECT * FROM departments ORDER BY id", (err, rows) => {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/monthly-data', (req, res) => {
    const { employee_id, month, year } = req.query;
    
    let query = "SELECT * FROM monthly_data WHERE 1=1";
    const params = [];
    
    if (employee_id) {
        query += " AND employee_id = ?";
        params.push(employee_id);
    }
    
    if (month) {
        query += " AND month = ?";
        params.push(month);
    }
    
    if (year) {
        query += " AND year = ?";
        params.push(year);
    }
    
    query += " ORDER BY year DESC, month DESC";
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/monthly-data', (req, res) => {
    const { employee_id, month, year, worked_hours, overtime_hours, bonus, one_time_payment } = req.body;
    
    if (!employee_id || !month || !year) {
        return res.status(400).json({ error: 'Требуются employee_id, month и year' });
    }
    
    const query = `
        INSERT OR REPLACE INTO monthly_data 
        (employee_id, month, year, worked_hours, overtime_hours, bonus, one_time_payment) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [employee_id, month, year, worked_hours || 160, overtime_hours || 0, bonus || 0, one_time_payment || 0], 
        function(err) {
            if (err) {
                console.error('Ошибка БД:', err);
                return res.status(500).json({ error: err.message });
            }
            
            res.json({ 
                message: 'Данные сохранены', 
                id: this.lastID,
                changes: this.changes 
            });
        }
    );
});

app.put('/monthly-data/:id', (req, res) => {
    const { id } = req.params;
    const { worked_hours, overtime_hours, bonus, one_time_payment } = req.body;
    
    db.run(
        'UPDATE monthly_data SET worked_hours = ?, overtime_hours = ?, bonus = ?, one_time_payment = ? WHERE id = ?',
        [worked_hours, overtime_hours, bonus, one_time_payment, id],
        function(err) {
            if (err) {
                console.error('Ошибка БД:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Данные обновлены', changes: this.changes });
        }
    );
});

app.delete('/monthly-data/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM monthly_data WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Данные удалены', changes: this.changes });
    });
});

app.get('/available-months', (req, res) => {
    const query = `
        SELECT DISTINCT year, month 
        FROM monthly_data 
        ORDER BY year DESC, month DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('✅ Сервер запущен на http://localhost:3000');
    console.log('📊 Доступные месяцы: Декабрь 2024, Январь 2025');
});