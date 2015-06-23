var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var gzipStatic = require('connect-gzip-static');

var app = express();
require('./config')(app);

var config = app.get('config');
var jwtSecret = config.JWT_SECRET;
var port = config.PORT;

app.use(gzipStatic('./www', {index: 'index.html', maxAge: 24 * 60 * 60 * 1000}));
app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({secret: jwtSecret}).unless({
  path: [
    '/api/users/register',
    '/api/users/login',
    '/api/football'
  ]
}));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    if (req.originalUrl.substring(0, 4) === '/api') {
      return res.status(401).end('Unauthorized');
    }
  }
  next();
});

app.listen(port, function () {
  console.log('App listening on ' + port);
});

require('./models')();
require('./routes')(app);

app.all('*', function (req, res) {
  res.sendFile('index.html', {root: './www'});
});
