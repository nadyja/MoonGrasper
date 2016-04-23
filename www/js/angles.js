var XMLHttpRequest = require('w3c-xmlhttprequest').XMLHttpRequest;
var Promise = require('promise');

function calculateZenithDiff(orientation, angle) {
  //returns negative values if rotate towards earth
  //returns positive vals if rotate towards sky
  return -(angle - orientation)
}
//azimuthal
//returns negative if rotate left
//returns positive if rotate right
function calculateAzimuthalDiff(aDirection, angle) {
  if (angle > 180) {
    return -(angle - 180 - aDirection)
  } else {
    return angle - aDirection
  }
}

//timezone - negative from Greenwitch
function getData(lat, lon, timezone) {
  var d = new Date();
  var day = d.getDate();
  var year = d.getFullYear();
  var month = d.getMonth();
  req = 'https://www.nrel.gov/midc/apps/sampa.pl?syear=' + year + '&smonth=' + month + '&sday=' + day + '&eyear=' + year + '&emonth=' + month + '&eday=' + day + '&step=60&stepunit=1&latitude=' + lat + '&longitude=' + lon + '&timezone=' + timezone + '&elev=0&press=835&temp=10&dut1=0.0&deltat=64.797&refract=0.5667&ozone=0.3&pwv=1.5&aod=0.07637&ba=0.85&albedo=0.2&field=3&field=4&field=5&zip=0';
  var xhttp = new XMLHttpRequest();
  xhttp.open("get", req, true);
  xhttp.send();
  return new Promise(function (resolve, reject) {
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var data = xhttp.responseText;
        var date = month + "/" + day + "/" + year + "," + d.getHours() + ":00:00";
        data = data.split("\n");
        for (var index in data) {
          if (data[index].search(date) !== -1) {
            resolve(data[index].split(",").slice(2));
          }
        }
      }
    };
  });
}

//pobieranie danych z api
//trzeba to załadować przy uruchomieniu i aktualizować co godzinę
//data zawiera trzy kąty - kąt zenitalny, kąt azymutalny względem północy i kąt azymutalny względem południa
getData(50, 45, 1).then(function (data) {

});
