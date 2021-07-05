const express = require('express');
const app = express();

/**
 * Recebe parametro por url 
 * fomato json
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true}))



app.listen(3000);