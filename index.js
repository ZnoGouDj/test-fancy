
let lat;
let lon;



//GEO=========================================================================
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {

    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log(lon, lat);

    //=============================================MAP===================================================
    const issIcon = L.icon({
        iconUrl: 'marker.png',
        iconSize: [32, 32],
        iconAnchor: [25, 16]
    });

    const mymap = L.map('mapid').setView([lat, lon], 13);
    const marker = L.marker([0, 0], {icon: issIcon}).addTo(mymap);//no need maybe
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mymap);

    async function getISS() {
        marker.setLatLng([lat, lon]);
    }
    getISS();

    document.getElementById('lat').textContent = lat;
    document.getElementById('lon').textContent = lon;
}

//=====================================================================

getLocation();
//=============================================BACKGROUND===================================================
function renderItem(state = "weather") {
    fetch(`https://source.unsplash.com/1600x900/?${state}`).then((response) => {
        document.getElementsByClassName('main-container')[0].style.backgroundImage = `url(${response.url})`;
    })
}
//======================================================================



//=============================================WEATHER===================================================
function weatherBalloon(cityID) {
    var key = '29a81f0e66d7fba4e113b2cf97ccb612';
    fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID + '&appid=' + key)
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {
            drawWeather(data);
        })
        .catch(function () {
            // catch any errors
        });
}

let descriptionReserve;
let dataReserve;
let humidityReserve;
let windReserve;
function drawWeather(d) { 
    dataReserve = d;
    var celsius = Math.round(parseFloat(d.main.temp) - 273.15);
    var fahrenheit = Math.round(((parseFloat(d.main.temp) - 273.15) * 1.8) + 32);




    var icon = d.weather[0].icon;
    var humidity = d.main.humidity;
    humidityReserve = humidity;
    var wind = d.wind.speed;
    windReserve = wind;
    var description = d.weather[0].description;
    descriptionReserve = description;
    var feelsLike = Math.round(parseFloat(d.main.feels_like) - 273.15);
    document.getElementById('description').innerHTML = description + '<br />' + 'feels like: ' + feelsLike + '&deg' + '<br />' + 'humidity: ' + humidity + '%' + '<br />' + 'wind: ' + wind + 'm/s';
    document.getElementById('temp').innerHTML = celsius;
    document.getElementById('location').innerHTML = d.name;

    // document.getElementById('lat').textContent = lat;
    // document.getElementById('lon').textContent = lon;
    console.log(lat, lon);
    document.getElementById('weather-icon').innerHTML = `<img class="weather-icon" src="http://openweathermap.org/img/wn/${icon}@2x.png"/>`;
    renderItem(description);

}

window.onload = function () {
    weatherBalloon(625144);

    forecastBalloon(625144);
}
//=======================================================================



//=============================================FORECAST===================================================
let forecastDataReserve;
let count = 1;
function drawForecast(d) {
    forecastDataReserve = d;
    for (let i = 7; i < 24; i += 8) {
        var daysForecast = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        // var monthsForecast = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        var celsius = Math.round(parseFloat(d.list[i].main.temp) - 273.15);
        var fahrenheit = Math.round(((parseFloat(d.list[i].main.temp) - 273.15) * 1.8) + 32);
        var icon = d.list[i].weather[0].icon;
        var description = d.list[i].weather[0].description;
        // var monthForecast = Number(d.list[i].dt_txt.slice(5, 7));
        var dayForecast = Number(d.list[i].dt_txt.slice(8, 10));
        var k = String(today.getDay()) - 1 + count;

        document.getElementById(`temp${count}`).innerHTML = celsius + '&deg;';
        document.getElementById(`weather-icon${count}`).innerHTML = `<img class="weather-icon1" src="http://openweathermap.org/img/wn/${icon}@2x.png"/>`;
        document.getElementById(`date${count}`).innerHTML = (k > 6 ? days[k - 7] : days[k]) + ' ' + dayForecast + '<br />';
        count++;
    }
    //well and do something with new Date();

}

function forecastBalloon(cityID) {
    var key = '29a81f0e66d7fba4e113b2cf97ccb612';
    fetch('https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&appid=' + key)
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {
            drawForecast(data);
        })
        .catch(function () {
            // catch any errors
        });
}
//========================================================================



//=============================================DATE===================================================
var today = new Date();

var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var day = days[String(today.getDay()) - 1] || 'Sun';
var dd = String(today.getDate()).padStart(2, '0');
var mm = months[String(today.getMonth()).padStart(2, '0')];

var currentDay = day + ' ' + dd + ' ' + mm;
document.getElementById('date').innerHTML = currentDay;
//========================================================================



//=============================================TIME===================================================
function updateClock() {
    var now = new Date(),
        time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

    // set the content of the element with the ID time to the formatted string
    document.getElementById('time').innerHTML = time;

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}
updateClock();
//========================================================================



//=============================================BUTTONS===================================================
let degreesValue = 'c'; //celsius or fahrenheit
function drawDegrees() {
    var celsius = Math.round(parseFloat(dataReserve.main.temp) - 273.15);
    var fahrenheit = Math.round(((parseFloat(dataReserve.main.temp) - 273.15) * 1.8) + 32);
    var feelsLikeCelsius = Math.round(parseFloat(dataReserve.main.feels_like) - 273.15);
    var feelsLikeFahrenheit = Math.round(((parseFloat(dataReserve.main.feels_like) - 273.15) * 1.8) + 32);

    if (degreesValue === 'c') {
        document.getElementById('temp').innerHTML = fahrenheit;
        for (let i = 1; i <= 3; i++) {
            var fahrenheitFor = Math.round(((parseFloat(forecastDataReserve.list[i].main.temp) - 273.15) * 1.8) + 32);
            document.getElementById(`temp${i}`).innerHTML = fahrenheitFor + '℉';
        }
        document.getElementById('degreeSign').innerHTML = '&#8457';
        document.getElementById('degreeSign').setAttribute('style', 'font-size:2em');
        document.getElementById('fahrenheit').innerHTML = '°C';
        document.getElementById('description').innerHTML = descriptionReserve + '<br />' + 'feels like: ' + feelsLikeFahrenheit + '℉' + '<br />' + 'humidity: ' + humidityReserve + '%' + '<br />' + 'wind: ' + windReserve + 'm/s';
        degreesValue = 'd';
    } else {
        document.getElementById('temp').innerHTML = celsius;
        for (let i = 1; i <= 3; i++) {
            var celsiusFor = Math.round(parseFloat(forecastDataReserve.list[i].main.temp) - 273.15);
            document.getElementById(`temp${i}`).innerHTML = celsiusFor + '&deg;';
        }
        document.getElementById('degreeSign').innerHTML = '°';
        document.getElementById('degreeSign').setAttribute('style', 'font-size:5em');
        document.getElementById('fahrenheit').innerHTML = '℉';
        document.getElementById('description').innerHTML = descriptionReserve + '<br />' + 'feels like: ' + feelsLikeCelsius + '&deg' + '<br />' + 'humidity: ' + humidityReserve + '%' + '<br />' + 'wind: ' + windReserve + 'm/s';
        degreesValue = 'c';
    }

}

document.getElementById('changeImage').addEventListener("click", function () {
    renderItem(descriptionReserve);
}, false);

document.getElementById('fahrenheit').addEventListener("click", function () {
    drawDegrees();
}, false);
//=========================================================================




