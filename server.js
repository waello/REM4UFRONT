
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static("./dist/vtc-comparator-front"));

app.get('/*', function(req,res){
  const fullPath = path.join(__dirname + '/dist/vtc-comparator-front/index.html');
  console.log(" Fetching from.." + fullPath);
  res.sendFile(fullPath);
})

app.listen(process.env.PORT || 8080);
