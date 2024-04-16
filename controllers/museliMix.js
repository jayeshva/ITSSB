const express = require('express');
const router = express.Router();
const db = require('../config');
const auth = require('../auth');

// Add museli mix details
router.post('/addMuseliMix',auth, async (req, res) => {
    try {
        const user_email = req.user;
        const user = await db.query('SELECT * FROM users WHERE email = ?', user_email);
        const user_id = user[0].id;
        const user_name = user[0].name;
        //generate museli_id 6 digit random number
        const museli_id = Math.floor(100000 + Math.random() * 900000);

        const {museli_mix_name, base_component_id, base_component_name, total_price, total_protein, total_fats, total_carbohydrates } = req.body;
        var individual_component = req.body.individual_component;
        const museliMixDetails = [museli_id, user_id, user_email, user_name, museli_mix_name, base_component_id, base_component_name, total_price, total_protein, total_fats, total_carbohydrates];
        await db.query('INSERT INTO museli_mix (museli_id,user_id, user_email, user_name, museli_mix_name, base_component_id, base_component_name, total_price, total_protein, total_fats, total_carbohydrates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', museliMixDetails);
        var individual_component_details  = individual_component.map((component) => {
            return [museli_id, component.component_id, component.component_name, component.price, component.weight_in_gram, component.carbohydrates_per_gram, component.proteins_per_gram, component.fats_per_gram];
        });
        await db.query('INSERT INTO museli_mix_selected_component (museli_id, component_id, component_name, price, weight_in_gram, carbohydrates_per_gram, proteins_per_gram, fats_per_gram) VALUES ?', [individual_component_details]);
        res.status(200).json({ message: 'Museli mix details added successfully' });
    } catch (error) {
        console.error('Error adding museli mix details:', error);
        res.status(500).json({ message: 'Error adding museli mix details' });
    }
});

// Edit museli mix details
router.post('/editMuseliMix/:id',auth, async (req, res) => {
    try {
        const user_email = req.user;
        const user = await db.query('SELECT * FROM users WHERE email = ?', user_email);
        const user_id = user[0].id;
        const user_name = user[0].name;
        const museli_id = req.params.id;

        const { museli_mix_name, base_component_id, base_component_name, total_price, total_protein, total_fats, total_carbohydrates } = req.body;
        var individual_component = req.body.individual_component;
        const museliMixDetails = [user_id, user_email, user_name, museli_mix_name, base_component_id, base_component_name, total_price, total_protein, total_fats, total_carbohydrates, museli_id];
        await db.query('UPDATE museli_mix SET user_id = ?, user_email = ?, user_name = ?, museli_mix_name = ?, base_component_id = ?, base_component_name = ?, total_price = ?, total_protein = ?, total_fats = ?, total_carbohydrates = ? WHERE museli_id = ?', museliMixDetails);
        await db.query('DELETE FROM museli_mix_selected_component WHERE museli_id = ?', museli_id);
        var individual_component_details  = individual_component.map((component) => {
            return [museli_id, component.component_id, component.component_name, component.price, component.weight_in_gram, component.carbohydrates_per_gram, component.proteins_per_gram, component.fats_per_gram];
        });
        await db.query('INSERT INTO museli_mix_selected_component (museli_id, component_id, component_name, price, weight_in_gram, carbohydrates_per_gram, proteins_per_gram, fats_per_gram) VALUES ?', [individual_component_details]);
        res.status(200).json({ message: 'Museli mix details updated successfully' });
    } catch (error) {
        console.error('Error updating museli mix details:', error);
        res.status(500).json({ message: 'Error updating museli mix details' });
    }
});

// Delete museli mix details
router.delete('/deleteMuseliMix/:id',auth, async (req, res) => {
    try {
        await db.query('DELETE FROM museli_mix WHERE museli_id = ?', req.params.id);
        await db.query('DELETE FROM museli_mix_selected_component WHERE museli_id = ?', req.params.id);
        res.status(200).json({ message: 'Museli mix details deleted successfully' });
    } catch (error) {
        console.error('Error deleting museli mix details:', error);
        res.status(500).json({ message: 'Error deleting museli mix details' });
    }
});

// Get museli mix details by id
router.get('/getMuseliMix/:id',auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM museli_mix WHERE museli_id = ?', req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting museli mix details:', error);
        res.status(500).json({ message: 'Error getting museli mix details' });
    }
});

// Get museli mix details by user
router.get('/getMuseliMix', auth, async (req, res) => {
    try {
        const user_email = req.user;
        const user = await db.query('SELECT * FROM users WHERE email = ?', user_email);
        const user_id = user[0].id;
        const result = await db.query('SELECT * FROM museli_mix WHERE user_id = ?', user_id);
        
        // Use map to iterate over the result asynchronously
        const promises = result.map(async (museli) => {
            const museli_id = museli.museli_id;
            const individual_component = await db.query('SELECT * FROM museli_mix_selected_component WHERE museli_id = ?', museli_id);
            museli.individual_component = individual_component;
            return museli; // Return the modified museli object
        });

        // Wait for all asynchronous operations to complete
        const museliMixDetails = await Promise.all(promises);

        res.status(200).json(museliMixDetails);
    } catch (error) {
        console.error('Error getting museli mix details:', error);
        res.status(500).json({ message: 'Error getting museli mix details' });
    }
});


module.exports = router;
