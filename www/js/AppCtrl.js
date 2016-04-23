angular.module('lunagrab.controllers', []).controller('AppCtrl', function($scope, $ionicModal, $timeout, MoonApi) {

    $scope.orientation = {}
    $scope.moon = {
        compass: 0,
        tilt: 90
    }
    $scope.arrowStyle = "transform: rotate(0deg) translate(0, -70px); ";
    $scope.moonStyle = "";
    $scope.debug = {};
    $scope.init = function() {

        getMoonPosition(52, 14, 2).then(function(result) {

            $scope.moon = {
                tilt: parseFloat(result[0]),
                compass: parseFloat(result[1])
            }
            debug(0, 'moon position (compass, tilt): ', $scope.moon.compass, $scope.moon.tilt);
            updatePosition({
                tilt: 90,
                compass: 38,
                lat: 0,
                lng: 0
            });
            initializeEzar();

        })

    }


    function initializeEzar() {
        debug(5, 'init');

        debug(5, 'no device orientation');
        if (window.DeviceOrientationEvent) {
            debug(5, 'device orientation present');


            window.addEventListener('deviceorientation', function(eventData) {
                // gamma is the left-to-right tilt in degrees, where right is positive
                var tiltLR = Math.floor(eventData.gamma);

                // beta is the front-to-back tilt in degrees, where front is positive
                var tiltFB = Math.floor(eventData.beta);

                // alpha is the compass direction the device is facing in degrees
                var dir = Math.floor(eventData.alpha);

                // call our orientation event handler
                $scope.orientation.tilt = tiltFB;
                $scope.$apply();
                doUpdate();
                //debug(tiltLR, tiltFB, dir);
            }, false);


        }


        var compass = {
            onSuccess: function(heading) {
                var hdng = Math.floor(heading.magneticHeading);
                $scope.orientation.compass = hdng;
                $scope.$apply();
                doUpdate();
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


    $scope.init();

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





    function getMoonPosition(lat, lon, timezone) {
        return MoonApi.getMoonPosition(lat, lon, timezone)
            .then(function(result) {
            	console.log(result);
                var data = result.data;
                var d = new Date();
                var date = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear() + "," + d.getHours() + ":00:00";
                console.log('looking for date  ' + date);
                data = data.split("\n");
                for (line in data) {
                    if (data[line].search(date) !== -1) {

                        return (data[line].split(",").slice(2));
                    }
                }
            });

        /*
                var d = new Date();
                var day = d.getDate();
                var year = d.getFullYear();
                var month = d.getMonth();
                req = 'https://www.nrel.gov/midc/apps/sampa.pl?syear=' + year + '&smonth=' + month + '&sday=' + day + '&eyear=' + year + '&emonth=' + month + '&eday=' + day + '&step=60&stepunit=1&latitude=' + lat + '&longitude=' + lon + '&timezone=' + timezone + '&elev=0&press=835&temp=10&dut1=0.0&deltat=64.797&refract=0.5667&ozone=0.3&pwv=1.5&aod=0.07637&ba=0.85&albedo=0.2&field=3&field=4&field=5&zip=0';
                var xhttp = new XMLHttpRequest();
                xhttp.open("get", req, true);
                xhttp.send();
                return new Promise(function(resolve, reject) {
                    xhttp.onreadystatechange = function() {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            var data = xhttp.responseText;

                        }
                    };
                });
                */
    }




    function updatePosition(newOrientation) {
        $scope.orientation = newOrientation;
        doUpdate();
    }

    function doUpdate() {
        debug(1, 'orientation (compass, tilt): ', $scope.orientation.compass, $scope.orientation.tilt);
        var delta = getMoonDelta();

        debug(2, 'delta (h, v): ', delta.h, delta.v);
        positionArrow({ v: delta.v, h: delta.h });
        //debug('moon delta1 (h, v): '+delta.h+ "   "+delta.v, 4);
        positionMoon({ v: delta.v, h: delta.h });
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
