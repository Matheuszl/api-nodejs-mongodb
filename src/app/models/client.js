//faz a coneção com o banco de dados
const mongoose = require('../../database');
/*
  Tudo no Mongoose começa com um Schema.
  Cada esquema é mapeado para uma coleção MongoDB e define a forma dos documentos dentro dessa coleção.
*/
const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true, //obrigatorio
    unique: true, //unico
    lowercase: true, //em minusculo
  },
  number: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//invoca model do mongose para criçao entro do banco
//com as caracteristicas do schema
const Client = mongoose.model('Client', ClientSchema);

//exporta o arquivo
module.exports = Client;