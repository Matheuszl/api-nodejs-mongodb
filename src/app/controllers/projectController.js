const express = require('express');
const authMiddleware = require('../middlewares/auth');
//importação das models
const Project = require('../models/project')
const Task = require('../models/task')

const router = express.Router();

//só acessa esse controle com o token de auth jwt
router.use(authMiddleware)

//rota que retorna todos projetos
router.get('/', async (req, res) => {
  res.send({ user: req.userId });
});

router.get('/projectId', async (req, res) => {
  res.send({ user: req.userId });
});

//rota de create de um novo projeto
router.post('/', async (req, res) => {
  res.send({ user: req.userId });
});

router.put('/projectId', async (req, res) => {
  res.send({ user: req.userId });
});

router.delete('/projectId', async (req, res) => {
  res.send({ user: req.userId });
});

module.exports = app => app.use('/projects', router);
