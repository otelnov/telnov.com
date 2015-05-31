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
      weddengFactory.current((err, current) => {
        vm.guests = current.guests;
        vm.me = current;

        vm.logout = function () {
          authTokenFactory.setToken();
          $state.go('wedding.auth');
        };

        vm.addPerson = function () {
          vm.showAddPerson = false;
          weddengFactory.addPerson({name: vm.newPersonName, status: true}, function () {
            vm.guests.push({name: vm.newPersonName, status: true});
            vm.newPersonName = '';
          });
        };

        vm.checkPerson = function (user) {
          weddengFactory.checkPerson(user);
        };

        vm.removePerson = function (user, index) {
          if (confirm('точно видалити ' + user.name + '?')) {
            vm.guests.splice(index, 1);
            weddengFactory.removePerson({guests: vm.guests});
          }
        };

        vm.addComment = function () {
          weddengFactory.addComment({
            text: vm.userComment
          }, function () {

          });
        };
      });
    }
  ]);
};
