-- 1. Tạo Database (Thực hiện thủ công nếu chưa có)
-- CREATE DATABASE vongquay_db;

-- 2. Tạo bảng lưu trữ lịch sử quay
CREATE TABLE IF NOT EXISTS spins (
    id SERIAL PRIMARY KEY,
    ip VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    reward VARCHAR(100) NOT NULL,
    segment_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tạo Index để tối ưu tốc độ kiểm tra theo IP + Ngày
CREATE INDEX idx_spins_ip_date ON spins (ip, (created_at::date));

-- Ghi chú: Sử dụng TIMESTAMP WITH TIME ZONE để đảm bảo chính xác thời gian quay.
