var _ = require('lodash');
var mongoose = require('mongoose');

module.exports = function (app) {
  'use strict';

  var env = process.env.NODE_ENV || 'development';

  var config = {
    MONGO_DB: 'mongodb://localhost/telnov'
  };

  if (env === 'development') {
    config = _.merge(require('./dev.js'), config);
  }

  if (env === 'production') {
    config = _.merge(require('./prod.js'), config);
  }

  mongoose.connect(config.MONGO_DB);
  app.set('config', config);
};
