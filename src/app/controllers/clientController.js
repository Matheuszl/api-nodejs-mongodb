const express = require('express');
//autorização
const authMiddleware = require('../middlewares/auth');
//importação das models
const Client = require('../models/client');
const router = express.Router();

//para realizar as operacoes da controller é precisso
//token de auth jwt
router.use(authMiddleware);

//retorna todos os clientes cadastrados
router.get('/', async (req, res) => {
  try {
    //find() retorna todas instancias de cliente do banco
  const clients = await Client.find();
  
  //send() manda corpo de resposta, {client} json
  return res.send({ clients });

  }catch(err){
    return res.status(400).send({ error: 'error loading clients' });
  }
});

module.exports = app => app.use('/clients', router);