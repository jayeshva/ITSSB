const db = require('../config');
const auth = require('../auth');
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
router.put('/editUser', auth,async (req, res) => {
    try {
        const email = req.user;
        const { name, address, country, pincode, mobile, password } = req.body;
        const user = [name, address, country, pincode, mobile, email, password, email];
        await db.query('UPDATE users SET name = ?, address = ?, country = ?, pincode = ?, mobile = ?, email = ?, password = ? WHERE email = ?', user);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

//get a user by id
router.get('/getUser', auth, async (req, res) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE email = ?', req.user);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Error getting user' });
    }
});


module.exports = router;
