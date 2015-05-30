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
      weddengFactory.getCurrent(function (err, user) {
        vm.logout = logout;
        vm.addPerson = addPerson;

        vm.guests = user.guests;
        vm.me = user;

        function addPerson() {
          vm.showAddPerson = false;
          weddengFactory.addPerson({name: vm.newPersonName, status: true}, function () {
            vm.guests.push({name: vm.newPersonName, status: true});
            vm.newPersonName = '';
          });
        }

        vm.addComment = ()=> {
          weddengFactory.addComment({
            text: vm.userComment,
            userId: vm.user._id
          }, function () {

          });
        };

        vm.checkGuest = function (user) {
          weddengFactory.checkPerson(user, function () {
          });
        };

        vm.removePerson = function (user, index) {
          if (confirm('точно видалити ' + user.name + '?')) {
            vm.guests.splice(index, 1);
            weddengFactory.removePerson({guests: vm.guests}, function (err, data) {

            });
          }
        };
      });

      function logout() {
        authTokenFactory.setToken();
        $state.go('wedding.auth');
      }
    }
  ]);
};
