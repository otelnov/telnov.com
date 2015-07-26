var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
  'use strict';

  var NotesSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Users'
    },
    title: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  mongoose.model('PebbleNotes', NotesSchema, 'PebbleNotes');
};






