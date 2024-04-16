const db = require('../config');
const express = require('express');
const router = express.Router();

//To store the compenent details
router.post('/addComponent', async (req, res) => {
    try {
        const { component_name, component_category, price, weight_in_gram, carbohydrates_per_gram, proteins_per_gram, fats_per_gram } = req.body;
        const component = [component_name, component_category, price, weight_in_gram, carbohydrates_per_gram, proteins_per_gram, fats_per_gram];
        await db.query('INSERT INTO museli_component (component_name, component_category, price, weight_in_gram, carbohydrates_per_gram, proteins_per_gram, fats_per_gram) VALUES (?, ?, ?, ?, ?, ?, ?)', component);
        res.status(200).json({ message: 'Component added successfully' });
    } catch (error) {
        console.error('Error adding component:', error);
        res.status(500).json({ message: 'Error adding component' });
    }
});

//To delete the component details
router.delete('/deleteComponent/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM museli_component WHERE component_id = ?', req.params.id);
        res.status(200).json({ message: 'Component deleted successfully' });
    } catch (error) {
        console.error('Error deleting component:', error);
        res.status(500).json({ message: 'Error deleting component' });
    }
});

//To edit the component details
router.put('/editComponent/:id', async (req, res) => {
    try {
        const { component_name, component_category, price, weight_in_gram, carbohydrates_per_gram, proteins_per_gram, fats_per_gram } = req.body;
        const component = [component_name, component_category, price, weight_in_gram, carbohydrates_per_gram, proteins_per_gram, fats_per_gram, req.params.id];
        await db.query('UPDATE museli_component SET component_name = ?, component_category = ?, price = ?, weight_in_gram = ?, carbohydrates_per_gram = ?, proteins_per_gram = ?, fats_per_gram = ? WHERE component_id = ?', component);
        res.status(200).json({ message: 'Component updated successfully' });
    } catch (error) {
        console.error('Error updating component:', error);
        res.status(500).json({ message: 'Error updating component' });
    }
});

//To get the component details
router.get('/getComponent', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM museli_component');
        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting component:', error);
        res.status(500).json({ message: 'Error getting component' });
    }
});







module.exports = router;