CREATE DATABASE testdb;
USE testdb;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('user','admin') DEFAULT 'user'
);
CREATE TABLE IF NOT EXISTS slots (
  id VARCHAR(10) PRIMARY KEY,
  status ENUM('available', 'booked', 'blocked') DEFAULT 'available',
  reserved_by VARCHAR(100) DEFAULT NULL
);
INSERT INTO slots (id) VALUES
('R1S1'),('R1S2'),('R1S3'),('R1S4'),('R1S5'),('R1S6'),('R1S7'),('R1S8'),
('R2S1'),('R2S2'),('R2S3'),('R2S4'),('R2S5'),('R2S6'),('R2S7'),('R2S8'),
('R3S1'),('R3S2'),('R3S3'),('R3S4'),('R3S5'),('R3S6'),('R3S7'),('R3S8'),('R3S9'),('R3S10'),
('R4S1'),('R4S2'),('R4S3'),('R4S4'),('R4S5'),('R4S6'),('R4S7'),('R4S8'),('R4S9'),('R4S10'),
('R5S1'),('R5S2'),('R5S3'),('R5S4'),('R5S5'),('R5S6'),('R5S7'),('R5S8'),
('R6S1'),('R6S2'),('R6S3'),('R6S4'),('R6S5'),('R6S6'),('R6S7'),('R6S8');
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slot_id VARCHAR(10) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  released_at DATETIME DEFAULT NULL,
  status ENUM('active', 'released') DEFAULT 'active'
);
select * from users;
select * from bookings;
select * from slots;