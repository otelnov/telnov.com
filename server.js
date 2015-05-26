var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');

var app = express();
require('./config')(app);

var config = app.get('config');
var jwtSecret = config.JWT_SECRET;
var port = config.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({secret: jwtSecret}).unless({
	path: ['/users/register', '/users/login']
}));

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		return res.status(401).end('Unauthorized');
	}
	next();
});

app.listen(port, function () {
	console.log('App listening on ' + port);
});

require('./models')();
require('./routes')(app);