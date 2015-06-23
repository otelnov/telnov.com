var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
  'use strict';

  var UsersSchema = new Schema({
    password: {
      type: String,
      select: false
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true
    },
    name: String,
    guests: [{
      name: String,
      status: Boolean
    }],
    status: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  });

  mongoose.model('Users', UsersSchema, 'Users');
};






