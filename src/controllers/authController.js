const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../config/auth');

const router = express.Router();

function genereteToken(params = {}){
  return jwt.sign(params, auth.secret, {
    expiresIn: 86400,
  });
}


router.post('/register', async (req, res) => {
  const { email } = req.body;

  try{
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'User already exists'});

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ 
      user,
      token: genereteToken({ id: user.id }),
    });
    
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed'});
  }
});


router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if(!user)
    return res.status(400).send({ error: 'User not found'});

  if(!await bcrypt.compare(password,user.password))
    return res.status(400).send({ error: 'Invalid password'});

  user.password = undefined;
  /**
   * como se fosse entrar/login
   * preciso passar a info que diferencia um token de outro
   * e essa info é o ID sempre unico
   * user.id
   * 
   * o segundo parametro e o hash que tambem é unico
   * 
   * o terceiro é o tempo de expiração em segundos
   */

  res.send({ 
    user,
    token: genereteToken({ id: user.id }),
  });
});

module.exports = app => app.use('/auth', router);