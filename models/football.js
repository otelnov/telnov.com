var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
  'use strict';

  var FootballSchema = new Schema({
    games: {},
    name: String,
    status: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  mongoose.model('Football', FootballSchema, 'Football');
};






