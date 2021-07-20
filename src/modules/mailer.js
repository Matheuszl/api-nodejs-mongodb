const nodemailer = require('nodemailer');
const path = require('path');
//reference the plugin
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass },
});


//attach the plugin to the nodemailer transporter
transport.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/resources/mail/')
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html',
}));

//21:48criando a rota de mudar a senha
//esse é o template de email
module.exports = transport;