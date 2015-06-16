angular.module('spinners', [])
  .factory('spinnerService', function () {
    var spinners = {};
    return {
      _register: function (data) {
        if (spinners.hasOwnProperty(data.name)) {
          throw new Error("A spinner with the name '" + data.name + "' has already been registered.");
        }
        spinners[data.name] = data;
      },
      _unregister: function (name) {
        if (spinners.hasOwnProperty(name)) {
          delete spinners[name];
        }
      },
      _unregisterGroup: function (group) {
        for (var name in spinners) {
          if (spinners[name].group === group) {
            delete spinners[name];
          }
        }
      },
      _unregisterAll: function () {
        for (var name in spinners) {
          delete spinners[name];
        }
      },
      show: function (name) {
        var spinner = spinners[name];
        if (!spinner) {
          throw new Error("No spinner named '" + name + "' is registered.");
        }
        spinner.show();
      },
      hide: function (name) {
        var spinner = spinners[name];
        if (!spinner) {
          throw new Error("No spinner named '" + name + "' is registered.");
        }
        spinner.hide();
      },
      showGroup: function (group) {
        var groupExists = false;
        for (var name in spinners) {
          var spinner = spinners[name];
          if (spinner.group === group) {
            spinner.show();
            groupExists = true;
          }
        }
        if (!groupExists) {
          throw new Error("No spinners found with group '" + group + "'.")
        }
      },
      hideGroup: function (group) {
        var groupExists = false;
        for (var name in spinners) {
          var spinner = spinners[name];
          if (spinner.group === group) {
            spinner.hide();
            groupExists = true;
          }
        }
        if (!groupExists) {
          throw new Error("No spinners found with group '" + group + "'.")
        }
      },
      showAll: function () {
        for (var name in spinners) {
          spinners[name].show();
        }
      },
      hideAll: function () {
        for (var name in spinners) {
          spinners[name].hide();
        }
      }
    };
  });

angular.module('spinners')
  .directive('spinner', function () {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {
        name: '@',
        group: '@?',
        show: '@?',
        imgSrc: '@?',
        register: '@?',
        onRegister: '&?'
      },
      template: [
        '<span ng-show="show">',
        '  <img ng-show="imgSrc" src="{{imgSrc}}" />',
        '  <span ng-transclude></span>',
        '</span>'
      ].join(''),
      controller: ["$scope", "spinnerService", function ($scope, spinnerService) {
        if (!$scope.hasOwnProperty('name')) {
          throw new Error("Spinner must specify a name.");
        }
        if (!$scope.hasOwnProperty('register')) {
          $scope.register = true;
        }
        if ($scope.register) {
          spinnerService._register({
            name: $scope.name,
            group: $scope.group,
            show: function () {
              $scope.show = true;
            },
            hide: function () {
              $scope.show = false;
            },
            toggle: function () {
              $scope.show = !$scope.show;
            }
          });
        }
        $scope.onRegister({ spinnerService: spinnerService });
      }]
    };
  });
