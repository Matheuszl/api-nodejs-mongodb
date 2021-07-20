const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
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


router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try{
    //precsaos verificar primeiramente se esse email existe
    //entao buscamos do usuario o email usando o await
    const user = await User.findOne({ email });

    //se ele nao achar, retonar que o usuario nao é encontrado
    if(!user)
    return res.status(400).send({ error: 'User not found'});

    const token = crypto.randomBytes(20).toString('hex');

    //aqui temos a data e o tempo de expiração desse token
    const now = new Date();
    now.setHours(now.getHours() + 1);
    //findById: busca por id
    //Update: atualiza
    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
      }
    });

    mailer.sendMail({
      to: email,
      from: 'matheus.zzalamena@gmail.com',
      template: 'auth/forgot_password',
      context: { token },

    }, (err) => {
      if(err)
        return res.status(400).send({error: 'cannot sand token forget password'});

      return res.send();
      });

  }catch(err){
    res.status(400).send({error: 'Erro on forgot password, try again'});
  }
});



module.exports = app => app.use('/auth', router);