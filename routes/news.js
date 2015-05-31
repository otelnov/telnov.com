var mongoose = require('mongoose');
var News = mongoose.model('News');
var _ = require('lodash');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');

  app.post('/api/news', function (req, res) {
    var body = req.body;

    if (!body.text) {
      return res.status(400).end('');
    }

    var news = new News({
      text: body.text
    });

    news.save(function(err, news){
      res.json({error: err, news: news});
    });
  });

  app.get('/api/news', function (req, res) {
    News.find().lean().exec(function (err, news) {
      res.json({error: err, news: news});
    });
  });

  app.delete('/api/news/:id', function (req, res) {
    News.remove({_id: req.params.id}).exec(function (err) {
      res.json({error: err});
    });
  });
};
