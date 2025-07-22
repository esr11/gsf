-- Insert initial subcities
INSERT INTO subcities (name) VALUES 
('Addis Ketema'),
('Akaki Kaliti'),
('Arada'),
('Bole'),
('Gulele'),
('Kirkos'),
('Kolfe Keranio'),
('Lideta'),
('Nifas Silk-Lafto'),
('Yeka');

-- Insert initial offices for each subcity
INSERT INTO offices (office_name, subcity_id) VALUES 
('Addis Ketema Branch Office', 1),
('Addis Ketema Service Center', 1),
('Akaki Kaliti Branch Office', 2),
('Akaki Kaliti Service Center', 2),
('Arada Branch Office', 3),
('Arada Service Center', 3),
('Bole Branch Office', 4),
('Bole Service Center', 4),
('Gulele Branch Office', 5),
('Gulele Service Center', 5),
('Kirkos Branch Office', 6),
('Kirkos Service Center', 6),
('Kolfe Keranio Branch Office', 7),
('Kolfe Keranio Service Center', 7),
('Lideta Branch Office', 8),
('Lideta Service Center', 8),
('Nifas Silk-Lafto Branch Office', 9),
('Nifas Silk-Lafto Service Center', 9),
('Yeka Branch Office', 10),
('Yeka Service Center', 10); 