export default ngModule => {
  ngModule.directive('weddingAdmin', [()=> {
    return {
      template: require('./admin.html'),
      controller: 'weddingAdminController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('weddingAdminController', [()=> {

  }]);
};
