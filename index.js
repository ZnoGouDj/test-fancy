let lat;
let lon;
let forecastDataReserve;
let count = 1;
let descriptionReserve;
let dataReserve;
let humidityReserve;
let windReserve;
let degreesValue = 'c'; //celsius or fahrenheit
let feelsLikeReserve;
let russianDescription;
let belarusianDescription;
let timeReserved;

//===============================================GEO=========================================================
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    //=============================================MAP===================================================
    const issIcon = L.icon({
        iconUrl: 'marker.png',
        iconSize: [32, 32],
        iconAnchor: [25, 16]
    });

    const mymap = L.map('mapid').setView([lat, lon], 13);
    const marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap);
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mymap);

    async function getISS() {
        marker.setLatLng([lat, lon]);
    }
    getISS();


    let la = lat.toFixed(2);
    let lo = lon.toFixed(2);
    document.getElementById('lat').textContent = 'latitude: ' + la;
    document.getElementById('lon').textContent = 'longitude: ' + lo;
}


//===========================================================================================================

getLocation();
//=============================================BACKGROUND===================================================
function renderItem(state = "clouds", mm, timeReserved = "15:00") {
    let season = mm === "December" ? "winter" : mm === "January" ? "winter" : mm === "February" ? "winter" : mm === "March" ? "spring" : mm === "April" ? "spring" : mm === "May" ? "spring" : mm === "June" ? "summer" : mm === "July" ? "summer" : mm === "August" ? "summer" : "autumn";
    let partsOfDay = timeReserved.slice(0, 2);
    let morningAfternoonEveningNight = partsOfDay >= 21 ? "night" : partsOfDay >= 17 ? "evening" : partsOfDay >= 12 ? "afternoon" : partsOfDay >= 5 ? "morning" : "night";
    fetch(`https://source.unsplash.com/1600x900/?${state},${season},${morningAfternoonEveningNight}`).then((response) => {
        document.getElementsByClassName('main-container')[0].style.backgroundImage = `url(${response.url})`;
    })
}
//=======================================================================



//=============================================WEATHER======================================================
function weatherBalloon(cityID) {
    let key = '29a81f0e66d7fba4e113b2cf97ccb612';
    fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID + '&appid=' + key)
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {
            drawWeather(data);
        })
        .catch(function () {
            // catch any errors
        });
}

function drawWeather(d) {
    dataReserve = d;
    let celsius = Math.round(parseFloat(d.main.temp) - 273.15);
    let icon = d.weather[0].icon;
    let humidity = d.main.humidity;
    humidityReserve = humidity;
    let wind = d.wind.speed;
    windReserve = wind;
    let description = d.weather[0].description;
    descriptionReserve = description;
    let feelsLike = Math.round(parseFloat(d.main.feels_like) - 273.15);
    feelsLikeReserve = feelsLike;

    document.getElementById('description').innerHTML = description + '<br />' + 'feels like: ' + feelsLike + '&deg' + '<br />' + 'humidity: ' + humidity + '%' + '<br />' + 'wind: ' + wind + 'm/s';
    document.getElementById('temp').innerHTML = (celsius < 10 ? '0' : '') + celsius;
    document.getElementById('location').innerHTML = d.name;
    document.getElementById('weather-icon').innerHTML = `<img class="weather-icon" src="http://openweathermap.org/img/wn/${icon}@2x.png"/>`;
    renderItem(description, mm, timeReserved);

}

window.onload = function () {
    weatherBalloon(625144);

    forecastBalloon(625144);
}
//==========================================================================================================



//=============================================FORECAST=====================================================
function drawForecast(d) {
    forecastDataReserve = d;
    for (let i = 7; i < 24; i += 8) {
        let celsius = Math.round(parseFloat(d.list[i].main.temp) - 273.15);
        let icon = d.list[i].weather[0].icon;
        let dayForecast = Number(d.list[i].dt_txt.slice(8, 10));
        let k = String(today.getDay()) - 1 + count;

        document.getElementById(`temp${count}`).innerHTML = (celsius < 10 ? '0' : '') + celsius;
        document.getElementById(`weather-icon${count}`).innerHTML = `<img class="weather-icon1" src="http://openweathermap.org/img/wn/${icon}@2x.png"/>`;
        document.getElementById(`date${count}`).innerHTML = (k > 6 ? days[k - 7] : days[k]) + ' ' + dayForecast + '<br />';
        count++;
    }
}

