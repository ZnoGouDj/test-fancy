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

window.onload = function () {
    weatherBalloon(625144);
}

function drawWeather(d) { //"cF = celsius" for changing temp, need to know how to deal with AJAX
    var celsius = Math.round(parseFloat(d.main.temp) - 273.15);
    var fahrenheit = Math.round(((parseFloat(d.main.temp) - 273.15) * 1.8) + 32);
    var lon = d.coord.lon;
    var lat = d.coord.lat;
    var icon = d.weather[0].icon;
    var humidity = d.main.humidity;
    var wind = d.wind.speed;
    var description = d.weather[0].description;
    var feelsLike = Math.round(parseFloat(d.main.feels_like) - 273.15);

    // if (cF === celsius) {
    //     document.getElementById('temp').innerHTML = celsius + '&deg;';
    // } else {
    //     document.getElementById('temp').innerHTML = fahrenheit + '℉;';
    // }

    document.getElementById('description').innerHTML = description + '<br />' + 'feels like: ' + feelsLike + '<br />' + 'humidity: ' + humidity + '%' + '<br />' + 'wind: ' + wind + 'mps';
    document.getElementById('temp').innerHTML = celsius + '&deg;';
    document.getElementById('location').innerHTML = d.name;
    document.getElementById('lat').textContent = lat;
    document.getElementById('lon').textContent = lon;
    document.getElementById('weather-icon').innerHTML = `<img class="weather-icon" src="http://openweathermap.org/img/wn/${icon}@2x.png"/>`;
    renderItem(description);
    
//=============================================MAP===================================================
    const mymap = L.map('mapid').setView([lat, lon], 13);
    const marker = L.marker([0, 0]).addTo(mymap);//no need maybe
    
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mymap);
}

export {weatherBalloon, drawWeather};