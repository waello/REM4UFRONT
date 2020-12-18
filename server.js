const express = require('express');
const path = require('path');
const app = express();

// Serve static files....
app.use(express.static( './dist/vtc-comparator-front'));

// Send all requests to index.html

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../dist/vtc-comparator-front/index.html'))

});

// default Heroku PORT
app.listen(process.env.PORT || 3000);
