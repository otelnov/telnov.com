export default ngModule => {
  ngModule.directive('weddingMain', [()=> {
    return {
      template: require('./main.html'),
      controller: 'weddingMainController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('weddingMainController', [()=> {

  }]);
};
