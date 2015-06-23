export default ngModule => {
  ngModule.directive('weddingMain', [()=> {
    return {
      restrict: 'E',
      template: require('./main.html'),
      controller: 'weddingMainController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.directive('mapCanvas', function () {
    return {
      restrict: 'E',
      link: function (scope, element) {
        google.maps.visualRefresh = true;
        var map;
        var geocoder = new google.maps.Geocoder();
        var addr = document.getElementById('map-input');
        var address = addr.innerText || addr.textContent;
        var mapOptions = {
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          scrollwheel: false
        };
        map = new google.maps.Map(element[0], mapOptions);

        if (geocoder) {
          geocoder.geocode({'address': address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
                map.setCenter(results[0].geometry.location);

                var infowindow = new google.maps.InfoWindow({
                  content: address,
                  map: map,
                  position: results[0].geometry.location
                });

                var marker = new google.maps.Marker({
                  position: results[0].geometry.location,
                  map: map,
                  title: address
                });

              } else {
                //alert('No results found');
              }
            }
          });
        }
      }
    };
  });

  ngModule.controller('weddingMainController', [
    'AuthTokenFactory', '$state', 'WeddingFactory', '$window',
    function (authTokenFactory, $state, weddingFactory, $window) {
      let vm = this;

      //govnokod
      $('body').removeClass('authBody');

      vm.scroll = function () {
        $window.scrollTo(0, 0);
      };

      weddingFactory.current((error, current) => {
        vm.guests = current.guests;
        vm.me = current;

        vm.logout = function () {
          authTokenFactory.setToken();
          $state.go('wedding.auth');
        };

        vm.addPerson = function () {
          vm.showAddPerson = false;
          weddingFactory.put('/users/addPerson', {name: vm.newPersonName, status: true}, function () {
            vm.guests.push({name: vm.newPersonName, status: true});
            vm.newPersonName = '';
          });
        };

        vm.checkPerson = function (user) {
          weddingFactory.put('/users/checkPerson', user, function () {
          });
        };

        vm.checkMe = function () {
          weddingFactory.put('/users/checkMe', {status: vm.me.status}, function () {
          });
        };

        vm.removePerson = function (user, index) {
          if (confirm('точно видалити ' + user.name + '?')) {
            vm.guests.splice(index, 1);
            weddingFactory.put('/users/removePerson', {guests: vm.guests}, function () {
            });
          }
        };

        vm.addComment = function () {
          weddingFactory.post('comments', {text: vm.userComment}, function () {
            vm.userComment = '';
            alert('Дякуємо');
          });
        };

        weddingFactory.get('news', function (err, data) {
          vm.news = data.news;
        });

        weddingFactory.get('help', function (err, data) {
          vm.help = data.help;
        });

        weddingFactory.get('wishlist', function (err, data) {
          vm.wishlist = data.wishlist;

          vm.wishlist.forEach(function (w) {
            w.my = w.user && w.user._id === vm.me._id;
          });
        });

        vm.checkWish = function (wish) {
          wish.status = wish.status;
          wish.user = wish.status ? vm.me._id : null;
          wish.my = wish.status;
          weddingFactory.put('/wishlist/checkWish', wish, function () {

          });
        };
      });
    }
  ]);
};
