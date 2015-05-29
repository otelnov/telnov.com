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
        weddingFactory.guests(function (err, guests) {
          vm.guests = guests;
          vm.guestCount = 0;
          vm.guests.forEach(function (g) {
            vm.guestCount = vm.guestCount + 1 + g.guests.length;
          });

          vm.removeGuest = function (guest, index) {
            if (confirm('точно видалити ' + guest.name + '?')) {
              weddingFactory.removeGuest(guest, function () {
                vm.guests.splice(index, 1);
              });
            }
          };
        });
      };
      vm.activeMain();

      vm.activeHelp = ()=> {
        vm.activeMenu = 'help';
        weddingFactory.help(function (err, help) {
          vm.help = help;
        });

        vm.addHelp = ()=> {
          weddingFactory.addHelp({text: vm.newHelp}, function (err, help) {
            vm.help.push(help);
            vm.newHelp = '';
          });
        };

        vm.removeHelp = function (help, index) {
          if (confirm('точно видалити ' + help.text + '?')) {
            weddingFactory.removeHelp(help, function () {
              vm.help.splice(index, 1);
            });
          }
        };
      };

      vm.activeWishlist = ()=> {
        vm.activeMenu = 'wishlist';

        weddingFactory.wishlist(function (err, wishlist) {
          vm.wishlist = wishlist;
        });

        vm.addWish = ()=> {
          weddingFactory.addWish({text: vm.newWish}, function (err, wish) {
            vm.wishlist.push(wish);
            vm.newWish = '';
          });
        };

        vm.removeWish = function (wish, index) {
          if (confirm('точно видалити ' + wish.text + '?')) {
            weddingFactory.removeWish(wish, function () {
              vm.wishlist.splice(index, 1);
            });
          }
        };
      };

      vm.activeComments = ()=> {
        vm.activeMenu = 'comments';
        weddingFactory.comments(function (err, comments) {
          vm.comments = comments;
        });
      };

      vm.activeNews = ()=> {
        vm.activeMenu = 'news';
        weddingFactory.news(function (err, news) {
          vm.news = news;
        });

        vm.addNews = ()=> {
          weddingFactory.addNews({text: vm.newNews}, function (err, news) {
            vm.news.push(news);
            vm.newNews = '';
          });
        };

        vm.removeNews = function (news, index) {
          if (confirm('точно видалити ' + news.text + '?')) {
            weddingFactory.removeNews(news, function () {
              vm.news.splice(index, 1);
            });
          }
        };
      };
    }
  ]);
};
