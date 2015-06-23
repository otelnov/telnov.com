export default ngModule => {
  ngModule.directive('footballMain', [()=> {
    return {
      restrict: 'E',
      template: require('./main.html'),
      controller: 'FootballMainController',
      controllerAs: 'vm'
    };
  }]);

  ngModule.controller('FootballMainController', [
    'FootballFactory',
    function (footballFactory) {
      let vm = this;
      let id;

      footballFactory.get((err, data) => {
        if (err) {
          alert(err.data);
          return;
        }

        if (data.tournament && data.tournament.games) {
          vm.tournament = data.tournament.games;
          id = data.tournament._id;
          updateResults();
        }
      });

      vm.finish = () => {
        if (confirm('Are You sure???!!!')) {
          footballFactory.put({status: false, id: id}, err => {
            if (!err) {
              vm.tournament = null;
              vm.results = null;
            }
          });
        }
      };

      vm.new = () => {
        let teams = footballFactory.players();
        footballFactory.shuffle(teams);

        let tournament = {
          round1: [],
          round2: []
        };

        for (let n = 0; n < 3; n++) {
          let temp = teams[0];
          teams.splice(0, 1);
          /*eslint-disable */
          teams.forEach((t) => {
            let pair = footballFactory.shuffle([t, temp]);
            tournament.round1.push({teams: pair, result: []});
            tournament.round2.push({teams: [pair[1], pair[0]], result: []});
          });
          /*eslint-enable */
        }

        footballFactory.create({
          name: 'Tournament',
          games: tournament
        }, (err, data) => {
          if (err) {
            alert(err.data);
            return;
          }
          vm.tournament = data.tournament.games;
          id = data.tournament._id;
          updateResults();
          alert('Have fun!');
        });
      };

      vm.update = () => {
        footballFactory.put({id: id, games: vm.tournament}, (err, data) => {
          if (!err && data.tournament && data.tournament.games) {
            vm.tournament = data.tournament.games;
            updateResults();
          }
        });
      };

      function updateResults() {
        let players = footballFactory.players();
        vm.results = {};
        players.forEach(pla => {
          vm.results[pla] = {
            points: 0,
            games: 0,
            name: pla
          };
        });

        players.forEach(p => {
          vm.tournament.round1.forEach(g => {
            if (g.teams[0] === p || g.teams[1] === p) {
              if ((+g.result[0] > 0 || g.result[0] === '0') && (+g.result[1] > 0 || g.result[1] === '0')) {
                vm.results[p].games++;

                if (g.result[0] === g.result[1]) {
                  vm.results[p].points++;
                }

                if (g.teams[0] === p && +g.result[0] > +g.result[1]) {
                  vm.results[p].points = vm.results[p].points + 3;
                }

                if (g.teams[1] === p && +g.result[1] > +g.result[0]) {
                  vm.results[p].points = vm.results[p].points + 3;
                }
              }
            }
          });

          vm.tournament.round2.forEach(g => {
            if (g.teams[0] === p || g.teams[1] === p) {
              if ((+g.result[0] > 0 || g.result[0] === '0') && (+g.result[1] > 0 || g.result[1] === '0')) {
                vm.results[p].games++;

                if (g.result[0] === g.result[1]) {
                  vm.results[p].points++;
                }

                if (g.teams[0] === p && +g.result[0] > +g.result[1]) {
                  vm.results[p].points = vm.results[p].points + 3;
                }

                if (g.teams[1] === p && +g.result[1] > +g.result[0]) {
                  vm.results[p].points = vm.results[p].points + 3;
                }
              }
            }
          });
        });
      }
    }
  ]);

  ngModule.filter('toArray', function () {
    return function (obj) {
      var result = [];
      angular.forEach(obj, function (val) {
        result.push(val);
      });
      return result;
    };
  });
};

