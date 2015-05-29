var mongoose = require('mongoose');
var Comments = mongoose.model('Comments');
var _ = require('lodash');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');

  app.post('/api/comment', function (req, res) {
    var body = req.body;

    //if (!body.text) {
    //  return res.status(400).end('');
    //}

    var comment = new Comments({
      text: body.text,
      user: body.userId
    });

    comment.save(function(err, comment){
      res.json({error: err, comment: comment});
    });
  });

  app.get('/api/comments', function (req, res) {
    Comments
      .find()
      .lean()
      .populate('user')
      .exec(function (err, comments) {
      res.json({error: err, comments: comments});
    });
  });
};
