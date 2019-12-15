function forecastBalloon(cityID) {
    var key = '29a81f0e66d7fba4e113b2cf97ccb612';
    fetch('https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&appid=' + key)
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {
            console.log(data);
            drawForecast(data);
        })
        .catch(function () {
            // catch any errors
        });
}

window.onload = function () {
    forecastBalloon(625144);
}

function drawForecast(d) {
    console.log(d.weather);
    var celsius = Math.round(parseFloat(d.list[7].main.temp) - 273.15);
    var fahrenheit = Math.round(((parseFloat(d.list[7].main.temp) - 273.15) * 1.8) + 32);
    var icon = d.list[7].weather[0].icon;
    var description = d.list[7].weather[0].description;

    document.getElementById('temp1').innerHTML = celsius + '&deg;';
    document.getElementById('weather-icon1').innerHTML = `<img class="weather-icon1" src="http://openweathermap.org/img/wn/${icon}@2x.png"/>`;
    //well and do something with new Date();
    
}
}

export {forecastBalloon, drawForecast};