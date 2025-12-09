BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "departments" (
    "id"    INTEGER,
    "name"  VARCHAR(100) NOT NULL,
    "budget"    DECIMAL(10, 2),
    PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "employees" (
    "id"    INTEGER,
    "full_name" VARCHAR(200) NOT NULL,
    "hire_date" DATE,
    "position"  VARCHAR(100),
    "salary_type"   VARCHAR(20) DEFAULT 'оклад',
    "hourly_rate"   DECIMAL(10, 2),
    "salary"    DECIMAL(10, 2),
    "grade" INTEGER,
    "department_id" INTEGER,
    "overtime_rate" DECIMAL(5, 2) DEFAULT 1.5,
    "status"    VARCHAR(20),
    PRIMARY KEY("id"),
    FOREIGN KEY("department_id") REFERENCES departments("id")
);

CREATE TABLE IF NOT EXISTS "monthly_data" (
    "id"    INTEGER,
    "employee_id"   INTEGER,
    "month" INTEGER NOT NULL,
    "year"  INTEGER NOT NULL,
    "worked_hours"  INTEGER DEFAULT 160,
    "overtime_hours"    INTEGER DEFAULT 0,
    "bonus" DECIMAL(10, 2) DEFAULT 0,
    "one_time_payment"  DECIMAL(10, 2) DEFAULT 0,
    PRIMARY KEY("id"),
    FOREIGN KEY("employee_id") REFERENCES employees("id"),
    UNIQUE(employee_id, month, year)
);

INSERT INTO "departments" VALUES (1,'Бухгалтерия',45000);
INSERT INTO "departments" VALUES (2,'Финансы',32000);
INSERT INTO "departments" VALUES (3,'IT',68000);
INSERT INTO "departments" VALUES (4,'Продажи',52000);
INSERT INTO "departments" VALUES (5,'Производство',120000);

INSERT INTO "employees" VALUES 
(1,'Иванов Алексей Сергеевич','2023-01-15','Бухгалтер','оклад',NULL,2520,3,1,1.5,'активен'),
(2,'Петрова Елена Владимировна','2022-03-20','Главный бухгалтер','оклад',NULL,3195,5,1,1.5,'активен'),
(3,'Сидоров Петр Николаевич','2024-01-10','Стажер','почасовая',8.33,NULL,1,1,1.5,'активен'),
(4,'Козлова Мария Игоревна','2023-11-05','Экономист','оклад',NULL,2850,4,2,1.5,'активен'),
(5,'Николаев Дмитрий Васильевич','2023-05-12','Аналитик','оклад',NULL,3120,4,2,1.5,'активен'),
(6,'Федоров Сергей Константинович','2022-08-22','Программист','оклад',NULL,3800,5,3,1.5,'активен'),
(7,'Васильева Ольга Леонидовна','2023-09-14','Менеджер','оклад',NULL,2650,3,4,1.5,'активен');

INSERT INTO "monthly_data" VALUES 
(1,1,12,2024,160,5,500,0),
(2,2,12,2024,160,8,1000,0),
(3,3,12,2024,140,0,0,0),
(4,4,12,2024,160,3,300,0),
(5,5,12,2024,170,10,700,500),
(6,6,12,2024,165,5,1200,0),
(7,7,12,2024,155,0,400,0),
(8,1,1,2025,160,2,300,0),
(9,2,1,2025,160,4,800,0),
(10,3,1,2025,150,0,0,0),
(11,4,1,2025,160,1,250,0),
(12,5,1,2025,165,8,600,300),
(13,6,1,2025,160,3,1000,0),
(14,7,1,2025,160,0,350,0);

COMMIT;