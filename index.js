// Current weather object
function CurrentWeather(weatherData) {
	// Main weather variables:
	// Location
	this.locationName = weatherData.location.name;
	this.locationRegion = weatherData.location.region;
	this.locationCountry = weatherData.location.country;
	// Date & time
	this.localTime = weatherData.location.localtime;
	// Weather
	this.conditionText = weatherData.current.condition.text;
	this.conditionIcon = weatherData.current.condition.icon; //(url.png)
	// Temperature
	this.temperatureC = weatherData.current.temp_c;
	this.temperatureF = weatherData.current.temp_f;

	// Additional weather variables:
	// Feels like temp
	this.feelsLikeTemperatureC = weatherData.current.feelslike_c;
	this.feelsLikeTemperatureF = weatherData.current.feelslike_f;
	// Humidity
	this.humidity = weatherData.current.humidity;
	// Rain chance
	this.rainChance =
		weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
	// Wind speed
	this.windSpeed = weatherData.current.wind_kph;
}

// Forecast object
function ForecastDay(weatherData, dayIndex) {
	this.date = weatherData.forecast.forecastday[dayIndex].date;
	this.dayOfWeek = weatherData.forecast.forecastday[dayIndex].date; // (convert to day of the week)
	this.temperatureC =
		weatherData.forecast.forecastday[dayIndex].day.avgtemp_c;
	this.temperatureCMin =
		weatherData.forecast.forecastday[dayIndex].day.mintemp_c;
	this.temperatureF =
		weatherData.forecast.forecastday[dayIndex].day.avgtemp_f;
	this.temperatureFMin =
		weatherData.forecast.forecastday[dayIndex].day.mintemp_f;
	this.weatherIcon =
		weatherData.forecast.forecastday[dayIndex].day.condition.icon;
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
		} else {
			const weatherData = await response.json();
			return weatherData;
		}
	} catch (error) {
		console.log(error);
		return Promise.reject(error);
	}
}

function search(event) {
	// Prevent submit
	event.preventDefault();

	// Store input value and reset form
	const value = document.querySelector('.searchInput').value;
	event.target.reset();

    // Fetch weather with input location
	const weatherData = fetchWeather(value);
	weatherData
		.then((data) => {
			const weatherToday = new CurrentWeather(data);
			const weatherForecastDay1 = new ForecastDay(data, 0);

			console.table(weatherToday);
			console.table(weatherForecastDay1);
		})
		.catch((error) => {
			console.log(error);
		});
}

const searchbar = document.getElementById('searchbar');
searchbar.addEventListener('submit', search);
