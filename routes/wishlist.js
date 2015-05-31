var mongoose = require('mongoose');
var Wishlist = mongoose.model('Wishlist');
var _ = require('lodash');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');

  app.post('/api/wishlist', function (req, res) {
    var body = req.body;

    if (!body.text) {
      return res.status(400).end('');
    }

    var wish = new Wishlist({
      text: body.text
    });

    wish.save(function (err, wish) {
      res.json({error: err, wishlist: wish});
    });
  });

  app.get('/api/wishlist', function (req, res) {
    Wishlist.find().lean().populate('user').exec(function (err, wish) {
      res.json({error: err, wishlist: wish});
    });
  });

  app.delete('/api/wishlist/:id', function (req, res) {
    Wishlist.remove({_id: req.params.id}).exec(function (err) {
      res.json({error: err});
    });
  });
};
