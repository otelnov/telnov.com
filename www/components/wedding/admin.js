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
        weddingFactory.get('users', (err, data) => {
          vm.guests = data.users;
          vm.guestCount = 0;
          vm.guests.forEach((g)=> {
            vm.guestCount = vm.guestCount + 1 + g.guests.length;
          });

          vm.removeUser = (user, index)=> {
            if (confirm('точно видалити ' + user.name + '?')) {
              weddingFactory.remove('users', user._id, ()=> {
                vm.guests.splice(index, 1);
              });
            }
          };
        });
      };
      vm.activeMain();

      vm.activeHelp = ()=> {
        vm.activeMenu = 'help';
        weddingFactory.get('help', (error, resp) => {
          vm.help = resp.help;

          vm.addHelp = ()=> {
            weddingFactory.post('help', {text: vm.newHelp}, (err, data) => {
              vm.help.push(data.help);
              vm.newHelp = '';
            });
          };

          vm.removeHelp = (help, index) => {
            if (confirm('точно видалити ' + help.text + '?')) {
              weddingFactory.remove('help', help._id, ()=> {
                vm.help.splice(index, 1);
              });
            }
          };
        });
      };

      vm.activeWishlist = ()=> {
        vm.activeMenu = 'wishlist';

        weddingFactory.get('wishlist', (error, resp) => {
          vm.wishlist = resp.wishlist;
          vm.addWish = ()=> {
            weddingFactory.post('wishlist', {text: vm.newWish}, (err, data) => {
              vm.wishlist.push(data.wishlist);
              vm.newWish = '';
            });
          };

          vm.removeWish = function (wish, index) {
            if (confirm('точно видалити ' + wish.text + '?')) {
              weddingFactory.remove('wishlist', wish._id, () => {
                vm.wishlist.splice(index, 1);
              });
            }
          };
        });
      };

      vm.activeComments = ()=> {
        vm.activeMenu = 'comments';
        weddingFactory.get('comments', (err, data) => {
          vm.comments = data.comments;
        });
      };

      vm.activeNews = ()=> {
        vm.activeMenu = 'news';
        weddingFactory.get('news', (error, resp)=> {
          vm.news = resp.news;
          vm.addNews = ()=> {
            weddingFactory.post('news', {text: vm.newNews}, (err, data) => {
              vm.news.push(data.news);
              vm.newNews = '';
            });
          };

          vm.removeNews = function (news, index) {
            if (confirm('точно видалити ' + news.text + '?')) {
              weddingFactory.remove('news', news._id, ()=> {
                vm.news.splice(index, 1);
              });
            }
          };
        });
      };
    }
  ]);
};
