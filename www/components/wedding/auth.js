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
    'WeddingFactory',
    function (weddingFactory) {
      let vm = this;
      vm.mode = 'register';
      vm.regModel = {};
      vm.logModel = {};
      vm.register = register;
      vm.login = login;

      function register() {
        weddingFactory.register(vm.regModel, (err, resp)=> {
          console.log(err, resp);
        });
      }

      function login() {
        weddingFactory.login(vm.logModel, (err, resp)=> {
          console.log(err, resp);
        });
      }
    }
  ]);
};
