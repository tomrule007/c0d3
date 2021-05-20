const app = require('./server/index.js');

const port = process.env.PORT || 8123;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
