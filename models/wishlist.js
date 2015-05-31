var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
  'use strict';

  var WishlistSchema = new Schema({
    text: String,
    user: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'Users'
    },
    status: {type: Boolean, default: false},
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  mongoose.model('Wishlist', WishlistSchema, 'Wishlist');
};






