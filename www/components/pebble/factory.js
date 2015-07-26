export default ngModule => {
  ngModule.factory('PebbleFactory', [
    '$http', 'config', 'AuthTokenFactory',
    function ($http, config, AuthTokenFactory) {
      let api = config.apiUrl;

      function current(cb) {
        $http.get(`${api}/pebble/current`).then(
            res => cb(null, res.data),
            res => cb(res)
        );
      }

      function login(model, cb) {
        $http.post(`${api}/pebble/login`, model).then(
            res => {
            if (res.data && res.data.token) {
              AuthTokenFactory.setToken(res.data.token);
            }
            cb(null, res.data);
          }, res => cb(res)
        );
      }

      function register(model, cb) {
        $http.post(`${api}/pebble/register`, model).then(
            res => {
            if (res.data && res.data.token) {
              AuthTokenFactory.setToken(res.data.token);
            }
            cb(null, res.data);
          }, res => cb(res)
        );
      }

      function getNotes(cb) {
        $http.get(`${api}/pebble/notes`).then(
            res => cb(null, res.data.notes[0].items),
            res => cb(res)
        );
      }

      function createNote(model, cb) {
        $http.post(`${api}/pebble/notes`, model).then(
            res => cb(null, res.data),
            res => cb(res)
        );
      }

      return {current, login, register, getNotes, createNote};
    }
  ]);
};
