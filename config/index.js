var mongoose = require('mongoose');

module.exports = function (app) {
	'use strict';

	var devConfig = {
		MONGO_DB: 'mongodb://localhost/telnov',
		PORT: 1488,
		HOST: 'http://localhost',
		JWT_SECRET: 'sEDve3dGgr366c35H854ca6/a0568a5',
	};

	var liveConfig = {
		MONGO_DB: 'mongodb://localhost/telnov',
		PORT: 8814,
		HOST: 'http://telnov.com',
		JWT_SECRET: '434ff08FV3re01c35FT56c/a6a5f68a5',
	};

	var env = process.env.NODE_ENV || 'development';

	if (env === 'development') {
		mongoose.connect(devConfig.MONGO_DB);
		app.set('config', devConfig);
	}

	if (env === 'production') {
		mongoose.connect(liveConfig.MONGO_DB);
		app.set('config', liveConfig);
	}
};