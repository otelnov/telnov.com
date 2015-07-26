let angular = require('angular');
let ngModule = angular.module('tc');

require('./pebble.css');
require('./factory')(ngModule);

require('./register')(ngModule);
require('./settings')(ngModule);
require('./notes')(ngModule);
