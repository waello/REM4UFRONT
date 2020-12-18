const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./public'));

app.get('/*', function(req, res) {
  res.sendfile('./build/main.html');
});

app.listen(process.env.PORT || 8080);

console.log(`Running on port ${process.env.PORT || 8080}`)
