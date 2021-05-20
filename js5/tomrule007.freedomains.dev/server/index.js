const cors = require('cors');
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
console.log('CORS IS ON!');
app.use((req, res, next) => {
  require('./app/router')(req, res, next);
});

// Seem to be getting this feature for
console.log('r');

if (process.env.NODE_ENV === 'development')
  require('./hot-swapper').hotSwapper();

module.exports = app;
