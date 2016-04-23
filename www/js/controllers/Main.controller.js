angular.module('MoonGrasper').controller('MainCtrl', function($scope,$rootScope, $ionicModal, $timeout, MoonApi, DeviceApi, $state) {
    $rootScope.isDebug = true;
    $scope.debug = {};










    $rootScope.debug=function(position, txt, var1, var2) {
        $scope.debug[position] = [];
        $scope.debug[position].push(txt);
        $scope.debug[position].push(var1);
        $scope.debug[position].push(var2);

        //document.getElementById("debug" + position).innerHTML = txt;
    }


})
