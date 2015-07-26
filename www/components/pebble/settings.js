export default ngModule => {
  ngModule.directive('pebbleSettings', [()=> {
    return {
      restrict: 'E',
      template: require('./settings.html'),
      controller: 'PebbleController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('PebbleController', [
    'PebbleFactory', '$state', 'AuthTokenFactory',
    function (pebbleFactory, $state, AuthTokenFactory) {
      let vm = this;
      vm.model = {};
      vm.isReady = false;
      vm.loggedIn = false;

      pebbleFactory.current((err, user) => {
        vm.isReady = true;
        if (!err && user) {
          vm.loggedIn = true;
          vm.current = user;
        }
      });

      vm.login = () => {
        pebbleFactory.login(vm.model, (err, data) => {
          if (!err && data && data.token) {
            vm.model = {};
            vm.loggedIn = true;
            vm.current = data.user;
            location.href = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(data));
          }
        });
      };

      vm.register = () => {
        pebbleFactory.register(vm.model, (err, data) => {
          if (!err && data && data.token) {
            vm.model = {};
            vm.loggedIn = true;
            $state.go('pebble.notes');
          }
        });
      };

      vm.logout = () => {
        AuthTokenFactory.setToken();
        vm.loggedIn = false;
      };
    }
  ]);
};

