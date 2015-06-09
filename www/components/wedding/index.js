let angular = require('angular');
let ngModule = angular.module('tc');

require('./wedding.css');
require('./factory')(ngModule);

require('./auth')(ngModule);
require('./main')(ngModule);
require('./admin')(ngModule);
