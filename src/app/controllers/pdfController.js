const express = require('express');
const PDFPrinter = require('pdfmake');
const Project = require('../models/project')
const fs = require('fs');

//usa nas rotas
const router = express.Router();


router.get('/projetos', async (req, res) => {
  try {
    //apenas esse metodo find() ja retorna todos os projetos no bd
    const projects = await Project.find();
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

    for await (let project of projects) {
      const rows = new Array();
      rows.push(project.title);
      rows.push(project.description);

      body.push(rows);
    }

    const docDefinition = {
      defaultStyle: {
        font: 'Helvetica'
      },
      content: [
        {
          table: {
            body: [
              ['title', 'description'], ...body],
          },
        },
      ],
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    //pega o conteudo do arquivo e passa para outro lugar
    //pdfDoc.pipe(fs.createWriteStream("Relatorio.pdf"));

    //esse trecho de codigo abaixo é complexo mas basicamente ele gera o pdf 
    //no navegadr cortando seus pedaçoes e dpeois montando o nomamente
    const chunks = [];
    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });
    pdfDoc.end();
    //quando o pdfDoc tiver finalizado, faço o seguinte
    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.end(result);
    });


  } catch (err) {
    return res.status(400).send({ error: 'error create PDF for projects' });
  }
});

module.exports = app => app.use('/relatorio', router);