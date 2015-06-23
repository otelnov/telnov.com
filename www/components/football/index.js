let angular = require('angular');
let ngModule = angular.module('tc');

require('./football.css');
require('./factory')(ngModule);

require('./main')(ngModule);
