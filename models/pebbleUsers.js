var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
  'use strict';

  var UsersSchema = new Schema({
    password: {
      type: String,
      select: false
    },
    username: {
      type: String,
      unique: true,
      index: true,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  mongoose.model('PebbleUsers', UsersSchema, 'PebbleUsers');
};






