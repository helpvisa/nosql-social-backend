// dependencies
const express = require('express');
const mongoose = require('mongoose');

// server setup
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes import
app.use(require('./routes'));

// sync mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nosql-social-backend', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// enable mongo query logging
mongoose.set('debug', true);

// run listen server
app.listen(PORT, () => {
    console.log(`Listen on ${PORT}`);
});