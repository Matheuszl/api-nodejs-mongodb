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

router.get('/:clientId', async (req, res) => {
  try {

    const client = await Client.findById(req.params.clientId);

    return res.send({ client });

  }catch(err){
    return res.status(400).send({ error: 'error loading client' });
  }
});

//caminha para criação de um novo cliente
router.post('/', async (req, res) => {
  try {
    //cria as variasveis que capturam do corpo da req a informação a ser armazenada
    const { name, email, number, adress } = req.body;
    //cria a instancia client no bd passado as informaçoes 
    const client = await Client.create({ name, email, number, adress});

    //salva o novo cliente
    await client.save();
    //retorna o cliente
    return res.send({ client });

  }catch(err){
    return res.status(400).send({ error: 'error crating new client'});
  }
});

//procura por id e remove
router.delete('/:clientId', async (req, res) => {
  try{
    
    await Client.findByIdAndRemove(req.params.clientId);

    //retorno apenas o send pq ja excluiu, 200=ok
    return res.send();

  }catch(err){
    return res.status(400).send({ error: 'error deleting client' });
  }
});

//atualizar um cliente
router.put('/:clientId', async (req, res) => {
  try {
    const {name , email, number, adress} = req.body;

    const client = await Client.findByIdAndUpdate(req.params.clientId, {
      name,
      email,
      number,
      adress
    }, {new: true});


    await client.save();

    return res.send({ client });

  }catch(err){
    return res.status(400).send({ error: 'error updating client'});
  }
})



module.exports = app => app.use('/clients', router);