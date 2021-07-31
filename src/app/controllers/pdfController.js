const express = require('express');
const PDFPrinter = require('pdfmake');
const Project = require('../models/project')
const User = require('../models/User');
const fs = require('fs');

//usa nas rotas
const router = express.Router();

var generateNewPdf = function (print, doc, response) {
  //pega o conteudo do arquivo e passa para outro lugar
  //pdfDoc.pipe(fs.createWriteStream("Relatorio.pdf"));

  //esse trecho de codigo abaixo é complexo mas basicamente ele gera o pdf 
  //no navegadr cortando seus pedaçoes e dpeois montando o nomamente
  const pdfDoc = print.createPdfKitDocument(doc);
  const chunks = [];
  //quando o pdfDoc tiver finalizado, faço o seguinte
  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk);
  });
  pdfDoc.end();

  //quando o pdfDoc tiver finalizado, faço o seguinte
  pdfDoc.on("end", () => {
    const result = Buffer.concat(chunks);
    response.end(result);
  });

}

router.get('/usuarios', async (req, res) => {
  try {
    const users = await User.find();
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      },
    };

    const printer = new PDFPrinter(fonts);
    const body = [];

    for await (let user of users) {
      const rows = new Array();
      rows.push(user.name);
      rows.push(user.email);
      body.push(rows);
    }

    const docDefinition = {
      defaultStyle: {
        font: 'Helvetica' //muito importante, se tirar isso o coigo da pau
      },
      content: [
        { text: 'Usuarios', style: 'header' },
        'Relatorio usuarios cadastrados no sistema',
        {
          table: {
            body: [
              ['Nome', 'E-mail'], ...body],
          },
        },
      ],
    };

    generateNewPdf(printer, docDefinition, res);

  } catch (err) {
    return res.status(400).send({ error: 'error create PDF for users' });
  }
});


router.get('/projetos', async (req, res) => {
  try {
    //apenas esse metodo find() ja retorna todos os projetos no bd
    const projects = await Project.find().populate(['user']);
    // Define font files
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      },
    };

    const printer = new PDFPrinter(fonts);
    const body = [];

    //nesse for varremos oque buscamos do banco de dados e colomos em um array apenas oque queremos
    for await (let project of projects) {
      const rows = new Array();
      rows.push(project.id);
      rows.push(project.title);
      rows.push(project.description);
      rows.push(project.user.name);
      //rows.push(project.user.email);
      rows.push(project.createdAt);

      body.push(rows);
    }

    const docDefinition = {
      defaultStyle: {
        font: 'Helvetica' //muito importante, se tirar isso o coigo da pau
      },
      content: [
        { text: 'PROJETOS', style: 'header' },
        'Relatorio de projetos atuais em desenvolvimento',
        {
          table: {
            body: [
              ['ID', 'Titulo', 'Descrição', 'Usuario', 'Data emissão'], ...body],
          },
        },
      ],
    };

    generateNewPdf(printer, docDefinition, res);

  } catch (err) {
    return res.status(400).send({ error: 'error create PDF for projects' });
  }
});



module.exports = app => app.use('/relatorio', router);