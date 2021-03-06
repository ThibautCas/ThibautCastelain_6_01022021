require('dotenv').config();                 //For environement variables (not to show passwords in public source code)
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const mongodbURL = process.env.DB_URL;

mongoose.connect(mongodbURL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet());                        //For securized HTTP headers (against XSS attacks)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(bodyParser.json());
app.use(mongoSanitize());                 //For sanitization against NoSQL query injection
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes); 
app.use('/api/auth', userRoutes); 
module.exports = app;