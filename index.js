const express = require('express');
const userRoute = require('./controllers/userRoute');
const componentRoute = require('./controllers/museliComponent');
const mixRoute = require('./controllers/museliMix');
const orderRoute = require('./controllers/orders');
const jwt = require('jsonwebtoken');
const auth = require('./auth');
const cors = require('cors');
const db = require('./config');
const app = express();
const PORT = 5000;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.urlencoded({ extended: true }));    

app.use(express.json());
app.use('/user', userRoute);
app.use('/component', componentRoute);
app.use('/mix', mixRoute);
app.use('/order', orderRoute);


// Login a user
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = [email, password];
        const result = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', user);
        if (result.length > 0) {
            const token = jwt.sign({ id: result[0].email }, 'secret',{ expiresIn: '5h' });
            res.status(200).json({ message: 'Login successful' , token: token});
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

//check session
app.get('/isTokenValid', auth, async (req, res) => {
    try {
        res.status(200).json({ message: 'Session is valid' ,login: true});
    } catch (error) {
        console.error('Error checking session:', error);
        res.status(500).json({ message: 'Error checking session' ,login: false});
    }
});

// Logout a user
app.get('/logout', auth, async (req, res) => {
    try {
        res.clearCookie('x-auth-token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Error logging out' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});