require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to DB');
});

require('./src/routes')(app);

// Listen to port
app.listen(5000, () => {
    console.log('localhost:5000');
});