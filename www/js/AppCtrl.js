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
                tilt: result[0],
                compass: result[1]
            }
              $scope.moon = {
        compass: 0,
        tilt: 90
    }
            debug('moon position (tilt,compass): ' + moon.tilt + "   " + moon.compass, 4);
            updatePosition({
                tilt: 87,
                compass: 3,
                lat: 0,
                lng: 0
            });
        })

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
        return { v: 20, h: 20 };
        /*
        Camera.Parameters p = camera.getParameters();
        double thetaV = Math.toRadians(p.getVerticalViewAngle());
        double thetaH = Math.toRadians(p.getHorizontalViewAngle());
        var theta = {
            v: thetaV,
            h: thetaH,
        }
        return theta;
        */
    }

    function getDeviceResolution() {
        //mock
        return { v: 320, h: 568 };
        /*
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        var resolution = {
            v: size.y,
            h: size.x
        }
        return resolution;
        */
    }

    function getMoonPixelPosition(delta) {
        var theta = getDeviceAngleOfView();
        var resolution = getDeviceResolution();

        var pixelsV = resolution.v * delta.v / theta.v;
        var pixelsH = resolution.h * delta.h / theta.h;

        var pixels = {
            v: pixelsV,
            h: pixelsH
        }
        debug('moon pixels (h, v): ' + pixels.h + "   " + pixels.v, 3);

        return pixels;
    }

    function getMoonDelta() {
        diffH = -$scope.orientation.compass + $scope.moon.compass;
        diffV = $scope.orientation.tilt - $scope.moon.tilt;
        return {
            v: diffV,
            h: diffH
        }
    }





    function getMoonPosition(lat, lon, timezone) {
        return MoonApi.getMoonPosition(lat, lon, timezone)
            .then(function(result) {

                var data = result;
                var d = new Date();
                var date = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear() + "," + d.getHours() + ":00:00";
                data = data.split("\n");
                console.log('looking for date'+date);
                console.log(data);
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
        debug('orientation (compass, tilt): ' + $scope.orientation.compass + '   ' + $scope.orientation.tilt, 0);
        var delta = getMoonDelta();

        debug('delta (h, v): ' + delta.h + "   " + delta.v, 1);
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
        debug('arrow angle: ' + deg, 2);
        $scope.arrowStyle = 'transform: rotate(' + deg + 'deg) translate(0, -80px)';
    }

    function debug(txt, position) {
        $scope.debug[position] = txt;

        //document.getElementById("debug" + position).innerHTML = txt;
    }


})
