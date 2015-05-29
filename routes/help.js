var mongoose = require('mongoose');
var Help = mongoose.model('Help');
var _ = require('lodash');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');

  app.post('/api/help', function (req, res) {
    var body = req.body;

    if (!body.text) {
      return res.status(400).end('');
    }

    var help = new Help({
      text: body.text
    });

    help.save(function (err, help) {
      res.json({error: err, help: help});
    });
  });

  app.get('/api/help', function (req, res) {
    Help.find().lean().exec(function (err, help) {
      res.json({error: err, help: help});
    });
  });

  app.delete('/api/help', function (req, res) {
    Help.remove({_id: req.query.id}).exec(function (err) {
      res.json({error: err});
    });
  });
};
