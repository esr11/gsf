-- Drop existing tables if they exist
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS offices;
DROP TABLE IF EXISTS subcities;

-- Create subcities table
CREATE TABLE subcities (
    subcity_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create offices table
CREATE TABLE offices (
    office_id SERIAL PRIMARY KEY,
    subcity_id INTEGER NOT NULL REFERENCES subcities(subcity_id),
    office_name VARCHAR(100) NOT NULL,
    office_desc TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    office_id INTEGER NOT NULL REFERENCES offices(office_id),
    full_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    photo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop existing foreign key constraint if it exists
ALTER TABLE offices 
DROP FOREIGN KEY IF EXISTS fk_offices_subcity;

-- Add foreign key relationships
ALTER TABLE offices 
ADD CONSTRAINT fk_offices_subcity 
FOREIGN KEY (subcity_id) REFERENCES subcities(subcity_id);

ALTER TABLE employees 
ADD CONSTRAINT fk_employees_office 
FOREIGN KEY (office_id) REFERENCES offices(office_id);

-- Add is_active column to employees for soft delete
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_offices_subcity_id ON offices(subcity_id);
CREATE INDEX IF NOT EXISTS idx_employees_office_id ON employees(office_id);
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);

-- Add email validation constraint
ALTER TABLE employees 
ADD CONSTRAINT valid_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- First, ensure we have a unique constraint on office_name
ALTER TABLE offices 
ADD CONSTRAINT unique_office_name UNIQUE (office_name);

-- Insert offices for all subcities
INSERT INTO offices (subcity_id, office_name, office_desc) VALUES
    -- Addis Ketema (14)
    (14, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (14, 'Office of Finance', 'Handles financial matters and budgeting'),
    (14, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (14, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (14, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (14, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (14, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (14, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (14, 'Office of Commerce', 'Manages commercial activities'),
    (14, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (14, 'Office of Revenue', 'Manages revenue collection'),
    (14, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (14, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (14, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (14, 'Office of Investment Commission', 'Manages investment activities'),
    (14, 'Office of State Property Management Authority', 'Manages state properties'),
    (14, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (14, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (14, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (14, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (14, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (14, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (14, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (14, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (14, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (14, 'Office of the Auditor General', 'Conducts government audits'),

    -- Akaky Kaliti (15)
    (15, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (15, 'Office of Finance', 'Handles financial matters and budgeting'),
    (15, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (15, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (15, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (15, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (15, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (15, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (15, 'Office of Commerce', 'Manages commercial activities'),
    (15, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (15, 'Office of Revenue', 'Manages revenue collection'),
    (15, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (15, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (15, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (15, 'Office of Investment Commission', 'Manages investment activities'),
    (15, 'Office of State Property Management Authority', 'Manages state properties'),
    (15, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (15, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (15, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (15, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (15, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (15, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (15, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (15, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (15, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (15, 'Office of the Auditor General', 'Conducts government audits'),

    -- Arada (16)
    (16, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (16, 'Office of Finance', 'Handles financial matters and budgeting'),
    (16, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (16, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (16, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (16, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (16, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (16, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (16, 'Office of Commerce', 'Manages commercial activities'),
    (16, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (16, 'Office of Revenue', 'Manages revenue collection'),
    (16, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (16, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (16, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (16, 'Office of Investment Commission', 'Manages investment activities'),
    (16, 'Office of State Property Management Authority', 'Manages state properties'),
    (16, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (16, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (16, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (16, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (16, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (16, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (16, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (16, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (16, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (16, 'Office of the Auditor General', 'Conducts government audits'),

    -- Bole (17)
    (17, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (17, 'Office of Finance', 'Handles financial matters and budgeting'),
    (17, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (17, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (17, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (17, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (17, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (17, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (17, 'Office of Commerce', 'Manages commercial activities'),
    (17, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (17, 'Office of Revenue', 'Manages revenue collection'),
    (17, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (17, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (17, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (17, 'Office of Investment Commission', 'Manages investment activities'),
    (17, 'Office of State Property Management Authority', 'Manages state properties'),
    (17, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (17, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (17, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (17, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (17, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (17, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (17, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (17, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (17, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (17, 'Office of the Auditor General', 'Conducts government audits'),

    -- Gullele (18)
    (18, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (18, 'Office of Finance', 'Handles financial matters and budgeting'),
    (18, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (18, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (18, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (18, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (18, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (18, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (18, 'Office of Commerce', 'Manages commercial activities'),
    (18, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (18, 'Office of Revenue', 'Manages revenue collection'),
    (18, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (18, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (18, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (18, 'Office of Investment Commission', 'Manages investment activities'),
    (18, 'Office of State Property Management Authority', 'Manages state properties'),
    (18, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (18, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (18, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (18, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (18, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (18, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (18, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (18, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (18, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (18, 'Office of the Auditor General', 'Conducts government audits'),

    -- Kirkos (19)
    (19, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (19, 'Office of Finance', 'Handles financial matters and budgeting'),
    (19, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (19, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (19, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (19, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (19, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (19, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (19, 'Office of Commerce', 'Manages commercial activities'),
    (19, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (19, 'Office of Revenue', 'Manages revenue collection'),
    (19, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (19, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (19, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (19, 'Office of Investment Commission', 'Manages investment activities'),
    (19, 'Office of State Property Management Authority', 'Manages state properties'),
    (19, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (19, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (19, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (19, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (19, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (19, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (19, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (19, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (19, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (19, 'Office of the Auditor General', 'Conducts government audits'),

    -- Kolfe Keranio (20)
    (20, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (20, 'Office of Finance', 'Handles financial matters and budgeting'),
    (20, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (20, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (20, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (20, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (20, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (20, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (20, 'Office of Commerce', 'Manages commercial activities'),
    (20, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (20, 'Office of Revenue', 'Manages revenue collection'),
    (20, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (20, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (20, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (20, 'Office of Investment Commission', 'Manages investment activities'),
    (20, 'Office of State Property Management Authority', 'Manages state properties'),
    (20, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (20, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (20, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (20, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (20, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (20, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (20, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (20, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (20, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (20, 'Office of the Auditor General', 'Conducts government audits'),

    -- Lideta (21)
    (21, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (21, 'Office of Finance', 'Handles financial matters and budgeting'),
    (21, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (21, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (21, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (21, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (21, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (21, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (21, 'Office of Commerce', 'Manages commercial activities'),
    (21, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (21, 'Office of Revenue', 'Manages revenue collection'),
    (21, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (21, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (21, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (21, 'Office of Investment Commission', 'Manages investment activities'),
    (21, 'Office of State Property Management Authority', 'Manages state properties'),
    (21, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (21, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (21, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (21, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (21, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (21, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (21, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (21, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (21, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (21, 'Office of the Auditor General', 'Conducts government audits'),

    -- Nifas Silk-Lafto (22)
    (22, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (22, 'Office of Finance', 'Handles financial matters and budgeting'),
    (22, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (22, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (22, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (22, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (22, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (22, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (22, 'Office of Commerce', 'Manages commercial activities'),
    (22, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (22, 'Office of Revenue', 'Manages revenue collection'),
    (22, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (22, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (22, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (22, 'Office of Investment Commission', 'Manages investment activities'),
    (22, 'Office of State Property Management Authority', 'Manages state properties'),
    (22, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (22, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (22, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (22, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (22, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (22, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (22, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (22, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (22, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (22, 'Office of the Auditor General', 'Conducts government audits'),

    -- Yeka (23)
    (23, 'Office of Employment, Enterprise and Industry', 'Manages employment, enterprise development and industrial activities'),
    (23, 'Office of Finance', 'Handles financial matters and budgeting'),
    (23, 'Office of Housing Development and Administration', 'Manages housing development and administration'),
    (23, 'Office of Public Service and Human Resource Development', 'Oversees public service and HR development'),
    (23, 'Office of Peace and Security Administration', 'Manages peace and security matters'),
    (23, 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism'),
    (23, 'Office of Land Development and Administration', 'Manages land development and administration'),
    (23, 'Office of Design and Construction Works', 'Oversees design and construction projects'),
    (23, 'Office of Commerce', 'Manages commercial activities'),
    (23, 'Office of Women, Children and Social Affairs', 'Handles women, children and social welfare'),
    (23, 'Office of Revenue', 'Manages revenue collection'),
    (23, 'Office of Youth Sports', 'Promotes youth and sports activities'),
    (23, 'Office of Urban Beautification and Urban Development', 'Manages urban development and beautification'),
    (23, 'Office of Planning and Development Commission', 'Oversees planning and development'),
    (23, 'Office of Investment Commission', 'Manages investment activities'),
    (23, 'Office of State Property Management Authority', 'Manages state properties'),
    (23, 'Office of Farmers and Urban Agriculture Development Commission', 'Supports farmers and urban agriculture'),
    (23, 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk'),
    (23, 'Office of the Education and Training Quality Assurance Authority', 'Ensures education quality'),
    (23, 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing'),
    (23, 'Office of the Traffic Management Agency', 'Oversees traffic management'),
    (23, 'Office of the Land Titles and Information Agency', 'Manages land titles and information'),
    (23, 'Office of the Vital Records and Information Agency', 'Handles vital records'),
    (23, 'Office of the Revenue Agency', 'Manages revenue collection'),
    (23, 'Office of the Government Procurement and Disposal Service', 'Handles government procurement'),
    (23, 'Office of the Auditor General', 'Conducts government audits'); 