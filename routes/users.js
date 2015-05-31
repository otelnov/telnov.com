var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var crypto = require('crypto');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');
  var jwtSecret = config.JWT_SECRET;

  app.get('/api/users/current', function (req, res) {
    if (!req.user || !req.user.id) {
      return res.status(503).end();
    }
    Users.findById(req.user.id).lean().exec(function (err, user) {
      if (err) {
        return res.status(503).end(err);
      }

      if (!user) {
        return res.status(401).end('user not found');
      }

      res.send(user);
    })
  });

  app.post('/api/users/register', function (req, res, next) {
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
  }, auth);

  app.post('/api/users/login', function (req, res, next) {
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
  }, auth);

  app.get('/api/users', function (req, res) {
    Users.find().lean().exec(function (err, users) {
      res.json({error: err, users: users});
    });
  });

  app.delete('/api/users/:id', function (req, res) {
    Users.remove({_id: req.params.id}).exec(function (err) {
      res.json({error: err});
    });
  });

  app.put('/api/users/addPerson', function (req, res) {
    Users.findByIdAndUpdate(req.user.id, {
      $push: {
        guests: req.body
      }
    }, function (err, user) {
      res.json({error: err, user: user});
    });
  });

  app.put('/api/users/removePerson', function (req, res) {
    Users.update({email: req.user.email}, {
      $set: {guests: req.body.guests}
    }).exec(function (err, user) {
      res.json({error: err, user: user});
    });
  });

  app.put('/api/users/checkPerson', function (req, res) {
    Users.findOneAndUpdate({email: req.user.email, 'guests.name': req.body.name}, {
      $set: {
        'guests.$.status': req.body.status
      }
    }, function (err, user) {
      res.json({error: err, user: user});
    });
  });

  function auth(req, res) {
    var user = req.userData;
    var token = jwt.sign({
      email: user.email,
      id: user._id
    }, jwtSecret);
    res.send({
      token: token,
      user: user
    });
  }

  function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
  }
}
;
