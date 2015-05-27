let angular = require('angular');
let ngModule = angular.module('tc', [
  'ui.router',
  'oc.lazyLoad'
]);

ngModule.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
  ($stateProvider, $urlRouterProvider, $httpProvider) => {

    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');

    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('AuthInterceptor');

    $stateProvider
      .state('main', {
        url: '/',
        template: 'hello'
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
        template: '<wedding-main></wedding-main>'
      })
      .state('wedding.auth', {
        url: '/wedding/auth',
        template: '<wedding-auth></wedding-auth>'
      })
      .state('wedding.admin', {
        url: '/wedding/admin',
        template: '<wedding-admin></wedding-admin>'
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

ngModule.constant('conf', {
  API_URL: 'http://localhost:1488/api'
});

angular.bootstrap(document, ['tc']);
