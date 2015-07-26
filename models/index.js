module.exports = function () {
	'use strict';

	require('./users')();
	require('./pebbleUsers')();
	require('./pebbleNotes')();
	require('./help')();
	require('./news')();
	require('./comments')();
	require('./wishlist')();
	require('./football')();
};
