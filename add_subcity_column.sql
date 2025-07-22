-- Add subcity_id column to employees table
USE gsf;

-- Add subcity_id column to employees table
ALTER TABLE employees ADD COLUMN subcity_id INT;

-- Update existing employees to have subcity_id based on their office
UPDATE employees e 
JOIN offices o ON e.office_id = o.office_id 
SET e.subcity_id = o.subcity_id;

-- Add foreign key constraint
ALTER TABLE employees ADD CONSTRAINT fk_employees_subcity 
FOREIGN KEY (subcity_id) REFERENCES subcities(subcity_id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX idx_employees_subcity ON employees(subcity_id); 