CREATE DATABASE IF NOT EXISTS service_management1;
USE service_management1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    role ENUM('SE', 'Manager', 'HO') NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otp_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE installations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_id VARCHAR(100),
    installation_date DATE,
    equipment_name VARCHAR(255),
    instrument_number VARCHAR(100),
    serial_number VARCHAR(100),
    invoice_number VARCHAR(100),
    invoice_date DATE,
    warranty_start DATE,
    warranty_end DATE,
    customer_name VARCHAR(255),
    delivery_address TEXT,
    customer_representative VARCHAR(255),
    engineer_name VARCHAR(255),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE service_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_report_id VARCHAR(100),
    service_date DATE,
    model VARCHAR(255),
    instrument_number VARCHAR(100),
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    mobile_number VARCHAR(20),
    amc_period VARCHAR(100),
    po_number VARCHAR(100),
    call_type ENUM('Installation', 'Warranty', 'AMC', 'On Call'),
    customer_address TEXT,
    problem_reported TEXT,
    observations TEXT,
    engineer_remarks TEXT,
    customer_remarks TEXT,
    service_status ENUM('Completed', 'Incomplete'),
    completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE customer_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_report_id INT,
    rating INT,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_report_id) REFERENCES service_reports(id)
);

CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    customer_name VARCHAR(255),
    issue_description TEXT,
    status ENUM('Open', 'In Progress', 'Resolved') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE closure_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    acceptance_date DATE,
    document_number VARCHAR(100),
    customer_name VARCHAR(255),
    equipment_name VARCHAR(255),
    instrument_number VARCHAR(100),
    serial_number VARCHAR(100),
    installation_remarks TEXT,
    customer_representative VARCHAR(255),
    company_representative VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
