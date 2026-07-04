const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// API Routes
app.get('/api/tours', (req, res) => {
    const tours = [
        {
            id: 1,
            name: 'Paris City Tour',
            price: 89.99,
            rating: 4.8,
            duration: '8 hours'
        },
        {
            id: 2,
            name: 'Tokyo Adventure',
            price: 79.99,
            rating: 4.7,
            duration: '10 hours'
        },
        {
            id: 3,
            name: 'New York Explorer',
            price: 99.99,
            rating: 4.9,
            duration: '12 hours'
        },
        {
            id: 4,
            name: 'London Heritage Tour',
            price: 84.99,
            rating: 4.6,
            duration: '9 hours'
        },
        {
            id: 5,
            name: 'Barcelona Beach & Culture',
            price: 74.99,
            rating: 4.7,
            duration: '8 hours'
        },
        {
            id: 6,
            name: 'Rome Ancient Wonders',
            price: 94.99,
            rating: 4.8,
            duration: '10 hours'
        }
    ];
    res.json(tours);
});

app.get('/api/tours/:id', (req, res) => {
    res.json({ message: 'Tour details for ID: ' + req.params.id });
});

app.post('/api/bookings', (req, res) => {
    res.json({ message: 'Booking created successfully', booking: req.body });
});

app.post('/api/contact', (req, res) => {
    res.json({ message: 'Message received. We will contact you soon.' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
