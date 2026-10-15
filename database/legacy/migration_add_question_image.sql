-- Migration: আগে থেকে বসানো ডাটাবেসে "প্রশ্নে ছবি" ফিচার যোগ করার জন্য
-- phpMyAdmin > আপনার ডাটাবেস সিলেক্ট > SQL ট্যাব > এই কোডটা পেস্ট করে Go চাপুন

ALTER TABLE questions ADD COLUMN question_image VARCHAR(255) DEFAULT NULL AFTER question_text;
