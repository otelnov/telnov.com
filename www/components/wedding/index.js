let angular = require('angular');
let ngModule = angular.module('tc');

require('./auth')(ngModule);
require('./main')(ngModule);
require('./admin')(ngModule);
