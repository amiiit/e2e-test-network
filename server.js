const express = require('express');

const app = express();

app.get('/weather', function(req, res) {
  res.send({ weather: 'nice' })
});

app.get('/', function(req, res) {

});

app.listen(8888);
