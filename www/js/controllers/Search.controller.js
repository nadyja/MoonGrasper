angular.module('MoonGrasper').controller('SearchCtrl', function($scope, $rootScope, $ionicModal, $timeout, MoonApi, DeviceApi, $state) {


    $scope.orientation = {        
        compass: 340,
        tilt: 60,
        lat: 0,
        lng: 0
    }
    var sensitivity = 5;
    $scope.arrowStyle = "transform: rotate(0deg) translate(0, -70px); ";
    $scope.moonStyle = "";


    $scope.init = function() {
        $scope.moonPhase=MoonApi.getMoonPhase();


        DeviceApi.getCoordinatesAndTimezone(function(coordResult) {
            MoonApi.getMoonPositionOffline(coordResult, $rootScope.isDebug).then(function(result) {
                $scope.moon = result;
                $rootScope.debug(0, 'moon position (compass, tilt): ', $scope.moon.compass, $scope.moon.tilt);
                redrawPositions();
                $scope.initListeners();
                $rootScope.debug(9, 'connection success');  
            }, function(err) {
                //Moon api returned error (possibly nrel.gov dead)
                $scope.moon = {
                  compass: 0,
                  tilt: 90
                }
                $rootScope.debug(0, 'moon position (compass, tilt): ', $scope.moon.compass, $scope.moon.tilt);
                $rootScope.debug(9, 'connection error');        
                redrawPositions();
                $scope.initListeners();
            })


           


        });


    }
    $scope.initListeners=function() {
       if (!$rootScope.isDebug ) {
                DeviceApi.initTiltListner(function(tilt) {
                    $scope.orientation.tilt = tilt;
                    $scope.$apply();
                    redrawPositions();
                });
                DeviceApi.initCompassListner(function(heading) {
                    $scope.orientation.compass = heading;
                    $scope.$apply();
                    redrawPositions();
                });
            }

    }
    $scope.init();


    function redrawPositions() {
        $rootScope.debug(1, 'orientation (compass, tilt): ', $scope.orientation.compass, $scope.orientation.tilt);
        var delta = getMoonDelta();

        $rootScope.debug(2, 'delta (h, v): ', delta.h, delta.v);
        setArrowPosition({ v: delta.v, h: delta.h });
        setMoonPosition({ v: delta.v, h: delta.h });
    }

    function setMoonPosition(delta) {
        var pixels = getMoonPixelPosition(delta);
        $scope.moonStyle = 'transform: translate(' + pixels.h + 'px,' + pixels.v + 'px)';
        if (isMoonInCatchingArea(delta)) {

            $state.go('app.found');

        }

    }

    function isMoonInCatchingArea(delta) {
        var areaAngle = sensitivity;
        return delta.v > -areaAngle &&
            delta.v < areaAngle &&
            delta.h > -areaAngle &&
            delta.h < areaAngle
    }

    function setArrowPosition(delta) {
        var deg = getArrowAngle(delta);
        $rootScope.debug(4, 'arrow angle: ', deg);
        $scope.arrowStyle = 'transform: rotate(' + deg + 'deg) translate(0, -100px)';
    }

    function getArrowAngle(delta) {
        var v = delta.v;
        var h = delta.h;

        if (h === 0 && v === 0) {
            return null
        } else if (v === 0) {
            if (h > 0) {
                return -90
            } else {
                return -270
            }
        } else if (h === 0) {
            if (v > 0) {
                return 0
            } else {
                return -180
            }
        }

        var radians = Math.atan(delta.h / delta.v);
        var deg = Math.abs(radians * 180 / Math.PI);

        //clockwise rotation
        if (h > 0 && v > 0) {
            return -deg
        } else if (h > 0 && v < 0) {
            return -(180 - deg)
        } else if (h < 0 && v < 0) {
            return -(180 + deg)
        } else if (h < 0 && v > 0) {
            return -(270 + deg)
        }
    }


    function getMoonPixelPosition(delta) {
        var theta = DeviceApi.getAngleOfView();
        var resolution = DeviceApi.getDisplayResolution();

        var pixelsV = resolution.v * -delta.v / theta.v;
        var pixelsH = resolution.h * -delta.h / theta.h;

        var pixels = {
            v: pixelsV,
            h: pixelsH
        }
        $rootScope.debug(3, 'moon pixels (h, v): ', pixels.h, pixels.v);

        return pixels;
    }

    function getMoonDelta() {
        diffH =  $scope.orientation.compass - $scope.moon.compass
        diffV = -($scope.orientation.tilt - $scope.moon.tilt);

        diffH=diffH%360;
        diffV=diffV%360;
        if(diffH>180) diffH=180-diffH;
        if(diffH<-180) diffH=-180-diffH;

        if(diffV>180) diffV=180-diffV;
        if(diffV<-180) diffV=-180-diffV;

        return {
            v: diffV,
            h: diffH
        }
    }


})
