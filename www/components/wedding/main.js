export default ngModule => {
  ngModule.directive('weddingMain', [()=> {
    return {
      restrict: 'E',
      template: require('./main.html'),
      controller: 'weddingMainController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('weddingMainController', [
    'AuthTokenFactory', '$state', 'WeddingFactory', '$window',
    function (authTokenFactory, $state, weddengFactory, $window) {
      let vm = this;

      vm.scroll = function () {
        $window.scrollTo(0, 0);
      };

      weddengFactory.current((error, current) => {
        vm.guests = current.guests;
        vm.me = current;

        vm.logout = function () {
          authTokenFactory.setToken();
          $state.go('wedding.auth');
        };

        vm.addPerson = function () {
          vm.showAddPerson = false;
          weddengFactory.put('/users/addPerson', {name: vm.newPersonName, status: true}, function () {
            vm.guests.push({name: vm.newPersonName, status: true});
            vm.newPersonName = '';
          });
        };

        vm.checkPerson = function (user) {
          weddengFactory.put('/users/checkPerson', user, function () {
          });
        };

        vm.removePerson = function (user, index) {
          if (confirm('точно видалити ' + user.name + '?')) {
            vm.guests.splice(index, 1);
            weddengFactory.put('/users/removePerson', {guests: vm.guests}, function () {
            });
          }
        };

        vm.addComment = function () {
          weddengFactory.post('comments', {text: vm.userComment}, function () {
            vm.userComment = '';
            alert('Дякуємо');
          });
        };

        weddengFactory.get('news', function (err, data) {
          vm.news = data.news;
        });

        weddengFactory.get('help', function (err, data) {
          vm.help = data.help;
        });

        weddengFactory.get('wishlist', function (err, data) {
          vm.wishlist = data.wishlist;

          vm.wishlist.forEach(function (w) {
            w.my = w.user && w.user._id === vm.me._id;
          });
        });

        vm.checkWish = function (wish) {
          wish.status = wish.status;
          wish.user = wish.status ? vm.me._id : null;
          wish.my = wish.status;
          weddengFactory.put('/wishlist/checkWish', wish, function () {

          });
        };
      });
    }
  ]);
};
