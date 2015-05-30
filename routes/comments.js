var mongoose = require('mongoose');
var Comments = mongoose.model('Comments');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');

  app.post('/api/comment', function (req, res) {
    var body = req.body;

    if (!body.text || !body.userId) {
      return res.status(400).end('text and userId are required');
    }

    var comment = new Comments({
      text: body.text,
      user: body.userId
    });

    comment.save(function (err, comment) {
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
