export default ngModule => {
  ngModule.factory('FootballFactory', [
    '$http', 'config',
    function ($http, config) {
      let api = config.apiUrl;

      return {shuffle, create, get, put, players};

      function get(cb) {
        $http.get(`${api}/football`).then(response=> {
          cb(false, response.data);
        }, err=> cb(err));
      }

      function create(data, cb) {
        $http.post(`${api}/football`, data).then(response=> {
          cb(false, response.data);
        }, err=> cb(err));
      }

      function put(data, cb) {
        $http.put(`${api}/football`, data).then(response=> {
          cb(false, response.data);
        }, err=> cb(err));
      }

      function players() {
        return ['Svyat', 'Yura', 'Igor', 'Sasha'];
      }

      function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
    }
  ]);
};
