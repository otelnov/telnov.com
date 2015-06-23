var mongoose = require('mongoose');
var Football = mongoose.model('Football');
//var _ = require('lodash');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');

  app.post('/api/football', function (req, res) {
    var body = req.body;

    if (!body.games) {
      return res.status(400).end('');
    }

    Football.find({status: true}).lean().exec(function (err, t) {
      if (t.length > 0) {
        return res.status(400).end('You can have only one active tournament!');
      }
      var foot = new Football(body);
      foot.save(function (err, t) {
        res.json({error: err, tournament: t});
      });
    });
  });

  app.get('/api/football', function (req, res) {
    Football.findOne({status: true}).lean().exec(function (err, t) {
      res.json({error: err, tournament: t});
    });
  });

  app.put('/api/football', function (req, res) {
    var id = req.body.id;
    delete req.body.id;
    Football.findOneAndUpdate({_id: id}, {
      $set: req.body
    }, {new: true}).exec(function (err, t) {
      res.json({error: err, tournament: t});
    });
  });
};
