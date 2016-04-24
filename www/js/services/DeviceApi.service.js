angular.module('MoonGrasper').factory('DeviceApi', function ($http, $q) {
  return {

    isDebug: function () {
      //return true;
      return false;
      //helper for debugging with ionic serve

    },
    initCameraBackground: function () {

    },
    initTiltListner: function (callback) {
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function (eventData) {
          // gamma is the left-to-right tilt in degrees, where right is positive
          var tiltLR = eventData.gamma;
          // beta is the front-to-back tilt in degrees, where front is positive
          var tiltFB = eventData.beta;
          // alpha is the compass direction the device is facing in degrees
          var dir = eventData.alpha;

          callback(tiltFB);
        }, false);


      }
    },
    initCompassListner: function (callback) {
      var compass = {
        onSuccess: function (heading) {
          var hdng = heading.magneticHeading;
          callback(hdng);
          neverUsedCompass = false;
        },
        onError: function (compassError) {
          console.log("Compass error", err);
          debug(5, err);
          ezar.getBackCamera().start();
        },
        options: {
          frequency: 100
        }
      }
      setInterval(function () {
        navigator.compass.getCurrentHeading(compass.onSuccess, compass.onError);
      }, 30);
    },
    getAngleOfView: function () {
      return {v: 75, h: 75}; //mock
      //TODO:  find a way to get real camera angle of view
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
    },
    getDisplayResolution: function () {
      return {v: 360, h: 640}; //mock
      //TODO:  find out why this doesn't work
      var display = getWindowManager().getDefaultDisplay();
      var size = new Point();
      display.getSize(size);
      var resolution = {
        v: size.y,
        h: size.x
      }
      return resolution;
    },
    getCoordinatesAndTimezone: function (callback) {
      var location = navigator.geolocation.getCurrentPosition(
        function (data) {
          callback({
            lat: data.coords.latitude,
            lon: data.coords.longitude,
            timezone: 2
          })
        },
        function (err) {
          console.log("error")
        }
      );
    },

  }

});
