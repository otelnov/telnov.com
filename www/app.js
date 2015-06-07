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
          user: ['$http', 'config', '$state', ($http, config, $state)=> {
            return $http.get(config.apiUrl + '/users/current').then(
              ()=> null, ()=> $state.go('wedding.auth')
            );
          }]
        }
      })
      .state('wedding.auth', {
        url: '/wedding/auth',
        template: '<wedding-auth></wedding-auth>',
        resolve: {
          user: ['$http', 'config', '$state', ($http, config, $state)=> {
            return $http.get(config.apiUrl + '/users/current').then(
              ()=> $state.go('wedding.main'),
              ()=> null
            );
          }]
        }
      })
      .state('wedding.admin', {
        url: '/wedding/admin',
        template: '<wedding-admin></wedding-admin>',
        resolve: {
          user: ['$http', 'config', '$state', ($http, config, $state)=> {
            return $http.get(config.apiUrl + '/users/current').then(
                response=> {

                if (response && response.data && response.data.isAdmin) {
                  return;
                }
                $state.go('wedding.main');
              }, ()=> $state.go('wedding.auth')
            );
          }]
        }
      });
  }
]);

ngModule.factory('AuthTokenFactory', ['$window', ($window) => {
  let store = $window.localStorage;
  let key = 'auth-token';

  return {
    getToken: ()=>store.getItem(key),
    setToken: token=> {
      if (token) {
        store.setItem(key, token);
      } else {
        store.removeItem(key);
      }
    }
  };
}]);

ngModule.factory('AuthInterceptor', ['AuthTokenFactory', (AuthTokenFactory) => {
  return {
    request: config=> {
      let token = AuthTokenFactory.getToken();

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  };
}]);

ngModule.constant('config', {
  apiUrl: 'http://telnov.com/api'
});

angular.bootstrap(document, ['tc']);
