const sqlite3 = require('sqlite3');
const fs = require('fs');

const db = new sqlite3.Database('./database.sqlite');

const sqlContent = fs.readFileSync('./database.sql', 'utf8');

db.exec(sqlContent, (err) => {
    if (err) {
        console.error('❌ Ошибка создания БД:', err);
    } else {
        console.log('✅ База данных создана успешно!');
        
        db.all("SELECT COUNT(*) as count FROM employees", (err, row) => {
            if (err) {
                console.error('Ошибка проверки:', err);
            } else {
                console.log(`✅ Загружено сотрудников: ${row[0].count}`);
            }
        });
        
        db.all("SELECT COUNT(*) as count FROM departments", (err, row) => {
            if (err) {
                console.error('Ошибка проверки:', err);
            } else {
                console.log(`✅ Загружено отделов: ${row[0].count}`);
            }
            db.close();
        });
    }
});