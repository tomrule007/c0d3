const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());

// *Must require statements must remain wrapped in arrow function to insure files get reloaded
app.use((req, res, next) => {
  require('./p1')(req, res, next);
});
app.use((req, res, next) => {
  require('./p2')(req, res, next);
});
app.use((req, res, next) => {
  require('./p3')(req, res, next);
});
app.use((req, res, next) => {
  require('./p4')(req, res, next);
});

module.exports = app;