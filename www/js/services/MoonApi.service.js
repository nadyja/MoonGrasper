angular.module('MoonGrasper').factory('MoonApi', function($http, $q) {



    function parseMoonPosition(result) {
        // console.log(result);
        var data = result.data;
        var d = new Date();
        var date = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear() + "," + d.getHours() + ":00:00";
        data = data.split("\n");
        for (line in data) {
            if (data[line].search(date) !== -1) {

                var arr=(data[line].split(",").slice(2));
                arr[0]=180-parseFloat(arr[0]);
                arr[1]=parseFloat(arr[1]);
                arr[2]=parseFloat(arr[2]);
                console.log(arr);
                return arr;
            }
        }

    }



    return {
        getMoonPosition: function(coordinates, isDebug) {
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
                '&step=60&stepunit=1&latitude=' + coordinates.lat +
                '&longitude=' + coordinates.lon +
                '&timezone=' + coordinates.timezone +
                '&elev=0&press=835&temp=10&dut1=0.0&deltat=64.797&refract=0.5667&ozone=0.3&pwv=1.5&aod=0.07637&ba=0.85&albedo=0.2&field=3&field=4&field=5&zip=0'
                //console.log(url);
            if (!isDebug) return $http.get(url).then(parseMoonPosition);



            var fakeAnswer = 'Date,Time,Lunar Topocentric zenith angle,Lunar Top. azimuth angle (eastward from N),Lunar Top. azimuth angle (westward from S)' + '\n\
                4/23/2016,19:00:00,112.340454,84.465859,-95.534141' + '\n\
                4/23/2016,20:00:00,103.528437,96.008571,-83.991429' + '\n\
                4/23/2016,21:00:00,94.879477,107.293550,-72.706450' + '\n\
                4/23/2016,22:00:00,86.562725,118.842765,-61.157235' + '\n\
                4/23/2016,23:00:00,79.416969,131.080500,-48.919500' + '\n\
                4/24/2016,0:00:00,73.491061,144.303627,-35.696373' + '\n\
                4/24/2016,1:00:00,69.298280,158.590885,-21.409115' + '\n\
                4/24/2016,2:00:00,67.245217,173.695769,-6.304231' + '\n\
                4/24/2016,3:00:00,67.562098,189.048268,9.048268' + '\n\
                4/24/2016,4:00:00,70.215265,203.963471,23.963471' + '\n\
                4/24/2016,5:00:00,134.922233,217.940842,37.940842' + '\n\
                4/24/2016,6:00:00,81.252390,230.820636,50.820636' + '\n\
                4/24/2016,7:00:00,88.616058,242.743509,62.743509' + '\n\
                4/24/2016,8:00:00,97.286899,254.038388,74.038388' + '\n\
                4/24/2016,9:00:00,106.119792,265.146521,85.146521' + '\n\
                4/24/2016,10:00:00,115.074524,276.609550,96.609550' + '\n\
                4/24/2016,11:00:00,123.789551,289.108971,109.108971' + '\n\
                4/24/2016,12:00:00,131.799846,303.518796,123.518796' + '\n\
                4/24/2016,13:00:00,138.439044,320.839250,140.839250' + '\n\
                4/24/2016,14:00:00,142.789085,341.646012,161.646012' + '\n\
                4/24/2016,15:00:00,143.920980,4.844805,-175.155195' + '\n\
                4/24/2016,16:00:00,141.537645,27.435616,-152.564384' + '\n\
                4/24/2016,17:00:00,136.259842,46.965991,-133.034009' + '\n\
                4/24/2016,18:00:00,129.078922,63.116540,-116.883460' + '\n\
                4/24/2016,19:00:00,120.829323,76.737308,-103.262692' + '\n\
                4/24/2016,20:00:00,112.095298,88.807374,-91.192626' + '\n\
                4/24/2016,21:00:00,103.297638,100.121810,-79.878190' + '\n\
                4/24/2016,22:00:00,94.784859,111.295482,-68.704518' + '\n\
                4/24/2016,23:00:00,86.711933,122.815311,-57.184689' + '\n';





            return mockApi({ data: fakeAnswer }, 0).then(parseMoonPosition);

        },
        getMoonPhase: function() {
            //returns 1 to 28 (14 fullmoon)
            return 14;
        }

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
