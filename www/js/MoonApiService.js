angular.module('lunagrab.services', []).factory('MoonApi', function($http, $q) {



    function parseMoonPosition(result) {
        console.log(result);
        var data = result.data;
        var d = new Date();
        var date = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear() + "," + d.getHours() + ":00:00";
        data = data.split("\n");
        for (line in data) {
            if (data[line].search(date) !== -1) {

                return (data[line].split(",").slice(2));
            }
        }

    }



    return {
        getMoonPosition: function(lat, lon, timezone, isDebug) {
            //return MockApi.getBundleList();
            var d = new Date();
            var day = d.getDate();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var url = 'https://www.nrel.gov/midc/apps/sampa.pl?syear=' + year +
                '&smonth=' + month +
                '&sday=' + day +
                '&eyear=' + year +
                '&emonth=' + month +
                '&eday=' + day +
                '&step=60&stepunit=1&latitude=' + lat +
                '&longitude=' + lon +
                '&timezone=' + timezone +
                '&elev=0&press=835&temp=10&dut1=0.0&deltat=64.797&refract=0.5667&ozone=0.3&pwv=1.5&aod=0.07637&ba=0.85&albedo=0.2&field=3&field=4&field=5&zip=0'
            if(!isDebug) return $http.get(url).then(parseMoonPosition);



            var fakeAnswer = 'Date,Time,Lunar Topocentric zenith angle,Lunar Top. azimuth angle (eastward from N),Lunar Top. azimuth angle (westward from S)' + '\n\
				4/23/2016,19:00:00,112.340454,84.465859,-95.534141' + '\n\
				4/23/2016,20:00:00,103.528437,96.008571,-83.991429' + '\n\
				4/23/2016,21:00:00,94.879477,107.293550,-72.706450' + '\n\
				4/23/2016,22:00:00,86.562725,118.842765,-61.157235' + '\n\
				4/23/2016,23:00:00,79.416969,131.080500,-48.919500';





            return mockApi({ data: fakeAnswer }, 0).then(parseMoonPosition);

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
