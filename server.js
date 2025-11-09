const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

app.get('/overtime', (req, res) => {
    db.all("SELECT * FROM employees WHERE overtime_hours > 0", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/net-salary', (req, res) => {
    db.all(`
        SELECT id, full_name, position, salary_type, 
               -- Расчет общей зарплаты
               CASE 
                   WHEN salary_type = 'оклад' THEN salary + bonus + one_time_payment
                   WHEN salary_type = 'почасовая' THEN (hourly_rate * worked_hours) + bonus + one_time_payment
               END as total_salary,
               -- Зарплата после налога (12%)
               CASE 
                   WHEN salary_type = 'оклад' THEN (salary + bonus + one_time_payment) * 0.88
                   WHEN salary_type = 'почасовая' THEN ((hourly_rate * worked_hours) + bonus + one_time_payment) * 0.88
               END as net_salary,
               -- Сумма налога (12%)
               CASE 
                   WHEN salary_type = 'оклад' THEN (salary + bonus + one_time_payment) * 0.12
                   WHEN salary_type = 'почасовая' THEN ((hourly_rate * worked_hours) + bonus + one_time_payment) * 0.12
               END as tax_amount
        FROM employees
    `, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(3000, () => console.log('API запущен на порту 3000'));