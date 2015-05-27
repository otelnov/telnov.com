export default ngModule => {
  ngModule.directive('weddingAdmin', [()=> {
    return {
      template: require('./admin.html'),
      controller: 'weddingAdminController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('weddingAdminController', [
    'WeddingFactory',
    function (weddingFactory) {
      let vm = this;

      vm.activeMain = ()=> {
        vm.activeMenu = 'main';
        weddingFactory.guests(function(err, guests){
          vm.guests = guests;
          vm.guestCount = 0;
          vm.guests.forEach(function (g) {
            vm.guestCount = vm.guestCount + 1 + g.guests.length;
          });
        });
      };
      vm.activeMain();

      vm.activeHelp = ()=> {
        vm.activeMenu = 'help';

        vm.help = [
          {
            text: 'sgsdfgsdfg'
          },
          {
            text:' sfgsdfgsdfgs'
          }
        ];
      };

      vm.activeWishlist = ()=> {
        vm.activeMenu = 'wishlist';

        vm.wishlist = [
          {
            text: 'asdf asdfn kajsndf jksafsgsd fgsd fgs',
            user: 'Eadfas Fafsd'
          },
          {
            text: 'sd afsg sdf gsdf gsdf',
          },
          {
            text: 'daf sg asdfsd afsg sdf gsdf gsdf',
          }
        ];
      };

      vm.activeComments = ()=> {
        vm.activeMenu = 'comments';

        vm.comments = [
          {
            text: 'safsgsd fgsd fgs',
            user: 'Eadfas Fafsd'
          },
          {
            text: 'sd afsg sdf gsdf gsdf',
            user: 'SFSDG sfdg'
          }
        ];
      };

      vm.activeNews = ()=> {
        vm.activeMenu = 'news';

        vm.news = [
          {
            text: 'sgsdfgsdfg'
          },
          {
            text:' sfgsdfgsdfgs'
          },
          {
            text:'rfijodsoisd'
          }
        ];
      };
    }
  ]);
};
