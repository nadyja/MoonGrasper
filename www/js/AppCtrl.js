angular.module('lunagrab.controllers', []).controller('AppCtrl', function($scope, $ionicModal, $timeout, MoonApi) {

    var isDebug = false;


    $scope.orientation = {
    	 tilt: 90,
                compass: 38,
                lat: 0,
                lng: 0
    }
    $scope.moon = {
        compass: 0,
        tilt: 90
    }
    $scope.arrowStyle = "transform: rotate(0deg) translate(0, -70px); ";
    $scope.moonStyle = "";
    $scope.debug = {};



    $scope.init = function() {

        MoonApi.getMoonPosition(52, 14, 2, isDebug).then(function(result) {

            $scope.moon = {
                tilt: parseFloat(result[0]),
                compass: parseFloat(result[1])
            }
            debug(0, 'moon position (compass, tilt): ', $scope.moon.compass, $scope.moon.tilt);
            
            redrawPositions();

            if (!isDebug) {
                initTiltListner();
                initCompassListner();
            }
        })

    }
    $scope.init();


    function initTiltListner() {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function(eventData) {
                // gamma is the left-to-right tilt in degrees, where right is positive
                var tiltLR = eventData.gamma;

                // beta is the front-to-back tilt in degrees, where front is positive
                var tiltFB = eventData.beta;

                // alpha is the compass direction the device is facing in degrees
                var dir = eventData.alpha;

                // call our orientation event handler
                $scope.orientation.tilt = tiltFB;
                $scope.orientation.secondaryCompass = dir;
                $scope.$apply();
                redrawPositions();
                //debug(tiltLR, tiltFB, dir);
            }, false);


        }
    }

    function initCompassListner() {



        var compass = {
            onSuccess: function(heading) {
                var hdng = heading.magneticHeading;
                $scope.orientation.compass = hdng;
                $scope.$apply();
                redrawPositions();
            },
            onError: function(compassError) {
                console.log("Compass error", err);
                debug(5, err);
                ezar.getBackCamera().start();
            },
            options: {
                frequency: 10
            }
        }

        //var watchID = navigator.compass.watchHeading(compass.onSuccess, compass.onError, compass.options);




        setInterval(function() { navigator.compass.getCurrentHeading(compass.onSuccess, compass.onError); }, 10);
    }
  

    function redrawPositions() {
        debug(1, 'orientation (compass, tilt): ', $scope.orientation.compass, $scope.orientation.tilt);
        var delta = getMoonDelta();

        debug(2, 'delta (h, v): ', delta.h, delta.v);
        positionArrow({ v: delta.v, h: delta.h });
        positionMoon({ v: delta.v, h: delta.h });
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

    function getDeviceAngleOfView() {
        //mock
        return { v: 75, h: 75 };
        /*
          var p = camera.getParameters();
          var thetaV = Math.toRadians(p.getVerticalViewAngle());
          var thetaH = Math.toRadians(p.getHorizontalViewAngle());
          var theta = {
              v: thetaV,
              h: thetaH,
          }
          return theta;
        */
    }

    function getDeviceResolution() {
        //mock
        return { v: 360, h: 640 };

        var display = getWindowManager().getDefaultDisplay();
        var size = new Point();
        display.getSize(size);
        var resolution = {
            v: size.y,
            h: size.x
        }
        return resolution;
    }

    function getMoonPixelPosition(delta) {
        var theta = getDeviceAngleOfView();
        var resolution = getDeviceResolution();

        var pixelsV = resolution.v * -delta.v / theta.v;
        var pixelsH = resolution.h * -delta.h / theta.h;

        var pixels = {
            v: pixelsV,
            h: pixelsH
        }
        debug(3, 'moon pixels (h, v): ', pixels.h, pixels.v);

        return pixels;
    }

    function getMoonDelta() {
        diffH = $scope.orientation.compass - $scope.moon.compass;
        diffV = -$scope.orientation.tilt + $scope.moon.tilt;
        return {
            v: diffV,
            h: diffH
        }
    }






    function positionMoon(delta) {
        var pixels = getMoonPixelPosition(delta);

        $scope.moonStyle = 'transform: translate(' + pixels.h + 'px,' + pixels.v + 'px)';


    }

    function positionArrow(delta) {
        var deg = getArrowAngle(delta);
        debug(4, 'arrow angle: ', deg);
        $scope.arrowStyle = 'transform: rotate(' + deg + 'deg) translate(0, -80px)';
    }

    function debug(position, txt, var1, var2) {
        $scope.debug[position] = [];
        $scope.debug[position].push(txt);
        $scope.debug[position].push(var1);
        $scope.debug[position].push(var2);

        //document.getElementById("debug" + position).innerHTML = txt;
    }


})
