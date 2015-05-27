export default ngModule => {
  ngModule.factory('WeddingFactory', [
    '$http', 'conf', 'AuthTokenFactory',
    function ($http, conf, AuthTokenFactory) {
      let api = conf.API_URL;

      return {
        login: login,
        register: register
      };

      function login(data, cb) {
        $http.post(api + '/users/login', data)
          .then(response => {
            AuthTokenFactory.setToken(response.data.token);
            cb(false, response);
          }, err=> {
            cb(err.data);
          });
      }

      function register(data, cb) {
        $http.post(api + '/users/register', data)
          .then(response=> {
            AuthTokenFactory.setToken(response.data.token);
            cb(false, response);
          }, err=> {
            cb(err.data);
          });
      }
    }
  ]);
};
