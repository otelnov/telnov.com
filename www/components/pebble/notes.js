export default ngModule => {
  ngModule.directive('pebbleNotes', [()=> {
    return {
      restrict: 'E',
      template: require('./notes.html'),
      controller: 'PebbleNotesController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('PebbleNotesController', [
    'PebbleFactory',
    function (pebbleFactory) {
      let vm = this;
      vm.model = {};

      pebbleFactory.getNotes((err, notes) => {
        if (!err) {
          vm.notes = notes;
        }
      });

      vm.create = () => {
        pebbleFactory.createNote(vm.model, () => {
          vm.model = {};
          pebbleFactory.getNotes((err, notes) => {
            if (!err) {
              vm.notes = notes;
            }
          });
        });
      };
    }
  ]);
};

