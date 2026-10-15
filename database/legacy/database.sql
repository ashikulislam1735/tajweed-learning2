-- Tajweed Learning Centre - Database Schema
-- InfinityFree এ MySQL ডাটাবেস তৈরি করার পর এই পুরো ফাইলটা phpMyAdmin এর SQL ট্যাবে Import করুন
-- গুরুত্বপূর্ণ: Import করার সময় নিচের দিকে "Character set of the file" অপশনে utf8mb4 সিলেক্ট করুন

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ডিফল্ট এডমিন: username = admin, password = admin123
-- (README.txt এ পাসওয়ার্ড বদলানোর নিয়ম দেওয়া আছে, প্রথম লগিনের পরই বদলে ফেলুন)
INSERT INTO admins (username, password) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(150),
    qualification VARCHAR(255),
    experience VARCHAR(100),
    bio TEXT,
    photo VARCHAR(255) DEFAULT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    level_no INT DEFAULT 0,
    fee VARCHAR(100),
    duration VARCHAR(100),
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(150) NOT NULL,
    age VARCHAR(20),
    phone VARCHAR(50) NOT NULL,
    course_interested VARCHAR(150),
    message TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    review_text TEXT NOT NULL,
    is_approved TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    time_limit_minutes INT DEFAULT 10,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_image VARCHAR(255) DEFAULT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_option ENUM('A','B','C','D') NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    student_class VARCHAR(100),
    score INT NOT NULL,
    total_questions INT NOT NULL,
    time_taken_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'Tajweed Learning Centre'),
('phone', '01700000000'),
('whatsapp', '8801700000000'),
('email', 'info@tajweedcentre.com'),
('address', 'ঢাকা, বাংলাদেশ'),
('map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...'),
('facebook_url', 'https://facebook.com/'),
('youtube_url', 'https://youtube.com/');

-- Sample courses
INSERT INTO courses (title, level_no, fee, duration, description, display_order) VALUES
('নূরানী কোর্স', 1, '৫০০ টাকা/মাস', '৩ মাস', 'আরবি হরফ চেনা ও প্রাথমিক পড়া শেখার কোর্স।', 1),
('তাজভীদ কোর্স', 2, '৭০০ টাকা/মাস', '৬ মাস', 'তাজভীদের নিয়মসহ শুদ্ধভাবে কুরআন পড়া শেখানো হয়।', 2),
('হিফজ কোর্স', 3, '১০০০ টাকা/মাস', 'নিরবচ্ছিন্ন', 'সম্পূর্ণ কুরআন মুখস্থ করানোর কোর্স।', 3),
('প্রাপ্তবয়স্কদের কোর্স', 4, '৬০০ টাকা/মাস', '৪ মাস', 'যারা বড় বয়সে শুদ্ধ করে কুরআন পড়া শিখতে চান তাদের জন্য।', 4);
