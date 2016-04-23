angular.module('lunagrab.services', []).factory('MoonApi', function($http, $q) {
  
    return {
        getMoonPosition: function(lat, lon, timezone) {
            //return MockApi.getBundleList();
 	        var d = new Date();
    	    var day = d.getDate();
       		var year = d.getFullYear();
        	var month = d.getMonth();
            //return $http.get('https://www.nrel.gov/midc/apps/sampa.pl?syear=' + year + '&smonth=' + month + '&sday=' + day + '&eyear=' + year + '&emonth=' + month + '&eday=' + day + '&step=60&stepunit=1&latitude=' + lat + '&longitude=' + lon + '&timezone=' + timezone + '&elev=0&press=835&temp=10&dut1=0.0&deltat=64.797&refract=0.5667&ozone=0.3&pwv=1.5&aod=0.07637&ba=0.85&albedo=0.2&field=3&field=4&field=5&zip=0');
           


            var fakeAnswer='Date,Time,Lunar Topocentric zenith angle,Lunar Top. azimuth angle (eastward from N),Lunar Top. azimuth angle (westward from S)\
			3/23/2016,0:00:00,51.840689,164.570743,-15.429257\
			3/23/2016,1:00:00,51.045663,183.378993,3.378993\
			3/23/2016,2:00:00,53.181976,201.843216,21.843216\
			3/23/2016,3:00:00,57.897518,218.749868,38.749868\
			3/23/2016,4:00:00,64.554485,233.691076,53.691076\
			3/23/2016,5:00:00,72.500400,246.924287,66.924287\
			3/23/2016,6:00:00,81.178790,258.987004,78.987004\
			3/23/2016,7:00:00,89.873660,270.467701,90.467701\
			3/23/2016,8:00:00,99.325266,281.941509,101.941509\
			3/23/2016,9:00:00,107.938855,293.977276,113.977276\
			3/23/2016,10:00:00,115.740276,307.143342,127.143342\
			3/23/2016,11:00:00,122.221630,321.942814,141.942814\
			3/23/2016,12:00:00,126.781225,338.598006,158.598006\
			3/23/2016,13:00:00,128.837873,356.706896,176.706896\
			3/23/2016,14:00:00,128.073956,15.136414,-164.863586\
			3/23/2016,15:00:00,124.625372,32.569600,-147.430400\
			3/23/2016,16:00:00,118.999303,48.258305,-131.741695\
			3/23/2016,17:00:00,111.820711,62.190784,-117.809216\
			3/23/2016,18:00:00,103.654201,74.785577,-105.214423\
			3/23/2016,19:00:00,94.962802,86.599318,-93.400682\
			3/23/2016,20:00:00,85.979570,98.200739,-81.799261\
			3/23/2016,21:00:00,77.501507,110.147812,-69.852188\
			3/23/2016,22:00:00,69.606592,122.988000,-57.012000\
			3/23/2016,23:00:00,62.853220,137.213986,-42.786014';
			return mockApi(fakeAnswer,0);
            
        },

    }


    function mockApi(obj, timeout, reject) {
        var isSuccess = true;
        if (!timeout) timeout = 0;
        if (reject) isSuccess = false;


        return $q(function(resolve, reject) {
            setTimeout(function() {
                if (isSuccess) {
                    resolve(obj);
                } else {
                    reject(false);
                }
            }, timeout);
        });
    }
});