function forecastBalloon(cityID) {
    let key = '29a81f0e66d7fba4e113b2cf97ccb612';
    fetch('https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&appid=' + key)
        .then(function (resp) { return resp.json() }) // Convert data to json
        .then(function (data) {
            drawForecast(data);
        })
        .catch(function () {
            // catch any errors
        });
}
//==========================================================================================================



//=============================================DATE=========================================================
let today = new Date();

let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let day = days[String(today.getDay()) - 1] || 'Sun';
let dd = String(today.getDate()).padStart(2, '0');
let mm = months[String(today.getMonth()).padStart(2, '0')];

let currentDay = day + ' ' + dd + ' ' + mm;
document.getElementById('date').innerHTML = currentDay;
//========================================================================================================



//=============================================TIME======================================================
function updateClock() {
    let now = new Date(),
        time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    document.getElementById('time').innerHTML = time;
    timeReserved = time;
    setTimeout(updateClock, 1000);
}
updateClock();
//=======================================================================================================



//=============================================BUTTONS===================================================
//celsius-fahrenheit switch
function drawDegrees() {
    let celsius = Math.round(parseFloat(dataReserve.main.temp) - 273.15);
    let fahrenheit = Math.round(((parseFloat(dataReserve.main.temp) - 273.15) * 1.8) + 32);
    let feelsLikeCelsius = Math.round(parseFloat(dataReserve.main.feels_like) - 273.15);
    let feelsLikeFahrenheit = Math.round(((parseFloat(dataReserve.main.feels_like) - 273.15) * 1.8) + 32);
    let check = document.getElementById('translate').innerText;

    if (degreesValue === 'c') {
        document.getElementById('temp').innerHTML = fahrenheit;
        for (let i = 1; i <= 3; i++) {
            let fahrenheitFor = Math.round(((parseFloat(forecastDataReserve.list[i].main.temp) - 273.15) * 1.8) + 32);
            document.getElementById(`temp${i}`).innerHTML = fahrenheitFor;
            document.getElementById(`degreeSignForecast${i}`).setAttribute('class', 'degreeSignForecast');
            document.getElementById(`degreeSignForecast${i}`).innerText = '℉';
        }
        document.getElementById('degreeSign').innerHTML = '&#8457';
        document.getElementById('degreeSign').setAttribute('style', 'font-size:2em');
        document.getElementById('fahrenheit').innerHTML = '°C';
        if (check === 'ru') {
            document.getElementById('description').innerHTML = descriptionReserve + '<br />' + 'feels like: ' + feelsLikeFahrenheit + '℉' + '<br />' + 'humidity: ' + humidityReserve + '%' + '<br />' + 'wind: ' + windReserve + 'm/s';
        } else if (check === 'by') {
            document.getElementById('description').innerHTML = russianDescription + '<br />' + 'ощущается: ' + feelsLikeFahrenheit + '℉' + '<br />' + 'влажность: ' + humidityReserve + '%' + '<br />' + 'ветер: ' + windReserve + 'м/с';
        } else {
            document.getElementById('description').innerHTML = belarusianDescription + '<br />' + 'адчуваецца: ' + feelsLikeFahrenheit + '℉' + '<br />' + 'вiльготнасць: ' + humidityReserve + '%' + '<br />' + 'вецер: ' + windReserve + 'м/с';
        }
        degreesValue = 'd';
    } else {
        document.getElementById('temp').innerHTML = (celsius < 10 ? '0' : '') + celsius;
        for (let i = 1; i <= 3; i++) {
            let celsiusFor = Math.round(parseFloat(forecastDataReserve.list[i].main.temp) - 273.15);
            document.getElementById(`temp${i}`).innerHTML = (celsiusFor < 10 ? '0' : '') + celsiusFor;
            document.getElementById(`degreeSignForecast${i}`).setAttribute('style', 'font-size:3em');
            document.getElementById(`degreeSignForecast${i}`).removeAttribute('class', 'degreeSignForecast');
            document.getElementById(`degreeSignForecast${i}`).innerText = '°';
        }
        document.getElementById('degreeSign').innerHTML = '°';
        document.getElementById('degreeSign').setAttribute('style', 'font-size:5em');
        document.getElementById('fahrenheit').innerHTML = '℉';
        if (check === 'ru') {
            document.getElementById('description').innerHTML = descriptionReserve + '<br />' + 'feels like: ' + feelsLikeCelsius + '&deg' + '<br />' + 'humidity: ' + humidityReserve + '%' + '<br />' + 'wind: ' + windReserve + 'm/s';
        } else if (check === 'by') {
            document.getElementById('description').innerHTML = russianDescription + '<br />' + 'ощущается: ' + feelsLikeCelsius + '&deg' + '<br />' + 'влажность: ' + humidityReserve + '%' + '<br />' + 'ветер: ' + windReserve + 'м/с';
        } else {
            document.getElementById('description').innerHTML = belarusianDescription + '<br />' + 'адчуваецца: ' + feelsLikeCelsius + '&deg' + '<br />' + 'вiльготнасць: ' + humidityReserve + '%' + '<br />' + 'вецер: ' + windReserve + 'м/с';
        }
        degreesValue = 'c';
    }
}
//translate switch
function translateText() {
    let check = document.getElementById('translate').innerText;

    if (check === 'ru') {
        document.getElementById('location').innerText = 'Минск';

        let date = document.getElementById('date').innerText.slice(0, 3);
        let dateNum = document.getElementById('date').innerText.slice(4, 6);
        let newDate = date === 'Mon' ? date = 'Пн' : date === 'Tue' ? date = 'Вт' : date === 'Wed' ? date = 'Ср' : date === 'Thu' ? date = 'Чт' : date === 'Fri' ? date = 'Пт' : date === 'Sat' ? date = 'Сб' : date = 'Вс';
        let month = document.getElementById('date').innerText.slice(7, 10);
        let newMonth = month === 'Jan' ? month = 'Января' : month === 'Feb' ? month = 'Февраля' : month === 'Mar' ? month = 'Марта' : month === 'Apr' ? month = 'Апреля' : month === 'May' ? month = 'Мая' : month === 'Jun' ? month = 'Июня' : month === 'Jul' ? month = 'Июля' : month === 'Aug' ? month = 'Августа' : month === 'Sep' ? month = 'Сентября' : month === 'Oct' ? month = 'Октября' : month === 'Nov' ? month = 'Ноября' : month = 'Декабря';
        document.getElementById('date').innerText = newDate + ' ' + dateNum + ' ' + newMonth;
        descriptionReserve === 'clear sky' ? russianDescription = 'ясно' : descriptionReserve === 'few clouds' ? russianDescription = 'слегка облачно' : descriptionReserve === 'scattered clouds' ? russianDescription = 'рассеянные облака' : descriptionReserve === 'broken clouds' ? russianDescription = 'облачно' : descriptionReserve === 'shower rain' ? russianDescription = 'ливень' : descriptionReserve === 'rain' ? russianDescription = 'дождь' : descriptionReserve === 'thunderstorm' ? russianDescription = 'гроза' : descriptionReserve === 'snow' ? russianDescription = 'снег' : russianDescription = 'туман';
        document.getElementById('description').innerHTML = russianDescription + '<br />' + 'ощущается: ' + feelsLikeReserve + '&deg' + '<br />' + 'влажность: ' + humidityReserve + '%' + '<br />' + 'ветер: ' + windReserve + ' м/с';

        for (let i = 1; i <= 3; i++) {
            let daysForecast = document.getElementById(`date${i}`).innerText.slice(0, 3);
            let newForecast = daysForecast === 'Mon' ? daysForecast = 'Пн' : daysForecast === 'Tue' ? daysForecast = 'Вт' : daysForecast === 'Wed' ? daysForecast = 'Ср' : daysForecast === 'Thu' ? daysForecast = 'Чт' : daysForecast === 'Fri' ? daysForecast = 'Пт' : daysForecast === 'Sat' ? daysForecast = 'Сб' : daysForecast = 'Вс';
            let x = document.getElementById(`date${i}`).innerText;
            let y = x.split('').splice(4, 7).join('');
            document.getElementById(`date${i}`).innerText = newForecast + ' ' + y;
        }

        document.getElementById('lat').innerText = 'широта: ' + lat.toFixed(2);
        document.getElementById('lon').innerText = 'долгота: ' + lon.toFixed(2);

        document.getElementById('translate').innerText = 'by';
    } else if (check === 'by') {
        document.getElementById('location').innerText = 'Мiнск';

        let date = document.getElementById('date').innerText.slice(0, 2);

        let dateNum = document.getElementById('date').innerText.slice(3, 5);
        let newDate = date === 'Пн' ? date = 'Пан' : date === 'Вт' ? date = 'Аўт' : date === 'Ср' ? date = 'Сер' : date === 'Чт' ? date = 'Чац' : date === 'Пт' ? date = 'Пят' : date === 'Сб' ? date = 'Суб' : date = 'Няд';
        let month = document.getElementById('date').innerText.slice(6, 9);
        let newMonth = month === 'Янв' ? month = 'Студзеня' : month === 'Фев' ? month = 'Лютага' : month === 'Мар' ? month = 'Сакавiка' : month === 'Апр' ? month = 'Красавiка' : month === 'Мая' ? month = 'Мая' : month === 'Июн' ? month = 'Чэрвеня' : month === 'Июл' ? month = 'Лiпня' : month === 'Авг' ? month = 'Жнiўня' : month === 'Сен' ? month = 'Верасня' : month === 'Окт' ? month = 'Кастрычнiка' : month === 'Ноя' ? month = 'Лiстапада' : month = 'Снежня';
        document.getElementById('date').innerText = newDate + ' ' + dateNum + ' ' + newMonth;

        russianDescription === 'ясно' ? belarusianDescription = 'ясна' : russianDescription === 'слегка облачно' ? belarusianDescription = 'злёгку воблачна' : russianDescription === 'рассеянные облака' ? belarusianDescription = 'рассеяныя аблокі' : russianDescription === 'облачно' ? belarusianDescription = 'воблачна' : russianDescription === 'ливень' ? belarusianDescription = 'лівень' : russianDescription === 'дождь' ? belarusianDescription = 'дождж' : russianDescription === 'гроза' ? belarusianDescription = 'навальніца' : russianDescription === 'снег' ? belarusianDescription = 'снег' : belarusianDescription = 'туман';
        document.getElementById('description').innerHTML = belarusianDescription + '<br />' + 'адчуваецца: ' + feelsLikeReserve + '&deg' + '<br />' + 'вільготнасць: ' + humidityReserve + '%' + '<br />' + 'вецер: ' + windReserve + ' м/с';

        for (let i = 1; i <= 3; i++) {
            let daysForecast = document.getElementById(`date${i}`).innerText.slice(0, 2);
            let newForecast = daysForecast === 'Пн' ? daysForecast = 'Пан' : daysForecast === 'Вт' ? daysForecast = 'Аўт' : daysForecast === 'Ср' ? daysForecast = 'Сер' : daysForecast === 'Чт' ? daysForecast = 'Чац' : daysForecast === 'Пт' ? daysForecast = 'Пят' : daysForecast === 'Сб' ? daysForecast = 'Суб' : daysForecast = 'Няд';
            let x = document.getElementById(`date${i}`).innerText;
            let y = x.split('').splice(3, 6).join('');
            document.getElementById(`date${i}`).innerText = newForecast + ' ' + y;
        }

        document.getElementById('lat').innerText = 'шырата: ' + lat.toFixed(2);
        document.getElementById('lon').innerText = 'даўгата: ' + lon.toFixed(2);

        document.getElementById('translate').innerText = 'en';
    } else if (check === 'en') {
        document.getElementById('location').innerText = 'Minsk';

        let date = document.getElementById('date').innerText.slice(0, 3);
        let dateNum = document.getElementById('date').innerText.slice(4, 6);
        let newDate = date === 'Пан' ? date = 'Mon' : date === 'Аўт' ? date = 'Tue' : date === 'Сер' ? date = 'Wed' : date === 'Чац' ? date = 'Thu' : date === 'Пят' ? date = 'Fri' : date === 'Суб' ? date = 'Sat' : date = 'Sun';
        let month = document.getElementById('date').innerText.slice(7, 10);
        let newMonth = month === 'Студзеня' ? month = 'January' : month === 'Лютага' ? month = 'February' : month === 'Сакавiка' ? month = 'March' : month === 'Красавiка' ? month = 'April' : month === 'Мая' ? month = 'May' : month === 'Чэрвеня' ? month = 'June' : month === 'Лiпня' ? month = 'July' : month === 'Жнiўня' ? month = 'August' : month === 'Верасня' ? month = 'September' : month === 'Кастрычнiка' ? month = 'October' : month === 'Лiстапада' ? month = 'November' : month = 'December';
        document.getElementById('date').innerText = newDate + ' ' + dateNum + ' ' + newMonth;

        belarusianDescription === 'ясна' ? descriptionReserve = 'clear sky' : belarusianDescription === 'злёгку воблачна' ? descriptionReserve = 'few clouds' : belarusianDescription === 'рассеяныя аблокі' ? descriptionReserve = 'scattered clouds' : belarusianDescription === 'воблачна' ? descriptionReserve = 'broken clouds' : belarusianDescription === 'лівень' ? descriptionReserve = 'shower rain' : belarusianDescription === 'дождж' ? descriptionReserve = 'rain' : belarusianDescription === 'навальніца' ? descriptionReserve = 'thunderstorm' : belarusianDescription === 'снег' ? descriptionReserve = 'snow' : descriptionReserve = 'mist';
        document.getElementById('description').innerHTML = descriptionReserve + '<br />' + 'feels like: ' + feelsLikeReserve + '&deg' + '<br />' + 'humidity: ' + humidityReserve + '%' + '<br />' + 'wind: ' + windReserve + ' m/s';

        for (let i = 1; i <= 3; i++) {
            let daysForecast = document.getElementById(`date${i}`).innerText.slice(0, 3);
            let newForecast = daysForecast === 'Пан' ? daysForecast = 'Mon' : daysForecast === 'Аўт' ? daysForecast = 'Tue' : daysForecast === 'Сер' ? daysForecast = 'Wed' : daysForecast === 'Чац' ? daysForecast = 'Thu' : daysForecast === 'Пят' ? daysForecast = 'Fri' : daysForecast === 'Суб' ? daysForecast = 'Sat' : daysForecast = 'Sun';
            let x = document.getElementById(`date${i}`).innerText;
            let y = x.split('').splice(4, 7).join('');
            document.getElementById(`date${i}`).innerText = newForecast + ' ' + y;
        }

        document.getElementById('lat').innerText = 'latitude: ' + lat.toFixed(2);
        document.getElementById('lon').innerText = 'longitude: ' + lon.toFixed(2);

        document.getElementById('translate').innerText = 'ru';
    }
}

document.getElementById('changeImage').addEventListener("click", function () {
    renderItem(descriptionReserve, mm, timeReserved);
}, false);

document.getElementById('fahrenheit').addEventListener("click", function () {
    drawDegrees();
}, false);

document.getElementById('translate').addEventListener("click", function () {
    translateText();
}, false);
//=======================================================================================================

