var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
  'use strict';

  var HelpSchema = new Schema({
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  mongoose.model('Help', HelpSchema, 'Help');
};
