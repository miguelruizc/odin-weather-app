// Current weather object
function CurrentWeather(weatherData) {
	// Main weather variables:
	// Location
	this.locationName = undefined; //weatherJSON.location.name
	this.locationRegion = undefined; //weather.JSON.location.region
	this.locationCountry = undefined; //weatherJson.location.country
	// Date & time
	this.localTime = undefined; //weatherJson.location.localtime
	// Weather
	this.conditionText = undefined; //weatherJson.current.condition.text
	this.conditionIcon = undefined; //weather.Json.current.condition.icon (url.png)
	// Temperature
	this.temperatureC = undefined; //weatherJson.current.temp_c
	this.temperatureF = undefined; //weatherJson.current.temp_f

	// Additional weather variables:
	// Feels like temp
	this.feelsLikeTemperatureC = undefined; //weatherJson.current.feelslike_c
	this.feelsLikeTemperatureF = undefined; //weatherJson.current.feelslike_f
	// Humidity
	this.humidity = undefined; //weatherJson.current.humidity
	// Rain chance
	this.rainChance = undefined; //weatherJson.forecast.forecastDay[0].day.daily_chance_of_rain
	// Wind speed
	this.windSpeed = undefined; //weatherJson.current.wind_kph
}

// Forecast object
function ForecastDay(weatherData) {
	this.date = undefined; //weatherJson.forecast.forecastday.date
	this.dayOfWeek = undefined; //weatherJson.forecast.forecastday.date (convert to day of the week)
	this.temperatureC = undefined; //weatherJson.forecast.forecastday.day.avgtemp_c
	this.temperatureCMin = undefined; //weatherJson.forecast.forecastday.day.mintemp_c
	this.temperatureF = undefined; //weatherJson.forecast.forecastday.day.avgtemp_f
	this.temperatureFMin = undefined; //weatherJson.forecast.forecastday.day.mintemp_f
	this.weatherIcon = undefined; //weatherJson.forecast.forecastday.day.condition.icon
}

async function fetchWeather(location = 'London') {
	// Call WeatherAPI to get the data from the specific location
	// Request URL example:
	// http://api.weatherapi.com/v1/forecast.json?key={API_KEY}&q={location}&days=3
	const apiKey = '1f942dd367ca473d889171547241705';
	const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;

    // fetch and check response status
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Error in fetchWeather(${location}), response status: ${response.status}, ${response.statusText}`
			);
		}
        else {
            const weatherData = await response.json();
            return weatherData;
        }

	} catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

let weatherData = fetchWeather();
weatherData.then((object)=>{
    console.log(object);
});
