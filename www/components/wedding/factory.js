export default ngModule => {
  ngModule.factory('WeddingFactory', [
    '$http', 'config', 'AuthTokenFactory',
    function ($http, config, AuthTokenFactory) {
      let api = config.apiUrl;
      let me = null;

      return {
        login: login,
        register: register,
        current: current,
        mail: mail,

        get: get,
        post: post,
        put: put,
        remove: remove
      };

      function login(data, cb) {
        $http.post(api + '/users/login', data).then(response => {
          AuthTokenFactory.setToken(response.data.token);
          cb(false, response);
        }, err=> cb(err.data));
      }

      function register(data, cb) {
        $http.post(api + '/users/register', data).then(response=> {
          AuthTokenFactory.setToken(response.data.token);
          cb(false, response);
        }, err=> cb(err.data));
      }

      function current(update, cb) {
        if (typeof cb === 'undefined') {
          cb = update;
        }

        if (me && !update) {
          return cb(null, me);
        }

        $http.get(api + '/users/current').then(response=> {
          me = response.data;
          cb(false, response.data);
        }, err=> cb(err));
      }

      function get(name, cb) {
        $http.get(api + '/' + name).then(response=> {
          cb(false, response.data);
        }, err=> cb(err));
      }

      function remove(name, id, cb) {
        $http.delete(api + '/' + name + '/' + id).then(response=> {
          cb(false, response.data);
        }, err=> cb(err));
      }

      function post(name, data, cb) {
        $http.post(api + '/' + name, data).then(response=> {
          cb(false, response.data);
        }, err=> cb(err));
      }

      function put(route, data, cb) {
        $http.put(api + route, data).then(response=> {
          cb(false, response.data);
        }, err=> cb(err));
      }

      function mail(data, cb) {
        $http.post(api + '/sendEmail', data).then(response=> {
          cb(false, response.data);
        }, err=> cb(err));
      }
    }
  ]);
};
