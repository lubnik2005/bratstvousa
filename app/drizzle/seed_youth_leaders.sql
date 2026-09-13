-- Seed PNW Youth Leaders (idempotent by email).
-- Public may see name + city only; phone + email are server-side only.
-- Safe to re-run: uses INSERT ... WHERE NOT EXISTS on email.

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Vadim Neyman', '(360)644-4092', 'vadimneyman01@gmail.com', 'Vancouver: Hazel Dell', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'vadimneyman01@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Daniel Blustain', '(916)595-5126', 'Danielblushtein@yahoo.com', 'Vancouver: Central', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'Danielblushtein@yahoo.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Tim Mikhaylov', '(360)910-7662', 'timmikhaylov@live.com', 'Vancouver: Faith', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'timmikhaylov@live.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Vadim Verhovetchi', '(916)519-3596', 'Vverh.996@gmail.com', 'Vancouver: Moldovian', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'Vverh.996@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Anatolii Elenets', '(425)535-6150', '88elenets@gmail.com', 'Seattle', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = '88elenets@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Marian Legeza', '(425)539-2852', 'marianlegeza80@gmail.com', 'Everett', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'marianlegeza80@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Paul Stepanov', '(916)267-5491', 'Pashinka1516@gmail.com', 'Salem', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'Pashinka1516@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Jacob Goldinov', '(360)261-8364', 'Goldinov23@gmail.com', 'Skamakowa', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'Goldinov23@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Yarislav Sankov', '(503)750-3969', 'mailforyaro@gmail.com', 'Portland: Paul', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'mailforyaro@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Mikhail Danyuk', '(971)344-8035', '19thcitizen19@gmail.com', 'Portland: Golovin', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = '19thcitizen19@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Nickolai Semikin', '(360)296-0716', 'Nikolaysemikin45@gmail.com', 'Bellingham', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'Nikolaysemikin45@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'David Ryzhuk', '(986)777-0000', 'david.ryzhuk@gmail.com', 'Boise', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'david.ryzhuk@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Andrey Vasiliev', '(250) 224-5000', 'andreyvas0990@gmail.com', 'Fort St. John', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'andreyvas0990@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Vladimir Berchuk', '(780)876-8200', 'vovaberchuk2003@gmail.com', 'Grande Prarie', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'vovaberchuk2003@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Vadim Savich', '(413)977-2024', 'prostovadim@outlook.com', 'Kalispell', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'prostovadim@outlook.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Oleg Antonuik', '(385)985-5195', 'olegsaad@gmail.com', 'Salt Lake City', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'olegsaad@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Mark Novikov', '(509)760-1456', 'Mark_novik@yahoo.com', 'Soap Lake', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'Mark_novik@yahoo.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Alex Kiselev', '(509)993-3824', 'Omega2682@gmail.com', 'Spokane', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'Omega2682@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Vitaliy Cherkasov', '(509)386-1134', 'vitalicherkasov@gmail.com', 'Walla Walla', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'vitalicherkasov@gmail.com');

INSERT INTO youth_leaders (name, phone, email, city, active)
SELECT 'Viktor Damyan', '(907)315-7033', 'vdamyan@gmail.com', 'Wasilla', 1
WHERE NOT EXISTS (SELECT 1 FROM youth_leaders WHERE email = 'vdamyan@gmail.com');
