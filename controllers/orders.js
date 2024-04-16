const db = require('../config');
const auth = require('../auth');
const express = require('express');
const router = express.Router();

//To create a new order
router.post('/createOrder', auth,async (req, res) => {
    try {
        const user_email = req.user;
        const user = await db.query('SELECT * FROM users WHERE email = ?', user_email);
        const user_id = user[0].id;
        const user_name = user[0].name;
        const order_id = Math.floor(100000 + Math.random() * 900000);

        const { total_price } = req.body;
        var individual_component = req.body.individual_component;
        const orderDetails = [order_id, user_id, user_email, user_name, total_price];
        await db.query('INSERT INTO orders (order_id, user_id, user_email, user_name,total_price) VALUES (?, ?, ?, ?, ?)', orderDetails);
        var individual_component_details = individual_component.map((component) => {
            return [order_id, component.museli_id, component.museli_mix_name, component.price,component.quantity];
        });
        await db.query('INSERT INTO order_details (order_id, museli_id, museli_mix_name, price, quantity) VALUES ?', [individual_component_details]);
        res.status(200).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

//To get all orders by user
router.get('/getAllOrders', auth, async (req, res) => {
    try {
        const user_email = req.user;
        const user = await db.query('SELECT * FROM users WHERE email = ?', user_email);
        const user_id = user[0].id;
        const orders = await db.query('SELECT * FROM orders WHERE user_id = ?', user_id);
        const promises = orders.map(async (order) => {
            order.order_details = await db.query('SELECT * FROM order_details WHERE order_id = ?', order.order_id);
            return order;
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Error getting orders' });
    }
});

//To get all orders by admin
router.get('/getAllOrdersByAdmin', auth, async (req, res) => {
    try {
        const orders = await db.query('SELECT * FROM orders');
        const promises = orders.map(async (order) => {
            order.order_details = await db.query('SELECT * FROM order_details WHERE order_id = ?', order.order_id);
            return order;
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Error getting orders' });
    }
});

//To update order status
router.put('/updateOrderStatus',  async (req, res) => {
    try {
        const { order_id, order_status } = req.body;
        await db.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [order_status, order_id]);
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

//To delete an order by user
router.delete('/deleteOrder', auth, async (req, res) => {
    try {
        const user_email = req.user;
        const { order_id } = req.body;
        await db.query('DELETE FROM orders WHERE order_id = ? AND user_email = ?', [order_id,user_email]);
        await db.query('DELETE FROM order_details WHERE order_id = ?', order_id);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
});


module.exports = router;