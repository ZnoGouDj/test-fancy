import { renderItem } from "./src/background.js";
import { weatherBalloon, drawWeather } from "./src/weather.js";
import { dateCreate } from "./src/date.js";
import { updateClock } from "./src/time.js";
import { forecastBalloon, drawForecast } from "./src/forecast-3-days.js";

weatherBalloon(625144);
forecastBalloon(625144);
