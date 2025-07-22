const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all subcities
router.get('/subcities', async (req, res) => {
    try {
        const subcities = await db.query('SELECT * FROM subcities ORDER BY name');
        res.json({
            success: true,
            subcities: subcities
        });
    } catch (error) {
        console.error('Error fetching subcities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subcities'
        });
    }
});

// Get single subcity by ID
router.get('/subcities/:subcityId', async (req, res) => {
    try {
        const { subcityId } = req.params;
        
        const [subcity] = await db.query(
            'SELECT * FROM subcities WHERE subcity_id = ?',
            [subcityId]
        );
        
        if (!subcity) {
            return res.status(404).json({
                success: false,
                message: 'Subcity not found'
            });
        }
        
        res.json({
            success: true,
            subcity: subcity
        });
    } catch (error) {
        console.error('Error fetching subcity:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subcity'
        });
    }
});

// Add new subcity
router.post('/subcities', async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const result = await db.query(
            'INSERT INTO subcities (name, description) VALUES (?, ?)',
            [name, description]
        );
        
        res.status(201).json({
            success: true,
            message: 'Subcity added successfully',
            subcity_id: result.insertId
        });
    } catch (error) {
        console.error('Error adding subcity:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding subcity'
        });
    }
});

// Get offices for a subcity
router.get('/subcities/:subcityId/offices', async (req, res) => {
    try {
        const { subcityId } = req.params;
        
        const offices = await db.query(
            'SELECT * FROM offices WHERE subcity_id = ? ORDER BY name',
            [subcityId]
        );
        
        res.json({
            success: true,
            offices: offices
        });
    } catch (error) {
        console.error('Error fetching offices:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching offices'
        });
    }
});

// Add new office
router.post('/offices', async (req, res) => {
    try {
        const { subcity_id, name, description } = req.body;
        
        const result = await db.query(
            'INSERT INTO offices (subcity_id, name, description) VALUES (?, ?, ?)',
            [subcity_id, name, description]
        );
        
        res.status(201).json({
            success: true,
            message: 'Office added successfully',
            office_id: result.insertId
        });
    } catch (error) {
        console.error('Error adding office:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding office'
        });
    }
});

// Get office details
router.get('/offices/:officeId', async (req, res) => {
    try {
        const { officeId } = req.params;
        
        const [office] = await db.query(
            'SELECT * FROM offices WHERE office_id = ?',
            [officeId]
        );
        
        if (!office) {
            return res.status(404).json({
                success: false,
                message: 'Office not found'
            });
        }
        
        res.json({
            success: true,
            office: office
        });
    } catch (error) {
        console.error('Error fetching office:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching office'
        });
    }
});

// Update office
router.put('/offices/:officeId', async (req, res) => {
    try {
        const { officeId } = req.params;
        const { name, description } = req.body;
        
        await db.query(
            'UPDATE offices SET name = ?, description = ? WHERE office_id = ?',
            [name, description, officeId]
        );
        
        res.json({
            success: true,
            message: 'Office updated successfully'
        });
    } catch (error) {
        console.error('Error updating office:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating office'
        });
    }
});

// Delete office
router.delete('/offices/:officeId', async (req, res) => {
    try {
        const { officeId } = req.params;
        
        await db.query('DELETE FROM offices WHERE office_id = ?', [officeId]);
        
        res.json({
            success: true,
            message: 'Office deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting office:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting office'
        });
    }
});

// Add standard offices to all subcities
router.post('/subcities/standard-offices', async (req, res) => {
    try {
        // Get all subcities
        const subcities = await db.query('SELECT subcity_id FROM subcities');
        
        // Standard offices to add
        const standardOffices = [
            { name: 'Office of Employment, Enterprise and Industry', description: 'Manages employment, enterprise development and industrial activities' },
            { name: 'Office of Finance', description: 'Handles financial matters and budget management' },
            { name: 'Office of Housing Development and Administration', description: 'Manages housing development and administration' },
            { name: 'Office of Public Service and Human Resource Development', description: 'Oversees public service delivery and human resource development' },
            { name: 'Office of Peace and Security Administration', description: 'Manages peace and security matters' },
            { name: 'Office of Culture and Arts Tourism', description: 'Promotes culture, arts and tourism' },
            { name: 'Office of Land Development and Administration', description: 'Handles land development and administration' },
            { name: 'Office of Design and Construction Works', description: 'Manages design and construction projects' },
            { name: 'Office of Commerce', description: 'Oversees commercial activities and trade' },
            { name: 'Office of Women, Children and Social Affairs', description: 'Addresses women, children and social welfare issues' },
            { name: 'Office of Revenue', description: 'Manages revenue collection and financial matters' },
            { name: 'Office of Youth Sports', description: 'Promotes youth development and sports activities' },
            { name: 'Office of Urban Beautification and Urban Development', description: 'Oversees urban beautification and development projects' },
            { name: 'Office of Planning and Development Commission', description: 'Handles planning and development initiatives' },
            { name: 'Office of Investment Commission', description: 'Manages investment opportunities and projects' },
            { name: 'Office of State Property Management Authority', description: 'Oversees state property management' },
            { name: 'Office of Farmers and Urban Agriculture Development Commission', description: 'Promotes agricultural development and urban farming' },
            { name: 'Office of the Fire and Disaster Risk Management Commission', description: 'Manages fire safety and disaster risk' },
            { name: 'Office of the Education and Training Quality Assurance Authority', description: 'Ensures quality in education and training' },
            { name: 'Office of the Driver and Operator Licensing and Control Authority', description: 'Manages driver licensing and control' },
            { name: 'Office of the Traffic Management Agency', description: 'Oversees traffic management and control' },
            { name: 'Office of the Land Titles and Information Agency', description: 'Manages land titles and related information' },
            { name: 'Office of the Vital Records and Information Agency', description: 'Handles vital records and information management' },
            { name: 'Office of the Revenue Agency', description: 'Manages revenue collection and administration' },
            { name: 'Office of the Government Procurement and Disposal Service', description: 'Handles government procurement and disposal' },
            { name: 'Office of the Auditor General', description: 'Conducts audits and ensures financial accountability' }
        ];
        
        // Add offices to each subcity
        for (const subcity of subcities) {
            for (const office of standardOffices) {
                try {
                    await db.query(
                        'INSERT INTO offices (subcity_id, name, description) VALUES (?, ?, ?)',
                        [subcity.subcity_id, office.name, office.description]
                    );
                } catch (error) {
                    // Skip if office already exists (due to unique constraint)
                    if (error.code !== 'ER_DUP_ENTRY') {
                        throw error;
                    }
                }
            }
        }
        
        res.json({
            success: true,
            message: 'Standard offices added to all subcities successfully'
        });
    } catch (error) {
        console.error('Error adding standard offices:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding standard offices'
        });
    }
});

// Get all offices
router.get('/offices', async (req, res) => {
    try {
        const offices = await db.query(`
            SELECT o.*, s.name as subcity_name 
            FROM offices o 
            LEFT JOIN subcities s ON o.subcity_id = s.subcity_id 
            ORDER BY s.name, o.name
        `);
        
        res.json({
            success: true,
            offices: offices
        });
    } catch (error) {
        console.error('Error fetching offices:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching offices'
        });
    }
});

module.exports = router; 