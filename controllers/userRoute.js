const db = require('../config');
const express = require('express');
const router = express.Router();

// Create a new user
router.post('/createUser', async (req, res) => {
    try {
        const { name, address, country, pincode, mobile, email, password } = req.body;
        const user = [name, address, country, pincode, mobile, email, password];
        await db.query('INSERT INTO users (name, address, country, pincode, mobile, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)', user);
        res.status(200).json({ message: 'User inserted successfully' });
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ message: `Error inserting user` });
    }
});

// Edit an existing user
router.put('/editUser/:id', async (req, res) => {
    try {
        const { name, address, country, pincode, mobile, email, password } = req.body;
        const user = [name, address, country, pincode, mobile, email, password, req.params.id];
        await db.query('UPDATE users SET name = ?, address = ?, country = ?, pincode = ?, mobile = ?, email = ?, password = ? WHERE id = ?', user);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});



module.exports = router;
