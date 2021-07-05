const express = require('express');
const app = express();

/**
 * Recebe parametro por url 
 * fomato json
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//repasso o app
require('./controllers/authController')(app);
//controllers\authController.js
app.listen(3000);