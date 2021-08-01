const fs = require('fs');
const path = require('path');

/*
  Esse arquivo automatia todas importaçoes dos controllers

  recebe o app, ele vaai ler o diretorio, e filtrar arquivos que tem o nome index.js(pq é esse aquivo aqui)
  e ignorando arquivos que começam com '.', sendo assim ja importa todos arquivos que sao controlers 

  o require passa o app pra todas controllers

  assim no index.js na raiz do projeto, só é preciso importar o app, e todos controllers automaticamente vao ter ele junto.

*/

module.exports = app => {
  fs
  .readdirSync(__dirname)
  .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
  .forEach(file => require(path.resolve(__dirname, file))(app));
};