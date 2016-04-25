angular.module('MoonGrasper').controller('MainCtrl', function ($scope, $rootScope, $ionicModal, $timeout, MoonApi, DeviceApi, $state) {
  $rootScope.isDebug = DeviceApi.isDebug();
  $scope.debug = {};
  $rootScope.debugBackground = $rootScope.isDebug ? 'background-image: url(img/bgr.jpg)' : 'fdgfd';

  $rootScope.isCaught = false;


  $scope.getCurrentFullMoonImage = function () {
    return 'img/hd/moon.png';
  };

  $rootScope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams, options) {
      if (toState.name == 'app.fount') {
        $rootScope.isCaught = true;
      } else {
        $rootScope.isCaught = false;
      }
    });


  $rootScope.debug = function (position, txt, var1, var2) {
    $scope.debug[position] = [];
    $scope.debug[position].push(txt);
    $scope.debug[position].push(var1);
    $scope.debug[position].push(var2);

    //document.getElementById("debug" + position).innerHTML = txt;
  }


});
