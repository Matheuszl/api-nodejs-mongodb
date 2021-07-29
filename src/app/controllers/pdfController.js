const express = require('express');
const PDFPrinter = require('pdfmake');
const fs = require('fs');

//usa nas rotas
const router = express.Router();


router.get('/pdf', async (req, res) => {
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

  const docDefinition = {
    defaultStyle: {
      font: 'Helvetica'
    },
    content: [
      'Relatorio de projetos',
      'projetos em desenvolvimentos pdf'
    ]
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  //pega o conteudo do arquivo e passa para outro lugar
  pdfDoc.pipe(fs.createWriteStream("Relatorio.pdf"));

  pdfDoc.end();

  res.send('Relatorio concluido');
});


module.exports = app => app.use('/relatorio', router);