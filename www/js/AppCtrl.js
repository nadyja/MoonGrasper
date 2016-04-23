angular.module('lunagrab.controllers', []).controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

  $scope.orientation = {}
  $scope.moon = {
    compass: 0,
    tilt: 90
  }
  $scope.arrowStyle = "transform: rotate(0deg) translate(0, -70px); ";
  $scope.moonStyle = "";
  $scope.debug = {};

  updatePosition({
    tilt: 87,
    compass: 3,
    lat: 0,
    lng: 0
  })

  function getArrowAngle(delta) {
    var v = delta.v;
    var h = delta.h;

    if (h === 0 && v === 0) {
      return null
    } else if (v === 0) {
      if (h > 0) {
        return 90
      } else {
        return 270
      }
    } else if (h === 0) {
      if (v > 0) {
        return 0
      } else {
        return 180
      }
    }

    var radians = Math.atan(delta.h / delta.v);
    var deg = Math.abs(radians * 180 / Math.PI);

    //clockwise rotation
    if (h > 0 && v > 0) {
      return deg
    } else if (h > 0 && v < 0) {
      return 180 - deg
    } else if (h < 0 && v < 0) {
      return 180 + deg
    } else if (h < 0 && v > 0) {
      return 270 + deg
    }


  }

  function getDeviceAngleOfView() {
    //mock
    return {v: 20, h: 20};
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
    return {v: 320, h: 568};
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
    debug('moon position (h, v): ' + pixels.h + "   " + pixels.v, 3);

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


  function updatePosition(newOrientation) {
    $scope.orientation = newOrientation;
    doUpdate();
  }

  function doUpdate() {
    debug('orientation (compass, tilt): ' + $scope.orientation.compass + '   ' + $scope.orientation.tilt, 0);
    var delta = getMoonDelta();

    debug('delta (h, v): ' + delta.h + "   " + delta.v, 1);
    positionArrow({v: delta.v, h: delta.h});
    //debug('moon delta1 (h, v): '+delta.h+ "   "+delta.v, 4);
    positionMoon({v: delta.v, h: delta.h});
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


});
