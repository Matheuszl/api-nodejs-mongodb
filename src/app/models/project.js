const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

//Classe modelo de projeto

// tasks:[{}] é como ele referencia que vai receber outro objeto.
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    rquire: true,
  },
  user: {
    //pega o id do usuario
    //é como o mongoDB referencia o id de um usuario
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;