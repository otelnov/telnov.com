var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var PebbleUser = mongoose.model('PebbleUsers');
var PebbleNotes = mongoose.model('PebbleNotes');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');
  var jwtSecret = config.JWT_SECRET;

  app.get('/api/pebble/current', function (req, res) {
    if (!req.user || !req.user.id) {
      return res.status(503).end();
    }
    PebbleUser.findById(req.user.id).lean().exec(function (err, user) {
      if (err) {
        return res.status(503).end(err);
      }

      if (!user) {
        return res.status(401).end('user not found');
      }

      res.send(user);
    })
  });

  app.post('/api/pebble/login', function (req, res, next) {
    var body = req.body;

    if (!body.username || !body.password) {
      return res.status(400).end('username and password are required');
    }

    PebbleUser.findOne({
      username: new RegExp('^' + body.username + '$', 'i'),
      password: md5(body.password)
    }).lean().exec(function (err, user) {
      if (err) {
        return res.status(503).end(err);
      }

      if (!user) {
        return res.status(401).end('user not found');
      }

      req.userData = user;
      next();
    })
  }, auth);

  app.post('/api/pebble/register', function (req, res, next) {
    var body = req.body;

    if (!body.password || !body.username) {
      return res.status(400).end('username and password are required');
    }

    PebbleUser.findOne({
      'username': body.username
    }, function (err, user) {
      if (err) {
        return res.status(400).end(err);
      }

      if (user) {
        return res.status(400).end('User exists');
      }

      var newUser = new PebbleUser({
        username: body.username,
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

  app.post('/api/pebble/notes', function (req, res) {
    var body = req.body;

    var note = new PebbleNotes({
      text: body.text,
      title: body.title,
      user: req.user.id
    });

    note.save(function (err, note) {
      if (err) {
        return res.status(400).end(err);
      }
      res.json({error: null, note: note});
    });
  });

  app.get('/api/pebble/notes', function (req, res) {
    if (req.user && req.user.id) {
      PebbleNotes.find({user: req.user.id}).lean().exec(function (err, notes) {
        var data = [];
        notes.forEach(function (note) {
          data.push({
            title: note.title,
            subtitle: note.createdAt,
            text: note.text
          });
        });
        res.json({notes: [{items: data}]});
      });
    }
  });

  function auth(req, res) {
    var user = req.userData;
    var token = jwt.sign({
      username: user.username,
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

};
