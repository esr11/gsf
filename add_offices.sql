USE gsf;

-- First, let's clear existing offices to avoid duplicates
DELETE FROM offices;

-- Insert standard offices for each subcity
INSERT INTO offices (subcity_id, name, description)
SELECT 
    s.subcity_id,
    o.name,
    o.description
FROM 
    subcities s
CROSS JOIN (
    SELECT 'Office of Employment, Enterprise and Industry' as name, 'Manages employment, enterprise development and industrial activities' as description UNION ALL
    SELECT 'Office of Finance', 'Handles financial matters and budget management' UNION ALL
    SELECT 'Office of Housing Development and Administration', 'Manages housing development and administration' UNION ALL
    SELECT 'Office of Public Service and Human Resource Development', 'Oversees public service delivery and human resource development' UNION ALL
    SELECT 'Office of Peace and Security Administration', 'Manages peace and security matters' UNION ALL
    SELECT 'Office of Culture and Arts Tourism', 'Promotes culture, arts and tourism' UNION ALL
    SELECT 'Office of Land Development and Administration', 'Handles land development and administration' UNION ALL
    SELECT 'Office of Design and Construction Works', 'Manages design and construction projects' UNION ALL
    SELECT 'Office of Commerce', 'Oversees commercial activities and trade' UNION ALL
    SELECT 'Office of Women, Children and Social Affairs', 'Addresses women, children and social welfare issues' UNION ALL
    SELECT 'Office of Revenue', 'Manages revenue collection and financial matters' UNION ALL
    SELECT 'Office of Youth Sports', 'Promotes youth development and sports activities' UNION ALL
    SELECT 'Office of Urban Beautification and Urban Development', 'Oversees urban beautification and development projects' UNION ALL
    SELECT 'Office of Planning and Development Commission', 'Handles planning and development initiatives' UNION ALL
    SELECT 'Office of Investment Commission', 'Manages investment opportunities and projects' UNION ALL
    SELECT 'Office of State Property Management Authority', 'Oversees state property management' UNION ALL
    SELECT 'Office of Farmers and Urban Agriculture Development Commission', 'Promotes agricultural development and urban farming' UNION ALL
    SELECT 'Office of the Fire and Disaster Risk Management Commission', 'Manages fire safety and disaster risk' UNION ALL
    SELECT 'Office of the Education and Training Quality Assurance Authority', 'Ensures quality in education and training' UNION ALL
    SELECT 'Office of the Driver and Operator Licensing and Control Authority', 'Manages driver licensing and control' UNION ALL
    SELECT 'Office of the Traffic Management Agency', 'Oversees traffic management and control' UNION ALL
    SELECT 'Office of the Land Titles and Information Agency', 'Manages land titles and related information' UNION ALL
    SELECT 'Office of the Vital Records and Information Agency', 'Handles vital records and information management' UNION ALL
    SELECT 'Office of the Revenue Agency', 'Manages revenue collection and administration' UNION ALL
    SELECT 'Office of the Government Procurement and Disposal Service', 'Handles government procurement and disposal' UNION ALL
    SELECT 'Office of the Auditor General', 'Conducts audits and ensures financial accountability'
) o; 