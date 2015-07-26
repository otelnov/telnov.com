require('bootstrapCSS');
require('bootstrapJS');
require('ajquery');
require('affix');

let angular = require('angular');
let ngModule = angular.module('tc', [
  'ui.router',
  'oc.lazyLoad',
  'mgcrea.jquery',
  'mgcrea.bootstrap.affix'
]);

ngModule.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
  ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) => {

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('AuthInterceptor');

    $stateProvider
      .state('main', {
        url: '/',
        template: '',
        resolve: {
          redirect: ['$window', $window => $window.location.href = 'https://twitter.com/otelnov']
        }
      })
      .state('wedding', {
        abstract: true,
        template: require('./components/wedding/layout.html'),
        resolve: {
          lazy: ['$ocLazyLoad', $ocLazyLoad => $ocLazyLoad.load('./build/wedding.bundle.js')]
        }
      })
      .state('wedding.main', {
        url: '/wedding',
        template: '<wedding-main></wedding-main>',
        resolve: {
          user: ['$http', 'config', '$state', ($http, config, $state) => {
            return $http.get(config.apiUrl + '/users/current').then(
              () => null, () => $state.go('wedding.auth')
              );
          }]
        }
      })
      .state('wedding.auth', {
        url: '/wedding/auth',
        template: '<wedding-auth></wedding-auth>',
        resolve: {
          user: ['$http', 'config', '$state', ($http, config, $state) => {
            return $http.get(config.apiUrl + '/users/current').then(
              () => $state.go('wedding.main'),
              () => null
              );
          }]
        }
      })
      .state('wedding.admin', {
        url: '/wedding/admin',
        template: '<wedding-admin></wedding-admin>',
        resolve: {
          user: ['$http', 'config', '$state', ($http, config, $state) => {
            return $http.get(config.apiUrl + '/users/current').then(
              response=> {

                if (response && response.data && response.data.isAdmin) {
                  return;
                }
                $state.go('wedding.main');
              }, () => $state.go('wedding.auth')
              );
          }]
        }
      })

      .state('football', {
        abstract: true,
        template: require('./components/football/layout.html'),
        resolve: {
          lazy: ['$ocLazyLoad', $ocLazyLoad => $ocLazyLoad.load('./build/football.bundle.js')]
        }
      })
      .state('football.main', {
        url: '/football',
        template: '<football-main></football-main>'
      })

      .state('pebble', {
        abstract: true,
        template: require('./components/pebble/layout.html'),
        resolve: {
          lazy: ['$ocLazyLoad', $ocLazyLoad => $ocLazyLoad.load('./build/pebble.bundle.js')]
        }
      })
      .state('pebble.settings', {
        url: '/pebble/settings',
        template: '<pebble-settings></pebble-settings>'
      })
      .state('pebble.register', {
        url: '/pebble/register',
        template: '<pebble-register></pebble-register>'
      })
      .state('pebble.notes', {
        url: '/pebble/notes',
        template: '<pebble-notes></pebble-notes>'
      });
  }
]);

require('./components/shared')(ngModule);

let conf = {};
conf.apiUrl = ON_PROD ? 'http://telnov.com/api' : 'http://71320035.ngrok.io/api';
ngModule.constant('config', conf);

angular.bootstrap(document, ['tc']);
