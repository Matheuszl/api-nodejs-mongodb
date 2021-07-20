const express = require('express');
const app = express();

/**
 * Recebe parametro por url 
 * fomato json
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//repasso o app
//todos controlers que forem sendo criados
//automaticamente sao chamados por causa do index.js na camada controllers
require('./app/controllers/index')(app);

//controllers\authController.js
app.listen(3000);