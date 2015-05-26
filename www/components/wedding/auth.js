export default ngModule => {
  ngModule.directive('weddingAuth', [()=> {
    return {
      template: require('./auth.html'),
      controller: 'weddingAuthController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('weddingAuthController', [()=> {

  }]);
};
