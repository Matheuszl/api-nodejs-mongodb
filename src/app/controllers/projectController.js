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
  try {
    //apenas esse metodo find() ja retorna todos os projetos no bd
    const projects = await Project.find().populate('user');

    return res.send({ projects });

  }catch(err){
    return res.status(400).send({ error: 'error loading projects' });
  }
});

//rota de findbyid busca por um projeto por id
router.get('/:projectId', async (req, res) => {
  
  try {
    const project = await Project.findById(req.params.projectId).populate('user');

    return res.send({ project });

  }catch(err){
    return res.status(400).send({ error: 'error loading project' });
  }

});

//rota de create de um novo projeto
router.post('/', async (req, res) => {
  try {
    const { title, description, tasks } = req.body;
    //usar o await pq isso é uma consulta ao mongoose e ele retorna uma promisse
    //o user: vai buscar qual usuario criou o projeto, quem preenche é o midware de auth
    const project = await Project.create({ title, description, user: req.userId });
    //percorrer todas as tasks

    //esse map precisa ser assincrono pois precisa esperar a resposta para depois salvar no projeto
    //esse Promisse.all garante que a funçao execute é só salve depois do retorno dela
    await Promise.all(tasks.map( async task => {
      const projectTask = new Task({ ...task, project: project._id});

      await projectTask.save();
        
      project.tasks.push(projectTask);
    }));  

    await project.save();
    //retorna o projeto
    return res.send({ project });


  } catch (error) {
    return res.status(400).send({ error: 'error crating new project'});
  }
});

//rota de atualizaçao
router.put('/:projectId', async (req, res) => {

});

//rota de delete
router.delete('/:projectId', async (req, res) => {
  try {
    await Project.findByIdAndRemove(req.params.projectId);

    //retorno apenas o send pq ja excluiu, 200=ok
    return res.send();

  }catch(err){
    return res.status(400).send({ error: 'error deleting project' });
  }
});

module.exports = app => app.use('/projects', router);

//15.45 metodo de update e post com as task