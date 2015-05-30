var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
  'use strict';

  var CommentsSchema = new Schema({
    text: String,
    user: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Users'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  mongoose.model('Comments', CommentsSchema, 'Comments');
};






