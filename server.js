var path = require('path');
var express = require('express');

var app = express();

app.use(express.static('dist'));
app.set('port', process.env.PORT || 8080);

app.get('/*', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

var server = app.listen(app.get('port'), function() {
});
