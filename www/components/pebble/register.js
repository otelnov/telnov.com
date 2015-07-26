export default ngModule => {
  ngModule.directive('pebbleRegister', [()=> {
    return {
      restrict: 'E',
      template: require('./register.html'),
      controller: 'PebbleRegisterController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('PebbleRegisterController', [
    'PebbleFactory', '$state',
    function (pebbleFactory, $state) {
      let vm = this;
      vm.model = {};
      vm.loggedIn = false;

      pebbleFactory.current((err, user) => {
        if (!err && user) {
          vm.loggedIn = true;
          $state.go('pebble.notes');
        }
      });

      vm.register = () => {
        pebbleFactory.register(vm.model, (err, data) => {
          if (!err && data && data.token) {
            vm.model = {};
            vm.loggedIn = true;
            $state.go('pebble.notes');
          }
        });
      };
    }
  ]);
};

