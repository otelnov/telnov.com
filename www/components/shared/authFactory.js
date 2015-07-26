export default ngModule => {
  ngModule.factory('AuthTokenFactory', ['$window', ($window) => {
    let store = $window.localStorage;
    let key = 'auth-token';

    if (location.pathname.indexOf('pebble') + 1) {
      key = 'pebble-token';
    }

    return {
      getToken: () => store.getItem(key),
      setToken: token => {
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
      request: config => {
        let token = AuthTokenFactory.getToken();

        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      }
    };
  }]);
};
