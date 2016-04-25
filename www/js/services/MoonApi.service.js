angular.module('MoonGrasper').factory('MoonApi', function ($http, $q) {


  function parseMoonPosition(result) {
    // console.log(result);
    var data = result.data;
    var d = new Date();
    var date = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear() + "," + d.getHours() + ":00:00";
    data = data.split("\n");
    for (line in data) {
      if (data[line].search(date) !== -1) {

        var arr = (data[line].split(",").slice(2));
        arr[0] = 180 - parseFloat(arr[0]);
        arr[1] = parseFloat(arr[1]);
        arr[2] = parseFloat(arr[2]);
        console.log(arr);
        return {
          tilt: arr[0],
          compass: arr[1]
        };
      }
    }

  }

  function rad2deg(radians) {
    return Math.abs(radians * 180 / Math.PI)
  }

  return {

    getMoonPositionOffline: function( coordinates,isDebug) {
      //TODO: can do this synchroneously now - mockAPI to destroy
      var today = new Date();
      var moonPosition=SunCalc.getMoonPosition(today, coordinates.lat, coordinates.lon);
      return mockApi({
        tilt:rad2deg(moonPosition.altitude), 
        compass: rad2deg(moonPosition.azimuth) +180
      }, 0); 
    },

    getMoonPosition: function (coordinates, isDebug) {
      //deprecated
      var day = d.getDate();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var url = 'https://www.nrel.gov/midc/apps/sampa.pl?syear=' + year +
        '&smonth=' + month +
        '&sday=' + day +
        '&eyear=' + year +
        '&emonth=' + month +
        '&eday=' + day +
        '&step=60&stepunit=1&latitude=' + coordinates.lat +
        '&longitude=' + coordinates.lon +
        '&timezone=' + coordinates.timezone +
        '&elev=0&press=835&temp=10&dut1=0.0&deltat=64.797&refract=0.5667&ozone=0.3&pwv=1.5&aod=0.07637&ba=0.85&albedo=0.2&field=3&field=4&field=5&zip=0';
     //console.log(url);
     
    //if (!isDebug) return $http.get(url).then(parseMoonPosition);
    return mockApi({tilt: 130.904723,compass: 297.718896}, 0); 

    },
    getMoonPhase: function () {
      //TODO have to return one of 28 phases
      var d = new Date;
      var JD = Math.floor((d / 86400000) - (d.getTimezoneOffset()/1440) + 2440587.5);
      var phase = ((JD / 29.5305902778) - 0.3033);
      phase = Math.floor((phase - Math.floor(phase)) * 100);
      var digit = phase % 10;
      if (digit >= 9){
        phase += 1;
        if (phase >= 100){
          phase = 0;
        }
      } else {
        phase -= digit;
      }
      return (Math.floor(parseFloat(phase)/100.0 * 28));
    }

  };


  function mockApi(obj, timeout, reject) {
    var isSuccess = true;
    if (!timeout) timeout = 0;
    if (reject) isSuccess = false;


    return $q(function (resolve, reject) {
      setTimeout(function () {
        if (isSuccess) {
          resolve(obj);
        } else {
          reject(false);
        }
      }, timeout);
    });
  }
});
