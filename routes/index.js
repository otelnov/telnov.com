module.exports = function (app) {
	'use strict';

	require('./users')(app);
	require('./help')(app);
	require('./news')(app);
	require('./comments')(app);
	require('./wishlist')(app);
	require('./football')(app);
	require('./pebble')(app);
};
