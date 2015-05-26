let angular = require('angular');
let ngModule = angular.module('tc', [
  'ui.router',
  'oc.lazyLoad'
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
        template: 'hello'
      })
      .state('wedding', {
        abstract: true,
        template: '<ui-view></ui-view>',
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

  function getToken() {
    return store.getItem(key);
  }

  function setToken(token) {
    if (token) {
      store.setItem(key, token);
    } else {
      store.removeItem(key);
    }
  }

  return {
    getToken: getToken,
    setToken: setToken
  };
}]);

ngModule.factory('AuthInterceptor', ['AuthTokenFactory', (AuthTokenFactory) => {
  function addToken(config) {
    let token = AuthTokenFactory.getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }

  return {
    request: addToken
  };
}]);

ngModule.constant('conf', {
  API_URL: 'http://localhost:8011'
});

angular.bootstrap(document, ['tc']);
