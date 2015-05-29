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
    'AuthTokenFactory', '$state', 'WeddingFactory',
    function (authTokenFactory, $state, weddengFactory) {
      let vm = this;

      vm.logout = logout;
      vm.addPerson = addPerson;

      vm.guests = [
        {
          name: 'Олександр Тельнов'
        }
      ];

      function addPerson() {
        vm.showAddPerson = false;
        vm.guests.push({name: vm.newPersonName});
        vm.newPersonName = '';
      }

      function logout() {
        authTokenFactory.setToken();
        $state.go('wedding.auth');
      }

      vm.addComment = ()=> {
        weddengFactory.addComment({
          text: vm.userComment,
          userId: vm.user._id
        }, function () {

        });
      };
    }
  ]);
};
