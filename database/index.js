const mongooso = require('mongoose');

/**
 * Faz a conexao com o banco de dados.
 */
mongooso.connect('mongodb://localhost/noderest', { useMongoClient: true});
mongooso.Promise = global.Promise;
