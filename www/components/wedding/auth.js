export default ngModule => {
  ngModule.directive('weddingAuth', [()=> {
    return {
      restrict: 'E',
      template: require('./auth.html'),
      controller: 'WeddingAuthController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('WeddingAuthController', [
    'WeddingFactory', '$state',
    function (weddingFactory, $state) {
      let vm = this;
      vm.mode = 'register';
      vm.regModel = {};
      vm.logModel = {};
      vm.register = register;
      vm.login = login;

      //govnokod
      $('body').addClass('authBody');

      function register() {
        weddingFactory.register(vm.regModel, (err)=> {
          if (!err) {
            return $state.go('wedding.main');
          }
          vm.error = true;
          vm.errorMess = err;
        });
      }

      function login() {
        weddingFactory.login(vm.logModel, (err)=> {
          if (!err) {
            return $state.go('wedding.main');
          }
          vm.error = true;
          vm.errorMess = err;
        });
      }

      vm.hideErr = ()=> {
        vm.error = false;
        vm.errorMess = '';
      };
    }
  ]);
};
