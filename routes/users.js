var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var crypto = require('crypto');
var _ = require('lodash');

module.exports = function (app) {
	'use strict';

	var config = app.get('config');
	var jwtSecret = config.JWT_SECRET;

	app.get('/users/current', function (req, res) {
		if (req.user && req.user.email) {
			Users.findOne({
				email: req.user.email
			}).lean().exec(function (err, user) {
				if (err) {
					return res.status(503).end(err);
				}

				if (!user) {
					return res.status(401).end('user not found');
				}

				res.send(user);
			})
		} else {
			return res.status(503).end();
		}

	});

	app.post('/users/register', register, auth, _.noop);

	app.post('/users/login', login, auth, _.noop);

	function auth(req, res) {
		var user = req.userData;
		var token = jwt.sign({
			email: user.email
		}, jwtSecret);
		res.send({
			token: token,
			user: user
		});
	}

	function register(req, res, next) {
		var body = req.body;

		if (!body.password || !body.email) {
			return res.status(400).end('email and password are required!');
		}

		Users.findOne({
				'email': body.email
		}, function (err, user) {
			if (err) {
				return res.status(400).end(err);
			}

			if (user) {
				return res.status(400).end('user exists');
			}

			var newUser = new Users({
				email: body.email,
				password: md5(body.password)
			});

			newUser.save(function (err, user) {
				if (err) {
					return res.status(400).end(err);
				}
				req.userData = user;
				next();
			});
		});
	}

	function login(req, res, next) {
		var body = req.body;

		if (!body.email || !body.password) {
			return res.status(400).end('email and password are required!');
		}

		Users.findOne({
			email: body.email,
			password: md5(body.password)
		}).lean().exec(function (err, user) {
			if (err) {
				return res.status(503).end(err);
			}

			if (!user) {
				return res.status(401).end('email or password incorrect');
			}

			req.userData = user;
			next();
		})
	}

	function md5(string) {
		return crypto.createHash('md5').update(string).digest('hex');
	}

};