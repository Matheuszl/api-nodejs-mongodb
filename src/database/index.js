const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const uri = "mongodb+srv://dbMatheus:dbMatheus@cluster0.k2pm3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
//C:\Program Files\MongoDB\Server\4.4\bin

module.exports = mongoose;