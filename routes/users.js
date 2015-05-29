var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var crypto = require('crypto');
var _ = require('lodash');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');
  var jwtSecret = config.JWT_SECRET;

  app.get('/api/users/current', function (req, res) {
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

  app.post('/api/users/register', register, auth, _.noop);

  app.post('/api/users/login', login, auth, _.noop);

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

    if (!body.password || !body.email || !body.name) {
      return res.status(400).end('Заповнено не всі обов\'язкові поля.');
    }

    Users.findOne({
      'email': body.email
    }, function (err, user) {
      if (err) {
        return res.status(400).end(err);
      }

      if (user) {
        return res.status(400).end('Ви вже зареєстровані, перейдіть на сторінку авторизації');
      }

      var newUser = new Users({
        name: body.name,
        email: body.email,
        password: md5(body.password)
      });

      newUser.save(function (err, user) {
        if (err) {
          return res.status(400).end(err);
        }
        user = user.toObject();
        delete user.password;
        req.userData = user;
        next();
      });
    });
  }

  function login(req, res, next) {
    var body = req.body;

    if (!body.email || !body.password) {
      return res.status(400).end('Заповнено не всі обов\'язкові поля.');
    }

    Users.findOne({
      email: body.email,
      password: md5(body.password)
    }).lean().exec(function (err, user) {
      if (err) {
        return res.status(503).end(err);
      }

      if (!user) {
        return res.status(401).end('Ви ще не зареєстровані або не правильно ввели дані.');
      }

      req.userData = user;
      next();
    })
  }

  function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
  }

  app.get('/api/guests', function (req, res) {
    Users.find().lean().exec(function (err, users) {
      res.json({error: err, users: users});
    });
  });

  app.delete('/api/guest', function (req, res) {
    Users.remove({_id: req.query.id}).exec(function (err) {
      res.json({error: err});
    });
  });

  app.post('/api/users/addPerson', function (req, res) {
    Users.findOneAndUpdate({email: req.user.email}, {
      $push: {
        guests: req.body
      }
    }, function (err, user) {
      res.json({error: err, user: user});
    });
  });

  app.get('/api/users/current', function (req, res) {
    Users.findOne({email: req.user.email}).lean().exec(function (err, user) {
      res.json({error: err, user: user});
    });
  });

  app.post('/api/users/checkPerson', function (req, res) {
    Users.findOneAndUpdate({email: req.user.email, 'guests.name': req.body.name}, {
      $set: {
        'guests.$.status': req.body.status
      }
    }, function (err, user) {
      res.json({error: err, user: user});
    });
  });
};
