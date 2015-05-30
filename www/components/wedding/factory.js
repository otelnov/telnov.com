export default ngModule => {
  ngModule.factory('WeddingFactory', [
    '$http', 'conf', 'AuthTokenFactory',
    function ($http, conf, AuthTokenFactory) {
      let api = conf.API_URL;

      return {
        login: login,
        register: register,
        getCurrent: getCurrent,
        guests: guests,
        removeGuest: removeGuest,
        help: help,
        removeHelp: removeHelp,
        addHelp: addHelp,
        news: news,
        addNews: addNews,
        removeNews: removeNews,
        comments: comments,
        addComment: addComment,
        addWish: addWish,
        wishlist: wishlist,
        removeWish: removeWish,
        addPerson: addPerson,
        removePerson: removePerson,
        checkPerson: checkPerson
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

      function getCurrent(cb) {
        $http.get(api + '/users/current')
          .then(response=> {
            cb(false, response.data);
          }, err=> {
            cb(err);
          });
      }

      function guests(cb) {
        $http.get(api + '/guests')
          .then(response=> {
            cb(false, response.data.users);
          }, err=> {
            cb(err);
          });
      }

      function help(cb) {
        $http.get(api + '/help')
          .then(response=> {
            cb(false, response.data.help);
          }, err=> {
            cb(err);
          });
      }

      function addHelp(data, cb) {
        $http.post(api + '/help', data)
          .then(response=> {
            cb(false, response.data.help);
          }, err=> {
            cb(err);
          });
      }

      function news(cb) {
        $http.get(api + '/news')
          .then(response=> {
            cb(false, response.data.news);
          }, err=> {
            cb(err);
          });
      }

      function addNews(data, cb) {
        $http.post(api + '/news', data)
          .then(response=> {
            cb(false, response.data.news);
          }, err=> {
            cb(err);
          });
      }

      function comments(cb) {
        $http.get(api + '/comments')
          .then(response=> {
            cb(false, response.data.comments);
          }, err=> {
            cb(err);
          });
      }

      function addComment(data, cb) {
        $http.post(api + '/comment', data)
          .then(response=> {
            cb(false, response.data.comment);
          }, err=> {
            cb(err);
          });
      }

      function removeGuest(data, cb) {
        $http.delete(api + '/guest?id=' + data._id)
          .then(response=> {
            cb(false, response.data);
          }, err=> {
            cb(err);
          });
      }

      function removeHelp(data, cb) {
        $http.delete(api + '/help?id=' + data._id)
          .then(response=> {
            cb(false, response.data);
          }, err=> {
            cb(err);
          });
      }

      function addWish(data, cb) {
        $http.post(api + '/wishlist', data)
          .then(response=> {
            cb(false, response.data.wishlist);
          }, err=> {
            cb(err);
          });
      }

      function wishlist(cb) {
        $http.get(api + '/wishlist')
          .then(response=> {
            cb(false, response.data.wishlist);
          }, err=> {
            cb(err);
          });
      }

      function removeWish(data, cb) {
        $http.delete(api + '/wishlist?id=' + data._id)
          .then(response=> {
            cb(false, response.data);
          }, err=> {
            cb(err);
          });
      }

      function removeNews(data, cb) {
        $http.delete(api + '/news?id=' + data._id)
          .then(response=> {
            cb(false, response.data);
          }, err=> {
            cb(err);
          });
      }

      function addPerson(data, cb) {
        $http.post(api + '/users/addPerson', data)
          .then(response=> {
            cb(false, response.data);
          }, err=> {
            cb(err);
          });
      }

      function removePerson(data, cb) {
        $http.put(api + '/users/removePerson', data)
          .then(response=> {
            cb(false, response.data);
          }, err=> {
            cb(err);
          });
      }

      function checkPerson(data, cb) {
        $http.post(api + '/users/checkPerson', data)
          .then(response=> {
            cb(false, response.data);
          }, err=> {
            cb(err);
          });
      }
    }
  ]);
};
