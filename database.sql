BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "departments" (
	"id"	INTEGER,
	"name"	VARCHAR(100) NOT NULL,
	"budget"	DECIMAL(10, 2),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "employees" (
	"id"	INTEGER,
	"full_name"	VARCHAR(200) NOT NULL,
	"hire_date"	DATE,
	"position"	VARCHAR(100),
	"salary_type"	VARCHAR(20) DEFAULT 'оклад',
	"hourly_rate"	DECIMAL(10, 2),
	"salary"	DECIMAL(10, 2),
	"grade"	INTEGER,
	"department_id"	INTEGER,
	"worked_hours"	INTEGER DEFAULT 160,
	"overtime_hours"	INTEGER DEFAULT 0,
	"overtime_rate"	DECIMAL(5, 2) DEFAULT 1.5,
	"bonus"	DECIMAL(10, 2) DEFAULT 0,
	"one_time_payment"	DECIMAL(10, 2) DEFAULT 0,
	"status"	VARCHAR(20),
	PRIMARY KEY("id")
);
INSERT INTO "departments" VALUES (1,'Бухгалтерия',45000);
INSERT INTO "departments" VALUES (2,'Финансы',32000);
INSERT INTO "departments" VALUES (3,'IT',68000);
INSERT INTO "departments" VALUES (4,'Продажи',52000);
INSERT INTO "departments" VALUES (5,'Производство',120000);
INSERT INTO "employees" VALUES (1,'Иванов Алексей Сергеевич','2023-01-15','Бухгалтер','оклад',NULL,2520,3,1,160,5,1.5,500,0,'активен');
INSERT INTO "employees" VALUES (2,'Петрова Елена Владимировна','2022-03-20','Главный бухгалтер','оклад',NULL,3195,5,1,160,8,1.5,1000,0,'активен');
INSERT INTO "employees" VALUES (3,'Сидоров Петр Николаевич','2024-01-10','Стажер','почасовая',8.33,NULL,1,1,140,0,1.5,0,0,'активен');
INSERT INTO "employees" VALUES (4,'Козлова Мария Игоревна','2023-11-05','Экономист','оклад',NULL,2850,4,2,160,3,1.5,300,0,'активен');
INSERT INTO "employees" VALUES (5,'Николаев Дмитрий Васильевич','2023-05-12','Аналитик','оклад',NULL,3120,4,2,170,10,1.5,700,500,'активен');
INSERT INTO "employees" VALUES (6,'Федоров Сергей Константинович','2022-08-22','Программист','оклад',NULL,3800,5,3,165,5,1.5,1200,0,'активен');
INSERT INTO "employees" VALUES (7,'Васильева Ольга Леонидовна','2023-09-14','Менеджер','оклад',NULL,2650,3,4,155,0,1.5,400,0,'активen');
COMMIT;
